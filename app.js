/**
 * ChronosMatch Real-Time Dashboard Client
 * Complete 12-Component Financial Trading Terminal
 */

// Base API URL configuration
const API_BASE = (window.location.protocol === "file:" || (window.location.port !== "8000" && window.location.port !== ""))
    ? "http://127.0.0.1:8000"
    : "";

const STATE = {
    symbol: "TCS",
    traderId: "TRADER_1",
    side: "BUY",
    orderType: "LIMIT",
    ordersProcessed: 0,
    apiLatencies: [],
    startTime: Date.now(),
    isOnline: false,
    activeTab: "tabPositions",
    filterSide: "ALL",
    filterSymbol: "ALL",
    filterSearch: "",
    moversMode: "GAINERS",
    allTrades: [],
    lastPortfolio: null,
};

// Company Directory & Market Metadata
const COMPANY_INFO = {
    "TCS": {
        name: "Tata Consultancy Services Ltd",
        shortName: "Tata Consultancy",
        sector: "Information Technology",
        exchange: "NSE / BSE",
        basePrice: 500.0,
        tickSize: 0.50,
        dayChangePct: +0.95,
        volume: 34820,
    },
    "RELIANCE": {
        name: "Reliance Industries Limited",
        shortName: "Reliance Ind.",
        sector: "Energy & Conglomerate",
        exchange: "NSE / BSE",
        basePrice: 2500.0,
        tickSize: 1.00,
        dayChangePct: +1.50,
        volume: 42100,
    },
    "INFY": {
        name: "Infosys Limited",
        shortName: "Infosys",
        sector: "Information Technology",
        exchange: "NSE / BSE",
        basePrice: 1500.0,
        tickSize: 1.00,
        dayChangePct: +3.20,
        volume: 58900,
    },
    "WIPRO": {
        name: "Wipro Limited",
        shortName: "Wipro Ltd",
        sector: "Information Technology",
        exchange: "NSE / BSE",
        basePrice: 480.0,
        tickSize: 0.25,
        dayChangePct: +2.80,
        volume: 71200,
    },
    "HDFCBANK": {
        name: "HDFC Bank Limited",
        shortName: "HDFC Bank",
        sector: "Banking & Financials",
        exchange: "NSE / BSE",
        basePrice: 1650.0,
        tickSize: 0.50,
        dayChangePct: -0.25,
        volume: 64100,
    },
    "TATAMOTORS": {
        name: "Tata Motors Limited",
        shortName: "Tata Motors",
        sector: "Automotive",
        exchange: "NSE / BSE",
        basePrice: 920.0,
        tickSize: 0.50,
        dayChangePct: -1.40,
        volume: 83500,
    },
    "AAPL": {
        name: "Apple Inc.",
        shortName: "Apple",
        sector: "Consumer Electronics",
        exchange: "NASDAQ (INR)",
        basePrice: 180.0,
        tickSize: 0.25,
        dayChangePct: -0.80,
        volume: 24500,
    },
    "MSFT": {
        name: "Microsoft Corporation",
        shortName: "Microsoft",
        sector: "Cloud & Software",
        exchange: "NASDAQ (INR)",
        basePrice: 420.0,
        tickSize: 0.50,
        dayChangePct: -0.40,
        volume: 19800,
    },
    "BTC-INR": {
        name: "Bitcoin / Indian Rupee",
        shortName: "Bitcoin INR",
        sector: "Digital Assets",
        exchange: "Spot Crypto (INR)",
        basePrice: 5500000.0,
        tickSize: 100.0,
        dayChangePct: +2.15,
        volume: 145,
    },
};

// Vector SVG Logos for Supported Symbols
function getCompanyLogoSvg(symbol, size = null) {
    const sym = (symbol || "").toUpperCase();
    const styleAttr = size ? `style="width:${size}px;height:${size}px;"` : "";

    switch (sym) {
        case "AAPL":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#18181b"/><g transform="translate(24, 16) scale(0.31)"><path fill="#f3f4f6" d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.87-11.93-14.49-5.99-9.36-10.74-20.08-14.25-32.18-3.51-12.1-5.26-23.75-5.26-34.97 0-14.9 3.51-26.96 10.53-36.19 7.02-9.23 15.82-13.97 26.41-14.22 4.14 0 8.92 1.11 14.34 3.33 5.42 2.22 9.09 3.33 11.01 3.33 1.54 0 5.37-1.16 11.5-3.48 6.13-2.32 11.27-3.3 15.42-2.94 13.59.88 24.32 5.92 32.19 15.14-12.14 7.37-18.06 17.5-17.76 30.38.3 10.15 4.14 18.66 11.52 25.53 7.38 6.87 16.32 10.66 26.83 11.37-2.37 7.23-5.28 14.54-8.74 21.94zM119.22 33.68c0-7.39 2.66-14.34 7.98-20.85 5.32-6.51 11.96-10.74 19.92-12.69.17 1.11.26 2.13.26 3.07 0 7.39-2.83 14.53-8.49 21.42-5.66 6.89-12.43 11.08-20.31 12.57-.42-1.19-.63-2.36-.63-3.52z"/></g><text x="50" y="88" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#9ca3af" letter-spacing="1">APPLE</text></svg>`;
        case "TCS":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#005696"/><path d="M26 36 C38 36 46 46 48 64 C45 48 38 42 26 42 Z" fill="#ffffff"/><path d="M74 36 C62 36 54 46 52 64 C55 48 62 42 74 42 Z" fill="#ffffff"/><text x="50" y="84" text-anchor="middle" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-size="16" fill="#ffffff" letter-spacing="1.5">TCS</text></svg>`;
        case "WIPRO":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#0f172a"/><circle cx="50" cy="38" r="6" fill="#fbbf24"/><circle cx="50" cy="22" r="4.5" fill="#ef4444"/><circle cx="62" cy="26" r="4.5" fill="#f43f5e"/><circle cx="66" cy="38" r="4.5" fill="#a855f7"/><circle cx="62" cy="50" r="4.5" fill="#3b82f6"/><circle cx="50" cy="54" r="4.5" fill="#06b6d4"/><circle cx="38" cy="50" r="4.5" fill="#10b981"/><circle cx="34" cy="38" r="4.5" fill="#84cc16"/><circle cx="38" cy="26" r="4.5" fill="#eab308"/><text x="50" y="80" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#ffffff" letter-spacing="1">wipro</text></svg>`;
        case "RELIANCE":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#0a192f"/><polygon points="50,14 80,31 80,67 50,84 20,67 20,31" stroke="#e11d48" stroke-width="4.5" fill="none"/><text x="50" y="58" text-anchor="middle" font-family="'Georgia', serif" font-weight="bold" font-size="34" fill="#ffffff">R</text><text x="50" y="93" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="8.5" fill="#60a5fa" letter-spacing="1.2">RELIANCE</text></svg>`;
        case "INFY":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#007cc3"/><text x="50" y="54" text-anchor="middle" font-family="'Inter', sans-serif" font-style="italic" font-weight="900" font-size="19" fill="#ffffff" letter-spacing="-0.5">Infosys</text><line x1="22" y1="64" x2="78" y2="64" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg>`;
        case "HDFCBANK":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#002d62"/><rect x="36" y="36" width="28" height="28" fill="#ed1c24"/><path d="M22 22 H42 V30 H30 V42 H22 Z" fill="#ffffff"/><path d="M78 22 H58 V30 H70 V42 H78 Z" fill="#ffffff"/><path d="M22 78 H42 V70 H30 V58 H22 Z" fill="#ffffff"/><path d="M78 78 H58 V70 H70 V58 H78 Z" fill="#ffffff"/><text x="50" y="94" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="8.5" fill="#ffffff" letter-spacing="0.5">HDFC BANK</text></svg>`;
        case "TATAMOTORS":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#1e3a8a"/><ellipse cx="50" cy="42" rx="30" ry="20" stroke="#60a5fa" stroke-width="3" fill="none"/><path d="M32 36 C41 36 47 44 49 54 C46 44 41 39 32 39 Z" fill="#ffffff"/><path d="M68 36 C59 36 53 44 51 54 C54 44 59 39 68 39 Z" fill="#ffffff"/><text x="50" y="80" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="9" fill="#ffffff" letter-spacing="1">TATA MOTORS</text></svg>`;
        case "MSFT":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#18181b"/><rect x="23" y="23" width="24" height="24" fill="#f25022"/><rect x="53" y="23" width="24" height="24" fill="#7fba00"/><rect x="23" y="53" width="24" height="24" fill="#00a4ef"/><rect x="53" y="53" width="24" height="24" fill="#ffb900"/><text x="50" y="92" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="8.5" fill="#e4e4e7" letter-spacing="1">MICROSOFT</text></svg>`;
        case "BTC-INR":
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#18181b"/><circle cx="50" cy="46" r="28" fill="#f7931a"/><path d="M51 28 V33 M57 28 V33 M51 59 V64 M57 59 V64 M43 33 H56 C60 33 63 36 63 39.5 C63 42 61 44 59 45 C62 46 64 48.5 64 52.5 C64 56.5 60 59 56 59 H43 V33 Z M50 38 H47 V43.5 H50 C52 43.5 54 43 54 40.8 C54 38.6 52 38 50 38 Z M51 48.5 H47 V54 H51 C53.5 54 55.5 53.2 55.5 51.2 C55.5 49.2 53.5 48.5 51 48.5 Z" fill="#ffffff"/><text x="50" y="88" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="9" fill="#f7931a" letter-spacing="1">BITCOIN</text></svg>`;
        default:
            return `<svg viewBox="0 0 100 100" class="company-svg-logo" ${styleAttr}><rect width="100" height="100" rx="22" fill="#2563eb"/><text x="50" y="60" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="28" fill="#ffffff">${sym.slice(0, 3)}</text></svg>`;
    }
}

// Candlestick Timeframe Durations in Milliseconds
const CANDLE_TIMEFRAMES = {
    "1s": 1000,
    "5s": 5000,
    "1m": 60000,
    "5m": 300000,
    "15m": 900000,
    "1D": 86400000,
};

// Candlestick Engine State
const candlestickState = {
    timeframe: "5s",
    candles: [],
    mousePos: null,
    hoveredCandle: null,
};

// Intraday P&L Progression Engine State
const pnlState = {
    points: [
        { time: "09:15", pnl: 0 },
        { time: "09:45", pnl: 320 },
        { time: "10:30", pnl: 850 },
        { time: "11:15", pnl: 640 },
        { time: "12:00", pnl: 1450 },
        { time: "13:15", pnl: 1200 },
        { time: "14:00", pnl: 1980 },
        { time: "14:45", pnl: 2450 },
    ],
    mousePos: null,
};

// Macro Ticker Items
const tickerData = [
    { name: "NIFTY 50", price: 24180.50, change: +145.20, pct: +0.60, isIndex: true },
    { name: "BANK NIFTY", price: 51420.00, change: -112.50, pct: -0.22, isIndex: true },
    { name: "SENSEX", price: 79840.20, change: +460.10, pct: +0.58, isIndex: true },
    { name: "GOLD (10g)", price: 76450.00, change: +265.00, pct: +0.35, isIndex: true },
    { name: "USD/INR", price: 84.32, change: -0.04, pct: -0.05, isIndex: true },
    { name: "CRUDE OIL", price: 6150.00, change: +45.00, pct: +0.74, isIndex: true },
    { name: "TCS", price: 502.50, change: +4.50, pct: +0.95, isStock: true, sym: "TCS" },
    { name: "RELIANCE", price: 2512.00, change: +37.00, pct: +1.50, isStock: true, sym: "RELIANCE" },
    { name: "INFY", price: 1525.00, change: +48.00, pct: +3.20, isStock: true, sym: "INFY" },
    { name: "WIPRO", price: 485.00, change: +13.50, pct: +2.80, isStock: true, sym: "WIPRO" },
];

// Sector Performance Data
const sectorData = [
    { name: "NIFTY IT", pct: +1.85, tag: "HOT 🔥", strength: 85 },
    { name: "NIFTY PHARMA", pct: +1.10, tag: "BULLISH", strength: 65 },
    { name: "NIFTY AUTO", pct: +0.92, tag: "STEADY", strength: 55 },
    { name: "NIFTY ENERGY", pct: +0.60, tag: "MODERATE", strength: 45 },
    { name: "NIFTY METAL", pct: -0.30, tag: "COOLING", strength: 30 },
    { name: "NIFTY BANK", pct: -0.45, tag: "COLD ❄️", strength: 20 },
];

// News & Market Catalysts Feed
const newsData = [
    {
        tag: "IT SECTOR",
        headline: "Wipro and TCS secure key multi-million dollar cloud modernisation partnerships across European banks.",
        time: "10 mins ago",
        sentiment: "bullish",
    },
    {
        tag: "MACRO",
        headline: "RBI MPC policy statement reaffirms domestic growth momentum; foreign institutional inflows hit 3-week peak.",
        time: "24 mins ago",
        sentiment: "bullish",
    },
    {
        tag: "ENERGY",
        headline: "Reliance Industries commences trial operations at green hydrogen giga-complex in Jamnagar.",
        time: "45 mins ago",
        sentiment: "bullish",
    },
    {
        tag: "AUTOMOTIVE",
        headline: "Tata Motors domestic passenger EV registrations record 22% MoM growth in monthly transport telemetry.",
        time: "1 hr ago",
        sentiment: "bullish",
    },
    {
        tag: "GLOBAL TECH",
        headline: "US Federal Reserve remarks indicate data-dependent stance on upcoming policy rates; Nasdaq futures steady.",
        time: "2 hrs ago",
        sentiment: "neutral",
    },
];

// Helper: Currency Prefix
function getCurrencyPrefix(sym) {
    return "₹";
}

// Health Check
async function checkEngineHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            if (data.status === "healthy") {
                setEngineOnline(true);
                return true;
            }
        }
        setEngineOnline(false);
        return false;
    } catch (e) {
        setEngineOnline(false);
        return false;
    }
}

function setEngineOnline(online) {
    STATE.isOnline = online;
    const systemStatusBadge = document.getElementById("systemStatusBadge");
    const statusDot = document.querySelector(".status-dot");
    const engineStatusText = document.getElementById("engineStatusText");
    const offlineBanner = document.getElementById("offlineBanner");

    if (online) {
        if (systemStatusBadge) systemStatusBadge.classList.remove("offline");
        if (statusDot) statusDot.classList.remove("offline");
        if (engineStatusText) engineStatusText.textContent = "ENGINE ONLINE";
        if (offlineBanner) offlineBanner.classList.add("hidden");
    } else {
        if (systemStatusBadge) systemStatusBadge.classList.add("offline");
        if (statusDot) statusDot.classList.add("offline");
        if (engineStatusText) engineStatusText.textContent = "ENGINE OFFLINE";
        if (offlineBanner) offlineBanner.classList.remove("hidden");
    }
}

// Master Initialization
document.addEventListener("DOMContentLoaded", async () => {
    setupAuthProfile();
    initLiveTicker();
    initKpiCards();
    initWatchlist();
    initCandlestickChart();
    initPnlChart();
    initTradingCenterTabs();
    initSlicers();
    initMovers();
    initSectors();
    initNewsFeed();
    updateCompanyLogosAndBranding();
    setupEventListeners();

    const online = await checkEngineHealth();
    if (online) {
        await initializeDefaultAccounts();
        await refreshMarketAndBook();
        await refreshAccountData();
    }
    startPollingLoop();
});

function setupAuthProfile() {
    const token = localStorage.getItem("chronosmatch_auth_token");
    const userStr = localStorage.getItem("chronosmatch_user");
    const traderId = localStorage.getItem("chronosmatch_trader_id");
    const userDisplayName = document.getElementById("userDisplayName");
    const userAvatarText = document.getElementById("userAvatarText");
    const authActionLink = document.getElementById("authActionLink");

    if (token && traderId) {
        STATE.traderId = traderId;
        let name = traderId;
        try {
            const user = userStr ? JSON.parse(userStr) : null;
            if (user && user.username) name = user.username;
        } catch (_) {}

        if (userDisplayName) userDisplayName.textContent = name;
        if (userAvatarText) userAvatarText.textContent = name.slice(0, 2).toUpperCase();
        if (authActionLink) {
            authActionLink.textContent = "Sign Out";
            authActionLink.href = "#";
            authActionLink.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem("chronosmatch_auth_token");
                localStorage.removeItem("chronosmatch_trader_id");
                localStorage.removeItem("chronosmatch_user");
                const target = (window.location.protocol === "file:") ? "auth.html#login" : "/login";
                window.location.href = target;
            };
        }
    } else {
        if (userDisplayName) userDisplayName.textContent = STATE.traderId || "Guest";
        if (userAvatarText) userAvatarText.textContent = (STATE.traderId || "G").slice(0, 2).toUpperCase();
        if (authActionLink) {
            authActionLink.textContent = "Sign In";
            authActionLink.href = (window.location.protocol === "file:") ? "auth.html#login" : "/login";
            authActionLink.onclick = null;
        }
    }
}

function setupEventListeners() {
    const symbolSelect = document.getElementById("symbolSelect");
    const accountSelect = document.getElementById("accountSelect");
    const btnSideBuy = document.getElementById("btnSideBuy");
    const btnSideSell = document.getElementById("btnSideSell");
    const btnTypeLimit = document.getElementById("btnTypeLimit");
    const btnTypeMarket = document.getElementById("btnTypeMarket");
    const inputPrice = document.getElementById("inputPrice");
    const inputQuantity = document.getElementById("inputQuantity");
    const orderForm = document.getElementById("orderForm");
    const btnRetryConnection = document.getElementById("btnRetryConnection");

    if (symbolSelect) {
        symbolSelect.addEventListener("change", (e) => {
            switchActiveSymbol(e.target.value);
        });
    }

    if (accountSelect) {
        accountSelect.addEventListener("change", (e) => {
            STATE.traderId = e.target.value;
            const userDisplayName = document.getElementById("userDisplayName");
            const userAvatarText = document.getElementById("userAvatarText");
            if (userDisplayName) userDisplayName.textContent = STATE.traderId;
            if (userAvatarText) userAvatarText.textContent = STATE.traderId.slice(0, 2).toUpperCase();
            refreshAccountData();
        });
    }

    if (btnSideBuy) btnSideBuy.addEventListener("click", () => setOrderSide("BUY"));
    if (btnSideSell) btnSideSell.addEventListener("click", () => setOrderSide("SELL"));
    if (btnTypeLimit) btnTypeLimit.addEventListener("click", () => setOrderType("LIMIT"));
    if (btnTypeMarket) btnTypeMarket.addEventListener("click", () => setOrderType("MARKET"));

    if (inputPrice) inputPrice.addEventListener("input", updateOrderEstimate);
    if (inputQuantity) inputQuantity.addEventListener("input", updateOrderEstimate);
    if (orderForm) orderForm.addEventListener("submit", handleOrderSubmit);

    if (btnRetryConnection) {
        btnRetryConnection.addEventListener("click", async () => {
            btnRetryConnection.textContent = "Checking...";
            const ok = await checkEngineHealth();
            if (ok) {
                await initializeDefaultAccounts();
                await refreshMarketAndBook();
                await refreshAccountData();
            }
            btnRetryConnection.textContent = "Retry Connection";
        });
    }

    // Account Modals
    const modalAccount = document.getElementById("modalAccount");
    const btnNewAccountModal = document.getElementById("btnNewAccountModal");
    const btnCloseAccModal = document.getElementById("btnCloseAccModal");
    const btnCancelAccModal = document.getElementById("btnCancelAccModal");
    const formNewAccount = document.getElementById("formNewAccount");

    if (btnNewAccountModal) btnNewAccountModal.addEventListener("click", () => modalAccount?.classList.remove("hidden"));
    if (btnCloseAccModal) btnCloseAccModal.addEventListener("click", () => modalAccount?.classList.add("hidden"));
    if (btnCancelAccModal) btnCancelAccModal.addEventListener("click", () => modalAccount?.classList.add("hidden"));
    if (formNewAccount) formNewAccount.addEventListener("submit", handleCreateAccount);

    // Deposit Modals
    const modalDeposit = document.getElementById("modalDeposit");
    const btnDepositModal = document.getElementById("btnDepositModal");
    const btnCloseDepModal = document.getElementById("btnCloseDepModal");
    const btnCancelDepModal = document.getElementById("btnCancelDepModal");
    const formDeposit = document.getElementById("formDeposit");

    if (btnDepositModal) btnDepositModal.addEventListener("click", () => modalDeposit?.classList.remove("hidden"));
    if (btnCloseDepModal) btnCloseDepModal.addEventListener("click", () => modalDeposit?.classList.add("hidden"));
    if (btnCancelDepModal) btnCancelDepModal.addEventListener("click", () => modalDeposit?.classList.add("hidden"));
    if (formDeposit) formDeposit.addEventListener("submit", handleDeposit);
}

// 1-Click Symbol Switcher
function switchActiveSymbol(newSym) {
    if (!newSym) return;
    STATE.symbol = newSym.toUpperCase();

    const symbolSelect = document.getElementById("symbolSelect");
    if (symbolSelect && symbolSelect.value !== STATE.symbol) {
        symbolSelect.value = STATE.symbol;
    }

    const lblOrderPanelSymbol = document.getElementById("lblOrderPanelSymbol");
    if (lblOrderPanelSymbol) lblOrderPanelSymbol.textContent = STATE.symbol;

    const ribbonSymbol = document.getElementById("ribbonSymbol");
    if (ribbonSymbol) ribbonSymbol.textContent = STATE.symbol;

    const obSymbolTitle = document.getElementById("obSymbolTitle");
    if (obSymbolTitle) obSymbolTitle.textContent = STATE.symbol;

    updateCompanyLogosAndBranding();
    seedCandlestickHistory(STATE.symbol, candlestickState.timeframe);
    updateOrderEstimate();
    refreshMarketAndBook();
    refreshAccountData();
    highlightActiveWatchlistRow();
}

/* ==========================================================
   Component 3: Live Price Ticker Strip
   ========================================================== */
function initLiveTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;

    renderTickerItems();

    // Subtle random price micro-ticks every 2.5 seconds
    setInterval(() => {
        const randIdx = Math.floor(Math.random() * tickerData.length);
        const item = tickerData[randIdx];
        const drift = (Math.random() - 0.48) * (item.price * 0.001);
        item.price = Math.max(1, +(item.price + drift).toFixed(item.price > 1000 ? 1 : 2));
        item.change = +(item.change + drift).toFixed(2);
        item.pct = +(item.pct + (drift / item.price) * 100).toFixed(2);

        const el = document.getElementById(`tickerItem_${randIdx}`);
        if (el) {
            const chgClass = item.pct >= 0 ? "text-buy" : "text-sell";
            const sign = item.pct >= 0 ? "+" : "";
            el.innerHTML = `
                <span class="ticker-symbol">${item.name}</span>
                <span class="ticker-price">${item.price > 100 ? item.price.toLocaleString("en-IN") : item.price}</span>
                <span class="ticker-chg ${chgClass}">${sign}${item.pct}%</span>
            `;
            el.classList.remove("ticker-flash-up", "ticker-flash-down");
            void el.offsetWidth;
            el.classList.add(drift >= 0 ? "ticker-flash-up" : "ticker-flash-down");
        }
    }, 2500);
}

function renderTickerItems() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;

    track.innerHTML = tickerData.map((t, idx) => {
        const chgClass = t.pct >= 0 ? "text-buy" : "text-sell";
        const sign = t.pct >= 0 ? "+" : "";
        const formattedPrice = t.price > 100 ? t.price.toLocaleString("en-IN") : t.price;
        const clickAttr = t.sym ? `onclick="switchActiveSymbol('${t.sym}')"` : "";
        return `
            <div class="ticker-item" id="tickerItem_${idx}" ${clickAttr} title="${t.sym ? 'Click to trade ' + t.sym : t.name}">
                <span class="ticker-symbol">${t.name}</span>
                <span class="ticker-price">${formattedPrice}</span>
                <span class="ticker-chg ${chgClass}">${sign}${t.pct}%</span>
            </div>
        `;
    }).join("");
}

/* ==========================================================
   Component 1: KPI Cards Engine
   ========================================================== */
function initKpiCards() {
    updateKpiCards(null, []);
}

function updateKpiCards(portfolio, trades) {
    const kpiTodayPnl = document.getElementById("kpiTodayPnl");
    const kpiPnlPct = document.getElementById("kpiPnlPct");
    const kpiPnlSubtitle = document.getElementById("kpiPnlSubtitle");
    const kpiWinRate = document.getElementById("kpiWinRate");
    const kpiWinBar = document.getElementById("kpiWinBar");
    const kpiWinStats = document.getElementById("kpiWinStats");
    const kpiTotalTrades = document.getElementById("kpiTotalTrades");
    const kpiTradesBreakdown = document.getElementById("kpiTradesBreakdown");
    const kpiCapitalUsed = document.getElementById("kpiCapitalUsed");
    const kpiCapitalBar = document.getElementById("kpiCapitalBar");
    const kpiCapitalBreakdown = document.getElementById("kpiCapitalBreakdown");

    // Default baseline values
    let totalPnl = 2450.00;
    let realizedPnl = 1850.00;
    let unrealizedPnl = 600.00;
    let winRate = 65;
    let numWins = 13;
    let numLosses = 7;
    let tradesCount = 8;
    let buyCount = 5;
    let sellCount = 3;
    let capitalUsedPct = 70;
    let deployedCash = 70000;
    let freeMargin = 30000;

    if (portfolio) {
        deployedCash = portfolio.reserved_cash || 0;
        let holdingMktVal = 0;
        let holdingUnrealized = 0;

        if (portfolio.holdings && portfolio.holdings.length > 0) {
            portfolio.holdings.forEach((h) => {
                holdingMktVal += h.market_value;
                holdingUnrealized += h.unrealized_pnl;
            });
        }
        deployedCash += holdingMktVal;
        freeMargin = portfolio.available_cash || 30000;
        const totalCap = deployedCash + freeMargin || 100000;
        capitalUsedPct = Math.min(100, Math.max(0, Math.round((deployedCash / totalCap) * 100)));

        if (portfolio.holdings && portfolio.holdings.length > 0) {
            unrealizedPnl = holdingUnrealized;
            totalPnl = realizedPnl + unrealizedPnl;
        }
    }

    if (trades && trades.length > 0) {
        tradesCount = trades.length;
        buyCount = Math.ceil(tradesCount * 0.6);
        sellCount = tradesCount - buyCount;
    }

    const pnlSign = totalPnl >= 0 ? "+" : "";
    const pnlClass = totalPnl >= 0 ? "text-buy" : "text-sell";
    const pnlPctVal = ((totalPnl / 50000) * 100).toFixed(2);

    if (kpiTodayPnl) {
        kpiTodayPnl.textContent = `${pnlSign} ₹${Math.abs(totalPnl).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
        kpiTodayPnl.className = `kpi-main-val font-mono ${pnlClass}`;
    }
    if (kpiPnlPct) {
        kpiPnlPct.textContent = `${pnlSign}${pnlPctVal}%`;
        kpiPnlPct.className = `kpi-badge ${pnlClass}`;
    }
    if (kpiPnlSubtitle) {
        kpiPnlSubtitle.textContent = `Realized: ₹${realizedPnl.toLocaleString("en-IN")} • Unrealized: ₹${unrealizedPnl.toFixed(2)}`;
    }

    if (kpiWinRate) kpiWinRate.textContent = `${winRate}%`;
    if (kpiWinBar) kpiWinBar.style.width = `${winRate}%`;
    if (kpiWinStats) kpiWinStats.textContent = `${numWins} Wins / ${numLosses} Losses Today`;

    if (kpiTotalTrades) kpiTotalTrades.textContent = tradesCount;
    if (kpiTradesBreakdown) {
        const estTurnover = tradesCount * 17800;
        kpiTradesBreakdown.textContent = `${buyCount} Buys • ${sellCount} Sells • Turnover: ₹${estTurnover.toLocaleString("en-IN")}`;
    }

    if (kpiCapitalUsed) kpiCapitalUsed.textContent = `${capitalUsedPct}%`;
    if (kpiCapitalBar) kpiCapitalBar.style.width = `${capitalUsedPct}%`;
    if (kpiCapitalBreakdown) {
        kpiCapitalBreakdown.textContent = `₹${deployedCash.toLocaleString("en-IN")} Deployed / ₹${freeMargin.toLocaleString("en-IN")} Free Margin`;
    }

    // Sync P&L chart current badge
    const pnlBadge = document.getElementById("pnlProgressionBadge");
    if (pnlBadge) {
        pnlBadge.textContent = `${pnlSign} ₹${totalPnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
        pnlBadge.className = `pnl-current-stat font-mono ${pnlClass}`;
    }
}

/* ==========================================================
   Component 5: Watchlist Engine
   ========================================================== */
function initWatchlist() {
    renderWatchlist();
    const searchInput = document.getElementById("watchlistSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderWatchlist(e.target.value);
        });
    }
}

function renderWatchlist(query = "") {
    const container = document.getElementById("watchlistItems");
    if (!container) return;

    const q = query.trim().toUpperCase();
    const symbols = Object.keys(COMPANY_INFO);
    const filtered = symbols.filter((sym) => {
        if (!q) return true;
        const info = COMPANY_INFO[sym];
        return sym.includes(q) || (info && (info.name.toUpperCase().includes(q) || info.sector.toUpperCase().includes(q)));
    });

    const countEl = document.getElementById("watchlistCount");
    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">No matching stocks found</div>`;
        return;
    }

    container.innerHTML = filtered.map((sym) => {
        const info = COMPANY_INFO[sym];
        const isActive = sym === STATE.symbol;
        const activeClass = isActive ? "active" : "";
        const logoSvg = getCompanyLogoSvg(sym, 22);
        const chgClass = info.dayChangePct >= 0 ? "text-buy" : "text-sell";
        const sign = info.dayChangePct >= 0 ? "+" : "";
        const cur = getCurrencyPrefix(sym);

        return `
            <div class="watchlist-row ${activeClass}" id="wl_${sym}" onclick="switchActiveSymbol('${sym}')">
                <div class="watchlist-left-meta">
                    <div class="watchlist-logo-box">${logoSvg}</div>
                    <div class="watchlist-names">
                        <span class="watchlist-sym font-mono">${sym}</span>
                        <span class="watchlist-sector">${info.sector}</span>
                    </div>
                </div>
                <div class="watchlist-right-meta">
                    <span class="watchlist-px font-mono">${cur}${info.basePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    <span class="watchlist-chg-pill ${chgClass} font-mono">${sign}${info.dayChangePct}%</span>
                </div>
            </div>
        `;
    }).join("");
}

function highlightActiveWatchlistRow() {
    document.querySelectorAll(".watchlist-row").forEach((row) => row.classList.remove("active"));
    const activeEl = document.getElementById(`wl_${STATE.symbol}`);
    if (activeEl) activeEl.classList.add("active");
}

/* ==========================================================
   Component 11: Risk Meter Engine
   ========================================================== */
function initRiskMeter() {
    updateRiskMeter(null);
}

function updateRiskMeter(portfolio) {
    const riskBarFill = document.getElementById("riskBarFill");
    const riskDeployedVal = document.getElementById("riskDeployedVal");
    const riskRemainingVal = document.getElementById("riskRemainingVal");
    const riskSlHitCount = document.getElementById("riskSlHitCount");

    let deployedPct = 70;
    let deployedAmount = 70000;
    let remainingRisk = 3800;

    if (portfolio) {
        const avail = portfolio.available_cash || 30000;
        const reserved = portfolio.reserved_cash || 0;
        let mktVal = 0;
        if (portfolio.holdings) {
            portfolio.holdings.forEach((h) => mktVal += h.market_value);
        }
        deployedAmount = reserved + mktVal;
        const total = deployedAmount + avail || 100000;
        deployedPct = Math.min(100, Math.max(0, Math.round((deployedAmount / total) * 100)));
    }

    if (riskBarFill) riskBarFill.style.width = `${deployedPct}%`;
    if (riskDeployedVal) riskDeployedVal.textContent = `${deployedPct}% (₹${deployedAmount.toLocaleString("en-IN")})`;
    if (riskRemainingVal) riskRemainingVal.textContent = `₹${remainingRisk.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    if (riskSlHitCount) riskSlHitCount.textContent = `0 Hit Today`;
}

/* ==========================================================
   Component 2: Intraday P&L Chart Engine (Line / Area Canvas)
   ========================================================== */
function initPnlChart() {
    const container = document.getElementById("pnlCanvasContainer");
    if (!container) return;

    container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        pnlState.mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        drawPnlChart();
    });

    container.addEventListener("mouseleave", () => {
        pnlState.mousePos = null;
        drawPnlChart();
    });

    window.addEventListener("resize", drawPnlChart);
    drawPnlChart();
}

function drawPnlChart() {
    const canvas = document.getElementById("pnlCanvas");
    const container = document.getElementById("pnlCanvasContainer");
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    // Background
    ctx.fillStyle = "#080c16";
    ctx.fillRect(0, 0, W, H);

    const padTop = 14;
    const padBottom = 22;
    const padLeft = 14;
    const padRight = 65; // price axis
    const plotW = W - padLeft - padRight;
    const plotH = H - padTop - padBottom;

    const points = pnlState.points;
    if (!points || points.length === 0) return;

    let minPnl = -500;
    let maxPnl = 3000;

    points.forEach((p) => {
        if (p.pnl < minPnl) minPnl = p.pnl;
        if (p.pnl > maxPnl) maxPnl = p.pnl;
    });

    const range = maxPnl - minPnl || 100;
    minPnl -= range * 0.1;
    maxPnl += range * 0.1;

    function yForPnl(val) {
        return padTop + plotH - ((val - minPnl) / (maxPnl - minPnl)) * plotH;
    }

    const zeroY = yForPnl(0);

    // 1. Zero Baseline
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padLeft, Math.round(zeroY) + 0.5);
    ctx.lineTo(padLeft + plotW, Math.round(zeroY) + 0.5);
    ctx.stroke();
    ctx.restore();

    // Zero label
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(154, 168, 199, 0.6)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("₹0", padLeft + plotW + 6, zeroY);

    // 2. High & Low scale labels
    ctx.fillText(`+₹${maxPnl.toFixed(0)}`, padLeft + plotW + 6, padTop + 8);
    ctx.fillText(`-₹${Math.abs(minPnl).toFixed(0)}`, padLeft + plotW + 6, padTop + plotH - 6);

    // 3. Compute coordinates for points
    const coords = points.map((p, idx) => {
        const x = padLeft + (idx / (points.length - 1)) * plotW;
        const y = yForPnl(p.pnl);
        return { x, y, pnl: p.pnl, time: p.time };
    });

    // 4. Area Gradient Fill
    const isOverallProfit = points[points.length - 1].pnl >= 0;
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    if (isOverallProfit) {
        grad.addColorStop(0, "rgba(0, 230, 118, 0.3)");
        grad.addColorStop(1, "rgba(0, 230, 118, 0.0)");
    } else {
        grad.addColorStop(0, "rgba(255, 51, 102, 0.3)");
        grad.addColorStop(1, "rgba(255, 51, 102, 0.0)");
    }

    ctx.beginPath();
    ctx.moveTo(coords[0].x, zeroY);
    coords.forEach((pt) => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(coords[coords.length - 1].x, zeroY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 5. Line Stroke
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    coords.forEach((pt) => ctx.lineTo(pt.x, pt.y));
    ctx.strokeStyle = isOverallProfit ? "#00e676" : "#ff3366";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 6. Time Labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(154, 168, 199, 0.5)";
    coords.forEach((pt, i) => {
        if (i % 2 === 0 || i === coords.length - 1) {
            ctx.fillText(pt.time, pt.x, padTop + plotH + 5);
        }
    });

    // 7. Interactive Crosshair
    if (pnlState.mousePos) {
        const { x: mx } = pnlState.mousePos;
        if (mx >= padLeft && mx <= padLeft + plotW) {
            // Find closest point
            let closest = coords[0];
            let minDist = Infinity;
            coords.forEach((pt) => {
                const dist = Math.abs(pt.x - mx);
                if (dist < minDist) {
                    minDist = dist;
                    closest = pt;
                }
            });

            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.beginPath();
            ctx.moveTo(Math.round(closest.x) + 0.5, padTop);
            ctx.lineTo(Math.round(closest.x) + 0.5, padTop + plotH);
            ctx.stroke();
            ctx.restore();

            // Highlight dot
            ctx.beginPath();
            ctx.arc(closest.x, closest.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            // Tooltip chip
            const sign = closest.pnl >= 0 ? "+" : "";
            const tipText = `${closest.time} • ${sign}₹${closest.pnl.toLocaleString("en-IN")}`;
            ctx.fillStyle = "#2563eb";
            ctx.fillRect(closest.x - 45, closest.y - 24, 90, 18);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 10px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(tipText, closest.x, closest.y - 15);
        }
    }
}

/* ==========================================================
   Trading Center Tabs & Component 10: Slicers Engine
   ========================================================= */
function initTradingCenterTabs() {
    const tabButtons = document.querySelectorAll(".center-tabs-nav .tab-btn");
    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            tabButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const targetTab = btn.dataset.tab;
            STATE.activeTab = targetTab;

            document.querySelectorAll(".trading-center-card .tab-pane").forEach((p) => p.classList.remove("active"));
            if (targetTab === "tabPositions") document.getElementById("panePositions")?.classList.add("active");
            if (targetTab === "tabTradeBook") document.getElementById("paneTradeBook")?.classList.add("active");
            if (targetTab === "tabOrderBook") document.getElementById("paneOrderBook")?.classList.add("active");
            if (targetTab === "tabActiveOrders") document.getElementById("paneActiveOrders")?.classList.add("active");
        });
    });
}

function initSlicers() {
    // Side filter buttons
    const sideButtons = document.querySelectorAll(".slicer-side-group .slicer-btn");
    sideButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            sideButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            STATE.filterSide = btn.dataset.side || "ALL";
            applyTradingCenterFilters();
        });
    });

    // Symbol dropdown slicer
    const slicerSymbol = document.getElementById("slicerSymbolSelect");
    if (slicerSymbol) {
        slicerSymbol.addEventListener("change", (e) => {
            STATE.filterSymbol = e.target.value;
            applyTradingCenterFilters();
        });
    }

    // Text search slicer
    const slicerSearch = document.getElementById("slicerSearchInput");
    if (slicerSearch) {
        slicerSearch.addEventListener("input", (e) => {
            STATE.filterSearch = e.target.value.trim().toUpperCase();
            applyTradingCenterFilters();
        });
    }
}

function applyTradingCenterFilters() {
    if (STATE.lastPortfolio) {
        renderOpenPositions(STATE.lastPortfolio.holdings || []);
    }
    renderTradeBook(STATE.allTrades);
}

/* ==========================================================
   Component 4: Open Positions Table Engine
   ========================================================== */
function renderOpenPositions(holdings) {
    const tbody = document.getElementById("positionsTbody");
    const countBadge = document.getElementById("lblOpenPositionsCount");
    if (!tbody) return;

    if (!holdings || holdings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No open intraday positions</td></tr>`;
        if (countBadge) countBadge.textContent = "0";
        return;
    }

    // Filter by slicers
    const filtered = holdings.filter((h) => {
        if (STATE.filterSymbol !== "ALL" && h.symbol !== STATE.filterSymbol) return false;
        if (STATE.filterSearch && !h.symbol.includes(STATE.filterSearch)) return false;
        return true;
    });

    if (countBadge) countBadge.textContent = filtered.length;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No positions match the active filter</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((h) => {
        const logoSvg = getCompanyLogoSvg(h.symbol, 18);
        const cur = getCurrencyPrefix(h.symbol);
        const pnlClass = h.unrealized_pnl >= 0 ? "text-buy" : "text-sell";
        const sign = h.unrealized_pnl >= 0 ? "+" : "";

        return `
            <tr>
                <td>
                    <div class="holding-symbol-cell">
                        <span class="holding-logo-icon">${logoSvg}</span>
                        <span class="font-bold font-mono">${h.symbol}</span>
                    </div>
                </td>
                <td><span class="badge badge-market-tag">MIS</span></td>
                <td><span class="font-mono font-bold text-buy">LONG</span></td>
                <td class="font-mono">${h.quantity.toLocaleString()}</td>
                <td class="font-mono">${cur}${h.average_buy_price.toFixed(2)}</td>
                <td class="font-mono font-bold">${cur}${h.market_value > 0 && h.quantity > 0 ? (h.market_value / h.quantity).toFixed(2) : '--'}</td>
                <td class="font-mono ${pnlClass} font-bold">${sign}${cur}${h.unrealized_pnl.toFixed(2)} (${sign}${h.unrealized_pnl_percent}%)</td>
                <td>
                    <button class="btn-square-off" onclick="squareOffPosition('${h.symbol}', ${h.quantity})">Square Off</button>
                </td>
            </tr>
        `;
    }).join("");
}

window.squareOffPosition = async function (symbol, qty) {
    if (!confirm(`Square off position: Sell ${qty} shares of ${symbol} at best market price?`)) return;

    try {
        const payload = {
            trader_id: STATE.traderId,
            symbol: symbol,
            side: "SELL",
            order_type: "MARKET",
            quantity: qty,
        };

        const res = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            showAlert(`Position squared off! ${qty} units of ${symbol} executed.`, "success");
            await refreshMarketAndBook();
            await refreshAccountData();
        } else {
            const err = await res.json();
            showAlert(err.detail || "Square off failed", "error");
        }
    } catch (e) {
        showAlert("Error executing square off", "error");
    }
};

/* ==========================================================
   Component 7: Trade Book Engine (With Brokerage)
   ========================================================== */
function renderTradeBook(trades) {
    const tbody = document.getElementById("tradeBookTbody");
    const countBadge = document.getElementById("lblTradeBookCount");
    if (!tbody) return;

    STATE.allTrades = trades || [];

    if (!trades || trades.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No executed trades today</td></tr>`;
        if (countBadge) countBadge.textContent = "0";
        return;
    }

    // Apply Component 10 Slicers
    const filtered = trades.filter((t) => {
        if (STATE.filterSymbol !== "ALL" && t.symbol && t.symbol !== STATE.filterSymbol) return false;
        if (STATE.filterSearch && t.trade_id && !t.trade_id.toUpperCase().includes(STATE.filterSearch)) return false;
        return true;
    });

    if (countBadge) countBadge.textContent = filtered.length;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No trades match the active filter</td></tr>`;
        return;
    }

    const cur = getCurrencyPrefix(STATE.symbol);
    const brokerage = 20.00; // Flat ₹20 discount brokerage

    tbody.innerHTML = filtered.map((t) => {
        const sym = t.symbol || STATE.symbol;
        const logoSvg = getCompanyLogoSvg(sym, 16);
        const timeStr = new Date((t.timestamp || Date.now() / 1000) * 1000).toLocaleTimeString();
        const side = t.side || "BUY";
        const sideClass = side === "BUY" ? "text-buy" : "text-sell";
        const grossVal = t.execution_price * t.quantity;
        const netVal = side === "BUY" ? grossVal + brokerage : grossVal - brokerage;

        return `
            <tr>
                <td class="font-mono text-muted">${t.trade_id.slice(-8)}</td>
                <td>
                    <div class="holding-symbol-cell">
                        <span class="holding-logo-icon" style="width:16px;height:16px;">${logoSvg}</span>
                        <span class="font-mono font-bold">${sym}</span>
                    </div>
                </td>
                <td class="font-mono font-bold ${sideClass}">${side}</td>
                <td class="font-mono font-bold">${cur}${t.execution_price.toFixed(2)}</td>
                <td class="font-mono">${t.quantity.toLocaleString()}</td>
                <td class="font-mono text-muted">₹${brokerage.toFixed(2)}</td>
                <td class="font-mono font-bold">${cur}${netVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td class="font-mono text-muted">${timeStr}</td>
            </tr>
        `;
    }).join("");
}

/* ==========================================================
   Component 8: Top Gainers / Losers Engine
   ========================================================== */
function initMovers() {
    renderMovers();
    const btnGainers = document.getElementById("btnMoversGainers");
    const btnLosers = document.getElementById("btnMoversLosers");

    if (btnGainers) {
        btnGainers.addEventListener("click", () => {
            btnGainers.classList.add("active");
            btnLosers?.classList.remove("active");
            STATE.moversMode = "GAINERS";
            renderMovers();
        });
    }

    if (btnLosers) {
        btnLosers.addEventListener("click", () => {
            btnLosers.classList.add("active");
            btnGainers?.classList.remove("active");
            STATE.moversMode = "LOSERS";
            renderMovers();
        });
    }
}

function renderMovers() {
    const container = document.getElementById("moversListContainer");
    if (!container) return;

    const symbols = Object.keys(COMPANY_INFO);
    let sorted = [...symbols].sort((a, b) => {
        const chgA = COMPANY_INFO[a].dayChangePct;
        const chgB = COMPANY_INFO[b].dayChangePct;
        return STATE.moversMode === "GAINERS" ? chgB - chgA : chgA - chgB;
    });

    const top4 = sorted.slice(0, 4);

    container.innerHTML = top4.map((sym, idx) => {
        const info = COMPANY_INFO[sym];
        const logoSvg = getCompanyLogoSvg(sym, 20);
        const isUp = info.dayChangePct >= 0;
        const chgClass = isUp ? "text-buy" : "text-sell";
        const sign = isUp ? "+" : "";
        const fillClass = isUp ? "bg-buy" : "bg-sell";
        const barPct = Math.min(100, Math.abs(info.dayChangePct) * 25);
        const cur = getCurrencyPrefix(sym);

        return `
            <div class="mover-row" onclick="switchActiveSymbol('${sym}')" title="Click to trade ${sym}">
                <div class="mover-left">
                    <span class="mover-rank">#${idx + 1}</span>
                    <div class="mover-logo">${logoSvg}</div>
                    <span class="mover-name">${sym}</span>
                </div>
                <div class="mover-right">
                    <span class="mover-px font-mono">${cur}${info.basePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    <div class="mover-bar-track">
                        <div class="mover-bar-fill ${fillClass}" style="width: ${barPct}%;"></div>
                    </div>
                    <span class="font-mono font-bold ${chgClass}" style="font-size: 11px; width: 48px; text-align: right;">${sign}${info.dayChangePct}%</span>
                </div>
            </div>
        `;
    }).join("");
}

/* ==========================================================
   Component 9: Sector Performance Heatmap Engine
   ========================================================== */
function initSectors() {
    const container = document.getElementById("sectorHeatmapContainer");
    if (!container) return;

    container.innerHTML = sectorData.map((sec) => {
        const isUp = sec.pct >= 0;
        const colClass = isUp ? "text-buy" : "text-sell";
        const fillClass = isUp ? "bg-buy" : "bg-sell";
        const sign = isUp ? "+" : "";

        return `
            <div class="sector-item">
                <div class="sector-top-row">
                    <span class="sector-name">${sec.name}</span>
                    <span class="sector-chg ${colClass}">${sign}${sec.pct.toFixed(2)}% <small style="opacity:0.7;">(${sec.tag})</small></span>
                </div>
                <div class="sector-track">
                    <div class="sector-fill ${fillClass}" style="width: ${sec.strength}%;"></div>
                </div>
            </div>
        `;
    }).join("");
}

/* ==========================================================
   Component 12: News & Market Catalysts Feed
   ========================================================== */
function initNewsFeed() {
    const container = document.getElementById("newsFeedContainer");
    if (!container) return;

    container.innerHTML = newsData.map((n) => {
        return `
            <div class="news-item">
                <div class="news-meta-row">
                    <span class="news-tag">${n.tag}</span>
                    <span class="news-sentiment-badge ${n.sentiment}">${n.sentiment.toUpperCase()}</span>
                </div>
                <div class="news-headline">${n.headline}</div>
                <div class="news-time">${n.time}</div>
            </div>
        `;
    }).join("");
}

/* ==========================================================
   Order Execution & Account Handlers
   ========================================================== */
function setOrderSide(side) {
    STATE.side = side;
    const btnSideBuy = document.getElementById("btnSideBuy");
    const btnSideSell = document.getElementById("btnSideSell");
    const btnSubmitOrder = document.getElementById("btnSubmitOrder");

    if (side === "BUY") {
        if (btnSideBuy) btnSideBuy.className = "side-btn active-buy";
        if (btnSideSell) btnSideSell.className = "side-btn";
        if (btnSubmitOrder) {
            btnSubmitOrder.className = "btn btn-buy btn-block";
            btnSubmitOrder.textContent = `PLACE ${STATE.orderType} BUY`;
        }
    } else {
        if (btnSideBuy) btnSideBuy.className = "side-btn";
        if (btnSideSell) btnSideSell.className = "side-btn active-sell";
        if (btnSubmitOrder) {
            btnSubmitOrder.className = "btn btn-sell btn-block";
            btnSubmitOrder.textContent = `PLACE ${STATE.orderType} SELL`;
        }
    }
}

function setOrderType(type) {
    STATE.orderType = type;
    const btnTypeLimit = document.getElementById("btnTypeLimit");
    const btnTypeMarket = document.getElementById("btnTypeMarket");
    const groupPrice = document.getElementById("groupPrice");
    const inputPrice = document.getElementById("inputPrice");
    const btnSubmitOrder = document.getElementById("btnSubmitOrder");

    if (type === "LIMIT") {
        if (btnTypeLimit) btnTypeLimit.classList.add("active");
        if (btnTypeMarket) btnTypeMarket.classList.remove("active");
        if (groupPrice) groupPrice.classList.remove("hidden");
        if (inputPrice) inputPrice.required = true;
    } else {
        if (btnTypeLimit) btnTypeLimit.classList.remove("active");
        if (btnTypeMarket) btnTypeMarket.classList.add("active");
        if (groupPrice) groupPrice.classList.add("hidden");
        if (inputPrice) inputPrice.required = false;
    }
    if (btnSubmitOrder) btnSubmitOrder.textContent = `PLACE ${STATE.orderType} ${STATE.side}`;
    updateOrderEstimate();
}

function updateOrderEstimate() {
    const inputQuantity = document.getElementById("inputQuantity");
    const inputPrice = document.getElementById("inputPrice");
    const estOrderTotal = document.getElementById("estOrderTotal");

    const cur = getCurrencyPrefix(STATE.symbol);
    const qty = parseFloat(inputQuantity?.value) || 0;
    const px = STATE.orderType === "LIMIT" ? (parseFloat(inputPrice?.value) || 0) : 0;

    if (estOrderTotal) {
        if (STATE.orderType === "LIMIT") {
            estOrderTotal.textContent = `${cur}${(qty * px).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            estOrderTotal.textContent = `Best Market Available`;
        }
    }
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    const inputQuantity = document.getElementById("inputQuantity");
    const inputPrice = document.getElementById("inputPrice");
    const perfOrdersCount = document.getElementById("perfOrdersCount");

    const qty = parseInt(inputQuantity?.value, 10);
    const px = STATE.orderType === "LIMIT" ? parseFloat(inputPrice?.value) : null;

    if (!qty || qty <= 0) {
        showAlert("Quantity must be a positive integer", "error");
        return;
    }
    if (STATE.orderType === "LIMIT" && (!px || px <= 0)) {
        showAlert("Price must be > 0 for Limit Orders", "error");
        return;
    }

    const payload = {
        trader_id: STATE.traderId,
        symbol: STATE.symbol,
        side: STATE.side,
        order_type: STATE.orderType,
        quantity: qty,
        price: px,
    };

    const t0 = performance.now();
    try {
        const res = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const latencyMs = performance.now() - t0;
        recordLatency(latencyMs);

        const data = await res.json();
        if (!res.ok) {
            showAlert(data.detail || "Order rejected by matching engine", "error");
            return;
        }

        setEngineOnline(true);
        STATE.ordersProcessed++;
        if (perfOrdersCount) perfOrdersCount.textContent = STATE.ordersProcessed.toLocaleString();

        const numTrades = data.trades ? data.trades.length : 0;
        if (numTrades > 0) {
            showAlert(`Order executed! ${numTrades} trade(s) filled instantly.`, "success");
        } else {
            showAlert(`Order resting in book [ID: ${data.order_id}]`, "success");
        }

        if (inputQuantity) inputQuantity.value = "";
        updateOrderEstimate();
    } catch (err) {
        setEngineOnline(false);
        showAlert(`Failed to connect to matching engine.`, "error");
        return;
    }

    await refreshMarketAndBook();
    await refreshAccountData();
}

function recordLatency(latencyMs) {
    const latUs = Math.round(latencyMs * 1000);
    STATE.apiLatencies.push(latUs);
    if (STATE.apiLatencies.length > 50) STATE.apiLatencies.shift();
    const avg = Math.round(STATE.apiLatencies.reduce((a, b) => a + b, 0) / STATE.apiLatencies.length);

    const perfAvgLatency = document.getElementById("perfAvgLatency");
    const perfThroughput = document.getElementById("perfThroughput");

    if (perfAvgLatency) perfAvgLatency.textContent = `${avg} μs`;

    const elapsedSec = (Date.now() - STATE.startTime) / 1000;
    if (elapsedSec > 0 && STATE.ordersProcessed > 0 && perfThroughput) {
        const tput = (STATE.ordersProcessed / elapsedSec).toFixed(1);
        perfThroughput.textContent = `${tput} ord/s`;
    }
}

function showAlert(msg, type) {
    const orderAlert = document.getElementById("orderAlert");
    if (!orderAlert) return;
    orderAlert.textContent = msg;
    orderAlert.className = `alert-box ${type}`;
    orderAlert.classList.remove("hidden");
    setTimeout(() => {
        orderAlert.classList.add("hidden");
    }, 4500);
}

// Data Polling Loop
function startPollingLoop() {
    setInterval(async () => {
        const ok = await checkEngineHealth();
        if (ok) {
            await refreshMarketAndBook();
            await refreshAccountData();
            ensureActiveCandleTime();
        }
    }, 1000);
}

async function refreshMarketAndBook() {
    const cur = getCurrencyPrefix(STATE.symbol);
    try {
        // 1. Market Summary
        const resMarket = await fetch(`${API_BASE}/market/${STATE.symbol}`);
        if (resMarket.ok) {
            const m = await resMarket.json();
            const ribbonLastPrice = document.getElementById("ribbonLastPrice");
            const ribbonBestBid = document.getElementById("ribbonBestBid");
            const ribbonBestAsk = document.getElementById("ribbonBestAsk");
            const ribbonSpread = document.getElementById("ribbonSpread");
            const ribbonVolume = document.getElementById("ribbonVolume");
            const ribbonTradesCount = document.getElementById("ribbonTradesCount");

            if (ribbonLastPrice) ribbonLastPrice.textContent = m.last_traded_price ? `${cur}${m.last_traded_price.toFixed(2)}` : "--";
            if (ribbonBestBid) ribbonBestBid.textContent = m.best_bid ? `${cur}${m.best_bid.toFixed(2)}` : "--";
            if (ribbonBestAsk) ribbonBestAsk.textContent = m.best_ask ? `${cur}${m.best_ask.toFixed(2)}` : "--";
            if (ribbonSpread) ribbonSpread.textContent = m.spread !== null ? `${cur}${m.spread.toFixed(2)}` : "--";
            if (ribbonVolume) ribbonVolume.textContent = m.total_traded_volume ? m.total_traded_volume.toLocaleString() : "0";
            if (ribbonTradesCount) ribbonTradesCount.textContent = m.total_trades_count ? m.total_trades_count.toLocaleString() : "0";
        }

        // 2. Order Book Depth
        const resOb = await fetch(`${API_BASE}/orderbook/${STATE.symbol}?depth=10`);
        if (resOb.ok) {
            const ob = await resOb.json();
            renderOrderBook(ob, cur);
        }

        // 3. Recent Trades
        const resTrades = await fetch(`${API_BASE}/trades?symbol=${STATE.symbol}&limit=25`);
        if (resTrades.ok) {
            const trades = await resTrades.json();
            renderTradeBook(trades);
            updateCandlestickWithTrades(trades);
        }
    } catch (e) {
        console.error("Error refreshing market data:", e);
    }
}

function renderOrderBook(ob, cur) {
    const obMidSpread = document.getElementById("obMidSpread");
    const obAsksList = document.getElementById("obAsksList");
    const obBidsList = document.getElementById("obBidsList");

    if (obMidSpread) obMidSpread.textContent = ob.spread !== null ? `${cur}${ob.spread.toFixed(2)}` : "EMPTY";

    let maxVol = 1;
    if (ob.bids) ob.bids.forEach((b) => { if (b.quantity > maxVol) maxVol = b.quantity; });
    if (ob.asks) ob.asks.forEach((a) => { if (a.quantity > maxVol) maxVol = a.quantity; });

    if (obAsksList) {
        if (!ob.asks || ob.asks.length === 0) {
            obAsksList.innerHTML = `<div class="empty-book">No active asks</div>`;
        } else {
            const asksReversed = [...ob.asks].reverse();
            obAsksList.innerHTML = asksReversed.map((a) => {
                const depthPct = Math.min(100, Math.round((a.quantity / maxVol) * 100));
                return `
                    <div class="book-row ask-row">
                        <div class="depth-bar depth-bar-ask" style="width: ${depthPct}%;"></div>
                        <span class="row-price font-bold">${cur}${a.price.toFixed(2)}</span>
                        <span class="row-qty font-mono">${a.quantity.toLocaleString()}</span>
                        <span class="row-count font-mono text-muted">${a.order_count}</span>
                    </div>
                `;
            }).join("");
        }
    }

    if (obBidsList) {
        if (!ob.bids || ob.bids.length === 0) {
            obBidsList.innerHTML = `<div class="empty-book">No active bids</div>`;
        } else {
            obBidsList.innerHTML = ob.bids.map((b) => {
                const depthPct = Math.min(100, Math.round((b.quantity / maxVol) * 100));
                return `
                    <div class="book-row bid-row">
                        <div class="depth-bar depth-bar-bid" style="width: ${depthPct}%;"></div>
                        <span class="row-price font-bold">${cur}${b.price.toFixed(2)}</span>
                        <span class="row-qty font-mono">${b.quantity.toLocaleString()}</span>
                        <span class="row-count font-mono text-muted">${b.order_count}</span>
                    </div>
                `;
            }).join("");
        }
    }
}

async function refreshAccountData() {
    if (!STATE.traderId) return;
    const cur = getCurrencyPrefix(STATE.symbol);

    try {
        const resPort = await fetch(`${API_BASE}/portfolio/${STATE.traderId}`);
        if (resPort.ok) {
            const p = await resPort.json();
            STATE.lastPortfolio = p;

            const accCashBalance = document.getElementById("accCashBalance");
            const accReservedCash = document.getElementById("accReservedCash");
            const accAvailableCash = document.getElementById("accAvailableCash");
            const accTotalPortfolio = document.getElementById("accTotalPortfolio");
            const lblAvailableCash = document.getElementById("lblAvailableCash");
            const lblAvailableShares = document.getElementById("lblAvailableShares");

            if (accCashBalance) accCashBalance.textContent = `₹${p.cash_balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
            if (accReservedCash) accReservedCash.textContent = `₹${p.reserved_cash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
            if (accAvailableCash) accAvailableCash.textContent = `₹${p.available_cash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
            if (accTotalPortfolio) accTotalPortfolio.textContent = `₹${p.total_portfolio_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
            if (lblAvailableCash) lblAvailableCash.textContent = `₹${p.available_cash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

            let curShares = 0;
            const curH = p.holdings ? p.holdings.find((h) => h.symbol === STATE.symbol) : null;
            if (curH) curShares = curH.available_quantity;
            if (lblAvailableShares) lblAvailableShares.textContent = curShares.toLocaleString();

            renderOpenPositions(p.holdings || []);
            updateRiskMeter(p);
            updateKpiCards(p, STATE.allTrades);
        }

        const resOrders = await fetch(`${API_BASE}/orders?trader_id=${STATE.traderId}`);
        if (resOrders.ok) {
            const orders = await resOrders.json();
            const active = orders.filter((o) => o.status === "PENDING" || o.status === "PARTIALLY_FILLED");
            renderActiveOrders(active, cur);
        }
    } catch (e) {
        console.error("Error refreshing account data:", e);
    }
}

function renderActiveOrders(orders, cur) {
    const lblActiveOrdersCount = document.getElementById("lblActiveOrdersCount");
    const activeOrdersTbody = document.getElementById("activeOrdersTbody");

    if (lblActiveOrdersCount) lblActiveOrdersCount.textContent = orders.length;
    if (!activeOrdersTbody) return;

    if (!orders || orders.length === 0) {
        activeOrdersTbody.innerHTML = `<tr><td colspan="6" class="empty-state">No resting orders for current trader</td></tr>`;
        return;
    }

    activeOrdersTbody.innerHTML = orders.map((o) => {
        const sideClass = o.side === "BUY" ? "text-buy" : "text-sell";
        return `
            <tr>
                <td class="font-mono text-muted">${o.order_id}</td>
                <td class="font-mono font-bold">${o.symbol}</td>
                <td class="font-mono font-bold ${sideClass}">${o.side}</td>
                <td class="font-mono">${cur}${o.price ? o.price.toFixed(2) : 'MKT'}</td>
                <td class="font-mono">${o.remaining_quantity}/${o.quantity}</td>
                <td>
                    <button class="btn btn-cancel" onclick="cancelOrder('${o.order_id}')">Cancel</button>
                </td>
            </tr>
        `;
    }).join("");
}

window.cancelOrder = async function (orderId) {
    if (!confirm(`Cancel order ${orderId}?`)) return;
    try {
        const res = await fetch(`${API_BASE}/orders/${orderId}`, { method: "DELETE" });
        if (res.ok) {
            showAlert(`Order ${orderId} cancelled`, "success");
            await refreshMarketAndBook();
            await refreshAccountData();
        } else {
            const err = await res.json();
            showAlert(err.detail || "Cancellation failed", "error");
        }
    } catch (e) {
        showAlert("Error cancelling order", "error");
    }
};

/* ==========================================================
   Account Management API Calls
   ========================================================== */
async function initializeDefaultAccounts() {
    try {
        const res = await fetch(`${API_BASE}/accounts`);
        if (!res.ok) return;
        const accounts = await res.json();
        if (!accounts || accounts.length === 0) {
            await createAccountAPI("TRADER_1", 100000.0);
            await createAccountAPI("TRADER_2", 100000.0);
        }
        await populateAccountDropdown();
    } catch (e) {
        console.error("Error initializing accounts:", e);
    }
}

async function createAccountAPI(accountId, initialCash) {
    return fetch(`${API_BASE}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, initial_cash: initialCash }),
    });
}

async function populateAccountDropdown() {
    const accountSelect = document.getElementById("accountSelect");
    if (!accountSelect) return;
    try {
        const res = await fetch(`${API_BASE}/accounts`);
        if (!res.ok) return;
        const accounts = await res.json();
        accountSelect.innerHTML = "";
        accounts.forEach((acc) => {
            const opt = document.createElement("option");
            opt.value = acc.account_id;
            opt.textContent = `${acc.account_id} (₹${acc.cash_balance.toLocaleString("en-IN")})`;
            if (acc.account_id === STATE.traderId) opt.selected = true;
            accountSelect.appendChild(opt);
        });
        if (accounts.length > 0 && !STATE.traderId) {
            STATE.traderId = accounts[0].account_id;
        }
    } catch (e) {
        console.error("Failed to populate accounts:", e);
    }
}

async function handleCreateAccount(e) {
    e.preventDefault();
    const accId = document.getElementById("inputNewAccountId")?.value.trim();
    const cash = parseFloat(document.getElementById("inputInitialCash")?.value) || 0;
    const modalAccount = document.getElementById("modalAccount");

    try {
        const res = await createAccountAPI(accId, cash);
        if (!res.ok) {
            const err = await res.json();
            alert(err.detail || "Failed to create account");
            return;
        }
        modalAccount?.classList.add("hidden");
        const newAccInput = document.getElementById("inputNewAccountId");
        if (newAccInput) newAccInput.value = "";
        STATE.traderId = accId;
        await populateAccountDropdown();
        await refreshAccountData();
    } catch (err) {
        alert("Error connecting to server");
    }
}

async function handleDeposit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("inputDepositAmount")?.value) || 0;
    const modalDeposit = document.getElementById("modalDeposit");
    try {
        const res = await fetch(`${API_BASE}/accounts/${STATE.traderId}/deposit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });
        if (res.ok) {
            modalDeposit?.classList.add("hidden");
            await populateAccountDropdown();
            await refreshAccountData();
        } else {
            const err = await res.json();
            alert(err.detail || "Deposit failed");
        }
    } catch (err) {
        alert("Error depositing funds");
    }
}

/* ==========================================================
   Component 6: Candlestick Chart Engine
   ========================================================== */
function updateCompanyLogosAndBranding() {
    const sym = STATE.symbol;
    const info = COMPANY_INFO[sym] || {
        name: sym,
        shortName: sym,
        exchange: "NSE / BSE",
    };

    const headerLogoEl = document.getElementById("headerSymbolLogo");
    if (headerLogoEl) headerLogoEl.innerHTML = getCompanyLogoSvg(sym, 24);

    const ribbonLogoEl = document.getElementById("ribbonLogoBadge");
    if (ribbonLogoEl) ribbonLogoEl.innerHTML = getCompanyLogoSvg(sym, 32);

    const ribCompNameEl = document.getElementById("ribbonCompanyName");
    if (ribCompNameEl) ribCompNameEl.textContent = info.name;

    const chartLogoEl = document.getElementById("chartCompanyLogo");
    if (chartLogoEl) chartLogoEl.innerHTML = getCompanyLogoSvg(sym, 38);

    const chartSymEl = document.getElementById("chartSymbolName");
    if (chartSymEl) chartSymEl.textContent = sym;

    const chartTitleEl = document.getElementById("chartCompanyTitle");
    if (chartTitleEl) chartTitleEl.textContent = info.name;

    const chartTagEl = document.getElementById("chartExchangeTag");
    if (chartTagEl) chartTagEl.textContent = info.exchange || "NSE / BSE";
}

function initCandlestickChart() {
    const canvas = document.getElementById("candlestickCanvas");
    const container = document.getElementById("chartCanvasContainer");
    if (!canvas || !container) return;

    container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        candlestickState.mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        const padLeft = 12;
        const padRight = 75;
        const plotW = rect.width - padLeft - padRight;
        const candles = candlestickState.candles;

        if (candles && candles.length > 0 && candlestickState.mousePos.x >= padLeft && candlestickState.mousePos.x <= padLeft + plotW) {
            const candleSlotW = plotW / candles.length;
            const idx = Math.max(0, Math.min(candles.length - 1, Math.floor((candlestickState.mousePos.x - padLeft) / candleSlotW)));
            candlestickState.hoveredCandle = candles[idx];
            updateOhlcDisplay(candles[idx]);
        }

        drawCandlestickChart();
    });

    container.addEventListener("mouseleave", () => {
        candlestickState.mousePos = null;
        candlestickState.hoveredCandle = null;
        const candles = candlestickState.candles;
        if (candles && candles.length > 0) {
            updateOhlcDisplay(candles[candles.length - 1]);
        }
        drawCandlestickChart();
    });

    const tfButtons = document.querySelectorAll(".timeframe-selector .tf-btn");
    tfButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            tfButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const tf = btn.dataset.tf || "5s";
            candlestickState.timeframe = tf;
            seedCandlestickHistory(STATE.symbol, tf);
        });
    });

    window.addEventListener("resize", drawCandlestickChart);
    seedCandlestickHistory(STATE.symbol, candlestickState.timeframe);
}

function seedCandlestickHistory(symbol, tf = "5s") {
    candlestickState.candles = [];
    const intervalMs = CANDLE_TIMEFRAMES[tf] || 5000;
    const info = COMPANY_INFO[symbol] || { basePrice: 500.0, tickSize: 0.5 };
    const base = info.basePrice;
    const tick = info.tickSize || 0.25;
    const numBars = 45;
    const now = Date.now();

    let curPrice = base;
    const tempCandles = [];

    for (let i = numBars; i >= 1; i--) {
        const time = Math.floor((now - i * intervalMs) / intervalMs) * intervalMs;
        const drift = (Math.random() - 0.49) * (base * 0.003);
        const open = Math.max(tick, Math.round(curPrice / tick) * tick);
        const close = Math.max(tick, Math.round((curPrice + drift) / tick) * tick);
        const highExtra = Math.round((Math.random() * base * 0.002) / tick) * tick;
        const lowExtra = Math.round((Math.random() * base * 0.002) / tick) * tick;
        const high = Math.max(open, close) + highExtra;
        const low = Math.max(tick, Math.min(open, close) - lowExtra);
        const volume = Math.floor(20 + Math.random() * 150);

        tempCandles.push({
            time,
            open,
            high: Math.max(high, open, close),
            low: Math.min(low, open, close),
            close,
            volume,
        });

        curPrice = close;
    }

    const curTime = Math.floor(now / intervalMs) * intervalMs;
    tempCandles.push({
        time: curTime,
        open: curPrice,
        high: curPrice,
        low: curPrice,
        close: curPrice,
        volume: 0,
    });

    candlestickState.candles = tempCandles;
    updateOhlcDisplay(candlestickState.candles[candlestickState.candles.length - 1]);
    drawCandlestickChart();
}

function updateCandlestickWithTrades(trades) {
    if (!trades || trades.length === 0) return;
    if (!candlestickState.candles || candlestickState.candles.length === 0) {
        seedCandlestickHistory(STATE.symbol, candlestickState.timeframe);
    }

    const intervalMs = CANDLE_TIMEFRAMES[candlestickState.timeframe] || 5000;
    let updated = false;

    trades.forEach((t) => {
        const tradePrice = t.execution_price;
        const tradeQty = t.quantity;
        const tradeTimeMs = (t.timestamp * 1000) || Date.now();
        const bucketTime = Math.floor(tradeTimeMs / intervalMs) * intervalMs;

        const lastCandle = candlestickState.candles[candlestickState.candles.length - 1];

        if (lastCandle && lastCandle.time === bucketTime) {
            lastCandle.high = Math.max(lastCandle.high, tradePrice);
            lastCandle.low = Math.min(lastCandle.low, tradePrice);
            lastCandle.close = tradePrice;
            lastCandle.volume += tradeQty;
            updated = true;
        } else if (!lastCandle || bucketTime > lastCandle.time) {
            candlestickState.candles.push({
                time: bucketTime,
                open: tradePrice,
                high: tradePrice,
                low: tradePrice,
                close: tradePrice,
                volume: tradeQty,
            });
            if (candlestickState.candles.length > 80) {
                candlestickState.candles.shift();
            }
            updated = true;
        }
    });

    if (updated) {
        const activeCandle = candlestickState.candles[candlestickState.candles.length - 1];
        if (!candlestickState.hoveredCandle) {
            updateOhlcDisplay(activeCandle);
        }
        drawCandlestickChart();
    }
}

function ensureActiveCandleTime() {
    if (!candlestickState.candles || candlestickState.candles.length === 0) return;
    const intervalMs = CANDLE_TIMEFRAMES[candlestickState.timeframe] || 5000;
    const now = Date.now();
    const curBucket = Math.floor(now / intervalMs) * intervalMs;
    const lastCandle = candlestickState.candles[candlestickState.candles.length - 1];

    if (lastCandle && curBucket > lastCandle.time) {
        candlestickState.candles.push({
            time: curBucket,
            open: lastCandle.close,
            high: lastCandle.close,
            low: lastCandle.close,
            close: lastCandle.close,
            volume: 0,
        });
        if (candlestickState.candles.length > 80) {
            candlestickState.candles.shift();
        }
        drawCandlestickChart();
    }
}

function updateOhlcDisplay(c) {
    if (!c) return;
    const cur = getCurrencyPrefix(STATE.symbol);
    const oEl = document.getElementById("chartValOpen");
    const hEl = document.getElementById("chartValHigh");
    const lEl = document.getElementById("chartValLow");
    const cEl = document.getElementById("chartValClose");
    const vEl = document.getElementById("chartValVol");
    const chgEl = document.getElementById("chartValChange");

    if (oEl) oEl.textContent = `${cur}${c.open.toFixed(2)}`;
    if (hEl) hEl.textContent = `${cur}${c.high.toFixed(2)}`;
    if (lEl) lEl.textContent = `${cur}${c.low.toFixed(2)}`;
    if (cEl) cEl.textContent = `${cur}${c.close.toFixed(2)}`;
    if (vEl) vEl.textContent = c.volume.toLocaleString();

    if (chgEl) {
        const diff = c.close - c.open;
        const pct = c.open > 0 ? (diff / c.open) * 100 : 0;
        const sign = diff >= 0 ? "+" : "";
        chgEl.textContent = `${sign}${pct.toFixed(2)}% (${sign}${cur}${diff.toFixed(2)})`;
        chgEl.className = diff >= 0 ? "chart-pct-badge text-buy" : "chart-pct-badge text-sell";
    }
}

function drawCandlestickChart() {
    const canvas = document.getElementById("candlestickCanvas");
    const container = document.getElementById("chartCanvasContainer");
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = "#080c16";
    ctx.fillRect(0, 0, W, H);

    const candles = candlestickState.candles;
    if (!candles || candles.length === 0) return;

    const padTop = 16;
    const padBottom = 26;
    const padLeft = 12;
    const padRight = 75;

    const plotW = Math.max(10, W - padLeft - padRight);
    const plotH = Math.max(10, H - padTop - padBottom);

    const priceH = plotH * 0.74;
    const volH = plotH * 0.22;
    const volTopY = padTop + priceH + (plotH * 0.04);

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 1;

    for (const c of candles) {
        if (c.low < minPrice) minPrice = c.low;
        if (c.high > maxPrice) maxPrice = c.high;
        if (c.volume > maxVol) maxVol = c.volume;
    }

    if (!isFinite(minPrice) || !isFinite(maxPrice) || minPrice === maxPrice) {
        minPrice = (minPrice === Infinity ? 100 : minPrice) * 0.98;
        maxPrice = (maxPrice === -Infinity ? 102 : maxPrice) * 1.02;
    }

    const priceRange = maxPrice - minPrice;
    minPrice -= priceRange * 0.06;
    maxPrice += priceRange * 0.06;

    const cur = getCurrencyPrefix(STATE.symbol);

    function yForPrice(p) {
        return padTop + priceH - ((p - minPrice) / (maxPrice - minPrice)) * priceH;
    }

    function yForVol(v) {
        return volTopY + volH - (v / maxVol) * volH;
    }

    // Grid lines & price labels
    const numPriceSteps = 5;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= numPriceSteps; i++) {
        const p = minPrice + (i / numPriceSteps) * (maxPrice - minPrice);
        const y = yForPrice(p);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padLeft, Math.round(y) + 0.5);
        ctx.lineTo(padLeft + plotW, Math.round(y) + 0.5);
        ctx.stroke();

        ctx.fillStyle = "rgba(154, 168, 199, 0.75)";
        ctx.fillText(`${cur}${p.toFixed(2)}`, padLeft + plotW + 8, y);
    }

    // Volume divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(padLeft, Math.round(volTopY) + 0.5);
    ctx.lineTo(padLeft + plotW, Math.round(volTopY) + 0.5);
    ctx.stroke();

    ctx.fillStyle = "rgba(154, 168, 199, 0.35)";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.fillText("VOL", padLeft + 4, volTopY + 10);

    // Time ticks
    const numTimeSteps = Math.min(6, Math.max(3, Math.floor(plotW / 95)));
    const stepIdx = Math.max(1, Math.floor(candles.length / numTimeSteps));

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(154, 168, 199, 0.6)";

    for (let i = 0; i < candles.length; i += stepIdx) {
        const c = candles[i];
        const x = padLeft + (i + 0.5) * (plotW / candles.length);
        const d = new Date(c.time);
        const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.beginPath();
        ctx.moveTo(Math.round(x) + 0.5, padTop);
        ctx.lineTo(Math.round(x) + 0.5, padTop + plotH);
        ctx.stroke();

        ctx.fillText(timeStr, x, padTop + plotH + 6);
    }

    // Volume bars
    const candleSlotW = plotW / candles.length;
    const barW = Math.max(2, candleSlotW * 0.72);

    candles.forEach((c, i) => {
        const isBull = c.close >= c.open;
        const x = padLeft + i * candleSlotW + (candleSlotW - barW) / 2;
        const y = yForVol(c.volume);
        const h = Math.max(1, volTopY + volH - y);

        ctx.fillStyle = isBull ? "rgba(0, 230, 118, 0.35)" : "rgba(255, 51, 102, 0.35)";
        ctx.fillRect(x, y, barW, h);
    });

    // Candlesticks
    candles.forEach((c, i) => {
        const isBull = c.close >= c.open;
        const color = isBull ? "#00e676" : "#ff3366";
        const xMid = padLeft + i * candleSlotW + candleSlotW / 2;
        const barX = padLeft + i * candleSlotW + (candleSlotW - barW) / 2;

        const yHigh = yForPrice(c.high);
        const yLow = yForPrice(c.low);
        const yOpen = yForPrice(c.open);
        const yClose = yForPrice(c.close);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(Math.round(xMid) + 0.5, Math.round(yHigh));
        ctx.lineTo(Math.round(xMid) + 0.5, Math.round(yLow));
        ctx.stroke();

        const bodyTop = Math.min(yOpen, yClose);
        const bodyH = Math.max(1.8, Math.abs(yClose - yOpen));

        ctx.fillStyle = color;
        ctx.fillRect(barX, bodyTop, barW, bodyH);
    });

    // Current price dashed line
    const latestCandle = candles[candles.length - 1];
    if (latestCandle) {
        const curY = yForPrice(latestCandle.close);
        const isBull = latestCandle.close >= latestCandle.open;
        const lineCol = isBull ? "#00e676" : "#ff3366";

        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = lineCol;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padLeft, Math.round(curY) + 0.5);
        ctx.lineTo(padLeft + plotW, Math.round(curY) + 0.5);
        ctx.stroke();
        ctx.restore();

        const badgeText = `${cur}${latestCandle.close.toFixed(2)}`;
        const badgeW = 68;
        const badgeH = 18;
        ctx.fillStyle = lineCol;
        ctx.fillRect(padLeft + plotW + 2, curY - badgeH / 2, badgeW, badgeH);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(badgeText, padLeft + plotW + 6, curY);
    }

    // Crosshair
    if (candlestickState.mousePos) {
        const { x: mouseX, y: mouseY } = candlestickState.mousePos;

        if (mouseX >= padLeft && mouseX <= padLeft + plotW && mouseY >= padTop && mouseY <= padTop + plotH) {
            const candleIdx = Math.max(0, Math.min(candles.length - 1, Math.floor((mouseX - padLeft) / candleSlotW)));
            const targetCandle = candles[candleIdx];
            const candleX = padLeft + candleIdx * candleSlotW + candleSlotW / 2;

            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(Math.round(candleX) + 0.5, padTop);
            ctx.lineTo(Math.round(candleX) + 0.5, padTop + plotH);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(padLeft, Math.round(mouseY) + 0.5);
            ctx.lineTo(padLeft + plotW, Math.round(mouseY) + 0.5);
            ctx.stroke();
            ctx.restore();

            if (mouseY <= padTop + priceH) {
                const hoverPrice = maxPrice - ((mouseY - padTop) / priceH) * (maxPrice - minPrice);
                const hoverText = `${cur}${hoverPrice.toFixed(2)}`;
                ctx.fillStyle = "#2563eb";
                ctx.fillRect(padLeft + plotW + 2, mouseY - 9, 68, 18);
                ctx.fillStyle = "#ffffff";
                ctx.font = "10px 'JetBrains Mono', monospace";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.fillText(hoverText, padLeft + plotW + 6, mouseY);
            }

            const hoverDate = new Date(targetCandle.time);
            const hoverTimeStr = `${String(hoverDate.getHours()).padStart(2, "0")}:${String(hoverDate.getMinutes()).padStart(2, "0")}:${String(hoverDate.getSeconds()).padStart(2, "0")}`;
            ctx.fillStyle = "#2563eb";
            ctx.fillRect(candleX - 32, padTop + plotH + 2, 64, 18);
            ctx.fillStyle = "#ffffff";
            ctx.font = "10px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(hoverTimeStr, candleX, padTop + plotH + 11);
        }
    }
}
