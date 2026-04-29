# Thai Text Summarization — Backend

Thai Lizard backend — REST API for Thai text summarization.  
Built as part of CP465 Text Mining (2/2568).

---

## Tech Stack

| Category | Library |
|----------|---------|
| Framework | NestJS + TypeScript |
| HTTP Client | Axios + HttpService |
| PDF Parsing | pdf-parse |
| Web Scraping | Cheerio |
| Containerization | Docker |

---

## Project Structure

```plaintext
src/
└── summerize/
    ├── dto/
    │   └── summarize.dto.ts      # Request validation (text / url / pdf)
    ├── summarize.controller.ts   # Route handlers
    ├── summarize.interface.ts    # Interfaces
    ├── summarize.module.ts       # NestJS module
    └── summarize.service.ts      # Core business logic
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm
- Docker (optional)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/thai-text-summarization-backend.git
cd thai-text-summarization-backend
npm install
```

### Run Development Server

```bash
npm run start:dev
```

API will be available at `http://localhost:5000`

### Run with Docker

```bash
docker build -t thai-lizard-backend .
docker run -p 5000:5000 thai-lizard-backend
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/summarize/text` | Summarize from plain text |
| POST | `/summarize/url` | Summarize from URL |
| POST | `/summarize/pdf` | Summarize from PDF file |
| POST | `/summarize/evaluate` | Summarize + BERTScore (text) |
| POST | `/summarize/evaluate-url` | Summarize + BERTScore (URL) |
| POST | `/summarize/evaluate-pdf` | Summarize + BERTScore (PDF) |

### Request Body (text / url)

```json
{
  "text": "ข้อความที่ต้องการสรุป",
  "mode": "short",
  "reference": "optional reference text for BERTScore"
}
```

### Available Modes

| Mode | Description |
|------|-------------|
| `teaser` | Short teaser / headline |
| `short` | Brief summary (≤3 lines) |
| `normal` | Standard summary (≤8 lines) |

### Response

```json
{
  "summary": "ข้อความที่สรุปแล้ว",
  "original_text": "ข้อความต้นฉบับ",
  "frontend_metric": {
    "score": 85
  }
}
```

---

## Configuration

This service connects to a Python model server running at:
http://host.docker.internal:8000/summarize

Adjust the URL in `summarize.service.ts` if running outside Docker.

---

## Team

| Name | Student ID |
|------|-----------|
| Rujapa Monkhontirapat | 65102010201 |
| Siri Meesuk | 65102010202 |
| Thatchaya Siriwaseree | 65102010417 |

---

## Related Repository

- https://github.com/rujapathz/thai-text-summarization-frontend Add frontend repo link here
- https://github.com/SiriMeesuk19796/thai-text-summarization-model Add Model repo link here
