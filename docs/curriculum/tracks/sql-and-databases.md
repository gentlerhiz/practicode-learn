# SQL and Databases

*Syllabus v0.1 (draft for practitioner review) · Licensed under CC BY-SA 4.0*

> **Ask real databases questions with SQL, then design, build and protect databases of your own, on real PostgreSQL running in your browser.**

| | |
|---|---|
| **For** | Complete beginners, people who work with spreadsheets and want more, and anyone heading for Data Analysis or back-end development |
| **Prerequisites** | None. IT Fundamentals helps. |
| **Estimated effort** | ~40 hours across 10 modules (about 64 lessons) plus a capstone (≈ 3 months at 4 hours a week) |
| **Tools** | PostgreSQL runs in the browser through PGlite (PostgreSQL compiled to WebAssembly, free and open source). Every lesson gets a fresh practice database, so learners can't break anything, and nothing needs installing. |
| **Primary alignment** | The SQL standard (ISO/IEC 9075), as PostgreSQL implements it |
| **Also aligned to** | ACM CS2023: Data Management · [PostgreSQL documentation](https://www.postgresql.org/docs/current/) · OWASP: SQL injection prevention · data protection law (GDPR as the example) · SFIA 9 level 2 (Assist): DBDS, DTAN |
| **Credential** | PractiCode Learn Certificate: SQL and Databases (Open Badges 3.0) |

## By the end, you can

1. Explain what a database is, how tables store data, and why apps and analysts use them.
2. Write SELECT queries that filter, sort, calculate and summarise data.
3. Combine tables with joins, subqueries and common table expressions.
4. Change data safely with INSERT, UPDATE, DELETE and transactions.
5. Design a relational database from requirements: tables, keys, relationships and normalisation.
6. Build and change schemas with constraints, indexes and views.
7. Make queries faster, prevent SQL injection, and control who can see what.
8. Answer real business questions with window functions and reporting queries.

## Modules

Every module ends with a check and a hands-on project, and includes a *Myth or fact* step on what people commonly get wrong about its topic.

| # | Module | Key outcomes | Standard | Project |
|---|---|---|---|---|
| 1 | **Databases and your first query** · *Free* | Explain what a database is and when to use one; read tables, rows and columns; write SELECT and FROM; choose columns; filter with WHERE; sort and limit results | ISO/IEC 9075: query expressions · CS2023: Data Management | Answer ten questions about a bookshop's stock |
| 2 | **Filtering like a pro** | Combine conditions with AND, OR and NOT; use BETWEEN and IN; search text with LIKE; handle NULL; calculate columns; use CASE | ISO/IEC 9075: predicates | Find the customers a shop should contact |
| 3 | **Summarising data** | Count, sum, average, minimum and maximum; group with GROUP BY; filter groups with HAVING; remove duplicates; work with dates; round results | ISO/IEC 9075: aggregate functions | A sales summary by month and product |
| 4 | **Joining tables** | Explain why data lives in many tables; use primary and foreign keys; write inner and left joins; join three tables; avoid join mistakes | ISO/IEC 9075: joined tables | One report from orders, customers and products |
| 5 | **Subqueries and CTEs** | Use subqueries in WHERE and FROM; write common table expressions; use EXISTS; combine results with UNION; take a first look at window functions | ISO/IEC 9075: subqueries, WITH | Top sellers and repeat customers |
| 6 | **Changing data** | Insert, update and delete rows; group changes in transactions; let constraints protect data; upsert | ISO/IEC 9075: data change statements | Run a stock update safely in a transaction |
| 7 | **Designing a database** | Turn requirements into tables; choose data types; model one-to-many and many-to-many relationships; normalise; draw an ERD | CS2023: Data Management (relational design) | Design a database for a library |
| 8 | **Building and changing schemas** | Create and alter tables; add indexes and views; write migrations; load seed data | ISO/IEC 9075: schema definition | Build the library database, with indexes and a view |
| 9 | **Performance and security** | Read a query plan with EXPLAIN; choose helpful indexes; prevent SQL injection; grant roles and permissions; plan backups; protect personal data | OWASP: SQL injection prevention · GDPR | Speed up slow queries and lock down access |
| 10 | **SQL for analysis** | Use window functions for ranking and running totals; pivot; clean messy data; build cohorts and funnels; write reporting queries | ISO/IEC 9075: window functions | A monthly report with ranking and running totals |
| ★ | **Capstone** | Design, build, fill and query a database for a real small organisation, with the queries for its reports | All | A documented database with the queries for its reports |

## Lessons

Each lesson takes 8–14 minutes and follows the [lesson format](../lesson-format.md).

1. **Databases and your first query** (6): What a database is · Tables, rows and columns · Your first SELECT · Choosing columns · Filtering with WHERE · Sorting and limiting
2. **Filtering like a pro** (7): AND, OR and NOT · Ranges with BETWEEN and IN · Searching text with LIKE · NULL and missing data · Calculated columns · CASE · Common mistakes
3. **Summarising data** (6): COUNT, SUM, AVG, MIN and MAX · GROUP BY · HAVING · DISTINCT · Dates and times · Rounding and formatting
4. **Joining tables** (7): Why data lives in many tables · Primary and foreign keys · INNER JOIN · LEFT JOIN · Joining three tables · Self joins · Join mistakes
5. **Subqueries and CTEs** (6): Subqueries in WHERE · Subqueries in FROM · Common table expressions · EXISTS · UNION and friends · Window functions: a first look
6. **Changing data** (6): INSERT · UPDATE · DELETE · Transactions · Constraints that protect data · Upserts
7. **Designing a database** (7): From requirements to tables · Data types · Keys and relationships · Normalisation · Many-to-many tables · Naming and conventions · Diagrams (ERDs)
8. **Building and changing schemas** (6): CREATE TABLE · ALTER TABLE · Indexes · Views · Migrations · Seed data
9. **Performance and security** (6): How queries run: EXPLAIN · Indexes that help · SQL injection · Users, roles and permissions · Backups · Privacy and data protection
10. **SQL for analysis** (7): Window functions · Ranking and running totals · Pivoting · Cleaning messy data · Cohorts and funnels · Reporting queries · Where to go next

## Labs

- **Where data lives** (Module 1): the same information in a notebook, a spreadsheet and a database.
- **Table anatomy** (Module 1): a table, a column, a row and a primary key.
- **WHERE filter** (Module 1): conditions picking rows out of a table, as you change them.
- **Query order** (Module 1): the order a database runs FROM, WHERE, SELECT, ORDER BY and LIMIT.
- **Filters** (Module 2): AND, OR, NOT, brackets and BETWEEN picking rows from twelve books, with how SQL reads the condition.
- **LIKE patterns** (Module 2): % and _ wildcards, and ILIKE.
- **NULL logic** (Module 2): true, false and unknown, row by row.
- **Calculated columns** (Module 2): a column worked out from others, with AS.
- **CASE** (Module 2): labels from the first true WHEN, and the wrong-order trap.
- **PostgreSQL in the browser** (every module): a fresh practice database for every step, with results drawn as tables and errors in the console.

## Assessment

In-lesson tasks with instant checks, module mastery checks (80% pass mark), projects with automatic checks, and a capstone.

## Device notes

Every module works on a phone. The database takes a few seconds to start the first time, and is cached after that.

## Next steps after this course

Data Analysis (with Python Programming), or Back-End Web Development to use databases in your own apps.
