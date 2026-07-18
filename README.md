# Latin Academy v0.9

Latin Academy is a static family-learning website for introductory Latin. It
currently provides a complete Foundations course with separate learner
profiles, progress tracking, interactive pronunciation practice and an
educational Roman Empire map.

## Current features

- Responsive homepage and ordered lesson journey
- Separate browser-based learner profiles
- Individual XP, streaks, lesson progress, scores and achievements
- Introduction lesson covering why Latin matters
- Pronunciation lesson covering vowels, diphthongs, consonants and stress
- Thirty-seven local synthetic pronunciation clips
- Interactive SVG map of the Roman Empire around AD 117
- Reading practice and a nine-question Foundations quiz
- Local progress storage using `localStorage`
- Structured Markdown and JSON lesson content
- Automated JavaScript and local-asset validation

## Foundations course

The current course contains two core lessons:

1. **Welcome to Latin**
2. **Pronunciation Foundations**

A pronunciation score of at least 7 out of 9 completes Foundations.

## Repository structure

```text
LatinAcademy/
├── .github/workflows/validate.yml
├── assets/
│   ├── audio/latin/
│   └── source-images/
├── content/
│   ├── foundations/
│   └── profiles/
├── pages/
│   ├── introduction.html
│   ├── foundations.html
│   └── profiles.html
├── scripts/
│   └── validate-site.mjs
├── static/
│   ├── app.js
│   ├── foundations.css
│   ├── foundations.js
│   ├── introduction.css
│   ├── introduction.js
│   ├── profiles.css
│   ├── profiles-page.js
│   ├── profiles.js
│   └── styles.css
├── .gitignore
├── CONTRIBUTING.md
├── index.html
├── package.json
└── README.md
```

## Run locally

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Validate the repository

Node.js 22 or later is recommended.

```bash
npm test
```

Validation checks:

- JavaScript syntax
- required site files
- local HTML links and asset references
- CSS asset references

The same checks run automatically through GitHub Actions on pushes to `main`
and on pull requests.

## Learner data

Profiles and progress are stored in browser `localStorage`. They are separate
for each learner on the same browser and device, but are not currently
synchronised or backed up. Clearing browser site data removes them.

## Audio

Audio under `assets/audio/latin/` was generated with a synthetic Latin voice.
It is suitable as a technical learning prototype, but should be reviewed
against the Classical Latin pronunciation model selected for the final course.

## Content and copyright

The photographed textbook pages are retained as private source material.
Learner-facing explanations and activities should remain original summaries,
adaptations or properly licensed content.

## Next milestone

The next milestone is the Book I lesson-content architecture:

- reusable lesson renderer
- structured lesson schema
- Book I course manifest
- vocabulary and exercise data
- first Book I lesson
