/* Course content is intentionally kept in a plain JavaScript object so the site works offline. */
window.COURSE_DATA = {
  meta: {
    title: "Cybersecurity Foundations in 7 Days",
    subtitle: "A field course for software engineers and future security-company founders",
    version: "1.0",
    estimatedHours: 28,
    passScore: 80,
    disclaimer:
      "This is an intensive foundation, not a promise of expertise. Perform active security testing only in a laboratory or under explicit written authorization."
  },
  days: [
    {
      id: 1,
      title: "Think like a security engineer",
      shortTitle: "Security mindset",
      summary: "Build the mental models behind every good security decision: goals, threats, controls, risk and ethics.",
      duration: "4 hours",
      color: "mint",
      objectives: [
        "Distinguish assets, threats, vulnerabilities, controls and risk",
        "Write a precise threat model instead of listing random attacks",
        "Apply confidentiality, integrity and availability to a real product",
        "Recognize the legal boundary between a lab and unauthorized testing"
      ],
      lessons: [
        {
          id: "d1-l1",
          title: "Security goals, adversaries and risk",
          summary: "Security starts by stating what must remain true even when someone is trying to break it.",
          duration: "55 min",
          tags: ["Foundations", "Risk", "MIT 6.858"],
          outcomes: [
            "Define security as a system property under adversarial conditions",
            "Separate a vulnerability from the business risk it creates",
            "Use the CIA triad without reducing security to a slogan"
          ],
          sections: [
            {
              title: "Security is an adversarial systems problem",
              html: `<p>A reliable system should work despite accidents. A secure system must also uphold its goals when an intelligent adversary deliberately searches for a path around them. Start with an <strong>asset</strong>, the thing that has value; a <strong>security objective</strong>, what must remain true; and a <strong>threat model</strong>, the capabilities you assume an adversary has.</p>
              <p>A vulnerability is a weakness. A threat is a circumstance or actor that could exploit it. Risk combines the plausible likelihood of exploitation with the resulting impact. A missing header may be a weakness but create little business risk; an authorization flaw exposing every customer's invoices can be existential.</p>
              <div class="concept-grid">
                <article class="concept-card"><strong>Confidentiality</strong><p>Only authorized parties can read the information.</p></article>
                <article class="concept-card"><strong>Integrity</strong><p>Only authorized changes occur, and unauthorized changes are detectable.</p></article>
                <article class="concept-card"><strong>Availability</strong><p>Authorized users can obtain the service when they need it.</p></article>
              </div>`
            },
            {
              title: "From weakness to decision",
              html: `<p>A useful risk statement has a cause, an uncertain event and a consequence: <em>Because order records are selected only by a user-controlled ID, one customer may read another customer's order, causing a privacy breach and contractual exposure.</em></p>
              <div class="example-box"><span class="box-label">Worked example</span><p><strong>Asset:</strong> customer invoices. <strong>Threat:</strong> an authenticated customer changes an invoice ID. <strong>Weakness:</strong> the server checks authentication but not ownership. <strong>Impact:</strong> cross-tenant disclosure. <strong>Control:</strong> server-side object authorization on every request, plus regression tests and audit logging.</p></div>
              <p>Severity scores help communication, but context controls priority. Ask about reachability, privileges required, exposed data, blast radius, detectability, safety impact and existing compensating controls.</p>`
            },
            {
              title: "Practice: make a risk register entry",
              html: `<div class="lab-box"><span class="box-label">25-minute lab</span><ol><li>Choose a product you know.</li><li>Name three assets: one data asset, one service and one identity.</li><li>Write one CIA objective for each.</li><li>Create one risk statement using cause → event → consequence.</li><li>Add likelihood, impact, an owner and a treatment: reduce, avoid, transfer or accept.</li></ol><p><strong>Deliverable:</strong> a one-row risk register that a product manager could understand.</p></div>`
            }
          ],
          references: [
            { label: "MIT 6.858 — Lecture 1: Introduction and threat models", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-1-introduction-threat-models/" },
            { label: "NIST Cybersecurity Framework 2.0", url: "https://www.nist.gov/cyberframework" }
          ]
        },
        {
          id: "d1-l2",
          title: "Threat modeling and trust boundaries",
          summary: "Turn an architecture diagram into explicit assumptions, abuse cases and design decisions.",
          duration: "65 min",
          tags: ["Threat modeling", "Architecture", "STRIDE"],
          outcomes: [
            "Draw a data-flow diagram with trust boundaries",
            "Identify threats systematically",
            "Convert threats into requirements and tests"
          ],
          sections: [
            {
              title: "Model before choosing controls",
              html: `<p>A threat model is a structured argument about what you are protecting, from whom and under which assumptions. Begin with scope. Inventory users, processes, data stores, external services and data flows. Mark every place where data or authority crosses a boundary: browser to API, public network to private service, employee to production, pipeline to cloud account.</p>
              <p>STRIDE is a useful prompt: <strong>S</strong>poofing, <strong>T</strong>ampering, <strong>R</strong>epudiation, <strong>I</strong>nformation disclosure, <strong>D</strong>enial of service and <strong>E</strong>levation of privilege. It generates questions; it does not replace judgment.</p>`
            },
            {
              title: "A small SaaS threat model",
              html: `<pre class="code-block">Customer browser
    │  HTTPS + session cookie
    ▼
Public API ───────► Identity provider
    │                   ▲
    │ service identity  │ OAuth/OIDC
    ▼                   │
Database            Admin portal

Trust boundaries: browser/API, API/IdP, application/database,
employee/admin portal, CI pipeline/production.</pre>
              <div class="example-box"><span class="box-label">Abuse case</span><p>An authenticated user requests <code>/api/accounts/other-user</code>. The requirement is not merely “users must log in.” It is “the server must verify that the requesting principal may access the requested account on every read and write path.” The test changes the object identifier and expects denial.</p></div>`
            },
            {
              title: "Practice: trace one flow",
              html: `<div class="lab-box"><span class="box-label">35-minute lab</span><ol><li>Draw the login and data-read flows of a web application.</li><li>Mark trust boundaries and secrets.</li><li>Apply STRIDE at each boundary.</li><li>Select the three threats with greatest plausible impact.</li><li>For each, write one prevention control, one detection signal and one verification test.</li></ol></div>`
            }
          ],
          references: [
            { label: "MIT 6.033 — Security Part I", url: "https://ocw.mit.edu/courses/6-033-computer-system-engineering-spring-2018/pages/week-11/lecture-20-outline/" },
            { label: "OWASP Threat Modeling", url: "https://owasp.org/www-community/Threat_Modeling" }
          ]
        },
        {
          id: "d1-l3",
          title: "Ethics, authorization and safe laboratories",
          summary: "Learn the rules that make security testing professional rather than harmful.",
          duration: "50 min",
          tags: ["Ethics", "Authorization", "Lab safety"],
          outcomes: [
            "Identify what written authorization must contain",
            "Use stop conditions and data minimization",
            "Build a safely isolated learning environment"
          ],
          sections: [
            {
              title: "Capability never creates permission",
              html: `<p>Security testing changes risk for someone else. Permission must come from an authorized owner and describe exact targets, dates, techniques and constraints. A public IP address, an exposed login page or a customer's verbal request is not sufficient evidence that every connected system is in scope.</p>
              <p>A rules-of-engagement document should include target identifiers, excluded systems, testing windows, source addresses, prohibited actions, rate limits, data-handling requirements, emergency contacts and stop conditions. Cloud, SaaS and shared hosting may require additional provider permission.</p>`
            },
            {
              title: "Professional restraint",
              html: `<div class="decision-box"><span class="box-label">Decision rule</span><p>Use the least invasive action that proves the agreed risk. If one synthetic record demonstrates broken authorization, do not download a customer database. If testing affects stability or exposes unexpected sensitive data, stop, preserve minimal evidence and contact the named client representative.</p></div>
              <p>Evidence should be access-controlled, encrypted, logged, retained only as agreed and securely destroyed. Never place client tokens, source code or customer data into unapproved AI tools, personal drives or public issue trackers.</p>`
            },
            {
              title: "Practice: define the safe box",
              html: `<div class="lab-box"><span class="box-label">20-minute lab</span><p>Create an isolated lab using local virtual machines or containers. Use deliberately vulnerable targets such as OWASP Juice Shop. Do not bridge vulnerable machines to corporate networks, do not use real credentials, and create a known restoration point.</p><p><strong>Write:</strong> scope, allowed techniques, prohibited techniques, a stop condition and cleanup steps for your own lab exercise.</p></div>`
            }
          ],
          references: [
            { label: "MIT 6.858 syllabus — security-work warning", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/pages/syllabus/" },
            { label: "NIST SP 800-115 — testing and assessment", url: "https://csrc.nist.gov/pubs/sp/800/115/final" }
          ]
        }
      ],
      quiz: [
        { q: "Which statement is a risk statement rather than merely a vulnerability?", options: ["The server uses version 2.4", "The CSP header is absent", "Because ownership is not checked, one customer may read another customer's invoices, causing a reportable disclosure", "Port 443 is open"], answer: 2, explanation: "A useful risk statement connects a cause and uncertain event to business impact." },
        { q: "What is a trust boundary?", options: ["A list of trusted employees", "A point where data or authority crosses between components with different trust assumptions", "An encrypted database", "A firewall rule"], answer: 1, explanation: "A trust boundary is an architectural transition where validation, authentication or authorization assumptions change." },
        { q: "What should a tester do after unexpectedly accessing real sensitive data?", options: ["Download it all for evidence", "Publish the finding", "Stop, minimize evidence and contact the agreed client representative", "Continue until the database is exhausted"], answer: 2, explanation: "Professional testing minimizes harm and follows the engagement's stop and notification procedure." },
        { q: "Which property is primarily affected if an attacker changes invoice totals?", options: ["Confidentiality", "Integrity", "Availability", "Non-repudiation only"], answer: 1, explanation: "Unauthorized modification is an integrity failure." }
      ]
    },
    {
      id: 2,
      title: "See the system beneath the app",
      shortTitle: "Networks & systems",
      summary: "Follow a request through DNS, TCP, TLS, Linux and Windows, then understand where controls actually operate.",
      duration: "4 hours",
      objectives: [
        "Explain the path from a URL to an application response",
        "Interpret common network and operating-system evidence",
        "Apply least privilege and complete mediation",
        "Distinguish processes, services, identities and permissions"
      ],
      lessons: [
        {
          id: "d2-l1",
          title: "Networking from DNS to TLS",
          summary: "Trace the layers that make a browser request possible and secure.",
          duration: "75 min",
          tags: ["TCP/IP", "DNS", "TLS"],
          outcomes: ["Trace a browser request", "Identify where common network controls apply", "Read basic packet and socket evidence"],
          sections: [
            { title: "The request path", html: `<p>When a user enters a URL, the system resolves a name through DNS, chooses an IP route, establishes transport—normally TCP or QUIC—negotiates TLS, sends an HTTP request and receives a response. Security failures can occur at every layer, but controls at one layer do not automatically repair another.</p><pre class="code-block">URL → DNS answer → IP route → TCP/QUIC → TLS → HTTP → application
name   address      path       transport  identity+  method,   business
                                           secrecy    headers    logic</pre><p>TLS can authenticate the server and protect data in transit. It does not decide whether Alice may read Bob's invoice. That remains an application authorization decision.</p>` },
            { title: "Ports, flows and middleboxes", html: `<p>A port identifies a service endpoint on a host. Firewalls filter flows; NAT translates addresses; a reverse proxy accepts client traffic and forwards it; a load balancer distributes requests. A VPN changes network reachability but does not make every reachable system trustworthy.</p><div class="example-box"><span class="box-label">Diagnostic example</span><p>If DNS resolves correctly and TCP connects but TLS fails, inspect certificate names, trust chains, protocol support and time. If TLS succeeds and HTTP returns 403, the network path is working; investigate authorization or policy.</p></div>` },
            { title: "Practice: observe without attacking", html: `<div class="lab-box"><span class="box-label">35-minute lab</span><ol><li>Use browser developer tools to inspect a request to a site you own or a local app.</li><li>Record DNS name, remote address, protocol, method, status and security headers.</li><li>Use <code>curl -v</code> against your local app and label DNS, connection, TLS and HTTP evidence.</li><li>Write where a firewall, reverse proxy and application authorization check would act.</li></ol></div>` }
          ],
          references: [{ label: "MIT 6.829 — Computer Networks", url: "https://ocw.mit.edu/courses/6-829-computer-networks-fall-2002/" }]
        },
        {
          id: "d2-l2",
          title: "Linux, Windows and identity",
          summary: "Understand the primitives behind local privilege and enterprise administration.",
          duration: "70 min",
          tags: ["Linux", "Windows", "Identity"],
          outcomes: ["Reason about users, groups and processes", "Explain local versus domain identity", "Identify useful system logs"],
          sections: [
            { title: "Processes act with identities", html: `<p>Operating systems mediate access to files, memory, devices and networks. A process acts with a security context: user and group identifiers on Unix-like systems; access tokens and security identifiers on Windows. Services are long-running processes and should have only the permissions they need.</p><p>Authentication establishes a principal. Authorization determines what that principal may do. These concepts remain separate even when one login screen appears to handle both.</p>` },
            { title: "Enterprise Windows in one model", html: `<p>Active Directory centralizes identities, computers and policy. Domain controllers authenticate principals and distribute directory information. Kerberos commonly uses tickets to prove identity to services; Group Policy configures systems. Excessive group membership, reusable administrator credentials and powerful service accounts create common attack paths.</p><div class="example-box"><span class="box-label">Least privilege</span><p>A build service that only uploads artifacts should not be a domain administrator. Limit its scope, use a managed workload identity where possible, rotate credentials and alert on unusual use.</p></div>` },
            { title: "Practice: inventory a machine", html: `<div class="lab-box"><span class="box-label">30-minute lab</span><p>On your own Linux or Windows lab machine, list users, groups, running processes, services, listening ports and recent authentication events. Choose one service and answer: who runs it, which files can it read, which network connections can it make and where are its logs?</p></div>` }
          ],
          references: [{ label: "MIT 6.858 — OS security materials", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/pages/lecture-notes/" }]
        },
        {
          id: "d2-l3",
          title: "Complete mediation, isolation and hardening",
          summary: "Learn why every access path must encounter the intended security check.",
          duration: "55 min",
          tags: ["Access control", "Hardening", "Architecture"],
          outcomes: ["Explain complete mediation", "Recognize bypass paths", "Create a small hardening baseline"],
          sections: [
            { title: "The guard must see every request", html: `<p>Complete mediation means every access to a protected resource passes through the authorization mechanism. A secure API route is irrelevant if the same database is publicly reachable, an old endpoint omits the check or an internal job accepts attacker-controlled messages.</p><p>Isolation reduces what a compromised component can affect. Process isolation, containers, virtual machines, network segments and separate cloud accounts are different mechanisms with different boundaries—not interchangeable magic boxes.</p>` },
            { title: "Hardening is attack-surface management", html: `<p>Begin with an inventory. Remove unused software and services, change defaults, patch supported components, restrict administrative access, enforce strong identity controls, centralize logs and test backups. A hardened configuration is a maintained baseline, not a one-time checklist.</p><pre class="code-block">Inventory → approved baseline → detect drift → investigate → restore or approve change</pre>` },
            { title: "Practice: find the bypass", html: `<div class="lab-box"><span class="box-label">25-minute exercise</span><p>Take your Day 1 data-flow diagram. For each protected resource, list every technical path to it: application API, administration tool, background worker, direct database access, backups and support exports. Mark which guard mediates each path. Any unguarded path becomes a design question.</p></div>` }
          ],
          references: [{ label: "MIT 6.033 — Guard model and complete mediation", url: "https://ocw.mit.edu/courses/6-033-computer-system-engineering-spring-2018/pages/week-11/lecture-20-outline/" }]
        }
      ],
      quiz: [
        { q: "TLS successfully connects, but the server returns HTTP 403. What is the strongest conclusion?", options: ["DNS failed", "The network and TLS path work; an application or policy denied the request", "The certificate is expired", "TCP is blocked"], answer: 1, explanation: "An HTTP response means the lower layers completed sufficiently to reach the application or proxy." },
        { q: "Complete mediation requires that…", options: ["All traffic is encrypted", "Every access to a protected resource passes through the intended check", "Every user is an administrator", "The system uses a firewall"], answer: 1, explanation: "A guard is effective only if no alternate path bypasses it." },
        { q: "What is the safest default identity for a narrowly scoped background job?", options: ["Domain administrator", "Root", "A dedicated identity with only required permissions", "A developer's personal account"], answer: 2, explanation: "Dedicated least-privilege identities reduce blast radius and improve accountability." },
        { q: "What does a VPN primarily change?", options: ["Application authorization", "Network reachability and protected transit", "Database integrity", "Source-code quality"], answer: 1, explanation: "A VPN protects/connects network paths; application access decisions still need enforcement." }
      ]
    },
    {
      id: 3,
      title: "Break and build web applications",
      shortTitle: "Web & API security",
      summary: "Use your frontend background to master browser boundaries, access control, injection, sessions and secure verification.",
      duration: "5 hours",
      objectives: [
        "Apply the browser security model correctly",
        "Distinguish authentication, sessions and object authorization",
        "Recognize major web and API vulnerability classes",
        "Turn each discovered defect into a regression test"
      ],
      lessons: [
        {
          id: "d3-l1",
          title: "Browser security: origin, cookies, CORS and CSP",
          summary: "Understand the boundary your frontend lives inside.",
          duration: "80 min",
          tags: ["Browser", "CORS", "CSP", "XSS"],
          outcomes: ["Explain same-origin policy", "Configure cookies deliberately", "Use CSP as defense in depth"],
          sections: [
            { title: "Origin is a security boundary", html: `<p>An origin is normally the tuple of scheme, host and port. The same-origin policy limits how scripts from one origin read resources from another. CORS is a controlled relaxation made by the receiving server; it is not an authentication system.</p><p>Cookies can be automatically attached to requests, which makes their attributes important. <code>HttpOnly</code> restricts script access, <code>Secure</code> limits transport to HTTPS and <code>SameSite</code> influences cross-site sending. None replaces server-side authorization.</p>` },
            { title: "XSS changes the meaning of trust", html: `<p>Cross-site scripting occurs when attacker-controlled content is interpreted as executable browser code in a trusted origin. Prevent it with context-aware output encoding, safe DOM APIs, framework-safe rendering and careful sanitization when HTML is genuinely required. CSP and Trusted Types add defense in depth but should not excuse unsafe rendering.</p><pre class="code-block">// Unsafe: interprets data as HTML
result.innerHTML = userControlledValue;

// Safer for plain text
result.textContent = userControlledValue;</pre>` },
            { title: "Practice: inspect your frontend", html: `<div class="lab-box"><span class="box-label">40-minute lab</span><ol><li>Use a local sample app or OWASP Juice Shop.</li><li>List all origins contacted by the page.</li><li>Inspect authentication-cookie attributes.</li><li>Find every use of <code>innerHTML</code>, equivalent unsafe rendering or dynamic script creation in a project you own.</li><li>Write one safe replacement and one CSP objective.</li></ol></div>` }
          ],
          references: [{ label: "MIT 6.858 — Web security lectures", url: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/pages/lecture-videos/" }, { label: "OWASP Top 10:2025", url: "https://top10.owasp.org/2025/" }]
        },
        {
          id: "d3-l2",
          title: "Authentication, sessions and authorization",
          summary: "Protect the complete account lifecycle and every object decision.",
          duration: "85 min",
          tags: ["IAM", "Sessions", "OAuth", "Access control"],
          outcomes: ["Separate authentication and authorization", "Threat-model account recovery", "Test object-level authorization"],
          sections: [
            { title: "Identity is a lifecycle", html: `<p>Authentication includes enrollment, login, MFA, session creation, reauthentication, recovery, credential changes and termination. Attackers often choose the weakest path, such as recovery or support, rather than the strongest login flow.</p><p>A session token is a bearer credential if possession is sufficient. Protect it in transit and storage, rotate it after privilege changes, expire it appropriately and invalidate it when the account or risk state changes.</p>` },
            { title: "Authorization belongs on the server", html: `<p>Hiding a button is user-interface behavior, not access control. The server must validate the principal, requested action, target object and relevant context. Multi-tenant systems should make tenant scope difficult to omit—prefer centralized policy and query patterns over scattered conditionals.</p><div class="example-box"><span class="box-label">Test pattern</span><p>Create Alice and Bob. Have Alice create an object. Capture Alice's read, update and delete requests. Repeat each request as Bob and anonymously. A secure result denies every unauthorized path without leaking sensitive distinctions.</p></div>` },
            { title: "OAuth and OIDC in one paragraph", html: `<p>OAuth delegates authorization; OpenID Connect adds an identity layer. Validate redirect URIs, state and nonce as applicable; use current recommended flows with PKCE for public clients; validate issuer, audience, signature and time claims; and never treat an unverified token payload as proof.</p><div class="lab-box"><span class="box-label">35-minute design lab</span><p>Draw your application's account lifecycle from invitation to deletion. Mark credentials, tokens, recovery channels, privilege changes and audit events. Write abuse cases for stolen session, compromised email and cross-tenant object access.</p></div>` }
          ],
          references: [{ label: "NIST SP 800-63-4 — Digital Identity Guidelines", url: "https://csrc.nist.gov/pubs/sp/800/63/4/final" }, { label: "OWASP ASVS 5.0", url: "https://owasp.org/projects/asvs" }]
        },
        {
          id: "d3-l3",
          title: "Injection, APIs, business logic and verification",
          summary: "Move beyond memorizing vulnerability names to finding broken assumptions.",
          duration: "85 min",
          tags: ["Injection", "API", "Business logic", "ASVS"],
          outcomes: ["Explain injection as interpreter confusion", "Test API and workflow invariants", "Build a repeatable verification plan"],
          sections: [
            { title: "Injection crosses a language boundary", html: `<p>Injection happens when untrusted data is interpreted as part of a command or query. SQL injection, shell command injection and template injection differ in syntax but share a root cause: data and instructions were not kept separate. Prefer parameterized interfaces, safe APIs and allowlisted structure where parameters cannot represent it.</p><pre class="code-block">// Risky: data becomes SQL syntax
query("SELECT * FROM users WHERE id = " + request.id)

// Safer: structure and data remain separate
query("SELECT * FROM users WHERE id = ?", [request.id])</pre>` },
            { title: "Business logic has no universal scanner", html: `<p>Technical controls can all function while the product remains exploitable. Can a discount be reused? Can a user approve their own request? Can parallel requests exceed a limit? Can workflow steps be reordered? State the invariant first—such as “one coupon may reduce one paid order once”—then attempt sequences that violate it.</p>` },
            { title: "Verification is layered", html: `<p>Use automated tests for repeatable baseline coverage and manual reasoning for architecture, authorization and workflow behavior. ASVS supplies comprehensive application-security requirements; the OWASP Top 10 is an awareness list, not a complete audit scope.</p><div class="lab-box"><span class="box-label">50-minute lab</span><ol><li>Complete beginner SQL injection, XSS and access-control labs in PortSwigger Academy or Juice Shop.</li><li>For each issue, record precondition, input, interpreter or decision point, impact and fix.</li><li>Add a negative regression test.</li><li>Map the test to an ASVS requirement.</li></ol></div>` }
          ],
          references: [{ label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" }, { label: "OWASP Juice Shop", url: "https://owasp.org/projects/juice-shop" }]
        }
      ],
      quiz: [
        { q: "What does CORS primarily control?", options: ["Who may log in", "Which other origins may read a server's responses in browser contexts", "Database encryption", "Operating-system permissions"], answer: 1, explanation: "CORS relaxes browser same-origin read restrictions; it is not user authorization." },
        { q: "Why is hiding an admin button insufficient?", options: ["CSS is slow", "The client can issue the underlying request directly", "Buttons cannot use TLS", "Browsers ignore permissions"], answer: 1, explanation: "Authorization must be enforced on the server for every protected action." },
        { q: "What is the common root of SQL and command injection?", options: ["Weak passwords", "Untrusted data is interpreted as instructions", "Missing encryption", "An old browser"], answer: 1, explanation: "Safe parameterization keeps data separate from interpreter syntax." },
        { q: "What is the best way to test a business rule?", options: ["Run only a port scanner", "State the invariant, then try sequences and concurrency that violate it", "Check for a CSP header", "Review CSS"], answer: 1, explanation: "Business-logic testing begins with product invariants and adversarial workflows." }
      ]
    },
    {
      id: 4,
      title: "Protect identity, code and cloud",
      shortTitle: "Crypto, cloud & DevSecOps",
      summary: "Learn what cryptography guarantees, how cloud responsibility is divided and how secure delivery becomes routine.",
      duration: "4 hours",
      objectives: [
        "Choose cryptographic primitives by required property",
        "Apply least privilege to human and workload identities",
        "Explain cloud shared responsibility",
        "Design a secure software-delivery pipeline"
      ],
      lessons: [
        {
          id: "d4-l1",
          title: "Practical cryptography and secrets",
          summary: "Understand primitives well enough to use trusted libraries correctly.",
          duration: "75 min",
          tags: ["Cryptography", "Hashing", "PKI", "Secrets"],
          outcomes: ["Distinguish encryption, hashing and signatures", "Explain TLS identity", "Design secret storage and rotation"],
          sections: [
            { title: "Choose by security property", html: `<p>Encryption provides confidentiality when keys and modes are managed correctly. Cryptographic hashes provide fixed-length digests and should resist preimage and collision attacks. Message-authentication codes protect integrity and authenticity with a shared secret. Digital signatures provide integrity and origin authentication with asymmetric keys.</p><p>Password storage needs a dedicated, salted, slow password-hashing function—not reversible encryption and not a fast general-purpose hash.</p>` },
            { title: "PKI and TLS", html: `<p>A certificate binds an identity to a public key through a signature chain. A TLS client validates the chain, intended hostname, validity and other constraints before trusting the peer. Encryption without correct peer authentication can still connect securely to the wrong party.</p><div class="example-box"><span class="box-label">Design rule</span><p>Do not invent cryptographic algorithms or compose low-level primitives casually. Use reviewed protocols and well-maintained libraries. Define key ownership, storage, access, rotation, revocation and recovery.</p></div>` },
            { title: "Practice: secret lifecycle", html: `<div class="lab-box"><span class="box-label">30-minute lab</span><p>Inventory five secrets in a typical web system: session signing key, database credential, CI token, cloud workload credential and third-party API key. For each, record creator, storage, consumers, rotation process, exposure signal and revocation procedure. Replace static cloud keys with workload identity in your design.</p></div>` }
          ],
          references: [{ label: "MIT 6.1200J — Cryptography lecture notes", url: "https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/mit6_1200j_s24_lec10.pdf" }, { label: "MIT 6.857 — Network and Computer Security", url: "https://ocw.mit.edu/courses/6-857-network-and-computer-security-spring-2014/" }]
        },
        {
          id: "d4-l2",
          title: "Cloud security and workload identity",
          summary: "Secure the configuration and identities the cloud provider leaves to you.",
          duration: "65 min",
          tags: ["Cloud", "IAM", "Logging"],
          outcomes: ["Explain shared responsibility", "Design account boundaries", "Prioritize cloud telemetry"],
          sections: [
            { title: "The provider secures the cloud; you configure your use", html: `<p>Responsibility varies by service model. A cloud provider may secure physical facilities, hardware and managed-service infrastructure, while the customer remains responsible for identities, data, application behavior and many configuration choices. Managed services reduce operational burden but do not remove accountability.</p>` },
            { title: "Identity is the cloud perimeter", html: `<p>Use organization-level separation, dedicated production accounts or subscriptions, federated human access, short-lived workload credentials and explicit roles. Deny public exposure by default, centralize audit logs outside workload accounts and alert on privilege changes, disabled logging and unusual data access.</p><pre class="code-block">Human → SSO → role → approved action
Pipeline → workload identity → deploy role → specific environment
Application → service identity → exact database/queue/storage permissions</pre>` },
            { title: "Practice: review a cloud design", html: `<div class="lab-box"><span class="box-label">35-minute lab</span><p>For a cloud-hosted app, answer: Where are production boundaries? Who can assume admin roles? How does CI authenticate? Which storage is public? Where are audit logs copied? How are secrets obtained? What happens if the application identity is compromised?</p></div>` }
          ],
          references: [{ label: "NIST cloud-computing security publications", url: "https://csrc.nist.gov/projects/cloud-computing" }]
        },
        {
          id: "d4-l3",
          title: "Secure SDLC, dependencies and CI/CD",
          summary: "Build prevention and verification into everyday software delivery.",
          duration: "70 min",
          tags: ["SSDF", "Supply chain", "CI/CD"],
          outcomes: ["Design a layered pipeline", "Prioritize dependency risk", "Create feedback loops from incidents and defects"],
          sections: [
            { title: "Security is a lifecycle", html: `<p>Secure delivery begins with requirements and architecture, continues through implementation and verification, and remains active in operations. NIST SSDF groups practices around preparing the organization, protecting software, producing well-secured software and responding to vulnerabilities.</p><p>OWASP SAMM adds maturity planning across governance, design, implementation, verification and operations.</p>` },
            { title: "Pipeline controls with purpose", html: `<p>Use code review and protected branches, secret scanning, dependency analysis, static analysis, unit and abuse tests, infrastructure checks, container scanning, signed artifacts and constrained deployment identities. Each tool needs an owner, triage process and exception workflow. A red dashboard nobody trusts is not a control.</p><div class="example-box"><span class="box-label">Supply-chain question</span><p>Do not prioritize a dependency solely because a scanner found a CVE. Confirm the affected component and version, whether vulnerable functionality is reachable, deployment exposure, available fix and compensating controls—then document the decision.</p></div>` },
            { title: "Practice: pipeline blueprint", html: `<div class="lab-box"><span class="box-label">35-minute lab</span><p>Draw commit → review → build → test → artifact → deploy. At each stage add one preventive control, one evidence artifact and one owner. Include how urgent fixes move safely and how an accepted finding expires for review.</p></div>` }
          ],
          references: [{ label: "NIST SP 800-218 — Secure Software Development Framework", url: "https://csrc.nist.gov/pubs/sp/800/218/final" }, { label: "OWASP SAMM", url: "https://owaspsamm.org/model/" }]
        }
      ],
      quiz: [
        { q: "Which primitive is designed for storing passwords?", options: ["Reversible encryption", "A fast SHA-1 hash", "A salted, slow password-hashing function", "Base64"], answer: 2, explanation: "Password hashing should be intentionally expensive and uniquely salted." },
        { q: "In cloud security, which responsibility commonly remains with the customer?", options: ["Physical datacenter guards", "Application authorization and cloud IAM configuration", "Manufacturing CPU hardware", "Power to the provider's facility"], answer: 1, explanation: "The exact split varies, but customer identity, data and application configuration remain core customer duties." },
        { q: "Why prefer short-lived workload identity over static cloud keys?", options: ["It makes code shorter", "It reduces long-lived secret exposure and supports scoped issuance", "It disables audit logs", "It grants administrator access"], answer: 1, explanation: "Short-lived, scoped credentials reduce persistence and improve control." },
        { q: "What turns a scanner into an effective control?", options: ["More findings", "An owner, triage, remediation and exception process", "A colorful dashboard", "Running it once annually"], answer: 1, explanation: "Tools create signals; people and processes turn signals into managed risk reduction." }
      ]
    },
    {
      id: 5,
      title: "Detect and investigate",
      shortTitle: "Blue team operations",
      summary: "Collect useful telemetry, engineer detections, triage alerts and tell the story of an intrusion.",
      duration: "4 hours",
      objectives: [
        "Choose telemetry based on investigation questions",
        "Map behavior to MITRE ATT&CK",
        "Triage an alert using evidence and hypotheses",
        "Measure detection quality rather than alert volume"
      ],
      lessons: [
        {
          id: "d5-l1",
          title: "Telemetry and security operations",
          summary: "Logs are evidence only when they answer useful questions and can be trusted.",
          duration: "65 min",
          tags: ["SOC", "SIEM", "Logging"],
          outcomes: ["Select high-value log sources", "Explain SIEM and EDR roles", "Protect logging integrity"],
          sections: [
            { title: "Start with questions, not log volume", html: `<p>Collect evidence that supports prevention, detection, investigation and accountability. High-value sources commonly include identity-provider events, endpoint process activity, DNS, network metadata, cloud control-plane actions, application authentication and administrative business events.</p><p>A SIEM centralizes and queries events. EDR observes and responds on endpoints. Network detection analyzes traffic. None is effective without coverage, correct time, usable context, retention and trained analysts.</p>` },
            { title: "Application logs are security controls", html: `<p>Record actor, action, target, result, time, request or correlation identifier and relevant security context. Avoid logging passwords, full tokens or unnecessary personal data. Protect logs from alteration and establish access and retention policies.</p><pre class="code-block">2026-10-11T09:42:13Z auth.login.failed
actor=user:1842 source_ip=203.0.113.8
reason=mfa_invalid correlation_id=req-7f2a</pre>` },
            { title: "Practice: telemetry map", html: `<div class="lab-box"><span class="box-label">30-minute lab</span><p>For account takeover, list what you would need to answer: How did the attacker authenticate? What sessions were created? Which data or settings changed? Did privilege increase? Map each question to a source and verify that source is actually enabled.</p></div>` }
          ],
          references: [{ label: "Security Onion — network and host visibility", url: "https://docs.securityonion.net/en/3/main/introduction/" }]
        },
        {
          id: "d5-l2",
          title: "Detection engineering and ATT&CK",
          summary: "Turn a threat hypothesis into a testable, maintainable analytic.",
          duration: "70 min",
          tags: ["Detection", "MITRE ATT&CK", "Threat hunting"],
          outcomes: ["Write a detection hypothesis", "Map behavior accurately", "Validate a detection safely"],
          sections: [
            { title: "Behavior outlives many indicators", html: `<p>IP addresses and file hashes can change quickly. Behavior-based detections focus on what an adversary must do: create persistence, execute a script, access credentials or change a security control. MITRE ATT&CK is a knowledge base and shared vocabulary for these behaviors, not a list of mandatory alerts.</p>` },
            { title: "An analytic needs a complete story", html: `<p>Document the threat hypothesis, required data, query or rule, expected benign causes, severity, triage steps, owner and test procedure. Measure data coverage, true-positive usefulness, false-positive burden and whether analysts can act.</p><div class="example-box"><span class="box-label">Detection hypothesis</span><p>If a user authenticates successfully from a new geography immediately after repeated MFA failures and then creates a new API token, the sequence may indicate account takeover. Join identity and application audit events by actor and time, then prioritize privileged accounts.</p></div>` },
            { title: "Practice: build and test", html: `<div class="lab-box"><span class="box-label">35-minute lab</span><p>Choose one ATT&amp;CK technique. State observable behavior, required telemetry and benign explanations. Create a query or pseudocode rule, generate the behavior in your lab, confirm the alert and write three triage questions.</p></div>` }
          ],
          references: [{ label: "MITRE ATT&CK Enterprise", url: "https://attack.mitre.org/" }, { label: "CISA ATT&CK mapping guidance", url: "https://www.cisa.gov/news-events/news/best-practices-mitre-attckr-mapping" }]
        },
        {
          id: "d5-l3",
          title: "Alert triage and threat hunting",
          summary: "Move from a noisy signal to a defensible incident decision.",
          duration: "65 min",
          tags: ["Triage", "Investigation", "Hunting"],
          outcomes: ["Scope an alert", "Build a timeline", "Separate hypothesis-driven hunting from random searching"],
          sections: [
            { title: "Triage is constrained investigation", html: `<p>Validate that the alert refers to real activity, identify affected entities, establish chronology, enrich with identity and asset context, and decide whether the behavior is authorized, benign, suspicious or malicious. Preserve uncertainty rather than forcing a story too early.</p><p>Scope both backward and sideways: what preceded the alert, what followed it, and where else the same identity, indicator or behavior appears.</p>` },
            { title: "Hunt with a falsifiable hypothesis", html: `<p>A threat hunt begins with a plausible statement that evidence can support or reject, such as: “An attacker using stolen developer credentials may create unauthorized CI secrets and deploy an altered artifact.” Identify data, search for deviations and convert useful discoveries into durable detections or hardening work.</p>` },
            { title: "Practice: investigate a sequence", html: `<div class="lab-box"><span class="box-label">35-minute tabletop</span><p>Events: 09:00 five MFA failures; 09:03 successful login from a new ASN; 09:07 recovery email changed; 09:11 API token created; 09:20 customer export downloaded. Write an incident timeline, confidence, immediate containment, additional evidence and two alternative benign explanations to test.</p></div>` }
          ],
          references: [{ label: "MITRE ATT&CK — Detection and analytics", url: "https://attack.mitre.org/resources/attack-data-and-tools/" }]
        }
      ],
      quiz: [
        { q: "What is the best starting point for a logging plan?", options: ["Collect everything forever", "Investigation and detection questions the organization must answer", "Buy the largest SIEM", "Enable only firewall logs"], answer: 1, explanation: "Questions drive useful telemetry, coverage and retention decisions." },
        { q: "What is MITRE ATT&CK?", options: ["An antivirus product", "A knowledge base and vocabulary for adversary behavior", "A compliance certificate", "A vulnerability scanner"], answer: 1, explanation: "ATT&CK organizes observed tactics and techniques; teams use it for analysis, emulation and detection." },
        { q: "A strong detection document should include…", options: ["Only the query", "Hypothesis, data, benign causes, triage, owner and test", "Only the severity", "Only an IP blocklist"], answer: 1, explanation: "Operational context makes an analytic testable and usable." },
        { q: "What should an analyst do before declaring an account compromised?", options: ["Ignore chronology", "Validate the alert, add context and test alternative explanations", "Delete the account immediately in every case", "Publish the username"], answer: 1, explanation: "Triage builds a defensible conclusion while enabling urgent containment when evidence warrants it." }
      ]
    },
    {
      id: 6,
      title: "Assess like an ethical attacker",
      shortTitle: "Red team & pentesting",
      summary: "Plan authorized assessments, validate impact safely and produce findings clients can actually fix.",
      duration: "4 hours",
      objectives: [
        "Distinguish vulnerability assessment, penetration testing and red teaming",
        "Create a safe rules-of-engagement document",
        "Validate weaknesses with minimal impact",
        "Write reproducible, business-aware findings"
      ],
      lessons: [
        {
          id: "d6-l1",
          title: "Assessment types and methodology",
          summary: "Choose the engagement model that answers the client's actual question.",
          duration: "60 min",
          tags: ["Scoping", "Vulnerability assessment", "Red team"],
          outcomes: ["Select an assessment type", "Define success criteria", "Avoid misleading scope claims"],
          sections: [
            { title: "Different work answers different questions", html: `<p>A vulnerability assessment asks what likely weaknesses exist across a scope. A penetration test manually validates selected attack paths and impact within a time box. A red-team exercise asks whether an adversary can achieve an agreed objective and how well people, processes and technology detect and respond.</p><p>Black-box, gray-box and white-box describe how much internal knowledge or access testers receive. Less knowledge is not automatically more realistic or more valuable.</p>` },
            { title: "A disciplined flow", html: `<pre class="code-block">Authorize → scope → model → discover → validate → communicate
          → peer review → report → remediate → retest → close</pre><p>Establish exact assets, credentials, third parties, excluded actions, data-handling rules and critical-notification thresholds before testing.</p>` },
            { title: "Practice: choose the engagement", html: `<div class="lab-box"><span class="box-label">25-minute scenario</span><p>A SaaS company asks, “Are our new APIs safe before launch?” Select an assessment type, access level, sample accounts, required documentation, success criteria, prohibited actions and deliverables. Explain why calling it a red team would or would not be accurate.</p></div>` }
          ],
          references: [{ label: "NIST SP 800-115", url: "https://csrc.nist.gov/pubs/sp/800/115/final" }]
        },
        {
          id: "d6-l2",
          title: "Safe validation and attack paths",
          summary: "Demonstrate risk without turning the assessment into an incident.",
          duration: "70 min",
          tags: ["Validation", "Attack path", "Purple team"],
          outcomes: ["Use minimal proofs", "Connect weaknesses into attack paths", "Collaborate through purple-team exercises"],
          sections: [
            { title: "Prove the agreed claim", html: `<p>Validation should be proportional. Demonstrate command execution with an inert command, data access with a synthetic record, and privilege escalation with a controlled account where possible. Avoid persistence, destructive commands, bulk collection and uncontrolled payloads unless explicitly required, approved and prepared.</p>` },
            { title: "Attack paths reveal compound risk", html: `<p>Individually moderate conditions can combine: an exposed repository leaks a low-privilege token; broad cloud permissions allow reading deployment configuration; configuration reveals a database credential; missing tenant checks expose customer data. Record every precondition and control that could break the chain.</p><div class="example-box"><span class="box-label">Purple-team loop</span><p>Choose an ATT&amp;CK-mapped behavior, execute it safely in the authorized environment, observe telemetry, improve detection or hardening and repeat. The goal is validated improvement, not red-versus-blue competition.</p></div>` },
            { title: "Practice: minimal proof", html: `<div class="lab-box"><span class="box-label">30-minute lab</span><p>For three hypothetical findings—file read, broken authorization and command injection—write the least invasive proof that demonstrates impact. Add a stop condition and cleanup step for each.</p></div>` }
          ],
          references: [{ label: "MITRE CALDERA", url: "https://www.mitre.org/our-impact/intellectual-property/caldera" }, { label: "MITRE ATT&CK adversary emulation", url: "https://attack.mitre.org/resources/get-started/adversary-emulation-and-red-teaming/" }]
        },
        {
          id: "d6-l3",
          title: "Evidence, severity, reporting and retesting",
          summary: "A finding is useful only if the client can understand, reproduce and repair it.",
          duration: "70 min",
          tags: ["Reporting", "Severity", "QA"],
          outcomes: ["Write a complete finding", "Adjust severity with context", "Conduct independent quality review"],
          sections: [
            { title: "Anatomy of a finding", html: `<p>Include title, affected assets, preconditions, reproducible steps, minimal evidence, observed result, expected secure behavior, technical and business impact, severity rationale, root cause, remediation and references. Separate confirmed facts from assumptions.</p><p>An executive summary describes exposure, business consequence, themes and priorities without pretending that one assessment proves the absence of all vulnerabilities.</p>` },
            { title: "Severity is a decision aid", html: `<p>Use a consistent scoring model, then incorporate environmental context: asset criticality, exposed data, exploit reliability, privileges, reachability, detection and compensating controls. The client owns risk acceptance; the assessor must explain the evidence and implications clearly.</p>` },
            { title: "Practice: write and review", html: `<div class="lab-box"><span class="box-label">45-minute lab</span><p>Write a full finding for cross-tenant invoice access. Then review it as a developer: can you reproduce it? As an executive: can you understand the consequence? As legal/privacy: is data exposure described accurately? As QA: does the evidence support every claim?</p></div>` }
          ],
          references: [{ label: "CERT-In audit quality recommendations", url: "https://www.cert-in.org.in/s2cMainServlet?pageid=CERTEMPANEL" }]
        }
      ],
      quiz: [
        { q: "Which engagement primarily tests whether defenders detect and respond to an objective-driven adversary?", options: ["Configuration review", "Red-team exercise", "Dependency scan", "Code formatting review"], answer: 1, explanation: "Red teams emulate adversary objectives and test people, process and technology." },
        { q: "What is the best proof for broken object authorization?", options: ["Download all customer records", "Use two controlled accounts and access one synthetic object across the boundary", "Delete production data", "Publish a screenshot with real PII"], answer: 1, explanation: "A controlled cross-account test proves the failure while minimizing harm." },
        { q: "Who should accept remaining business risk?", options: ["The scanner", "The authorized business risk owner, informed by the assessor's evidence", "Any developer", "The attacker"], answer: 1, explanation: "Assessors explain risk; accountable business owners make documented treatment decisions." },
        { q: "Why should another qualified person review a report?", options: ["To make it longer", "To validate evidence, reproducibility, severity and clarity", "To remove remediation", "To replace authorization"], answer: 1, explanation: "Independent technical QA reduces unsupported claims and missed context." }
      ]
    },
    {
      id: 7,
      title: "Respond, govern and build the company",
      shortTitle: "IR, GRC & business",
      summary: "Close the loop with incident response, governance and a responsible plan for an AppSec consultancy.",
      duration: "4 hours",
      objectives: [
        "Coordinate incident response from preparation through improvement",
        "Use NIST CSF and CIS Controls to prioritize a program",
        "Design a narrow, credible security consultancy",
        "Complete an integrated capstone and 90-day launch plan"
      ],
      lessons: [
        {
          id: "d7-l1",
          title: "Incident response and evidence",
          summary: "Contain harm while preserving the information needed to understand and recover.",
          duration: "70 min",
          tags: ["Incident response", "Forensics", "Communication"],
          outcomes: ["Assign incident roles", "Balance containment and evidence", "Run a lessons-learned review"],
          sections: [
            { title: "Response starts before the incident", html: `<p>Preparation defines authority, contacts, telemetry, tools, playbooks, legal and regulatory obligations, communications and recovery capability. During an incident, establish coordination, validate and scope the event, contain it, eradicate causes, recover safely and preserve a decision log.</p><p>Fast containment matters, but uninformed action can destroy evidence or disrupt critical operations. The incident lead coordinates technical, legal, privacy, communications and business-continuity perspectives.</p>` },
            { title: "Build a defensible timeline", html: `<p>Record what happened, when it happened, source of evidence, who collected it and what actions responders took. Hash forensic copies where appropriate and maintain chain of custody when evidence may support legal or disciplinary processes.</p><div class="example-box"><span class="box-label">Credential compromise</span><p>Disable or constrain active sessions, secure recovery channels, rotate affected credentials, search for persistence and secondary identities, review actions performed, notify required stakeholders and monitor for recurrence.</p></div>` },
            { title: "Practice: tabletop", html: `<div class="lab-box"><span class="box-label">35-minute exercise</span><p>A production API key appears in a public repository. Write the first five actions, incident roles, evidence to preserve, scope questions, customer/regulatory decision points, recovery criteria and three improvements that prevent recurrence.</p></div>` }
          ],
          references: [{ label: "NIST SP 800-61 Rev. 3", url: "https://csrc.nist.gov/pubs/sp/800/61/r3/final" }]
        },
        {
          id: "d7-l2",
          title: "Governance, controls and assurance",
          summary: "Turn security activity into accountable, measurable risk management.",
          duration: "65 min",
          tags: ["NIST CSF", "CIS Controls", "GRC"],
          outcomes: ["Use CSF functions", "Build current and target profiles", "Distinguish compliance from security"],
          sections: [
            { title: "Govern the whole lifecycle", html: `<p>NIST CSF 2.0 organizes outcomes into Govern, Identify, Protect, Detect, Respond and Recover. Use a current profile to describe what exists, a target profile to state prioritized outcomes and a gap plan to assign work, owners and evidence.</p><p>CIS Controls provide a prioritized set of safeguards. Begin with the foundational implementation group appropriate for smaller organizations rather than selecting controls randomly.</p>` },
            { title: "Evidence beats policy theater", html: `<p>A policy states expected behavior; a standard makes requirements specific; a procedure describes how; evidence demonstrates what actually happened. Compliance verifies a defined set of obligations at a point in time. Security continually manages evolving risk. They overlap but are not equivalent.</p>` },
            { title: "Practice: a mini profile", html: `<div class="lab-box"><span class="box-label">30-minute lab</span><p>For a 30-person SaaS company, select one outcome under each CSF function. Record current state, desired state, owner, deadline and evidence. Prioritize identity, inventory, backups, logging, incident readiness and secure development before exotic tooling.</p></div>` }
          ],
          references: [{ label: "NIST CSF 2.0", url: "https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20" }, { label: "CIS Controls v8.1", url: "https://www.cisecurity.org/controls/v8-1" }]
        },
        {
          id: "d7-l3",
          title: "Launch a focused cybersecurity company",
          summary: "Package your strongest capability into a trustworthy operating model.",
          duration: "75 min",
          tags: ["Consulting", "Operations", "Capstone"],
          outcomes: ["Choose a credible service wedge", "Design delivery and QA", "Create a 90-day plan"],
          sections: [
            { title: "Start narrow", html: `<p>For a frontend engineer, the credible wedge is product and application security for web/API teams: threat modeling, architecture review, ASVS-based assessment, secure SDLC improvement and developer workshops. Do not promise a 24×7 SOC, ransomware response or advanced enterprise red teaming until qualified staff and operational coverage exist.</p>` },
            { title: "How the company delivers", html: `<pre class="code-block">Qualify → NDA/discovery → scope → MSA/SOW/authorization
→ kickoff → assessment → urgent notifications → peer review
→ report/readout → remediation → retest → evidence destruction</pre><p>Separate sales promises from technical approval. Require independent review of findings. Secure client credentials and evidence. Carry suitable professional and cyber insurance. Use qualified counsel for contracts, privacy and local regulatory obligations.</p>` },
            { title: "Capstone and 90-day plan", html: `<div class="lab-box"><span class="box-label">Final build</span><p>Create a small SaaS security package containing: architecture and data-flow diagram, threat model, risk register, ASVS verification scope, three example findings, secure CI/CD blueprint, ten logging requirements, four incident playbooks, CSF current/target profile, sample SOW and a sanitized report.</p><p><strong>Days 1–30:</strong> niche, interviews, legal/insurance and internal security. <strong>Days 31–60:</strong> methodology, templates, lab and senior reviewer. <strong>Days 61–90:</strong> three controlled pilot engagements with independent QA.</p></div>` }
          ],
          references: [{ label: "NIST CSF for small business", url: "https://www.nist.gov/itl/smallbusinesscyber/nist-cybersecurity-framework-0" }, { label: "CERT-In empanelment and audit resources", url: "https://www.cert-in.org.in/s2cMainServlet?pageid=CERTEMPANEL" }]
        }
      ],
      quiz: [
        { q: "Which activity should be prepared before an incident?", options: ["Only the press release", "Roles, contacts, telemetry, playbooks, recovery and notification paths", "Attribution to a nation-state", "Deleting all logs"], answer: 1, explanation: "Preparation creates authority, evidence and practiced coordination." },
        { q: "What is a target CSF profile?", options: ["A list of hackers", "Prioritized cybersecurity outcomes the organization intends to achieve", "A penetration-test payload", "A user account"], answer: 1, explanation: "Current and target profiles help communicate gaps and priorities." },
        { q: "Which initial business offering best matches a frontend engineering background?", options: ["24×7 global MDR", "Web/API product security and secure development", "Hardware chip reverse engineering", "Nation-state intelligence collection"], answer: 1, explanation: "A narrow AppSec niche uses existing product and development experience while deeper capabilities grow." },
        { q: "What is the strongest quality control for a consulting report?", options: ["More scanner screenshots", "Independent technical review against evidence and scope", "Removing limitations", "Promising zero vulnerabilities"], answer: 1, explanation: "A qualified reviewer checks reproducibility, claims, severity, scope and remediation quality." }
      ]
    }
  ],
  finalQuiz: [
    { q: "A user can change `/orders/81` to `/orders/82` and see another tenant's order. What is the primary root failure?", options: ["DNS", "Object-level authorization", "TLS", "Availability"], answer: 1, explanation: "Authentication succeeded, but the server failed to authorize access to the requested object." },
    { q: "Which sequence best describes sound risk analysis?", options: ["Tool → dashboard → fear", "Asset → threat → weakness → consequence → treatment", "Port → CVE → exploit everything", "Policy → assume compliance"], answer: 1, explanation: "Risk analysis connects valued assets and plausible threats to impact and treatment." },
    { q: "What does TLS not determine?", options: ["Confidentiality in transit", "Peer identity through certificates", "Whether Alice may read Bob's invoice", "Integrity of the protected transport"], answer: 2, explanation: "Application authorization remains the server's responsibility." },
    { q: "What is the correct response to a test reaching unexpected sensitive data?", options: ["Collect it all", "Stop, minimize evidence and notify through the agreed channel", "Post publicly", "Delete the target"], answer: 1, explanation: "Follow authorization, minimize harm and escalate." },
    { q: "Which is the best description of least privilege?", options: ["Nobody has access", "Each principal gets only the permissions needed for its function", "Everyone shares admin", "Use one account per company"], answer: 1, explanation: "Least privilege limits capability and blast radius." },
    { q: "What should protect a password database?", options: ["Base64", "Salted slow password hashes", "Plain SHA-1", "Reversible encryption as the only control"], answer: 1, explanation: "Purpose-built password hashing makes offline guessing more expensive." },
    { q: "Which security activity most needs manual domain reasoning?", options: ["Checking code formatting", "Testing business-logic invariants", "Listing package versions", "Counting lines"], answer: 1, explanation: "Business logic depends on the product's intended rules and workflows." },
    { q: "What makes a detection operational?", options: ["A query alone", "Hypothesis, data, validation, triage, owner and response", "A high alert count", "A threat name"], answer: 1, explanation: "An analytic must be testable and actionable." },
    { q: "What is the primary objective of a red-team exercise?", options: ["Find every CVE", "Test whether an objective-driven adversary can succeed and how defenders respond", "Run a compliance scan", "Review privacy text"], answer: 1, explanation: "Red teams test people, process and technology against adversary objectives." },
    { q: "Which statement about cloud security is correct?", options: ["The provider is responsible for every customer configuration", "Responsibility is shared and varies by service model", "Cloud removes identity risk", "Logging is automatic and complete"], answer: 1, explanation: "Customers retain important identity, data, application and configuration duties." },
    { q: "What is complete mediation?", options: ["Every access passes through the required security decision", "Every service is public", "Every log is retained forever", "Every user has MFA"], answer: 0, explanation: "No alternate path may bypass the intended guard." },
    { q: "A policy says backups are tested monthly. What is strongest evidence?", options: ["The policy itself", "A completed restoration record with results and owner", "A vendor brochure", "An assumption"], answer: 1, explanation: "Operational evidence demonstrates the control actually ran and worked." },
    { q: "What should a first-time founder with AppSec experience avoid promising?", options: ["A scoped web assessment", "Threat modeling", "24×7 MDR without staffing and operations", "Secure-development advice"], answer: 2, explanation: "Continuous detection and response is a different, operations-heavy business." },
    { q: "What is the best remediation for repeated authorization defects?", options: ["Hide more buttons", "Centralize server-side policy and add negative regression tests", "Add a firewall only", "Rename the endpoints"], answer: 1, explanation: "Fix the systemic root cause and prevent recurrence." },
    { q: "Which outcome proves a one-week course succeeded?", options: ["Calling yourself an expert", "Producing defensible models, labs, reports and a continued-learning plan", "Owning many tools", "Scanning public sites"], answer: 1, explanation: "The week establishes foundations and evidence of learning, not instant expertise." }
  ],
  glossary: [
    ["Asset", "Anything with value to the organization, including data, services, identities, reputation and operational capability."],
    ["Attack surface", "The set of reachable interfaces, paths and conditions through which a system may be influenced."],
    ["Authentication", "Establishing or verifying the identity of a principal."],
    ["Authorization", "Deciding whether a principal may perform an action on a resource."],
    ["Blue team", "The people and capabilities responsible for preventing, detecting and responding to attacks."],
    ["CIA triad", "Confidentiality, integrity and availability: three common categories of security objectives."],
    ["Complete mediation", "The principle that every access to a protected resource must pass through the intended security check."],
    ["Control", "A safeguard that modifies risk by preventing, detecting, responding to or recovering from an event."],
    ["CORS", "A browser and server mechanism for selectively permitting cross-origin response access."],
    ["CSP", "Content Security Policy, a browser defense-in-depth mechanism that constrains permitted content sources and execution."],
    ["Detection engineering", "The disciplined design, testing, documentation and maintenance of analytics for suspicious behavior."],
    ["EDR", "Endpoint detection and response: telemetry and response capability on endpoint systems."],
    ["Exploit", "Code or a technique that takes advantage of a vulnerability to cause unintended behavior."],
    ["IAM", "Identity and access management: the lifecycle of identities, credentials, roles and permissions."],
    ["Incident", "An occurrence that actually or imminently jeopardizes security objectives or violates security policy."],
    ["Least privilege", "Granting a principal only the permissions required for its defined function."],
    ["MITRE ATT&CK", "A knowledge base and common language for adversary tactics and techniques."],
    ["Penetration test", "An authorized, scoped assessment that manually validates selected weaknesses and their impact."],
    ["Principal", "An entity—such as a user, service or process—whose identity can be authenticated and authorized."],
    ["Purple team", "A collaborative exercise in which offensive and defensive participants test behavior, observe controls and improve them."],
    ["Red team", "An authorized group that emulates an adversary to test an organization's defensive posture and response."],
    ["Risk", "The effect of uncertainty on objectives, commonly evaluated using likelihood and impact in context."],
    ["SIEM", "Security information and event management: centralized event collection, search, correlation and alerting."],
    ["Threat", "A circumstance, event or actor with the potential to cause harm to an asset."],
    ["Threat model", "A structured representation of assets, objectives, adversary capabilities, trust boundaries, threats and controls."],
    ["Trust boundary", "A point where data or authority crosses between components with different trust assumptions."],
    ["Vulnerability", "A weakness that may be exploited to violate a security objective."],
    ["Vulnerability assessment", "A systematic activity for identifying and prioritizing potential weaknesses, often using automation."],
    ["White team", "The group that governs and referees a red/blue exercise, including safety and rules."],
    ["XSS", "Cross-site scripting: attacker-controlled content executing as script in a trusted web origin."]
  ]
};
