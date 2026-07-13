# Latin Academy v0.8

This version contains:

- Responsive homepage
- Foundations lesson page
- Original introduction to Latin
- Stylised Roman Empire map activity
- Interactive vowel and diphthong cards
- Embedded synthetic Latin pronunciation clips
- Stress guidance
- Five-question quiz
- Browser-based progress and collectible storage
- Private source-page image archive
- Initial structured lesson metadata

## Repository structure

```text
LatinAcademy/
├── index.html
├── pages/
│   └── foundations.html
├── static/
│   ├── app.js
│   ├── foundations.js
│   ├── foundations.css
│   └── styles.css
├── content/
│   └── foundations/
│       └── lesson-01.json
└── assets/
    └── source-images/
```

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## GitHub placement

Copy the contents of this folder into the root of the `LatinAcademy` repository.
Do not place the entire `LatinAcademy-v0.2` wrapper folder inside the repository.

## Content note

The photographed textbook pages are retained for private family reference.
The learner-facing text and interactions are original summaries and adaptations.


## Audio

Audio clips are stored in:

```text
assets/audio/latin/
```

They were generated with the local eSpeak Latin voice and are intended as a
technical prototype. Before treating them as authoritative teaching material,
they should be reviewed against the Classical Latin pronunciation model chosen
for the course. The website uses ordinary HTML audio playback and requires no
cloud service.

## v0.4 additions

- Hard `c` and `g`
- Consonantal `v` as English `w`
- Tapped or trilled `r`
- Notes on `s`, `gn`, and word-final `m`
- Double-consonant practice
- Four listen-and-repeat reading sentences
- Nine-question pronunciation quiz
- Sixteen additional local MP3 clips


## v0.5 map refinement

- Replaced the stylised placeholder with an inline interactive SVG
- Added more recognisable Mediterranean, European, North African and Near Eastern geography
- Added ten selectable regions and four selectable cities
- Added keyboard access, reset and label controls
- Retained the photographed source map for private reference

The SVG is an original simplified educational reconstruction for c. AD 117,
not a survey-grade province-boundary dataset.


## v0.6 introduction lesson

- Added a complete standalone Introduction lesson in HTML
- Added a structured Markdown source file
- Covered what Latin is, why it matters, Latin's influence on English and the Romance languages
- Added a timeline, root-word examples, language-family comparison, specialist vocabulary and collectible expression
- Linked the homepage to the Introduction lesson
- Linked the Introduction lesson to Pronunciation Foundations


## v0.6.1 hotfix

- Corrected a JavaScript syntax error introduced during the SVG map merge
- Restored all audio controls
- Restored interactive map selection, reset and label controls
- Restored dynamically generated vowel and diphthong content
- Added safer optional-element handling and loading fallbacks
- Verified that all referenced MP3 files are present


## v0.7 learner profiles

- Added multiple learner profiles stored locally in the browser
- Added a profile selection and management page
- Added separate XP, streaks, lesson progress, quiz scores, collectibles and achievements
- Added profile-aware homepage statistics
- Added profile-aware Introduction and Pronunciation lesson state
- Added legacy-state migration into the first profile
- Added achievement rules for lesson completion, quiz performance and collectibles

### Data storage

Profiles currently use browser `localStorage`. They are separate on the same
browser and device, but they are not yet synchronised between devices or backed
up to a server. Clearing browser site data will remove them.


## v0.8 lesson flow

- State-aware homepage CTA and course journey
- Ordered Introduction to Pronunciation progression
- Pronunciation prerequisite gate
- Breadcrumbs and save-and-return-home controls
- Course completion card and results route
- Intelligent Continue Learning behaviour
