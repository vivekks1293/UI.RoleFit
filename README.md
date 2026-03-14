# RoleFit

AI-powered resume tailoring — matches your resume to any job description.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Install & Run

```bash
npm install
npm start
```

Then open [http://localhost:4200](http://localhost:4200) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `dist/rolefit/`.

---

## Project Structure

```
src/app/
├── app.component.ts          # Root shell
├── app.config.ts             # Application config (providers)
├── app.routes.ts             # Route definitions
│
├── core/
│   ├── services/
│   │   ├── resume-session.service.ts   # Signal-based session store
│   │   └── resume-parser.service.ts    # API call to backend parser
│   └── guards/
│       └── auth.guard.ts               # Auth guard (placeholder)
│
├── layout/
│   └── main-layout/
│       ├── main-layout.component.*     # Shell: header + sidebar + outlet
│       └── header/
│           └── header.component.*      # Sticky top nav
│
└── pages/
    ├── home/
    │   └── home.component.*            # Landing page with Start CTA
    └── upload-resume/
        └── upload-resume.component.*   # Drag-and-drop file upload
```

## Pipeline Pages (Planned)

| Route            | Page              | Status      |
|------------------|-------------------|-------------|
| `/`              | Home              | ✅ Done     |
| `/upload-resume` | Upload Resume     | ✅ Done     |
| `/validate`      | Validate Resume   | 🔜 Next     |
| `/jobs`          | Add Job Descriptions | 🔜 Planned |
| `/results`       | Download Results  | 🔜 Planned |

## Tech Stack

- **Angular 18** — standalone components, signals, `@if` control flow
- **CSS custom properties** — design token system in `styles.css`
- **Syne + DM Sans** — Google Fonts
- **No UI library** — fully custom components

## Backend

The Python backend (FastAPI) is a separate project. The Angular app proxies API calls to `/api/*`. To connect during development, configure `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false
  }
}
```

Then serve with: `ng serve --proxy-config proxy.conf.json`
