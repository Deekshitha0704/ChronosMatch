"""
ChronosMatch Live Market Simulator Bot
======================================
Simulates realistic continuous market activity against the ChronosMatch REST API:
- Market Makers posting laddered bids and asks around fair value
- Retail traders placing directional limit orders
- Institutional traders placing aggressive market sweep orders
- Dynamic order cancellations simulating algorithmic quote refreshes

Usage:
    python simulate_market.py [--host 127.0.0.1] [--port 8000] [--symbol TCS] [--speed 0.5]
"""
import sys
import time
import random
import argparse
import urllib.request
import urllib.error
import json
from typing import Dict, Any, List, Optional

SYMBOLS_CONFIG = {
    "AAPL": {"base_price": 180.0, "tick_size": 0.25, "min_qty": 10, "max_qty": 100},
    "MSFT": {"base_price": 420.0, "tick_size": 0.50, "min_qty": 5, "max_qty": 50},
    "TSLA": {"base_price": 250.0, "tick_size": 0.50, "min_qty": 5, "max_qty": 60},
    "BTC-USD": {"base_price": 65000.0, "tick_size": 10.0, "min_qty": 1, "max_qty": 5},
    "BTC-INR": {"base_price": 5500000.0, "tick_size": 100.0, "min_qty": 1, "max_qty": 3},
    "TCS": {"base_price": 500.0, "tick_size": 0.50, "min_qty": 5, "max_qty": 50},
    "INFY": {"base_price": 1500.0, "tick_size": 1.00, "min_qty": 10, "max_qty": 100},
    "RELIANCE": {"base_price": 2500.0, "tick_size": 1.00, "min_qty": 5, "max_qty": 40},
    "WIPRO": {"base_price": 480.0, "tick_size": 0.25, "min_qty": 10, "max_qty": 80},
    "HDFCBANK": {"base_price": 1650.0, "tick_size": 0.50, "min_qty": 5, "max_qty": 50},
    "TATAMOTORS": {"base_price": 920.0, "tick_size": 0.50, "min_qty": 10, "max_qty": 100},
}

TRADERS = ["MM_ALPHA", "MM_BETA", "RETAIL_FLOW", "ALGO_QUANT"]


class MarketSimulator:
    def __init__(self, base_url: str = "http://127.0.0.1:8000", symbol: str = "TCS", interval: float = 0.5):
        self.base_url = base_url.rstrip("/")
        self.symbol = symbol.upper()
        self.interval = interval
        self.active_order_ids: List[str] = []
        self.cfg = SYMBOLS_CONFIG.get(self.symbol, {"base_price": 500.0, "tick_size": 0.50, "min_qty": 5, "max_qty": 50})
        self.fair_price = self.cfg["base_price"]

    def _http_request(self, method: str, endpoint: str, data: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        url = f"{self.base_url}{endpoint}"
        body = json.dumps(data).encode("utf-8") if data is not None else None
        headers = {"Content-Type": "application/json"} if data is not None else {}
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=3.0) as resp:
                if resp.status in (200, 201):
                    return json.loads(resp.read().decode("utf-8"))
                return {}
        except urllib.error.HTTPError as e:
            try:
                err_detail = json.loads(e.read().decode("utf-8"))
                # Suppress normal expected errors like liquidity exhaustion or cancel on filled
                return {"_error": err_detail.get("detail", str(e))}
            except Exception:
                return {"_error": str(e)}
        except Exception as e:
            return None

    def check_connection(self) -> bool:
        resp = self._http_request("GET", "/health")
        if resp and resp.get("status") == "healthy":
            return True
        return False

    def seed_accounts(self) -> None:
        """Ensure simulated accounts have plenty of cash and asset inventory."""
        print("[Simulator] Seeding trader accounts with cash & inventory...")
        for trader in TRADERS:
            # Create account / deposit cash
            self._http_request("POST", f"/api/v1/accounts/{trader}/deposit", {"amount": 2500000.0})
            # Deposit initial shares for each symbol
            for sym, scfg in SYMBOLS_CONFIG.items():
                self._http_request(
                    "POST",
                    f"/api/v1/accounts/{trader}/deposit-shares",
                    {"symbol": sym, "quantity": 10000, "average_price": scfg["base_price"]}
                )
        print("[Simulator] Accounts primed with ₹2,500,000 cash and 10,000 shares each.")

    def seed_order_book(self) -> None:
        """Seed initial two-sided depth."""
        print(f"[Simulator] Initializing deep order book liquidity for {self.symbol}...")
        tick = self.cfg["tick_size"]
        base = self.fair_price

        # Place 5 bid levels
        for i in range(1, 6):
            price = round(base - (i * tick), 2)
            qty = random.randint(20, 100)
            trader = "MM_ALPHA" if i % 2 == 0 else "MM_BETA"
            resp = self._http_request("POST", "/api/v1/orders", {
                "trader_id": trader,
                "symbol": self.symbol,
                "side": "BUY",
                "order_type": "LIMIT",
                "quantity": qty,
                "price": price
            })
            if resp and "order_id" in resp:
                self.active_order_ids.append(resp["order_id"])

        # Place 5 ask levels
        for i in range(1, 6):
            price = round(base + (i * tick), 2)
            qty = random.randint(20, 100)
            trader = "MM_ALPHA" if i % 2 != 0 else "MM_BETA"
            resp = self._http_request("POST", "/api/v1/orders", {
                "trader_id": trader,
                "symbol": self.symbol,
                "side": "SELL",
                "order_type": "LIMIT",
                "quantity": qty,
                "price": price
            })
            if resp and "order_id" in resp:
                self.active_order_ids.append(resp["order_id"])

        print(f"[Simulator] Initial order book depth placed. Active resting quotes: {len(self.active_order_ids)}")

    def run_step(self) -> None:
        """Simulate one market tick."""
        # Random drift on fair price (mean-reverting random walk)
        tick = self.cfg["tick_size"]
        self.fair_price += random.choice([-tick, 0, 0, tick])
        self.fair_price = max(self.cfg["base_price"] * 0.8, min(self.cfg["base_price"] * 1.2, self.fair_price))

        action = random.choices(["LIMIT_MAKER", "MARKET_TAKER", "CANCEL_ORDER"], weights=[0.60, 0.25, 0.15])[0]

        if action == "LIMIT_MAKER":
            side = random.choice(["BUY", "SELL"])
            offset = random.choice([0.5, 1.0, 1.5, 2.0]) * tick
            price = round(self.fair_price - offset if side == "BUY" else self.fair_price + offset, 2)
            qty = random.randint(self.cfg["min_qty"], self.cfg["max_qty"])
            trader = random.choice(TRADERS)

            res = self._http_request("POST", "/api/v1/orders", {
                "trader_id": trader,
                "symbol": self.symbol,
                "side": side,
                "order_type": "LIMIT",
                "quantity": qty,
                "price": price
            })
            if res and "order_id" in res:
                self.active_order_ids.append(res["order_id"])
                trades = res.get("trades_generated", 0)
                if trades > 0:
                    print(f"  \033[92m★ TRADE EXECUTION\033[0m: {side} {qty}x {self.symbol} @ ₹{price:.2f} ({trades} fill(s))")
                else:
                    print(f"  \033[94m+ RESTING ORDER\033[0m:   {side} {qty}x {self.symbol} @ ₹{price:.2f} [{res['order_id']}]")

        elif action == "MARKET_TAKER":
            side = random.choice(["BUY", "SELL"])
            qty = random.randint(self.cfg["min_qty"], self.cfg["max_qty"] // 2)
            trader = random.choice(["RETAIL_FLOW", "ALGO_QUANT"])

            res = self._http_request("POST", "/api/v1/orders", {
                "trader_id": trader,
                "symbol": self.symbol,
                "side": side,
                "order_type": "MARKET",
                "quantity": qty
            })
            if res and "trades_generated" in res:
                trades = res.get("trades_generated", 0)
                status = res.get("status")
                print(f"  \033[93m⚡ MARKET SWEEP\033[0m:    {side} {qty}x {self.symbol} -> {status} ({trades} trade(s))")

        elif action == "CANCEL_ORDER" and self.active_order_ids:
            # Pick a random resting order to cancel
            order_to_cancel = self.active_order_ids.pop(random.randrange(len(self.active_order_ids)))
            res = self._http_request("DELETE", f"/api/v1/orders/{order_to_cancel}")
            if res and res.get("status") == "CANCELLED":
                print(f"  \033[90m✕ CANCELLED\033[0m:        Order {order_to_cancel} removed from book")

        # Keep active pool bounded
        if len(self.active_order_ids) > 60:
            self.active_order_ids = self.active_order_ids[-40:]

    def start(self) -> None:
        print("==================================================")
        print(" CHRONOSMATCH: LIVE MARKET SIMULATION GENERATOR")
        print("==================================================")
        print(f"Target Server : {self.base_url}")
        print(f"Active Symbol : {self.symbol}")
        print(f"Tick Interval : {self.interval}s")
        print("==================================================")

        if not self.check_connection():
            print(f"\n\033[91m[ERROR] Unable to reach ChronosMatch backend at {self.base_url}.\033[0m")
            print("Please start the backend server in another terminal:")
            print("    cd backend")
            print("    python -m uvicorn main:app --reload\n")
            sys.exit(1)

        print("\033[92m[CONNECTED] Backend is alive and healthy.\033[0m\n")
        self.seed_accounts()
        self.seed_order_book()

        print("\n\033[96m[SIMULATION STREAMING ACTIVE] Press Ctrl+C to stop.\033[0m\n")
        tick_count = 0
        try:
            while True:
                self.run_step()
                tick_count += 1
                if tick_count % 10 == 0:
                    # Print brief order book summary
                    ob = self._http_request("GET", f"/api/v1/orderbook/{self.symbol}?depth=3")
                    if ob:
                        best_bid = ob.get("best_bid") or 0.0
                        best_ask = ob.get("best_ask") or 0.0
                        spread = ob.get("spread") or 0.0
                        print(f"  \033[95m[BOOK SNAPSHOT]\033[0m   Best Bid: ₹{best_bid:.2f} | Best Ask: ₹{best_ask:.2f} | Spread: ₹{spread:.2f}")
                time.sleep(self.interval)
        except KeyboardInterrupt:
            print("\n\n[Simulator] Simulation halted by user.")


def main():
    parser = argparse.ArgumentParser(description="ChronosMatch Real-time Market Simulator")
    parser.add_argument("--host", default="127.0.0.1", help="Backend host")
    parser.add_argument("--port", type=int, default=8000, help="Backend port")
    parser.add_argument("--symbol", default="TCS", help="Trading symbol (TCS, INFY, RELIANCE, AAPL, MSFT)")
    parser.add_argument("--interval", type=float, default=0.4, help="Seconds between order ticks")
    args = parser.parse_args()

    sim = MarketSimulator(
        base_url=f"http://{args.host}:{args.port}",
        symbol=args.symbol,
        interval=args.interval
    )
    sim.start()


if __name__ == "__main__":
    main()
