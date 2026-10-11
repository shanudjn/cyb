window.MIT_LECTURE_DATA = {
  meta: {
    title: "MIT OCW Guided Lecture Studio",
    version: "1.0",
    estimatedHours: 12,
    note: "Chapter links use the official MIT OpenCourseWare YouTube editions. Timestamps are guided jump points and may vary by a few seconds if MIT updates an intro or player edition."
  },
  days: [
    {
      day: 1,
      lecture: "Lecture 1: Introduction, Threat Models",
      instructor: "Prof. Nickolai Zeldovich",
      ocwUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-1-introduction-threat-models/",
      youtubeId: "GqmQg-cszw4",
      goal: "Turn a vague concern into explicit policy, adversary assumptions, mechanisms and evidence.",
      deliverable: "A one-page threat model for a small multi-tenant web application.",
      segments: [
        {
          at: 340,
          title: "How systems-security case studies are analyzed",
          teach: "A security design is not judged by the presence of fashionable controls. Start with the problem, identify what the system promises, state which attacker powers matter, and then ask where the mechanism succeeds or fails. This is the habit that lets an expert transfer lessons between technologies.",
          example: "A SaaS team says its database is encrypted. That fact matters only after we ask which threat it addresses. Disk encryption may help with stolen drives; it does not stop an authenticated service account from querying another tenant's records.",
          task: "Write four headings for your own app: promise, protected asset, attacker capability and enforcing mechanism. Put one concrete sentence below each.",
          solution: "Example: Promise—one tenant cannot read another's invoices. Asset—invoice records and attachments. Attacker—an ordinary authenticated tenant who can alter request identifiers. Mechanism—server-side tenant-scoped authorization on every invoice query."
        },
        {
          at: 690,
          title: "Policy: say what must remain true",
          teach: "A policy describes acceptable outcomes. Confidentiality limits disclosure, integrity limits unauthorized change and availability protects intended use. Useful policies name the principal, action and object instead of saying only that the application must be secure.",
          example: "“Only payroll staff may change a salary record” is testable. “Protect payroll” is not. The first statement identifies the actor, operation and protected object, so a reviewer can trace it to code and tests.",
          task: "Rewrite “customer data must be secure” as one confidentiality rule, one integrity rule and one availability rule.",
          solution: "Confidentiality—only members of the owning tenant may read its customer records. Integrity—only billing administrators may change payment status. Availability—the checkout API must continue serving legitimate traffic during a single-zone failure."
        },
        {
          at: 1120,
          title: "Threat models are explicit assumptions",
          teach: "A threat model defines what the adversary can observe, control or compromise. If an assumption remains hidden, a design can appear correct while protecting against the wrong attacker. Scope also matters: a mechanism can be secure under one model and inadequate under another.",
          example: "HTTPS assumes the endpoint is trustworthy enough to handle plaintext. If the browser extension, server process or administrator account is compromised, transport protection alone does not preserve the data.",
          task: "For a password-reset flow, list three attacker capabilities you will consider and one capability you deliberately exclude from the first review.",
          solution: "Consider control of an ordinary account, access to leaked old passwords and the ability to send many reset attempts. Initially exclude full compromise of the email provider, state that exclusion, and revisit it in a broader identity review."
        },
        {
          at: 1830,
          title: "Mechanisms, bugs and composition",
          teach: "Security mechanisms enforce policy, but implementations and interactions create failure modes. Authentication, authorization, isolation and cryptography solve different problems. A design is only as strong as the complete path through which an action reaches an asset.",
          example: "The API checks authorization, but an asynchronous export worker trusts a tenant ID inside a queue message. The worker creates a bypass because the same policy is not mediated on that path.",
          task: "Take one protected object and enumerate every path that can read or modify it: UI, API, job, admin tool, database and backup. Mark the guard on each path.",
          solution: "A strong result names a concrete guard for every path. Any blank row is a design question; “internal” is not itself a control."
        },
        {
          at: 2780,
          title: "From failure story to verification",
          teach: "A threat becomes actionable when it produces a test. State the precondition, attacker action, expected secure result and evidence. Negative tests are especially important because successful happy paths rarely prove isolation or authorization.",
          example: "Alice creates invoice 81. Bob requests invoice 81 using his own valid session. The expected result is a generic denial with no invoice metadata, and the audit event should identify the denied actor and object.",
          task: "Write one negative test for your highest-priority threat, including expected response and logging evidence.",
          solution: "Example: a standard user calls the admin role-change endpoint; expect 403, no state change, and an audit event recording actor, target, action and denial reason without storing secrets."
        }
      ]
    },
    {
      day: 2,
      lecture: "Lecture 6: Capabilities",
      instructor: "Prof. Nickolai Zeldovich",
      ocwUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-6-capabilities/",
      youtubeId: "TQhmua7Z2cY",
      goal: "Understand authority as something deliberately granted, delegated and revocable.",
      deliverable: "A least-authority redesign of one backend or CI/CD component.",
      segments: [
        {
          at: 300,
          title: "Authority, identity and access-control models",
          teach: "Identity answers who is acting; authority answers what the actor can do. Access-control lists begin from an object and enumerate principals. Capability systems begin from a principal holding an unforgeable reference that conveys specific authority.",
          example: "A cloud storage ACL says which identities may read a bucket. A pre-signed URL behaves more like a time-limited capability: possession grants a narrow operation without giving the holder general bucket credentials.",
          task: "Classify an API key, Unix file descriptor, JWT and pre-signed download URL as identity evidence, capability-like authority, or context-dependent.",
          solution: "An API key is often both identity and broad authority; a file descriptor is capability-like; a JWT depends on validated claims and server policy; a pre-signed URL is a bearer capability bounded by method, object and expiry."
        },
        {
          at: 780,
          title: "The confused-deputy problem",
          teach: "A deputy has authority that a requester lacks. Confusion occurs when it uses its own authority on behalf of an untrusted requester without correctly binding the request to the requester's permitted object. The flaw is about authority selection, not merely missing authentication.",
          example: "An image-conversion service can read every tenant bucket. A user supplies an arbitrary object path, and the service reads it with its global role. The service has become a confused deputy.",
          task: "Redesign the converter so the caller cannot choose an object outside its tenant.",
          solution: "Give the job a short-lived, object-specific read capability produced only after tenant authorization, and a separate narrow write capability for the output path. Avoid passing a global storage role to the worker."
        },
        {
          at: 1510,
          title: "Delegation and least authority",
          teach: "Capabilities make delegation concrete: a component can pass exactly the reference needed for a task. Good designs narrow authority by operation, resource, lifetime and propagation. This limits blast radius when a component is compromised.",
          example: "A deployment job needs to publish one artifact version. It should receive permission to write that version to one registry path, not administrator access to every repository and production cluster.",
          task: "Create an authority budget for a build job: resources, operations, duration and whether it may delegate.",
          solution: "Read the checked-out source and declared dependencies; write one build workspace and one versioned registry path; valid for the job duration; no permission to change repository settings, secrets or production workloads."
        },
        {
          at: 2320,
          title: "Revocation, naming and ambient authority",
          teach: "Ambient authority is available simply because code runs in a context, making unintended use easy. Explicit authority is easier to review. Revocation can be difficult when capabilities have been copied, so designs often add indirection, short expiry or a revocation check.",
          example: "A serverless function inherits a role that can list all secrets although it needs one database credential. Any injected code automatically gains that ambient power.",
          task: "Find one ambient authority in your development environment and propose a narrower replacement.",
          solution: "Replace a long-lived cloud administrator profile in CI with workload identity that issues short-lived credentials limited to the exact deployment resources."
        },
        {
          at: 3270,
          title: "Applying capability thinking to ordinary systems",
          teach: "You do not need a pure capability operating system to use capability reasoning. File descriptors, scoped tokens, object handles, cloud roles and signed URLs can all reduce authority when issued after policy checks and kept narrow.",
          example: "A frontend should not receive a master object-store credential. The backend authorizes the user and returns a single-object upload URL with content-type, size and expiry restrictions.",
          task: "Redesign one endpoint so it issues a narrow capability instead of proxying a broadly privileged action.",
          solution: "For avatar upload, authorize the account, generate a unique destination key, issue a five-minute upload URL restricted to that key and MIME type, then validate the completed object before publishing it."
        }
      ]
    },
    {
      day: 3,
      lecture: "Lecture 8: Web Security Model",
      instructor: "Prof. James Mickens",
      ocwUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-8-web-security-model/",
      youtubeId: "eRJ_r8WF1Y0",
      goal: "Reason precisely about browser principals, origins, cookies and cross-origin composition.",
      deliverable: "A browser trust-boundary map and secure cross-origin design for a frontend.",
      segments: [
        {
          at: 120,
          title: "Why the browser is a security operating system",
          teach: "A browser runs mutually distrusting code while holding credentials and rendering data from many sites. Its job is not merely displaying pages; it isolates principals, mediates reads and writes, and exposes controlled composition mechanisms.",
          example: "A banking tab and an attacker-controlled tab share one browser process family and network stack, yet the attacker must not read the bank DOM or responses.",
          task: "List the browser-held assets in a logged-in SaaS session and the principals that might try to reach them.",
          solution: "Assets include DOM data, cookies, local storage, cached responses, camera permission and session-bound actions. Principals include the application origin, third-party scripts, extensions, embedded frames and other tabs."
        },
        {
          at: 760,
          title: "Origin: scheme, host and port",
          teach: "The same-origin policy commonly identifies a principal using scheme, host and port. Paths do not create separate origins. Two applications on the same origin therefore share a security boundary even if different teams own them.",
          example: "https://app.example.com/a and /b are same-origin. http://app.example.com, https://api.example.com and https://app.example.com:8443 are different origins.",
          task: "Compare five URLs from one of your projects and group them by origin.",
          solution: "Group only URLs with exactly the same scheme, host and effective port. Treat path, query and fragment as irrelevant to origin identity."
        },
        {
          at: 1570,
          title: "Same-origin policy and its asymmetries",
          teach: "Cross-origin embedding, sending and reading follow different rules. A page may often send a request or embed a resource while being unable to read the response. Cookies may still accompany requests, which is why CSRF exists even when response reads are blocked.",
          example: "An attacker page submits a form to a bank. The browser may attach the bank cookie even though the attacker cannot read the response. The bank must require an unguessable anti-CSRF value or rely on an appropriately designed same-site interaction.",
          task: "For image, form, fetch and script requests, predict whether another origin can send, embed or read the result.",
          solution: "The exact matrix has exceptions, but the key lesson is to test each operation separately. CORS governs selected response reads; it does not stop ordinary cross-site form submission."
        },
        {
          at: 2580,
          title: "Cookies, authentication and confused boundaries",
          teach: "Cookies are scoped primarily by domain and path rules, not by port. They are automatically sent, so cookie-based sessions require deliberate Secure, HttpOnly and SameSite settings plus server-side authorization. Subdomains can become part of the trust boundary.",
          example: "A vulnerable marketing subdomain that can set a parent-domain cookie may interfere with authentication on the main application. Hosting untrusted content under powerful parent domains expands risk.",
          task: "Inspect one session cookie in a system you own. Record Domain, Path, Secure, HttpOnly, SameSite and expiry; explain the risk of each current value.",
          solution: "A strong baseline often uses a host-only Secure and HttpOnly cookie, an intentional SameSite mode, a narrow lifetime and rotation after privilege changes. Requirements may differ for federated login flows."
        },
        {
          at: 3660,
          title: "Safe cross-origin composition",
          teach: "CORS, postMessage and frames enable composition but require explicit receiver checks. The receiving side must validate the sender origin and message shape. A wildcard is appropriate only when the data is genuinely public and no credentialed trust is implied.",
          example: "A payment iframe posts a success message. The parent must check event.origin against the exact provider origin and validate the transaction identifier against server state.",
          task: "Write secure pseudocode for a postMessage receiver used by an embedded identity widget.",
          solution: "Check event.origin against an allowlist, optionally check event.source, parse a versioned schema, reject unexpected fields, never evaluate message text as code and confirm the asserted result with the backend."
        }
      ]
    },
    {
      day: 4,
      lecture: "Lecture 14: SSL and HTTPS",
      instructor: "Prof. Nickolai Zeldovich",
      ocwUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-14-ssl-and-https/",
      youtubeId: "q1OF_0ICt9A",
      goal: "Connect cryptographic primitives to the guarantees and failure modes of HTTPS.",
      deliverable: "A TLS trust narrative for one production-style web request.",
      segments: [
        {
          at: 120,
          title: "Transport threat model and security goals",
          teach: "Assume the network can observe, inject, modify, replay and drop traffic. A secure channel aims to authenticate the intended peer and protect confidentiality and integrity. It cannot force availability when an attacker can drop every packet.",
          example: "Coffee-shop Wi-Fi can redirect packets and present a fake server. HTTPS should cause the connection to fail unless the attacker can present a certificate trusted for the requested hostname.",
          task: "Write which of confidentiality, integrity, authentication and availability HTTPS provides for one API call.",
          solution: "It protects confidentiality and integrity in transit and authenticates the server under the browser's trust model. Client authentication is separate, and the network can still deny service."
        },
        {
          at: 780,
          title: "Symmetric encryption, MACs and public keys",
          teach: "Symmetric cryptography is efficient for bulk data. Integrity requires an authenticated construction, not encryption alone. Public-key mechanisms help establish identity and shared secrets, after which symmetric keys protect the session.",
          example: "Encrypting a message without authentication may allow controlled modification. Modern protocols use authenticated encryption so tampering is detected before plaintext is accepted.",
          task: "Explain why hashing a message is not enough to authenticate it over an attacker-controlled network.",
          solution: "The attacker can modify the message and compute a new unkeyed hash. Authentication needs a secret-key MAC or a verified digital signature, used correctly in a protocol."
        },
        {
          at: 1590,
          title: "Handshake, certificates and hostname validation",
          teach: "The handshake negotiates parameters, authenticates the server certificate chain and derives session keys. Correct clients verify the chain, validity period, hostname and protocol state. Skipping any check can restore man-in-the-middle risk.",
          example: "A mobile app accepts any certificate because a developer disabled validation during testing. Encryption still occurs, but it protects the connection to whoever intercepted it.",
          task: "Use browser certificate details on a site you control. Identify subject names, issuer, validity and public-key algorithm.",
          solution: "Confirm that the requested hostname appears in the subject alternative names, the current time falls within validity, and the chain terminates at a locally trusted root."
        },
        {
          at: 2550,
          title: "The certificate-authority trust model",
          teach: "Browsers trust many roots, and any suitable trusted CA can generally issue for a hostname after validation. This scales globally but creates ecosystem risk. Certificate Transparency, revocation mechanisms and operational controls improve detection and response without making trust trivial.",
          example: "A mistakenly issued certificate may pass ordinary validation. Public CT logs let domain owners and monitors discover unexpected issuance and respond.",
          task: "Document who could issue certificates for your domain and how you would detect unexpected issuance.",
          solution: "Use CAA to express intended issuers where appropriate, monitor Certificate Transparency, protect DNS and registrar accounts, automate renewal and maintain a revocation/replacement procedure."
        },
        {
          at: 3600,
          title: "Integrating HTTPS into the browser security model",
          teach: "Cryptography can work while application integration fails. Mixed content, insecure redirects, weak cookie flags and user-interface confusion can undermine the secure channel. HSTS and secure defaults reduce downgrade opportunities.",
          example: "A login page loads JavaScript over HTTP. An on-path attacker replaces the script and steals credentials before the HTTPS form submission.",
          task: "Create a five-item HTTPS review checklist for a frontend deployment.",
          solution: "Redirect HTTP safely, enable suitable HSTS after validation, load every active resource over HTTPS, use Secure cookies, avoid certificate-error bypasses and verify TLS at each proxy-to-origin hop."
        }
      ]
    },
    {
      day: 5,
      lecture: "Lecture 12: Network Security",
      instructor: "Prof. Nickolai Zeldovich",
      ocwUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-12-network-security/",
      youtubeId: "BZTWXl9QNK8",
      goal: "Translate network attacks into observable behavior and useful defensive telemetry.",
      deliverable: "A network detection hypothesis with data requirements and triage steps.",
      segments: [
        {
          at: 180,
          title: "An active network attacker",
          teach: "A realistic hostile-network model includes eavesdropping, injection, modification, replay, dropping and participation from attacker-controlled hosts. Defensive design should state which positions and capabilities are in scope instead of assuming that internal traffic is trustworthy.",
          example: "An attacker need not sit directly on a cable if routing, DNS, Wi-Fi or a compromised proxy gives equivalent influence over traffic.",
          task: "Draw a client-to-service path and mark three positions from which traffic could be observed or altered.",
          solution: "Examples include the local network, recursive DNS provider, edge proxy, compromised endpoint and service mesh. Note which controls and logs exist at each point."
        },
        {
          at: 820,
          title: "TCP state and spoofing assumptions",
          teach: "TCP was designed for reliable delivery, not endpoint identity. Sequence numbers and connection state make blind spoofing harder when unpredictable, but they do not cryptographically authenticate the peer. Protocol defenses must match the attacker position.",
          example: "Randomized sequence numbers reduce an off-path attack, but an on-path attacker who sees the connection can still observe valid state and inject unless a higher layer authenticates traffic.",
          task: "Contrast what an off-path attacker and an on-path attacker can learn during a TCP connection.",
          solution: "The off-path attacker must guess addresses, ports and sequence state; the on-path attacker can observe them. TLS is needed when application identity and message integrity matter."
        },
        {
          at: 1550,
          title: "Denial of service and asymmetric cost",
          teach: "Many denial-of-service attacks exploit cost asymmetry: the defender allocates more state or computation than the attacker spends. Defenses include delaying allocation, proving reachability, bounding work, rate limiting and distributing capacity.",
          example: "A service performs an expensive password hash before checking a cheap rate-limit token. Attackers can turn a desirable password defense into a compute-exhaustion path.",
          task: "Find one endpoint where unauthenticated input triggers costly work. Put cheap rejection steps before expensive ones.",
          solution: "Apply coarse rate and size limits, validate syntax and account state, then perform expensive cryptography. Preserve fairness and avoid exposing account-existence signals."
        },
        {
          at: 2580,
          title: "Protocol evolution and legacy assumptions",
          teach: "Protocols often outgrow their original environment. Compatibility pressures preserve behaviors that no longer fit the modern threat model. Security engineers must find inherited assumptions and add protection without assuming a clean redesign is deployable.",
          example: "A service trusts source IP because it began on a private network. Reverse proxies, cloud routing and attacker-controlled workloads later make that identity assumption unsafe.",
          task: "Identify one legacy trust assumption in an application protocol you use and propose a migration path.",
          solution: "Replace source-network trust with workload identity and authenticated channels, deploy alongside the old mechanism, instrument both, migrate clients, then remove the fallback."
        },
        {
          at: 3600,
          title: "From packets to detection hypotheses",
          teach: "Telemetry is valuable when it answers a question. Define suspicious behavior, required fields, benign alternatives, correlation keys and a response. Packet data alone lacks user and asset context; application logs alone may miss network manipulation.",
          example: "Repeated incomplete handshakes from distributed sources may indicate resource exhaustion, but a flash crowd or faulty client can look similar. Correlate rates, completion ratios, geography, service health and deployment changes.",
          task: "Write a detection hypothesis for suspicious connection behavior and list the minimum fields required.",
          solution: "Hypothesis: a sharp per-service rise in connection starts with falling handshake completion and many source networks may indicate a SYN-style flood. Required fields include time, source/destination, flags or handshake state, service, rate baseline and capacity indicators."
        }
      ]
    },
    {
      day: 6,
      lecture: "Lecture 17: User Authentication",
      instructor: "Prof. James Mickens",
      ocwUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-17-user-authentication/",
      youtubeId: "MT7X17ZRo1U",
      goal: "Assess authentication as an end-to-end system shaped by cryptography, deployment and people.",
      deliverable: "An authentication assessment plan covering storage, recovery, sessions and abuse resistance.",
      segments: [
        {
          at: 180,
          title: "Authentication factors and system boundaries",
          teach: "Authentication evidence may be something known, possessed or inherent, but the final assurance depends on enrollment, recovery, device security and server handling. Adding factors does not help if a weaker recovery path bypasses them.",
          example: "A hardware-backed login is undermined when support agents can remove it after answering publicly discoverable questions.",
          task: "Map every path that can create or regain an authenticated session in a system you use.",
          solution: "Include signup, password login, SSO, remembered device, reset email, backup code, help desk, administrator impersonation and API-token creation. Assess the weakest path."
        },
        {
          at: 820,
          title: "Online and offline password guessing",
          teach: "Online guessing can be observed and throttled; an offline attacker with a stolen verifier can test guesses without contacting the service. Password storage must therefore use unique salts and a deliberately expensive, current password-hashing function.",
          example: "Fast unsalted SHA-256 lets an attacker test huge dictionaries and reuse work across users. A unique salt prevents shared precomputation; a memory-hard function increases per-guess cost.",
          task: "Explain what changes after a password database is stolen and which controls still matter.",
          solution: "Online rate limits no longer constrain guessing. Hash choice, cost, unique salts, password strength, optional protected pepper, rapid detection, forced resets and session/token review become important."
        },
        {
          at: 1730,
          title: "Salts, slow hashes and migration",
          teach: "Parameters age as hardware improves. Store algorithm and cost metadata so verifiers can be upgraded. Rehash after a successful login or use a controlled migration. Do not invent a password scheme from general-purpose hashes.",
          example: "A database can hold Argon2id records with per-user salts and parameters. When policy changes, successful verification triggers a new record using stronger parameters.",
          task: "Write a password-storage record schema and an upgrade rule without storing plaintext.",
          solution: "Store user ID, algorithm version, parameters, salt and derived hash. On login, verify with stored metadata; if parameters are obsolete, derive and store a fresh record after successful authentication."
        },
        {
          at: 2700,
          title: "Usability and deployability are security properties",
          teach: "An authentication method that users cannot recover, organizations cannot deploy or clients do not support may be bypassed or abandoned. Evaluate security, usability and deployability together, including failure modes.",
          example: "A stronger protocol can lose to passwords if it breaks legacy clients and recovery. The practical design needs staged rollout, device enrollment, accessible backup and signals for risky exceptions.",
          task: "Compare passwords plus TOTP, passkeys and recovery codes across security, usability and deployment.",
          solution: "Passkeys strongly resist phishing but require platform and recovery planning. TOTP improves over password-only but can be phished. Recovery codes help availability but become bearer secrets that need secure storage."
        },
        {
          at: 3700,
          title: "Assess the lifecycle, not only the login form",
          teach: "A professional assessment examines enrollment, authentication, session creation, step-up, credential change, recovery, revocation and audit. It also considers enumeration, automation, phishing resistance and administrative override.",
          example: "Login is rate-limited, but the password-reset endpoint reveals registered emails and sends unlimited messages. The lifecycle has privacy and abuse failures outside the main form.",
          task: "Build ten tests for an authentication lifecycle using controlled accounts only.",
          solution: "Include enumeration resistance, rate controls, MFA enrollment/change, reset-token entropy and expiry, session rotation, concurrent-session visibility, logout/revocation, privilege step-up, recovery audit events and admin override controls."
        }
      ]
    },
    {
      day: 7,
      lecture: "Lecture 23: Security Economics",
      instructor: "Prof. James Mickens",
      ocwUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/resources/lecture-23-security-economics/",
      youtubeId: "8PdnOZI7H5E",
      goal: "Use incentives and attacker economics to prioritize controls and design a credible security service.",
      deliverable: "A business-case memo for one security investment and one narrowly scoped consulting offer.",
      segments: [
        {
          at: 150,
          title: "Ask why the attacker acts",
          teach: "Technical feasibility does not explain attacker choice. Motivation, cost, expected return and risk shape which targets and methods receive attention. Some attackers are not economically motivated, so incentive-based defenses complement rather than replace technical controls.",
          example: "Two equally vulnerable services may face different attack rates if one exposes easily monetized accounts and the other yields data that is hard to resell.",
          task: "For one product, list three attacker goals and how each goal creates value for the attacker.",
          solution: "Examples: account resale, payment fraud and extortion through service disruption. Tie each to a concrete asset and path to value."
        },
        {
          at: 780,
          title: "The attack ecosystem is a supply chain",
          teach: "Abuse often involves specialization: access brokers, infrastructure providers, distributors, payment processors and sellers. Mapping the chain reveals dependencies and intervention points that a vulnerability-only view misses.",
          example: "A spam campaign depends on compromised accounts, message delivery, landing pages, payment processing and fulfillment. Removing one replaceable server may have little lasting effect.",
          task: "Draw the supply chain for credential-stuffing fraud from stolen credentials to monetization.",
          solution: "Credential source → testing infrastructure → successful accounts → inventory/valuation → buyer or fraud operator → cash-out. Add defenders and evidence sources at each transition."
        },
        {
          at: 1590,
          title: "Measure conversion, cost and bottlenecks",
          teach: "Tiny conversion rates can still support abuse at large scale when marginal sending cost is low. Defenders should identify the bottleneck with the greatest combination of impact, durability and acceptable collateral cost.",
          example: "Blocking one sender is cheap for the attacker to evade. Strong payment-provider action or account-takeover prevention may affect the business model more deeply, but each has operational tradeoffs.",
          task: "Create a simple attacker-profit equation and identify which variable your control changes.",
          solution: "Profit = successful conversions × value per conversion − acquisition, infrastructure, labor and disruption costs. MFA may reduce conversions; takedowns raise infrastructure cost; fraud recovery can reduce realized value."
        },
        {
          at: 2680,
          title: "Externalities and misaligned incentives",
          teach: "Security costs and harms often fall on different parties. A vendor may underinvest when customers or society bear breach costs. Contracts, regulation, insurance, transparency and product design can realign incentives, but each can also create unintended behavior.",
          example: "A cheap connected device ships with weak update support. The owner enjoys the feature while third parties absorb botnet traffic. The manufacturer may lack a direct reason to fund long-term patching.",
          task: "Identify one security externality in a SaaS product and propose a measurable incentive change.",
          solution: "If customers create risky public links while support handles incidents, show risk at creation, set safe defaults, expire unused links and make link exposure visible to administrators through a dashboard and audit API."
        },
        {
          at: 3780,
          title: "Apply economics to a security company",
          teach: "A credible security company sells reduced uncertainty and improved decisions, not fear or a promise of perfect safety. Scope must match capability; delivery quality, evidence protection and independent review are part of the service's security model.",
          example: "A frontend engineer can credibly begin with web architecture reviews, threat modeling and authorization testing. Claiming mature 24×7 incident response without staffing transfers dangerous operational risk to clients.",
          task: "Write a one-sentence offer, named buyer, measurable output and explicit exclusion for your first service.",
          solution: "Offer: a two-week web/API authorization review for seed-stage SaaS engineering leaders, producing a threat model, verified findings, regression tests and remediation workshop; excludes production exploitation, social engineering and continuous monitoring."
        }
      ]
    }
  ]
};
