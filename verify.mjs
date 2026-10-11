globalThis.window = {};
await import("./course-data.js");

const course = globalThis.window.COURSE_DATA;
const errors = [];

if (!course || !Array.isArray(course.days)) errors.push("Course data is missing days.");
if (course.days.length !== 7) errors.push(`Expected 7 days, found ${course.days.length}.`);

const lessons = course.days.flatMap((day) => day.lessons);
const lessonIds = lessons.map((lesson) => lesson.id);
if (lessons.length !== 21) errors.push(`Expected 21 lessons, found ${lessons.length}.`);
if (new Set(lessonIds).size !== lessonIds.length) errors.push("Lesson IDs are not unique.");

for (const day of course.days) {
  if (!day.title || !day.summary || !day.objectives?.length) errors.push(`Day ${day.id} is incomplete.`);
  if (!Array.isArray(day.quiz) || day.quiz.length < 4) errors.push(`Day ${day.id} needs at least four quiz questions.`);
  for (const lesson of day.lessons) {
    if (!lesson.sections?.length || !lesson.outcomes?.length) errors.push(`${lesson.id} is missing lesson content.`);
    for (const reference of lesson.references || []) {
      if (!/^https:\/\//.test(reference.url)) errors.push(`${lesson.id} has a non-HTTPS external reference.`);
    }
  }
  day.quiz.forEach((question, index) => validateQuestion(question, `day ${day.id}, question ${index + 1}`));
}

if (!Array.isArray(course.finalQuiz) || course.finalQuiz.length < 15) errors.push("Final quiz needs at least 15 questions.");
course.finalQuiz.forEach((question, index) => validateQuestion(question, `final question ${index + 1}`));

function validateQuestion(question, label) {
  if (!question.q || !question.explanation) errors.push(`${label} is missing text or explanation.`);
  if (!Array.isArray(question.options) || question.options.length < 2) errors.push(`${label} has too few options.`);
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length) {
    errors.push(`${label} has an invalid answer index.`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const dailyQuestions = course.days.reduce((sum, day) => sum + day.quiz.length, 0);
console.log(`Verified ${course.days.length} days, ${lessons.length} lessons, ${dailyQuestions} daily questions, and ${course.finalQuiz.length} final questions.`);
