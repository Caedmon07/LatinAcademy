# Contributing to Latin Academy

## Local setup

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Before committing

Run:

```bash
npm test
```

This checks JavaScript syntax, required files and local asset references.

## Branches and commits

Use a short branch name such as:

```text
feature/book1-lesson-engine
fix/profile-progress
chore/repository-stabilisation
```

Prefer focused commits using conventional prefixes:

```text
feat:
fix:
docs:
test:
chore:
refactor:
```

## Content rules

Learner-facing content should be original, paraphrased or properly licensed.
Photographed textbook pages are private source material and should not be
published as public lesson content.
