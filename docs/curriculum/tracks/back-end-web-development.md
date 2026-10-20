# Back-End Web Development

*Syllabus v0.1 (draft for practitioner review) · Licensed under CC BY-SA 4.0*

> **Build the server side of apps with Node.js, Express and PostgreSQL: APIs people can use, databases that keep data safe, sign-in, security, tests, and putting it all online.**

| | |
|---|---|
| **For** | Complete beginners who have never written code, and Front-End learners who want to build the server side of their apps |
| **Prerequisites** | None. The course teaches JavaScript from zero. IT Fundamentals helps, and Front-End graduates will find Modules 2 and 3 a quick revision. |
| **Estimated effort** | ~140 hours across 15 modules (about 113 lessons) plus a capstone (≈ 7–9 months at 4–5 hours a week) |
| **Tools** | Modules 1–4 and every lab run in the browser: a simulated server, a practice API and a terminal. From Module 5, learners also install Node.js (free and open source) on a laptop. PostgreSQL runs in the browser through PGlite (free and open source), so no database server is needed. |
| **Primary alignment** | [MDN Learn: server-side website programming](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side), including its Express (Node.js) tutorial |
| **Also aligned to** | [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/) · the OpenJS Foundation's Node.js Application Developer (JSNAD) exam domains · HTTP Semantics ([RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)) · [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) · [The Twelve-Factor App](https://12factor.net) · ACM CS2023 (data management, security) · SFIA 9 level 2 (Assist): PROG, DBDS, TEST |
| **Credential** | PractiCode Learn Certificate: Back-End Web Development (Open Badges 3.0) |

## By the end, you can

1. Explain how clients, servers, APIs and databases work together, and read any HTTP request and response.
2. Write JavaScript on the server, including asynchronous code with promises and async/await.
3. Work from the command line and keep your code in Git and GitHub.
4. Build servers and REST APIs with Node.js and Express, with routing, middleware and good error handling.
5. Design APIs other developers can use: clear resources, validated input, helpful errors, pagination and OpenAPI documentation.
6. Design a relational database, write SQL, and connect your API to PostgreSQL safely.
7. Build sign-up, sign-in, sessions, password reset and role-based permissions.
8. Find and fix the most common API security problems, from the OWASP API Security Top 10.
9. Write TypeScript on the server, and test your API automatically.
10. Add caching, background jobs, email, webhooks and payments, and run your API in production with logs and monitoring.

## Modules

Every module ends with a check and a hands-on project, and includes a *Myth or fact* step on what people commonly get wrong about its topic. Each project adds a new skill rather than repeating the last one.

| # | Module | Key outcomes | Standard | Project |
|---|---|---|---|---|
| 1 | **How the back end works** · *Free* | Explain what the back end does; tell clients from servers; read IP addresses, ports and DNS; read and build HTTP requests; read status codes; read JSON and API documentation; change a working route | MDN: Server-side first steps · RFC 9110 | Map the back end of an app you use every day |
| 2 | **JavaScript basics** | Store values in variables; work with numbers, strings and booleans; make decisions; write functions; use arrays, loops and objects; read error messages | MDN: JavaScript first steps | A price calculator for a café's orders |
| 3 | **JavaScript for real programs** | Use map, filter and find; destructure and spread; split code into modules; handle errors; write callbacks, promises and async/await; parse and produce JSON | MDN: JavaScript building blocks · JSNAD: Control flow, Error handling | A records processor that reads, cleans and summarises orders |
| 4 | **The command line, Git and GitHub** | Move around the file system in a terminal; run programs; commit, branch and merge; open a pull request; write a README and a .gitignore | MDN: Version control | A documented repository with a clean history |
| 5 | **Node.js and your first server** | Explain what Node.js is; use npm and package.json; read and write files; use environment variables; explain the event loop; build a server with the built-in http module | JSNAD: Node.js CLI, File system, Events, Process | A server with no framework that answers three routes |
| 6 | **Express: routes and middleware** | Set up an Express app; read route parameters, query strings and bodies; write and order middleware; handle errors in one place; serve files and set CORS | MDN: Express web framework | A café menu API that can create, read, update and delete |
| 7 | **Designing APIs people can use** | Model resources with REST; choose methods and status codes; validate input with Zod; write error responses people can act on; paginate, filter and sort; version an API; document it with OpenAPI | RFC 9110 · OpenAPI 3.1 | A documented bookings API with validation and pagination |
| 8 | **Databases and SQL** | Explain why apps need databases; design tables with keys and constraints; query with SELECT, joins and grouping; change data safely; normalise; use indexes and transactions | ACM CS2023: Data management | A database for a learning platform, with the queries for its reports |
| 9 | **Connecting your API to a database** | Connect Node.js to PostgreSQL; use parameterised queries to stop SQL injection; keep database code in one place; run migrations; use transactions from code; handle database errors; know when to use a query builder | MDN: Express database tutorial · OWASP: Injection | Move the bookings API from memory to PostgreSQL |
| 10 | **Sign-in and passwords** | Tell authentication from authorisation; hash passwords; build sign-up and sign-in; use sessions and cookies; explain tokens and their limits; reset passwords by email; rate-limit sign-in | OWASP API2: Broken authentication | Sign-up, sign-in and password reset for the bookings API |
| 11 | **Permissions and security** | Build role-based permissions; prevent broken access control; apply the OWASP API Security Top 10; handle input safely; defend against XSS and CSRF; keep secrets out of code; log without leaking personal data | OWASP API Security Top 10 | Find and fix the holes in a deliberately broken API |
| 12 | **TypeScript on the server** | Explain what types catch; write types, interfaces and unions; use generics; narrow types in strict mode; type Express handlers; infer types from Zod schemas | SFIA 9: PROG | Convert the bookings API to TypeScript |
| 13 | **Testing your API** | Write unit tests with Vitest; test endpoints end to end; test errors, sign-in and permissions; manage test data; write a test first | SFIA 9: TEST | A test suite that proves the bookings API works |
| 14 | **Real-world back ends** | Cache responses; run background jobs; send email; receive webhooks safely, including the same one twice; take payments with a simulated provider; accept file uploads; push updates with WebSockets; explain monoliths, services and scaling | OWASP API4: Unrestricted resource consumption · RFC 6455 | Add payments and email receipts to the bookings API |
| 15 | **Going live** | Separate development, test and production; manage configuration and secrets; add logs, health checks and monitoring; run tests on every push; deploy an API; plan backups and rollbacks | The Twelve-Factor App | Run your API in production mode, with checks and monitoring |
| ★ | **Capstone** | Plan, build, test, document and run the back end of a small learning platform: courses, lessons, enrolments, quizzes, progress and roles | All | A learning-platform API with sign-in, roles, tests and documentation |

## Lessons

Each lesson takes 8–14 minutes and follows the [lesson format](../lesson-format.md).

1. **How the back end works** (6): What the back end does · Clients, servers, addresses and ports · Requests: methods, paths, headers and bodies · Status codes and responses · JSON and API documentation · Your first route
2. **JavaScript basics** (8): Values and variables · Numbers, strings and booleans · Making decisions with if · Functions · Arrays · Loops · Objects · Reading error messages
3. **JavaScript for real programs** (8): Array methods: map, filter and find · Destructuring and spread · Modules: import and export · Errors: throw, try and catch · Callbacks · Promises · async and await · Working with JSON
4. **The command line, Git and GitHub** (7): The terminal and the file system · Running programs from the terminal · Why version control · Commits and history · Branches and merging · GitHub and pull requests · README files and .gitignore
5. **Node.js and your first server** (8): What Node.js is · npm and package.json · Reading and writing files · Environment variables · The event loop · The built-in http module · Routing by method and path · Serving JSON
6. **Express: routes and middleware** (8): Why Express · Your first Express app · Route parameters and query strings · Reading request bodies · Middleware · The order middleware runs in · Errors and the error handler · Serving files and CORS
7. **Designing APIs people can use** (8): Resources and REST · Choosing methods and status codes · Validating input with Zod · Error responses people can act on · Pagination · Filtering, sorting and search · Versioning and changes · Documenting with OpenAPI
8. **Databases and SQL** (8): Why apps need databases · Tables, rows and keys · SELECT, WHERE and ORDER BY · INSERT, UPDATE and DELETE · Joins · Grouping and totals · Designing tables: normalisation · Indexes and transactions
9. **Connecting your API to a database** (7): Connecting Node to PostgreSQL · Parameterised queries and SQL injection · Keeping database code in one place · Migrations · Transactions from code · Handling database errors · Query builders and ORMs
10. **Sign-in and passwords** (8): Authentication and authorisation · Storing passwords: hashing · Registering and signing in · Sessions and cookies · Tokens and JWTs, and their limits · Signing out and expiring sessions · Password reset by email · Rate limiting and lockouts
11. **Permissions and security** (8): Roles and permissions · Broken access control · The OWASP API Security Top 10 · Injection and input handling · Cross-site attacks: XSS and CSRF · Secrets and configuration · Security headers and dependency checks · Privacy and logging safely
12. **TypeScript on the server** (7): Why types · Types, interfaces and unions · Functions and generics · Narrowing and strict mode · Typing Express handlers · Zod schemas and inferred types · Moving a project to TypeScript
13. **Testing your API** (7): Why test · Unit tests with Vitest · Testing endpoints · Testing the unhappy paths · Testing sign-in and permissions · Test data and test databases · Test first: a taste of TDD
14. **Real-world back ends** (8): Caching · Background jobs and queues · Sending email · Webhooks · Taking payments safely · File uploads · Real-time with WebSockets · Monoliths, services and scaling
15. **Going live** (7): Development, test and production · Configuration and secrets in production · Logs, health checks and monitoring · Continuous integration · Deploying your API · Backups and rollbacks · Where to go next

## Labs

- **The back end of a shop** (Module 1): one tap on Buy, followed through the server, the database and the payment.
- **Front end or back end?** (Module 1): sort an app's jobs between the two.
- **Client and server** (Module 1): a phone finding a server by name, address and port.
- **Request builder** (Module 1): real requests to a practice café API, with the full request and response.
- **Status codes** (Module 1): what each code means, and whose problem it is.
- **JSON shapes** and **API documentation** (Module 1): reading data and the docs that describe it.
- **Simulated server** (Modules 1, 5–7): write routes in the browser, send them requests, and see the replies, before installing anything.
- **Database in the browser** (Modules 8–9): real PostgreSQL through PGlite.
- **Broken API** (Module 11): a deliberately insecure API to attack and fix, safely, inside the page.
- **Simulated inbox and payment provider** (Modules 10 and 14): password-reset emails, receipts and webhooks without a real email or payment account.

## Assessment

In-lesson tasks with instant checks, module mastery checks (80% pass mark), projects with automatic checks, and a capstone.

## Device notes

Modules 1–4 work on a phone. From Module 5, learners need a laptop or desktop to install Node.js; the labs still run in the browser. Going live (Module 15) uses an optional free hosting tier, chosen when that module is written; the capstone can always run on the learner's own laptop.

## Next steps after this course

JavaScript in Depth (advanced), or SQL and Databases to go further with data.
