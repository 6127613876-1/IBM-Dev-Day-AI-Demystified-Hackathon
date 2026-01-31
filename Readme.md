# 🚨 Incident Autopilot AI

> **Enterprise Autonomous SOC & IT Governance Platform**
> Powered by **IBM watsonx Orchestrate**

Incident Autopilot AI is a **full-stack, agentic AI system** that transforms raw system alerts into **governed, auditable, enterprise actions**. Instead of just analyzing incidents, it **detects, reasons, acts, and validates compliance** — all in seconds.

---

## 🌟 Key Features

* 🤖 **Multi-Agent Architecture** — Detection, Reasoning, Action, and Governance agents working as a coordinated AI team
* 🧠 **Agentic AI Orchestration** — Built using IBM watsonx Orchestrate for enterprise-grade workflow control
* 🗂 **Audit-Ready Automation** — Every action is logged with timestamps and system identifiers
* 🎟 **Enterprise Integrations** — Simulated ITSM ticketing, on-call notifications, and compliance checks
* 🖥 **Live Dashboard** — React-based UI to observe the full lifecycle of every incident
* 📜 **Incident History** — Persistent audit trail stored in SQLite

---

## 🏗 Architecture

```
Browser (React Dashboard)
        ↓ REST API
FastAPI Orchestration Layer
        ↓ Agent Pipeline
[ Detection → Reasoning → Action → Governance ]
        ↓
Audit Database (SQLite)
```

---


## ⚡ Quick Start

### 1️⃣ Clone Repository

```bash
git clone https://github.com/6127613876-1/IBM-Dev-Day-AI-Demystified-Hackathon.git
cd IBM-Dev-Day-AI-Demystified-Hackathon
```

---

### 2️⃣ Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

### 3️⃣ Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🧪 Demo Test Input

Paste this into the dashboard:

```
ALERT: Production payment API returning 502 errors.
Database latency exceeded 6000ms starting at 14:12 UTC.
Multiple failed transactions detected across EU and US regions.
```

---

## 🔄 Agent Workflow

| Agent                | Role                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| **Detection Agent**  | Converts raw alerts into structured incident data (severity, system, escalation) |
| **Reasoning Agent**  | Performs root-cause analysis and business impact assessment                      |
| **Action Agent**     | Creates tickets, sends notifications, and generates audit logs                   |
| **Governance Agent** | Validates compliance, enforces policies, and approves automation                 |

---

## 🛡 Governance & Compliance

* Human-in-the-loop control supported
* Full audit timeline with timestamps
* No sensitive data exposure
* SOC2 / ISO 27001 aligned logging model

---

## 🏆 Hackathon Alignment

This project demonstrates:

* **Agentic AI Design**
* **Enterprise Automation**
* **Trust & Governance by Design**
* **IBM watsonx Orchestrate Integration**

---

## 🚀 Future Enhancements

* 🔗 Connect to real ITSM systems (ServiceNow / Jira)
* ☁ Deploy to IBM Cloud / Kubernetes
* 🔐 Role-based access control (RBAC)
* 📊 Business KPI dashboards (MTTR, revenue saved, SLA compliance)

---

## 📜 License

This project is provided for **hackathon and educational purposes only**. IBM, watsonx, and related marks are trademarks of International Business Machines Corporation.

---

## 🙌 Credits

Built by **[Your Name / Team Name]** for the **IBM watsonx Hackathon**.

> *“Turning AI into a trusted digital operations team.”*
