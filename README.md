# 📋 DemoQA Test Automation Project

> End-to-end test automation for the [DemoQA](https://demoqa.com) site  
> Author: **Maksym** [`extrah8`](https://github.com/extrah8)

---

## 🧪 Overview

This project covers end-to-end UI and API testing for DemoQA using WebdriverIO, TypeScript, Chai, and Allure reporting.  
It demonstrates advanced interaction with forms, widgets, alerts, frames, drag & drop areas, modal dialogs, and includes visual and video validation.

---

## 🗂 Project Structure

```
├── test/
│   ├── specs/
│   │   └── desktop/         # UI tests grouped by domain
│   │       ├── alerts.frame.windows.spec.ts
│   │       ├── elements.spec.ts
│   │       ├── forms.spec.ts
│   │       ├── interactions.spec.ts
│   │       └── widgets.spec.ts
│   ├── api/                 # API test specs
│   └── pageobjects/         # Page Object Models
│       ├── alerts.frame.windows.page.ts
│       ├── elements.page.ts
│       ├── forms.page.ts
│       ├── home.page.ts
│       ├── interactions.page.ts
│       └── widgets.page.ts
├── utils/                   # Test data generators and helpers
├── fixtures/                # Upload/download assets
├── wdio.conf.*.ts           # WDIO configurations (UI/API/chromium/headless etc.)
├── allure-results/          # Allure JSON output
├── allure-report/           # Allure HTML report output
├── video/                   # Recorded test videos
└── junit-report/            # XML report output (for CI)
```

---

## ⚙️ Installation

```bash
npm install
```

---

## ▶️ Running Tests

### UI Tests (Chromium)

Run all UI tests:
```bash
npm run test:chromium
```

Run specific test groups:
```bash
npm run test:elements
npm run test:forms
npm run test:widgets
npm run test:alerts
npm run test:interactions
```

Run in Chromium Headless:
```bash
npm run test:chromium:headless
```

Run in Firefox:
```bash
npm run test:firefox
```

### API Tests

```bash
npm run test:api
```

---

## 🧾 Allure Reporting

Generate HTML report:
```bash
npm run allure:generate
```

Open the report in browser:
```bash
npm run allure:open
```

Clean Allure + video + XML reports:
```bash
npm run clean:all
```

---

## ✅ Features Covered

### 🔹 UI Testing

- **Elements**: Checkboxes, text boxes, radio buttons, file upload/download, web tables.
- **Forms**: Randomized form filling, validation, modal verification.
- **Alerts, Frames & Windows**: JavaScript alerts, browser windows/tabs, nested frames, modals.
- **Widgets**: Auto-complete, sliders, progress bars, tooltips.
- **Interactions**: Draggable, droppable, selectable, sortable, resizable (with constraints and free).

### 🔹 API Testing

- Create new user
- Generate auth token
- Add book to user collection
- Validate and remove added book
- Cleanup created user

---

## 🎥 Video Recording

Tests automatically record `.mp4` files into `/video` directory.  
Useful for debugging flaky tests or UI issues.

---

## 📣 Author

Built and maintained by **Maksym**  
GitHub: [`extrah8`](https://github.com/extrah8)

---

## 📌 Notes

- WDIO framework is fully typed with TypeScript.
- Allure and JUnit reports allow integration with CI/CD pipelines.
- Utility functions provide reusable data generation and formatting tools.