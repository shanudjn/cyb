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

- Seven daily modules, approximately four hours each
- 21 lessons with explanations, examples and safe practical exercises
- Seven daily quizzes with teaching explanations
- A 15-question final assessment
- Progress tracking and resume support
- Searchable glossary
- Field-reference page
- MIT OpenCourseWare research library and one-week reading map
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
- `app.js` — navigation, rendering, progress and quiz behavior
- `mit-ocw-library/` — curated MIT OCW research index
- `verify.mjs` — content-integrity checks
- `smoke-test.mjs` — route-rendering smoke checks

Run the verification commands above after editing the curriculum.
