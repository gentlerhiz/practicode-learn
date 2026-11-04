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
- **Aggregates** (Module 3): twelve values folding into one answer, with NULLs skipped or counted.
- **GROUP BY** (Module 3): rows sorted into piles, each folding into one row.
- **WHERE and HAVING** (Module 3): a grouped query run clause by clause, filtering rows and then groups.
- **DISTINCT** (Module 3): repeated rows crossed out, one column or several.
- **Dates** (Module 3): pulling dates apart, writing them your way and doing sums in days.
- **Rounding** (Module 3): the same values through ROUND, CEIL, FLOOR and TO_CHAR.
- **One table or many** (Module 4): a flat sheet drifting apart, then split into linked tables.
- **Keys** (Module 4): following an order's foreign key to its customer.
- **Join steps** (Module 4): an inner join built row by row.
- **Join compare** (Module 4): INNER JOIN, LEFT JOIN and the rows with no match.
- **Join chain** (Module 4): four tables joined one at a time, following one order through.
- **Self join** (Module 4): one table read twice, as staff and as managers.
- **Join traps** (Module 4): five joins that run without an error and give the wrong answer.
- **Subqueries, FROM and WITH** (Module 5): an inner query's answer plugged into an outer one, a result used as a table, and a named step used twice.
- **EXISTS** (Module 5): each customer asked whether a match exists, and the NULL trap in NOT IN.
- **Set operators** (Module 5): two lists through UNION, UNION ALL, INTERSECT and EXCEPT.
- **Windows** (Module 5): GROUP BY beside OVER, PARTITION BY, running totals, ROW_NUMBER and RANK.
- **INSERT, UPDATE and DELETE** (Module 6): each statement's shapes, with the rows it adds, changes or removes, and the foreign key saying no.
- **Transactions** (Module 6): two changes with and without BEGIN, sent one statement at a time.
- **Constraints** (Module 6): each constraint refusing a bad change, and DEFAULT filling one in.
- **Upserts** (Module 6): ON CONFLICT with DO NOTHING, DO UPDATE and EXCLUDED.
- **From a brief to tables** (Module 7): a library's brief read for things, facts and events, becoming members, books and loans.
- **Data types** (Module 7): the same pages, fines and dates as the wrong type and the right one.
- **Relationships** (Module 7): one-to-many, one-to-one and many-to-many, and a key on the wrong side.
- **Normal forms** (Module 7): a list in a cell normalised to first, second and third normal form.
- **Junction tables** (Module 7): book_authors read both ways, counted and guarded, beside the list it replaces.
- **Naming** (Module 7): capitals, quotes, reserved words and spaces in names, and snake_case.
- **ERD** (Module 7): the library's tables in crow's foot notation, one relationship at a time.
- **CREATE and ALTER TABLE** (Module 8): tables as information_schema describes them, and each change on a table with rows.
- **Indexes** (Module 8): query plans with and without an index, on 20,000 loans and on six.
- **Views** (Module 8): a view saved, queried, and keeping up with its table.
- **Migrations and seeds** (Module 8): numbered migrations run and recorded, and seeds run twice, out of order and in bulk.
- **Query plans** (Module 9): a join's EXPLAIN ANALYZE read from the deepest line out, then with an index.
- **Indexes that help** (Module 9): functions, expressions, date ranges, common and rare values, and a partial index.
- **SQL injection** (Module 9): what a login form's input does to SQL glued together, and to a prepared statement.
- **Roles** (Module 9): roles granted, refused, grouped and revoked, tested with SET ROLE.
- **Backups** (Module 9): a backup written, a table lost, the restore run and checked.
- **Personal data** (Module 9): personal data cut down by a view, coded, erased on request and deleted when old.
- **LAG and LEAD** (Module 10): the row before and after, change since last month, and shares of a total.
- **Ranking** (Module 10): ROW_NUMBER, RANK and DENSE_RANK, top N per group, running totals with ties, and a moving average.
- **Pivots** (Module 10): long grouped rows turned into one column per month, gaps filled and totalled.
- **Cleaning** (Module 10): messy sign-ups trimmed, nulled, safely converted and de-duplicated.
- **Cohorts and funnels** (Module 10): a cohort grid built from orders, and a funnel from website visits.
- **Reports** (Module 10): a monthly report built from named steps, with a ROLLUP total.
- **Dialects** (Module 10): the same jobs in PostgreSQL, MySQL, SQLite and SQL Server.
- **PostgreSQL in the browser** (every module): a fresh practice database for every step, with results drawn as tables and errors in the console.

## Assessment

In-lesson tasks with instant checks, module mastery checks (80% pass mark), projects with automatic checks, and a capstone.

## Device notes

Every module works on a phone. The database takes a few seconds to start the first time, and is cached after that.

## Next steps after this course

Data Analysis (with Python Programming), or Back-End Web Development to use databases in your own apps.
