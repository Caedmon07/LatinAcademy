# Latin Academy v0.5

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
