# 🏥 AI Drug–Drug Interaction Warning System

Hackathon-ready web app: enter a list of medicines and get **risk level** (Safe / Moderate / Dangerous), **medical warning**, and a **simple AI explanation**.

---

## 📂 Project Structure

```
AI-Drug/
├── frontend/           # React + Vite + Tailwind
│   ├── src/
│   │   ├── api.js           # API service (check, drugs list)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── components/
│   │       ├── DrugInput.jsx      # Multi-drug input + autocomplete
│   │       ├── RiskBadge.jsx
│   │       ├── WarningCard.jsx
│   │       ├── RiskMeter.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── Disclaimer.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── main.py         # FastAPI app, /check, /drugs, /health, /docs
│   └── requirements.txt
├── data/
│   └── drug_interactions.csv   # drug1, drug2, severity, description
└── README.md
```

---

## 🚀 Setup & Run (first try)

### 1. Backend

```bash
cd backend
python -m venv venv
# Activate: Windows PowerShell -> venv\Scripts\Activate.ps1  |  CMD -> venv\Scripts\activate.bat  |  Mac/Linux -> source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend: **http://localhost:8000**  
Swagger: **http://localhost:8000/docs**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**

### 3. Use the app

- Enter drugs (e.g. **Aspirin, Ibuprofen** or **Warfarin, Aspirin**).
- Click **Check Interaction**.
- See risk badge, risk meter, warning message, and simple explanation.

---

## 🧪 Sample Test Drugs (from CSV)

| Drug A   | Drug B     | Expected risk  |
|----------|------------|----------------|
| Aspirin  | Ibuprofen  | Dangerous      |
| Warfarin | Aspirin    | Dangerous      |
| Paracetamol | Ibuprofen | Moderate    |
| Metformin   | Alcohol   | Moderate    |
| Paracetamol | Ibuprofen | Moderate (safe combo in many cases) |

No interaction (Safe): e.g. **Amoxicillin, Paracetamol** (if not in CSV as pair).

---

## 🔧 API

- **POST /check**  
  Body: `{ "drugs": ["paracetamol", "ibuprofen"] }`  
  Response: `{ "risk", "message", "ai_explanation", "detected_drugs" (optional) }`

- **POST /check-from-image**  
  Body: `multipart/form-data` with `file` = image (pill bottle, prescription, label).  
  Uses **Gemini Vision** (free) to extract drug names, then runs interaction check. **Requires GEMINI_API_KEY.**

- **POST /chat** (Medical chatbot)  
  Body: `{ "message": "user question" }`  
  Response: `{ "reply": "AI response" }`  
  Uses Gemini with a safe medical prompt: simple language, no prescriptions, always recommends consulting a doctor for serious issues.

- **GET /drugs**
  Returns list of drug names for autocomplete.

- **GET /health**
  Health check and whether CSV is loaded.

---

## ⭐ AI: Gemini (free)

The app uses **Google Gemini** for patient-friendly explanations and image-based drug extraction (no OpenAI).

1. Get a **free** API key at [Google AI Studio](https://aistudio.google.com/apikey).
2. In your project root or `backend/`, create or edit `.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. Restart the backend. Image upload and AI explanations will use Gemini.

---

## 📌 Features Checklist

- [x] Multi-drug input
- [x] Check Interaction button
- [x] Backend POST /check
- [x] Risk badge (Safe / Moderate / Dangerous)
- [x] Warning message card
- [x] Medical disclaimer footer
- [x] Autocomplete drug search
- [x] Loading spinner
- [x] Risk meter / progress bar
- [x] AI-style explanation (Gemini, free)
- [x] Empty state & error handling
- [x] Swagger docs at /docs
- [x] Gradient header, glass-style cards, responsive UI
- [x] **Medical chatbot** (floating widget, POST /chat, Gemini, safe prompts)

---

## 💬 Medical Chatbot (floating widget)

- Click the **chat icon** (bottom-right) to open the medical assistant.
- Same **GEMINI_API_KEY** in `.env`; uses **gemini-2.5-flash** for fast, free responses.
- **Example test questions:**  
  - “Can I take paracetamol with ibuprofen?”  
  - “What does drug interaction mean?”  
  - “Is it safe to drink alcohol with metformin?”  
- Bot stays in medicine/drug-safety domain and always recommends consulting a doctor when needed.

---

## 📌 Optional Improvements

- **Larger dataset**: Replace `data/drug_interactions.csv` with a Kaggle drug-interaction CSV (same columns: drug1, drug2, severity, description).
- **Gemini**: Add a branch in `get_ai_explanation()` to call Google Gemini if `GEMINI_API_KEY` is set.
- **History**: Store last N checks in localStorage and show “Recent checks” for the demo.
- **Print / share**: Add “Print report” or “Copy result” for judges.

You’re ready to demo. Good luck at the hackathon.
