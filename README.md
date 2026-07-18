# Latin Academy v1.0.4

Latin Academy is a static family-learning website for introductory Latin.
Version 1.0 adds the first Book I chapter experience and the first reusable,
interactive lesson.

## Current courses

### Foundations

1. Welcome to Latin
2. Pronunciation Foundations

### Latin Book I

#### Chapter 1 — Verbs

1. **What is a Verb?** — available now
2. The First Conjugation — planned
3. Future and Imperfect — planned
4. Principal Parts — planned
5. Perfect Tense — planned
6. Vocabulary Workshop — planned
7. Aeneas and the Origins of Rome — planned
8. Chapter Review — planned

Book I unlocks when the active learner completes Foundations.

## Version 1.0 additions

- Book I, Chapter 1 introduction screen
- Chapter objectives and lesson path
- First data-driven interactive lesson
- Action-word and sentence identification activities
- Person and number explanations
- Interactive stem-and-ending verb builder
- Complete present-tense paradigm of `amō`
- Six local audio clips for the conjugated forms
- Five-question completion quiz
- 25 XP lesson reward
- **First Steps into Latin** achievement
- Per-learner Book I progress and score tracking
- Book I status on the homepage and learner dashboard
- Structured Book I course, chapter and lesson JSON

## Repository structure

```text
LatinAcademy/
├── .github/workflows/validate.yml
├── assets/
│   ├── audio/latin/
│   │   └── book1/
│   └── source-images/
├── content/
│   ├── book1/
│   │   ├── course.json
│   │   ├── chapter-01.json
│   │   └── lesson-01.json
│   ├── foundations/
│   └── profiles/
├── pages/
│   ├── book1/
│   │   ├── chapter1.html
│   │   └── lesson-1.html
│   ├── foundations.html
│   ├── introduction.html
│   └── profiles.html
├── scripts/
│   └── validate-site.mjs
├── static/
│   ├── app.js
│   ├── book1.css
│   ├── book1-chapter.js
│   ├── lesson-engine.js
│   ├── profiles.js
│   └── ...
├── index.html
├── package.json
└── README.md
```

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Validate

Node.js 22 or later is recommended.

```bash
npm test
```

The checks validate JavaScript syntax, required files, local links and local
asset references. GitHub Actions runs the same checks on pushes and pull
requests.

## Learner data

Profiles and course progress are stored in browser `localStorage`. Book I data
is added to existing profiles automatically without removing Foundations
progress.

## Content and copyright

The new learner-facing lesson is an original digital treatment of the grammar
topics in Book I, Chapter 1. Textbook photographs are not included in the
distributable Book I lesson package.


## v1.0.1 progress hotfix

Some profiles created in earlier builds could contain an inconsistent state:
Pronunciation Foundations was complete, but the Introduction prerequisite was
still marked incomplete. This caused the pronunciation gate and Book I lock to
disagree with the visible completion card.

The hotfix now:

- reconciles completion from quiz score, completion flag or 100% progress;
- automatically marks the Introduction complete when pronunciation is complete;
- unlocks Book I consistently across the homepage, chapter and lesson pages;
- forces profile normalisation using data version 3;
- adds a manual **Repair progress** button to the learner profiles page.


## v1.0.2 state synchronisation hotfix

- Added automatic same-learner progress recovery across duplicate legacy records.
- Re-imports legacy Foundations quiz state into the active profile.
- Reconciles Introduction, Pronunciation and Book I unlock state centrally.
- Added cache-busting query strings to all local CSS and JavaScript references.
- Added a direct **Continue to Book I** action on the Foundations completion card.
- Updated the manual repair action to use the central recovery routine.


## v1.0.3 local server fix

Latin Academy must be opened through a local web server rather than directly
from `file:///.../index.html`.

Browsers do not provide reliable shared `localStorage` between separate local
HTML files. When opened with `file://`, the homepage, Introduction,
Pronunciation and Book I can each see different learner data. This caused the
progress display, prerequisite gates and Book I unlock state to disagree.

### Windows

Double-click:

```text
Start Latin Academy.bat
```

The browser will open:

```text
http://localhost:8000
```

### PowerShell

```powershell
.\Start Latin Academy.ps1
```

### macOS or Linux

```bash
./start-latin-academy.sh
```

A warning is now displayed whenever the site is opened using `file://`.


## v1.0.4 Windows launcher fix

The previous Windows launcher depended on the Python launcher (`py.exe`). On
some systems, `py.exe` can remain installed while pointing to a Python version
that has been removed. This produces an error such as:

```text
Unable to create process using ... Python311\python.exe
```

The default Windows launcher now uses a built-in PowerShell HTTP server and
does not require Python, Node.js or any additional installation.

### Start on Windows

Double-click:

```text
Start Latin Academy.bat
```

Keep the command window open while using the site. The browser opens at:

```text
http://localhost:8000
```

The Python `serve.py` script remains available as an optional alternative.
