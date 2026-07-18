import fs from "node:fs";

const files = {
  lesson2: fs.readFileSync("static/lesson-2.js", "utf8"),
  lesson3: fs.readFileSync("static/lesson-3.js", "utf8"),
  lesson3Html: fs.readFileSync("pages/book1/lesson-3.html", "utf8"),
  lesson4: fs.readFileSync("static/lesson-4.js", "utf8"),
  lesson4Html: fs.readFileSync("pages/book1/lesson-4.html", "utf8")
};
const errors = [];

if (!files.lesson2.includes('answer: "he, she or it sails"')) errors.push("Lesson 2 nāvigat answer is missing.");
if (!files.lesson2.includes("lessonAudio.playSequence(verbs.amo.audio, 120)")) errors.push("Lesson 2 sequential amō audio is missing.");
for (const id of ["futureBuilderMeaning","imperfectBuilderMeaning"]) {
  if (!files.lesson3Html.includes(`id="${id}"`)) errors.push(`Lesson 3 HTML is missing ${id}.`);
}
if (!files.lesson3.includes('document.getElementById(`${kind}BuilderMeaning`)')) errors.push("Lesson 3 visible builder meaning is not updated.");
if (!files.lesson4Html.includes('id="principalParts"')) errors.push("Lesson 4 principal-parts component is missing.");
if (!files.lesson4.includes("LatinLessonCommon.createScreenController")) errors.push("Lesson 4 does not use the shared screen controller.");
if (!files.lesson4.includes("audio.playSequence(parts.map")) errors.push("Lesson 4 principal-parts audio sequence is missing.");

if (errors.length) {
  console.error("Lesson regression checks failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Lesson regression checks passed.");
