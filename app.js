(function () {
  "use strict";

  const course = window.COURSE_DATA;
  const mitCourse = window.MIT_LECTURE_DATA;
  const STORAGE_KEY = "packet-proof-course-v1";
  const view = document.querySelector("#course-view");
  const breadcrumb = document.querySelector("#breadcrumb");
  const dayNavigation = document.querySelector("#day-navigation");
  const sidebar = document.querySelector("#sidebar");
  const menuScrim = document.querySelector("#menu-scrim");
  const glossaryDialog = document.querySelector("#glossary-dialog");
  const glossarySearch = document.querySelector("#glossary-search");

  const defaultState = {
    completedLessons: [],
    completedMitSegments: [],
    quizScores: {},
    finalScore: null,
    lastLesson: null
  };

  let state = loadState();

  function loadState() {
    try {
      return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch (_error) {
      return { ...defaultState };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateProgressUI();
  }

  function allLessons() {
    return course.days.flatMap((day) => day.lessons.map((lesson) => ({ ...lesson, day })));
  }

  function lessonById(id) {
    return allLessons().find((lesson) => lesson.id === id);
  }

  function dayProgress(day) {
    const completed = day.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
    return { completed, total: day.lessons.length, percentage: Math.round((completed / day.lessons.length) * 100) };
  }

  function totalProgress() {
    const totalLessons = allLessons().length;
    const completed = state.completedLessons.length;
    const mitSegments = mitCourse.days.flatMap((day) => day.segments);
    const mitSegmentIds = mitCourse.days.flatMap((day) => day.segments.map((segment) => segmentId(segment, day.day)));
    const completedMit = state.completedMitSegments.filter((id) => mitSegmentIds.includes(id)).length;
    const dailyQuizzesPassed = course.days.filter((day) => (state.quizScores[day.id] || 0) >= course.meta.passScore).length;
    const finalPassed = (state.finalScore || 0) >= course.meta.passScore ? 1 : 0;
    const possible = totalLessons + mitSegments.length + course.days.length + 1;
    return Math.round(((completed + completedMit + dailyQuizzesPassed + finalPassed) / possible) * 100);
  }

  function segmentId(segment, dayId) {
    return `mit-${dayId}-${segment.at}`;
  }

  function formatTimestamp(seconds) {
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function mitProgress(day) {
    const completed = day.segments.filter((segment) => state.completedMitSegments.includes(segmentId(segment, day.day))).length;
    return { completed, total: day.segments.length };
  }

  function updateProgressUI() {
    const progress = totalProgress();
    document.querySelector("#sidebar-progress-label").textContent = `${progress}%`;
    document.querySelector("#sidebar-progress-bar").style.width = `${progress}%`;
    buildNavigation();
  }

  function buildNavigation() {
    dayNavigation.innerHTML = course.days
      .map((day) => {
        const progress = dayProgress(day);
        const complete = progress.completed === progress.total && (state.quizScores[day.id] || 0) >= course.meta.passScore;
        return `<a class="nav-item" data-route="day-${day.id}" href="#/day/${day.id}">
          <span class="nav-index">${String(day.id).padStart(2, "0")}</span>
          <span><strong>${day.shortTitle}</strong><small>${progress.completed}/${progress.total} lessons</small></span>
          <i class="nav-state ${complete ? "complete" : ""}" aria-label="${complete ? "Complete" : "In progress"}"></i>
        </a>`;
      })
      .join("");
  }

  function setBreadcrumb(text) {
    breadcrumb.textContent = `COURSE / ${text.toUpperCase()}`;
  }

  function markActive(routeKey) {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.route === routeKey);
    });
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    menuScrim.hidden = true;
  }

  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    closeMenu();

    if (!parts.length || parts[0] === "home") {
      renderHome();
    } else if (parts[0] === "day" && parts[1]) {
      renderDay(Number(parts[1]));
    } else if (parts[0] === "lesson" && parts[1]) {
      renderLesson(parts[1]);
    } else if (parts[0] === "quiz" && parts[1]) {
      renderQuiz(Number(parts[1]));
    } else if (parts[0] === "mit" && parts[1] === "day" && parts[2]) {
      renderMitDay(Number(parts[2]));
    } else if (parts[0] === "mit") {
      renderMitStudio();
    } else if (parts[0] === "final") {
      renderFinal();
    } else if (parts[0] === "resources") {
      renderResources();
    } else {
      renderNotFound();
    }

    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
  }

  function renderHome() {
    setBreadcrumb("Command desk");
    markActive("home");
    const next = getNextLesson();
    const completedCount = state.completedLessons.length;
    const quizCount = course.days.filter((day) => state.quizScores[day.id] !== undefined).length;

    view.innerHTML = `
      <section class="hero">
        <span class="eyebrow">7-day intensive / version ${course.meta.version}</span>
        <h1>Learn to reason about security—not just run tools.</h1>
        <p class="lede">A structured field course for software engineers who need the foundations of application security, defense, ethical testing, incident response and security consulting.</p>
        <div class="hero-actions">
          <a class="button primary" href="${next ? `#/lesson/${next.id}` : "#/final"}">${completedCount ? "Continue course" : "Begin day one"} <span aria-hidden="true">→</span></a>
          <a class="button" href="#/mit">Open MIT lecture studio</a>
        </div>
        <div class="notice"><strong>REALITY CHECK</strong><p>${course.meta.disclaimer}</p></div>
        <div class="stat-grid" aria-label="Course statistics">
          <div class="stat"><strong>7</strong><span>intensive days</span></div>
          <div class="stat"><strong>${allLessons().length}</strong><span>guided lessons</span></div>
          <div class="stat"><strong>${course.days.reduce((sum, day) => sum + day.quiz.length, 0) + course.finalQuiz.length}</strong><span>quiz questions</span></div>
          <div class="stat"><strong>${course.meta.estimatedHours}h</strong><span>estimated work</span></div>
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <h2>Your seven-day operating plan</h2>
          <p>Complete the lessons in order, perform the labs, then score at least ${course.meta.passScore}% on each daily quiz.</p>
        </div>
        <div class="day-grid">
          ${course.days.map(renderDayCard).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <h2>Evidence before confidence</h2>
          <p>Your goal is a small portfolio of defensible artifacts, not a new title after seven days.</p>
        </div>
        <div class="resource-grid">
          <article class="resource-card"><span class="eyebrow">BUILD</span><h3>Daily field artifacts</h3><p>Risk statement, threat model, request trace, authorization test, cloud review, detection hypothesis, assessment finding and incident timeline.</p></article>
          <article class="resource-card"><span class="eyebrow">PROVE</span><h3>Integrated capstone</h3><p>Secure a small SaaS architecture and package the work as if you were presenting it to a product team and an executive buyer.</p></article>
          <article class="resource-card"><span class="eyebrow">STATUS</span><h3>${completedCount}/${allLessons().length} lessons complete</h3><p>You have attempted ${quizCount}/${course.days.length} daily quizzes. Course progress includes lessons, daily quizzes and the final assessment.</p></article>
          <article class="resource-card"><span class="eyebrow">ACADEMIC TRACK</span><h3>MIT OpenCourseWare lecture studio</h3><p>Seven guided lectures provide 35 timestamped chapter stops, original teaching notes, worked examples and active-recall exercises.</p><a href="#/mit">Enter the lecture studio →</a></article>
        </div>
      </section>`;
  }

  function renderDayCard(day) {
    const progress = dayProgress(day);
    const quizScore = state.quizScores[day.id];
    const complete = progress.completed === progress.total && (quizScore || 0) >= course.meta.passScore;
    return `<a class="day-card" data-day="${day.id}" href="#/day/${day.id}">
      <div class="card-top"><span class="day-label">DAY ${String(day.id).padStart(2, "0")}</span><span class="duration">${day.duration}</span></div>
      <div><h3>${day.title}</h3><p>${day.summary}</p></div>
      <div class="card-bottom">
        <div class="mini-progress" aria-label="${progress.completed} of ${progress.total} lessons complete">${day.lessons.map((lesson) => `<i class="${state.completedLessons.includes(lesson.id) ? "done" : ""}"></i>`).join("")}</div>
        <span class="status-pill ${complete ? "complete" : ""}">${complete ? "complete" : `${progress.percentage}%`}</span>
      </div>
    </a>`;
  }

  function renderDay(dayId) {
    const day = course.days.find((item) => item.id === dayId);
    if (!day) return renderNotFound();
    const progress = dayProgress(day);
    const quizScore = state.quizScores[day.id];
    setBreadcrumb(`Day ${day.id} / ${day.shortTitle}`);
    markActive(`day-${day.id}`);

    view.innerHTML = `
      <section class="day-hero">
        <div>
          <span class="eyebrow">DAY ${String(day.id).padStart(2, "0")} / ${day.duration}</span>
          <h1>${day.title}</h1>
          <p class="lede">${day.summary}</p>
          <div class="hero-actions">
            <a class="button primary" href="#/lesson/${day.lessons[0].id}">${progress.completed ? "Review first lesson" : "Start this day"} <span aria-hidden="true">→</span></a>
            <a class="button" href="#/quiz/${day.id}">Take day quiz</a>
          </div>
        </div>
        <aside class="briefing-card">
          <span class="eyebrow">MISSION OBJECTIVES</span>
          <h3>By end of day, you can:</h3>
          <ul>${day.objectives.map((objective) => `<li>${objective}</li>`).join("")}</ul>
        </aside>
      </section>

      <section class="section">
        ${renderMitDayCallout(day.id)}
      </section>

      <section class="section">
        <div class="section-heading"><h2>Lessons and field work</h2><p>${progress.completed} of ${progress.total} complete</p></div>
        <div class="lesson-list">
          ${day.lessons.map((lesson, index) => renderLessonRow(lesson, day, index)).join("")}
        </div>
        <div class="quiz-callout">
          <div><span class="eyebrow">KNOWLEDGE GATE</span><h3>Day ${day.id} field quiz</h3><p>${quizScore !== undefined ? `Best score: ${quizScore}%. ` : ""}Score ${course.meta.passScore}% or better. Every answer includes a teaching explanation.</p></div>
          <a class="button ${quizScore >= course.meta.passScore ? "primary" : "coral"}" href="#/quiz/${day.id}">${quizScore !== undefined ? "Retake quiz" : "Take quiz"}</a>
        </div>
      </section>`;
  }

  function renderMitDayCallout(dayId) {
    const lectureDay = mitCourse.days.find((item) => item.day === dayId);
    const progress = mitProgress(lectureDay);
    return `<article class="mit-callout">
      <div>
        <span class="eyebrow">MIT OCW GUIDED LECTURE</span>
        <h2>${lectureDay.lecture}</h2>
        <p>${lectureDay.goal}</p>
        <div class="lecture-meta"><span>${progress.completed}/${progress.total} chapter stops complete</span><span>Worked examples included</span></div>
      </div>
      <a class="button coral" href="#/mit/day/${dayId}">${progress.completed ? "Continue lecture" : "Start guided lecture"} →</a>
    </article>`;
  }

  function renderMitStudio() {
    setBreadcrumb("MIT lecture studio");
    markActive("mit");
    const total = mitCourse.days.reduce((sum, day) => sum + day.segments.length, 0);
    const completed = state.completedMitSegments.length;
    view.innerHTML = `
      <section class="hero mit-hero">
        <span class="eyebrow">OFFICIAL MIT OCW / ACTIVE LEARNING PATH</span>
        <h1>Watch less passively. Learn by stopping and doing.</h1>
        <p class="lede">Seven carefully chosen lectures from MIT 6.858, reorganized into a one-week sequence for a frontend engineer. Every timestamp pairs the lecture with an original explanation, worked example and exercise.</p>
        <div class="hero-actions"><a class="button primary" href="#/mit/day/${mitCourse.days.find((day) => mitProgress(day).completed < day.segments.length)?.day || 1}">${completed ? "Continue studio" : "Begin day one"} →</a><a class="button" href="https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/" target="_blank" rel="noreferrer">Open MIT course ↗</a></div>
        <div class="notice"><strong>TIMESTAMP NOTE</strong><p>${mitCourse.meta.note}</p></div>
        <div class="stat-grid"><div class="stat"><strong>7</strong><span>guided lectures</span></div><div class="stat"><strong>${total}</strong><span>chapter stops</span></div><div class="stat"><strong>${completed}</strong><span>completed stops</span></div><div class="stat"><strong>${mitCourse.meta.estimatedHours}h</strong><span>watch + practice</span></div></div>
      </section>
      <section class="section">
        <div class="section-heading"><h2>The one-week lecture path</h2><p>Budget roughly 90–110 minutes per day. Use the chapter links; pause after each one and complete the task before revealing the model answer.</p></div>
        <div class="lecture-grid">${mitCourse.days.map(renderMitLectureCard).join("")}</div>
      </section>
      <section class="section study-method">
        <div class="section-heading"><h2>The learning loop</h2><p>Retrieval and application turn lecture content into usable engineering judgment.</p></div>
        <div class="concept-grid"><article class="concept-card"><strong>1. Watch</strong><p>Open the exact chapter and take only three notes: claim, mechanism and limitation.</p></article><article class="concept-card"><strong>2. Work</strong><p>Close the video and complete the prompt using a system you know.</p></article><article class="concept-card"><strong>3. Verify</strong><p>Reveal the model answer, correct your reasoning and save the day's deliverable.</p></article></div>
      </section>`;
  }

  function renderMitLectureCard(day) {
    const progress = mitProgress(day);
    return `<a class="lecture-card" href="#/mit/day/${day.day}">
      <div class="card-top"><span class="day-label">DAY ${String(day.day).padStart(2, "0")}</span><span class="duration">${progress.completed}/${progress.total} stops</span></div>
      <div><h3>${day.lecture}</h3><p>${day.goal}</p></div>
      <div class="card-bottom"><span class="status-pill ${progress.completed === progress.total ? "complete" : ""}">${progress.completed === progress.total ? "complete" : "open studio"}</span><span aria-hidden="true">→</span></div>
    </a>`;
  }

  function renderMitDay(dayId) {
    const day = mitCourse.days.find((item) => item.day === dayId);
    if (!day) return renderNotFound();
    const progress = mitProgress(day);
    setBreadcrumb(`MIT studio / Day ${day.day}`);
    markActive("mit");
    view.innerHTML = `
      <section class="lecture-header">
        <div><span class="eyebrow">DAY ${String(day.day).padStart(2, "0")} / MIT 6.858</span><h1>${day.lecture}</h1><p class="lede">${day.goal}</p><div class="lecture-meta"><span>${day.instructor}</span><span>${progress.completed}/${progress.total} chapter stops</span></div><div class="hero-actions"><a class="button primary" href="https://www.youtube.com/watch?v=${day.youtubeId}" target="_blank" rel="noreferrer">Open full lecture ↗</a><a class="button" href="${day.ocwUrl}" target="_blank" rel="noreferrer">MIT page + transcript ↗</a></div></div>
        <aside class="briefing-card"><span class="eyebrow">TODAY'S ARTIFACT</span><h3>Build evidence of learning</h3><p>${day.deliverable}</p><p class="small-note">Recommended: watch each linked section, complete the task without notes, then compare your answer.</p></aside>
      </section>
      <section class="section">
        <div class="section-heading"><h2>Timestamped learning path</h2><p>Links open the official video at the selected topic. Jump points are approximate; use the topic title to orient if playback shifts slightly.</p></div>
        <div class="chapter-list">${day.segments.map((segment, index) => renderMitSegment(day, segment, index)).join("")}</div>
        <div class="lesson-actions"><a class="button" href="${day.day > 1 ? `#/mit/day/${day.day - 1}` : "#/mit"}">← ${day.day > 1 ? "Previous lecture" : "Lecture studio"}</a><a class="button primary" href="${day.day < 7 ? `#/mit/day/${day.day + 1}` : "#/final"}">${day.day < 7 ? "Next lecture" : "Final assessment"} →</a></div>
      </section>`;

    document.querySelectorAll(".segment-toggle").forEach((button) => button.addEventListener("click", toggleMitSegment));
  }

  function renderMitSegment(day, segment, index) {
    const id = segmentId(segment, day.day);
    const complete = state.completedMitSegments.includes(id);
    return `<article class="chapter-card ${complete ? "complete" : ""}" id="${id}">
      <div class="chapter-rail"><span>${String(index + 1).padStart(2, "0")}</span><i></i></div>
      <div class="chapter-content">
        <div class="chapter-heading"><div><a class="timestamp" href="https://www.youtube.com/watch?v=${day.youtubeId}&t=${segment.at}s" target="_blank" rel="noreferrer">▶ ${formatTimestamp(segment.at)} · watch from here</a><h2>${segment.title}</h2></div><button class="segment-toggle ${complete ? "complete" : ""}" data-segment-id="${id}">${complete ? "✓ Complete" : "Mark complete"}</button></div>
        <div class="teaching-block"><span class="box-label">TEACHING NOTE</span><p>${segment.teach}</p></div>
        <div class="worked-example"><span class="box-label">WORKED EXAMPLE</span><p>${segment.example}</p></div>
        <div class="practice-prompt"><span class="box-label">YOUR TURN</span><p>${segment.task}</p><details><summary>Reveal a model answer</summary><p>${segment.solution}</p></details></div>
      </div>
    </article>`;
  }

  function toggleMitSegment(event) {
    const id = event.currentTarget.dataset.segmentId;
    if (state.completedMitSegments.includes(id)) {
      state.completedMitSegments = state.completedMitSegments.filter((segment) => segment !== id);
    } else {
      state.completedMitSegments.push(id);
    }
    saveState();
    const dayId = Number(id.split("-")[1]);
    renderMitDay(dayId);
  }

  function renderLessonRow(lesson, day, index) {
    const complete = state.completedLessons.includes(lesson.id);
    return `<a class="lesson-row ${complete ? "complete" : ""}" href="#/lesson/${lesson.id}">
      <span class="lesson-number">${complete ? "✓" : `${day.id}.${index + 1}`}</span>
      <span><h3>${lesson.title}</h3><p>${lesson.summary}</p></span>
      <span class="lesson-time">${lesson.duration} →</span>
    </a>`;
  }

  function renderLesson(id) {
    const lesson = lessonById(id);
    if (!lesson) return renderNotFound();
    state.lastLesson = id;
    saveState();
    setBreadcrumb(`Day ${lesson.day.id} / ${lesson.title}`);
    markActive(`day-${lesson.day.id}`);
    const isComplete = state.completedLessons.includes(id);
    const siblings = lesson.day.lessons;
    const index = siblings.findIndex((item) => item.id === id);
    const previous = index > 0 ? siblings[index - 1] : null;
    const next = index < siblings.length - 1 ? siblings[index + 1] : null;

    view.innerHTML = `
      <div class="lesson-shell">
        <article class="lesson-article">
          <header class="lesson-header">
            <span class="eyebrow">DAY ${String(lesson.day.id).padStart(2, "0")} / LESSON ${index + 1}</span>
            <h1>${lesson.title}</h1>
            <p class="lede">${lesson.summary}</p>
            <div class="lesson-meta"><span class="tag">${lesson.duration}</span>${lesson.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          </header>
          <section class="lesson-section" id="outcomes">
            <h2>Learning outcomes</h2>
            <ul class="objective-list">${lesson.outcomes.map((outcome) => `<li>${outcome}</li>`).join("")}</ul>
          </section>
          ${lesson.sections.map((section, sectionIndex) => `<section class="lesson-section" id="section-${sectionIndex + 1}"><h2>${section.title}</h2>${section.html}</section>`).join("")}
          <section class="lesson-section" id="sources">
            <h2>Study sources</h2>
            <ul class="resource-list">${lesson.references.map((reference) => `<li><a href="${reference.url}" target="_blank" rel="noreferrer">${reference.label} ↗</a></li>`).join("")}</ul>
          </section>
          <div class="lesson-actions">
            ${previous ? `<a class="button" href="#/lesson/${previous.id}">← Previous lesson</a>` : `<a class="button" href="#/day/${lesson.day.id}">← Day overview</a>`}
            ${next ? `<a class="button primary" href="#/lesson/${next.id}">Next lesson →</a>` : `<a class="button primary" href="#/quiz/${lesson.day.id}">Take day quiz →</a>`}
          </div>
        </article>
        <aside class="lesson-aside">
          <span class="eyebrow">IN THIS LESSON</span>
          <h3>${index + 1} / ${siblings.length}</h3>
          <a href="#outcomes">Learning outcomes</a>
          ${lesson.sections.map((section, sectionIndex) => `<a href="#section-${sectionIndex + 1}">${section.title}</a>`).join("")}
          <a href="#sources">Study sources</a>
          <button class="button ${isComplete ? "" : "primary"} complete-toggle" data-lesson-id="${lesson.id}">${isComplete ? "✓ Marked complete" : "Mark lesson complete"}</button>
        </aside>
      </div>`;

    document.querySelector(".complete-toggle").addEventListener("click", toggleLessonComplete);
  }

  function toggleLessonComplete(event) {
    const id = event.currentTarget.dataset.lessonId;
    if (state.completedLessons.includes(id)) {
      state.completedLessons = state.completedLessons.filter((lessonId) => lessonId !== id);
    } else {
      state.completedLessons.push(id);
    }
    saveState();
    renderLesson(id);
  }

  function renderQuiz(dayId) {
    const day = course.days.find((item) => item.id === dayId);
    if (!day) return renderNotFound();
    setBreadcrumb(`Day ${day.id} / Quiz`);
    markActive(`day-${day.id}`);
    renderQuizPage({
      title: `Day ${day.id}: ${day.shortTitle}`,
      eyebrow: "DAILY KNOWLEDGE GATE",
      description: `Answer all ${day.quiz.length} questions. A score of ${course.meta.passScore}% passes the day.`,
      questions: day.quiz,
      formId: `day-quiz-${day.id}`,
      backLink: `#/day/${day.id}`,
      score: state.quizScores[day.id],
      onSubmit: (score) => {
        state.quizScores[day.id] = Math.max(state.quizScores[day.id] || 0, score);
        saveState();
      }
    });
  }

  function renderFinal() {
    setBreadcrumb("Final assessment");
    markActive("final");
    renderQuizPage({
      title: "Final field assessment",
      eyebrow: "15 QUESTIONS / COMPREHENSIVE",
      description: `This assessment spans all seven days. Score ${course.meta.passScore}% or better, then use the result as a baseline for continued practice—not as a professional certification.`,
      questions: course.finalQuiz,
      formId: "final-quiz",
      backLink: "#/home",
      score: state.finalScore,
      onSubmit: (score) => {
        state.finalScore = Math.max(state.finalScore || 0, score);
        saveState();
      }
    });
  }

  function renderQuizPage({ title, eyebrow, description, questions, formId, backLink, score, onSubmit }) {
    view.innerHTML = `
      <header class="quiz-header">
        <span class="eyebrow">${eyebrow}</span>
        <h1>${title}</h1>
        <p class="lede">${description}</p>
        ${score !== null && score !== undefined ? `<span class="status-pill ${score >= course.meta.passScore ? "passed" : ""}">Best score: ${score}%</span>` : ""}
      </header>
      <form class="quiz-form" id="${formId}">
        ${questions.map(renderQuestion).join("")}
        <div id="quiz-result" aria-live="polite"></div>
        <div class="quiz-actions">
          <button class="button primary" type="submit">Grade assessment</button>
          <a class="button" href="${backLink}">Leave quiz</a>
        </div>
      </form>`;

    const form = document.querySelector(`#${formId}`);
    form.addEventListener("submit", (event) => gradeQuiz(event, questions, onSubmit));
  }

  function renderQuestion(question, index) {
    return `<fieldset class="question-card" data-question="${index}">
      <legend><span class="question-number">QUESTION ${String(index + 1).padStart(2, "0")}</span>${question.q}</legend>
      ${question.options.map((option, optionIndex) => `<label class="option"><input type="radio" name="q-${index}" value="${optionIndex}" required /><span>${option}</span></label>`).join("")}
      <div class="explanation" hidden></div>
    </fieldset>`;
  }

  function gradeQuiz(event, questions, onSubmit) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    let correct = 0;

    questions.forEach((question, index) => {
      const selected = Number(data.get(`q-${index}`));
      const card = form.querySelector(`[data-question="${index}"]`);
      const isCorrect = selected === question.answer;
      correct += isCorrect ? 1 : 0;
      card.classList.remove("correct", "incorrect");
      card.classList.add(isCorrect ? "correct" : "incorrect");
      const explanation = card.querySelector(".explanation");
      explanation.hidden = false;
      explanation.innerHTML = `<strong>${isCorrect ? "Correct." : `Not quite. Correct answer: ${question.options[question.answer]}.`}</strong> ${question.explanation}`;
      card.querySelectorAll("input").forEach((input) => (input.disabled = true));
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= course.meta.passScore;
    onSubmit(score);
    const result = form.querySelector("#quiz-result");
    result.className = `quiz-result ${passed ? "pass" : "fail"}`;
    result.innerHTML = `<span class="eyebrow">${passed ? "ASSESSMENT PASSED" : "REVIEW REQUIRED"}</span><div class="quiz-score">${score}%</div><h2>${correct} of ${questions.length} correct</h2><p>${passed ? "Good foundation. Review every explanation and continue applying the concepts in labs." : "Review the explanations and relevant lessons, then retake the assessment."}</p><button class="button" type="button" id="retake-quiz">Retake assessment</button>`;
    result.scrollIntoView({ behavior: "smooth", block: "center" });
    result.querySelector("#retake-quiz").addEventListener("click", () => {
      const hash = location.hash;
      location.hash = "#/refresh";
      requestAnimationFrame(() => (location.hash = hash));
    });
  }

  function renderResources() {
    setBreadcrumb("Field references");
    markActive("resources");
    view.innerHTML = `
      <section class="hero">
        <span class="eyebrow">KEEP BESIDE THE KEYBOARD</span>
        <h1>Field references and continued study.</h1>
        <p class="lede">Short operational references for the course, followed by authoritative sources for deeper work.</p>
      </section>
      <section class="section">
        <div class="resource-grid">
          <article class="resource-card"><h3>Common network services</h3><table class="reference-table"><thead><tr><th>Port</th><th>Service</th><th>Question</th></tr></thead><tbody><tr><td>22</td><td>SSH</td><td>Who may administer remotely?</td></tr><tr><td>53</td><td>DNS</td><td>Can name resolution be trusted and observed?</td></tr><tr><td>80/443</td><td>HTTP/S</td><td>Where does TLS terminate?</td></tr><tr><td>389/636</td><td>LDAP/S</td><td>Is directory traffic protected and scoped?</td></tr><tr><td>445</td><td>SMB</td><td>Why is file sharing reachable?</td></tr><tr><td>3389</td><td>RDP</td><td>Is remote administration restricted and MFA-protected?</td></tr></tbody></table></article>
          <article class="resource-card"><h3>Web review prompts</h3><ul class="content-list"><li>Where is authentication established and recovered?</li><li>Is authorization enforced for every object and action?</li><li>Where does untrusted data reach an interpreter?</li><li>What can be reordered, repeated or raced?</li><li>What secrets or sensitive data reach the browser?</li><li>Which dependencies and build identities are trusted?</li></ul></article>
          <article class="resource-card"><h3>Incident first hour</h3><ol><li>Establish incident lead and secure coordination.</li><li>Validate the event and assign severity.</li><li>Preserve volatile and high-value evidence.</li><li>Contain the highest-risk paths.</li><li>Determine affected identities, assets and data.</li><li>Engage legal, privacy and communications as required.</li><li>Maintain a timestamped decision log.</li></ol></article>
          <article class="resource-card"><h3>Rules of engagement</h3><ul class="content-list"><li>Authorized owner and signatures</li><li>Exact targets and exclusions</li><li>Testing dates and source systems</li><li>Allowed and prohibited actions</li><li>Rate limits and safety controls</li><li>Critical-notification thresholds</li><li>Stop contacts and cleanup</li><li>Evidence retention and destruction</li></ul></article>
          <article class="resource-card"><h3>Assessment finding</h3><ul class="content-list"><li>Title and affected assets</li><li>Preconditions and reproducible steps</li><li>Minimal supporting evidence</li><li>Observed and expected results</li><li>Technical and business impact</li><li>Severity with context</li><li>Root cause and remediation</li><li>Retest status and limitations</li></ul></article>
          <article class="resource-card"><h3>Company readiness gate</h3><ul class="content-list"><li>Legally reviewed MSA, SOW and authorization</li><li>Secure evidence and credential handling</li><li>Documented method and critical escalation</li><li>Experienced technical lead</li><li>Independent report review</li><li>Appropriate insurance</li><li>Three reviewed sample engagements</li><li>Honest service limitations</li></ul></article>
        </div>
      </section>
      <section class="section">
        <div class="section-heading"><h2>Primary study sources</h2><p>Start with frameworks and standards, then use tools to implement them.</p></div>
        <div class="resource-grid">
          ${[
            ["MIT OpenCourseWare security library", "Local research index and official course map.", "mit-ocw-library/index.html"],
            ["NIST Cybersecurity Framework 2.0", "Govern, Identify, Protect, Detect, Respond and Recover.", "https://www.nist.gov/cyberframework"],
            ["NIST NICE Framework", "Work roles, tasks, knowledge and skills.", "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center"],
            ["OWASP ASVS 5.0", "Application-security verification requirements.", "https://owasp.org/projects/asvs"],
            ["OWASP Top 10:2025", "Awareness guide to major web application risks.", "https://top10.owasp.org/2025/"],
            ["MITRE ATT&CK", "Adversary behavior and defensive analysis vocabulary.", "https://attack.mitre.org/"],
            ["NIST SSDF", "Secure software-development practices.", "https://csrc.nist.gov/pubs/sp/800/218/final"],
            ["NIST Incident Response", "SP 800-61 Rev. 3 incident-response guidance.", "https://csrc.nist.gov/pubs/sp/800/61/r3/final"]
          ].map(([title, description, url]) => `<article class="resource-card"><h3>${title}</h3><p>${description}</p><a href="${url}" ${url.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>Open resource ↗</a></article>`).join("")}
        </div>
      </section>`;
  }

  function renderNotFound() {
    setBreadcrumb("Not found");
    markActive("");
    view.replaceChildren(document.querySelector("#empty-template").content.cloneNode(true));
  }

  function getNextLesson() {
    const lessons = allLessons();
    if (state.lastLesson && !state.completedLessons.includes(state.lastLesson)) return lessonById(state.lastLesson);
    return lessons.find((lesson) => !state.completedLessons.includes(lesson.id));
  }

  function renderGlossary(filter = "") {
    const normalized = filter.trim().toLowerCase();
    const entries = course.glossary.filter(([term, definition]) => `${term} ${definition}`.toLowerCase().includes(normalized));
    document.querySelector("#glossary-list").innerHTML = entries.length
      ? `<dl>${entries.map(([term, definition]) => `<div class="glossary-entry"><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}</dl>`
      : `<p>No terms match “${escapeHtml(filter)}”.</p>`;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  }

  function resetProgress() {
    if (!window.confirm("Reset all lesson and quiz progress for this course?")) return;
    state = { ...defaultState };
    localStorage.removeItem(STORAGE_KEY);
    route();
    updateProgressUI();
  }

  document.querySelector("#open-menu").addEventListener("click", () => {
    sidebar.classList.add("open");
    menuScrim.hidden = false;
  });
  document.querySelector("#close-menu").addEventListener("click", closeMenu);
  menuScrim.addEventListener("click", closeMenu);
  document.querySelector("#open-glossary").addEventListener("click", () => {
    renderGlossary();
    glossaryDialog.showModal();
    requestAnimationFrame(() => glossarySearch.focus());
  });
  glossarySearch.addEventListener("input", (event) => renderGlossary(event.target.value));
  document.querySelector("#reset-progress").addEventListener("click", resetProgress);
  window.addEventListener("hashchange", route);

  buildNavigation();
  updateProgressUI();
  route();
})();
