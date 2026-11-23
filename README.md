# ChronosMatch: Zero-Copy High-Frequency Trading Engine

An educational, high-performance simulated electronic exchange and order-matching platform developed in Python. Designed for microsecond-level order execution, strict price-time priority matching, double-entry portfolio accounting, live terminal dashboard visualization, and empirical performance benchmarking.

> **Disclaimer**: This is a simulated/educational trading platform designed for academic and internship review. It does not connect to real financial exchanges and does not handle real currency or securities.

---

## ⚡ Performance Highlights (Empirical Benchmarks)

Tested on 100,000 orders sequentially on a single thread using `time.perf_counter_ns()`:

| Metric | Baseline Engine | Zero-Copy Optimized | Improvement |
| :--- | :--- | :--- | :--- |
| **Throughput (100k Orders)** | 7,326.2 ord/sec | **18,086.3 ord/sec** | **2.47x speedup** |
| **Average Latency** | 92.27 µs | **33.69 µs** | **63.5% latency reduction** |
| **P50 Median Latency** | 24.30 µs | **13.50 µs** | 44.4% faster |
| **P99 Tail Latency** | 497.30 µs | **91.50 µs** | **81.6% tail latency reduction** |
| **Match Parity** | 88,250 trades | 88,250 trades | **100% deterministic parity** |

---

## 🏛️ Architecture Overview

```
chronosmatch/
│
├── backend/
│   ├── app/
│   │   ├── api/v1/         # FastAPI REST Endpoints (/orders, /orderbook, /trades, etc.)
│   │   ├── core/           # Configuration, Logging, and App Settings
│   │   ├── models/         # Domain Models (Order, Trade, Account, Holding, Transaction)
│   │   ├── schemas/        # Pydantic Schemas for Strict Input/Output Validation
│   │   ├── services/       # TradingService, AccountService, and Portfolio Settlement
│   │   ├── matching/       # Price-Time Priority MatchingEngine & Zero-Copy Optimized Engine
│   │   ├── database/       # SQLAlchemy 2.0 ORM & SQLite Persistence Repository
│   │   └── static/         # Interactive Real-Time Web Dashboard (HTML5/CSS3/Vanilla JS)
│   │
│   ├── tests/              # Automated Test Suite (81 pytest tests, 100% passing)
│   ├── benchmarks/         # Performance Benchmarking Suite (1k, 10k, 100k orders)
│   ├── requirements.txt    # Minimal dependencies (FastAPI, Uvicorn, SQLAlchemy, Pydantic)
│   └── main.py             # Server Application Entrypoint
│
├── docs/                   # Internship & Academic Documentation
│   ├── architecture.md     # Component Architecture & Low-Latency Design
│   ├── api_documentation.md# REST API Endpoints & Payloads
│   ├── database_schema.md  # Entity Relationship & SQLite Table Specs
│   ├── performance_report.md # Real Empirical Benchmark Results
│   ├── project_report.md   # Comprehensive Final Project Report
│   ├── presentation_slides.md # Slide Deck Content for Final Review
│   └── demonstration_guide.md # Step-by-Step Internship Demo Walkthrough
│
├── README.md
└── .gitignore
```

---

## 🚀 Quickstart

### 1. Requirements
- Python 3.11+ (Python 3.14+ verified)
- Git

### 2. Install Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

### 3. Run Automated Tests (81 Tests)
```powershell
cd backend
python -m pytest tests/ -v
```

### 4. Run Performance Benchmarks (1k, 10k, 100k Orders)
```powershell
cd backend
python benchmarks/run_benchmarks.py
```

### 5. Launch the Server & Open Dashboard
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- **Interactive Trading Terminal**: [http://127.0.0.1:8000/dashboard](http://127.0.0.1:8000/dashboard) (or [http://127.0.0.1:8000/](http://127.0.0.1:8000/))
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 🎯 16-Phase Implementation Status
- [x] **Phase 1: Project Setup & Environment Verification**
- [x] **Phase 2: Core Order Model & Strict Validation**
- [x] **Phase 3: High-Performance In-Memory Order Book**
- [x] **Phase 4: Price-Time Priority Matching Engine**
- [x] **Phase 5: Trade Execution & Partial Fill Handling**
- [x] **Phase 6: Order Cancellation & State Synchronization**
- [x] **Phase 7: Simulated Account & Portfolio Management**
- [x] **Phase 8: Asynchronous Database Persistence (SQLAlchemy & SQLite)**
- [x] **Phase 9: FastAPI REST Endpoints & Validation Error Handling**
- [x] **Phase 10: Real-Time Trading & Engine Dashboard**
- [x] **Phase 11: Comprehensive Test Suite (81 Tests Passing)**
- [x] **Phase 12: Performance Benchmarking (1k, 10k, 100k Orders)**
- [x] **Phase 13: Zero-Copy Optimization & Memory Profiling**
- [x] **Phase 14: Integration & Edge-Case Verification**
- [x] **Phase 15: Documentation, Reports & Presentation Slides**
- [x] **Phase 16: Final Internship Demonstration Walkthrough**

---

## 📚 Complete Project Documentation
- [Architecture & Design Decisions](docs/architecture.md)
- [REST API Reference](docs/api_documentation.md)
- [Database Schema & ERD](docs/database_schema.md)
- [Performance & Benchmark Report](docs/performance_report.md)
- [Internship Final Project Report](docs/project_report.md)
- [Presentation Slide Deck Content](docs/presentation_slides.md)
- [Step-by-Step Demonstration Guide](docs/demonstration_guide.md)
