# Packet & Proof — Cybersecurity Foundations in 7 Days

A self-contained, one-week cybersecurity course for software engineers and
future security-company founders.

## Clone and run

You only need Git and a modern web browser. Clone the public repository and
enter the project directory:

```sh
git clone https://github.com/shanudjn/cyb.git
cd cyb
```

The course is a static website with no package installation or build step.
Start a local web server with Python:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173> in your browser. Stop the server with
`Ctrl+C` when you are finished.

Alternatively, open `index.html` directly in a modern browser. If the browser
limits local-file behavior, use the local-server method above. Course progress
and quiz scores are stored only in that browser's local storage.

## Verify the course

The course itself does not require Node.js. Contributors with Node.js 18 or
newer can run the built-in content and route checks:

```sh
node verify.mjs
node smoke-test.mjs
```

Both commands should finish with a success message and no failed checks.

## Open the course without cloning

After the repository is published, GitHub users can also download it from the
repository page with **Code → Download ZIP**, extract the archive, and follow
the same run instructions.

## Included

- Seven daily modules with a 40-hour intensive schedule
- 21 lessons with explanations, examples and safe practical exercises
- Seven guided MIT OCW lectures with 35 timestamped learning stops
- Original teaching notes, worked examples, exercises and model answers for every lecture stop
- Seven daily quizzes with teaching explanations
- A 15-question final assessment
- Progress tracking and resume support
- Searchable glossary
- Field-reference page
- MIT OpenCourseWare research library and active-learning studio
- Responsive desktop and mobile layouts

## Daily schedule

1. Security mindset, risk, threat modeling, ethics and lab safety
2. Networking, Linux/Windows, complete mediation and hardening
3. Browser, web and API security
4. Cryptography, cloud security and secure software delivery
5. Blue-team telemetry, detection and investigations
6. Ethical assessment, red teaming and reporting
7. Incident response, governance and security-company operations

## Important boundary

This course establishes a foundation; it does not make someone an expert in a
week. Perform active testing only on systems you own or are explicitly
authorized in writing to assess.

## Files

- `index.html` — application shell
- `styles.css` — responsive visual design
- `course-data.js` — lessons, quizzes, glossary and sources
- `mit-lecture-data.js` — MIT lecture map, timestamp links, teaching notes and exercises
- `app.js` — navigation, rendering, progress and quiz behavior
- `mit-ocw-library/` — curated MIT OCW research index
- `verify.mjs` — content-integrity checks
- `smoke-test.mjs` — route-rendering smoke checks

Run the verification commands above after editing the curriculum.

## MIT OpenCourseWare study method

Open **MIT lecture studio** from the course navigation. Each day contains one
official MIT 6.858 lecture divided into five guided chapter stops. For each stop:

1. Follow the timestamp link and watch the selected topic.
2. Return to the course and read the teaching note and worked example.
3. Complete **Your turn** without looking at the answer.
4. Reveal the model answer, revise your work, and mark the stop complete.

The course links to MIT's authoritative pages and videos. It does not reproduce
or republish the full lectures or transcripts.
