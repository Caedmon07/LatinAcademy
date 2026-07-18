import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules"].includes(entry.name)) return [];
      return walk(fullPath);
    }
    return [fullPath];
  });
}

function isLocalReference(value) {
  return value &&
    !value.startsWith("#") &&
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    !value.startsWith("mailto:") &&
    !value.startsWith("tel:") &&
    !value.startsWith("data:") &&
    !value.startsWith("javascript:");
}

function stripQueryAndAnchor(value) {
  return value.split("#")[0].split("?")[0];
}

const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const cssFiles = files.filter((file) => file.endsWith(".css"));

for (const file of htmlFiles) {
  const text = fs.readFileSync(file, "utf8");
  const referencePattern = /\b(?:src|href)=["']([^"']+)["']/g;

  for (const match of text.matchAll(referencePattern)) {
    const reference = match[1];
    if (!isLocalReference(reference)) continue;

    const cleanReference = stripQueryAndAnchor(reference);
    if (!cleanReference) continue;

    const target = path.resolve(path.dirname(file), cleanReference);
    if (!fs.existsSync(target)) {
      errors.push(
        `${path.relative(root, file)} references missing file: ${reference}`
      );
    }
  }
}

for (const file of cssFiles) {
  const text = fs.readFileSync(file, "utf8");
  const urlPattern = /url\((?:["']?)([^"')]+)(?:["']?)\)/g;

  for (const match of text.matchAll(urlPattern)) {
    const reference = match[1].trim();
    if (!isLocalReference(reference)) continue;

    const target = path.resolve(
      path.dirname(file),
      stripQueryAndAnchor(reference)
    );

    if (!fs.existsSync(target)) {
      errors.push(
        `${path.relative(root, file)} references missing asset: ${reference}`
      );
    }
  }
}

const requiredFiles = [
  "index.html",
  "pages/introduction.html",
  "pages/foundations.html",
  "pages/profiles.html",
  "static/profiles.js",
  "static/app.js",
  "static/introduction.js",
  "static/foundations.js",
  "content/foundations/course-flow.json",
  "pages/book1/chapter1.html",
  "pages/book1/lesson-1.html",
  "pages/book1/lesson-2.html",
  "pages/book1/lesson-3.html",
  "static/book1.css",
  "static/book1-chapter.js",
  "static/lesson-engine.js",
  "static/lesson-2.js",
  "static/lesson-3.js",
  "static/runtime.js",
  "content/book1/course.json",
  "content/book1/chapter-01.json",
  "content/book1/lesson-01.json",
  "content/book1/lesson-02.json",
  "content/book1/lesson-03.json"
];

for (const required of requiredFiles) {
  if (!fs.existsSync(path.join(root, required))) {
    errors.push(`Required file is missing: ${required}`);
  }
}

if (errors.length > 0) {
  console.error("Site validation failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Site validation passed: ${htmlFiles.length} HTML files and ${cssFiles.length} CSS files checked.`
);
