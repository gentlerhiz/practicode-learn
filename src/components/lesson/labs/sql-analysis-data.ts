// The tables the SQL labs in Modules 9 and 10 draw: each stage's statements, run on PGlite (PostgreSQL 0.5.8,
// the runner's version), with its rows exactly as PostgreSQL returned them. `on` rows are picked out, `off` rows
// are crossed out, and `error` is what PostgreSQL said when it refused a step.
import type { Stage } from './sql-stage-data'

export const ANALYSIS_STAGES: Record<string, Stage[]> = {
  "plan-reader": [
    {
      "key": "The whole plan",
      "sql": "EXPLAIN ANALYZE\nSELECT m.name, l.borrowed_on\nFROM loans AS l\nJOIN members AS m ON m.id = l.member_id\nWHERE l.book_id = 7;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Hash Join (actual rows=25.00 loops=1)"
            ],
            [
              "  Hash Cond: (l.member_id = m.id)"
            ],
            [
              "  ->  Seq Scan on loans l (actual rows=25.00 loops=1)"
            ],
            [
              "        Filter: (book_id = 7)"
            ],
            [
              "        Rows Removed by Filter: 19975"
            ],
            [
              "  ->  Hash (actual rows=2000.00 loops=1)"
            ],
            [
              "        Buckets: 2048  Batches: 1  Memory Usage: 87kB"
            ],
            [
              "        ->  Seq Scan on members m (actual rows=2000.00 loops=1)"
            ]
          ]
        }
      ],
      "says": "Each line is a step, and the indented lines under a step feed it. EXPLAIN ANALYZE runs the query and adds what really happened: actual rows is how many came out of each step."
    },
    {
      "key": "Start at the deepest line",
      "sql": "EXPLAIN ANALYZE\nSELECT m.name, l.borrowed_on\nFROM loans AS l\nJOIN members AS m ON m.id = l.member_id\nWHERE l.book_id = 7;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Hash Join (actual rows=25.00 loops=1)"
            ],
            [
              "  Hash Cond: (l.member_id = m.id)"
            ],
            [
              "  ->  Seq Scan on loans l (actual rows=25.00 loops=1)"
            ],
            [
              "        Filter: (book_id = 7)"
            ],
            [
              "        Rows Removed by Filter: 19975"
            ],
            [
              "  ->  Hash (actual rows=2000.00 loops=1)"
            ],
            [
              "        Buckets: 2048  Batches: 1  Memory Usage: 87kB"
            ],
            [
              "        ->  Seq Scan on members m (actual rows=2000.00 loops=1)"
            ]
          ],
          "on": [
            5,
            6,
            7
          ]
        }
      ],
      "says": "Read from the most indented lines outwards. Here PostgreSQL reads all 2,000 members and builds a Hash: a lookup table, by id."
    },
    {
      "key": "The other branch",
      "sql": "EXPLAIN ANALYZE\nSELECT m.name, l.borrowed_on\nFROM loans AS l\nJOIN members AS m ON m.id = l.member_id\nWHERE l.book_id = 7;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Hash Join (actual rows=25.00 loops=1)"
            ],
            [
              "  Hash Cond: (l.member_id = m.id)"
            ],
            [
              "  ->  Seq Scan on loans l (actual rows=25.00 loops=1)"
            ],
            [
              "        Filter: (book_id = 7)"
            ],
            [
              "        Rows Removed by Filter: 19975"
            ],
            [
              "  ->  Hash (actual rows=2000.00 loops=1)"
            ],
            [
              "        Buckets: 2048  Batches: 1  Memory Usage: 87kB"
            ],
            [
              "        ->  Seq Scan on members m (actual rows=2000.00 loops=1)"
            ]
          ],
          "on": [
            2,
            3,
            4
          ]
        }
      ],
      "says": "Then it reads every loan, keeping the 25 for book 7. Rows Removed by Filter: 19,975 loans were read for nothing. That’s the expensive part."
    },
    {
      "key": "Where they meet",
      "sql": "EXPLAIN ANALYZE\nSELECT m.name, l.borrowed_on\nFROM loans AS l\nJOIN members AS m ON m.id = l.member_id\nWHERE l.book_id = 7;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Hash Join (actual rows=25.00 loops=1)"
            ],
            [
              "  Hash Cond: (l.member_id = m.id)"
            ],
            [
              "  ->  Seq Scan on loans l (actual rows=25.00 loops=1)"
            ],
            [
              "        Filter: (book_id = 7)"
            ],
            [
              "        Rows Removed by Filter: 19975"
            ],
            [
              "  ->  Hash (actual rows=2000.00 loops=1)"
            ],
            [
              "        Buckets: 2048  Batches: 1  Memory Usage: 87kB"
            ],
            [
              "        ->  Seq Scan on members m (actual rows=2000.00 loops=1)"
            ]
          ],
          "on": [
            0,
            1
          ]
        }
      ],
      "says": "The top line runs last: the Hash Join looks up each of the 25 loans in the members hash, giving 25 rows."
    },
    {
      "key": "With an index",
      "sql": "CREATE INDEX loans_book_id_idx ON loans (book_id);\nEXPLAIN ANALYZE\nSELECT m.name, l.borrowed_on\nFROM loans AS l\nJOIN members AS m ON m.id = l.member_id\nWHERE l.book_id = 7;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Hash Join (actual rows=25.00 loops=1)"
            ],
            [
              "  Hash Cond: (l.member_id = m.id)"
            ],
            [
              "  ->  Bitmap Heap Scan on loans l (actual rows=25.00 loops=1)"
            ],
            [
              "        Recheck Cond: (book_id = 7)"
            ],
            [
              "        Heap Blocks: exact=25"
            ],
            [
              "        ->  Bitmap Index Scan on loans_book_id_idx (actual rows=25.00 loops=1)"
            ],
            [
              "              Index Cond: (book_id = 7)"
            ],
            [
              "              Index Searches: 1"
            ],
            [
              "  ->  Hash (actual rows=2000.00 loops=1)"
            ],
            [
              "        Buckets: 2048  Batches: 1  Memory Usage: 87kB"
            ],
            [
              "        ->  Seq Scan on members m (actual rows=2000.00 loops=1)"
            ]
          ],
          "on": [
            2,
            4,
            5,
            6,
            7
          ]
        }
      ],
      "says": "With an index on book_id, the loans branch goes straight to the 25 rows: no Rows Removed by Filter. The plan shows where to add one."
    }
  ],
  "index-help": [
    {
      "key": "A function on the column",
      "sql": "CREATE INDEX ON members (email);\nEXPLAIN SELECT * FROM members\nWHERE lower(email) = 'member42@example.com';",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Seq Scan on members"
            ],
            [
              "  Filter: (lower(email) = 'member42@example.com'::text)"
            ]
          ]
        }
      ],
      "says": "The index holds email values, but the query asks about lower(email), a different value. PostgreSQL can’t look that up in the index, so it reads every row."
    },
    {
      "key": "An index on the expression",
      "sql": "CREATE INDEX ON members (lower(email));\nEXPLAIN SELECT * FROM members\nWHERE lower(email) = 'member42@example.com';",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Bitmap Heap Scan on members"
            ],
            [
              "  Recheck Cond: (lower(email) = 'member42@example.com'::text)"
            ],
            [
              "  ->  Bitmap Index Scan on members_lower_idx"
            ],
            [
              "        Index Cond: (lower(email) = 'member42@example.com'::text)"
            ]
          ]
        }
      ],
      "says": "Index the expression itself, and the same query can use it. The index has to match what the query asks."
    },
    {
      "key": "A year with EXTRACT",
      "sql": "CREATE INDEX ON loans (borrowed_on);\nEXPLAIN SELECT * FROM loans\nWHERE EXTRACT(YEAR FROM borrowed_on) = 2021;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Seq Scan on loans"
            ],
            [
              "  Filter: (EXTRACT(year FROM borrowed_on) = '2021'::numeric)"
            ]
          ]
        }
      ],
      "says": "The same trap with dates: EXTRACT works something out from every borrowed_on, so the index on borrowed_on is no help."
    },
    {
      "key": "A date range",
      "sql": "CREATE INDEX ON loans (borrowed_on);\nEXPLAIN SELECT * FROM loans\nWHERE borrowed_on >= '2021-03-01'\n  AND borrowed_on < '2021-04-01';",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Bitmap Heap Scan on loans"
            ],
            [
              "  Recheck Cond: ((borrowed_on >= '2021-03-01'::date) AND (borrowed_on < '2021-04-01'::date))"
            ],
            [
              "  ->  Bitmap Index Scan on loans_borrowed_on_idx"
            ],
            [
              "        Index Cond: ((borrowed_on >= '2021-03-01'::date) AND (borrowed_on < '2021-04-01'::date))"
            ]
          ]
        }
      ],
      "says": "Ask about the column as it is, as a range, and the index finds where March starts and reads to where it ends."
    },
    {
      "key": "A common value",
      "sql": "CREATE INDEX ON loans (returned_on);\nEXPLAIN SELECT * FROM loans\nWHERE returned_on IS NOT NULL;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Seq Scan on loans"
            ],
            [
              "  Filter: (returned_on IS NOT NULL)"
            ]
          ]
        }
      ],
      "says": "98% of loans have come back. When most rows match, reading the table straight through beats jumping back and forth from an index."
    },
    {
      "key": "A rare value",
      "sql": "CREATE INDEX ON loans (returned_on);\nEXPLAIN SELECT * FROM loans\nWHERE returned_on IS NULL;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Bitmap Heap Scan on loans"
            ],
            [
              "  Recheck Cond: (returned_on IS NULL)"
            ],
            [
              "  ->  Bitmap Index Scan on loans_returned_on_idx"
            ],
            [
              "        Index Cond: (returned_on IS NULL)"
            ]
          ]
        }
      ],
      "says": "Only 400 loans are still out, 2%. For a rare value the same index pays off."
    },
    {
      "key": "A partial index",
      "sql": "CREATE INDEX loans_open_idx ON loans (member_id)\n  WHERE returned_on IS NULL;\nEXPLAIN SELECT * FROM loans\nWHERE member_id = 42 AND returned_on IS NULL;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Index Scan using loans_open_idx on loans"
            ],
            [
              "  Index Cond: (member_id = 42)"
            ]
          ]
        }
      ],
      "says": "A partial index holds only the rows its WHERE allows: the 400 open loans, not all 20,000. It’s small, and quick for the question it’s made for."
    }
  ],
  "injection-demo": [
    {
      "key": "A normal email",
      "sql": "-- Typed into the form: ben@example.com\nSELECT id, name FROM members\nWHERE email = 'ben@example.com';",
      "grids": [
        {
          "columns": [
            "id",
            "name"
          ],
          "rows": [
            [
              "2",
              "Ben Carter"
            ]
          ]
        }
      ],
      "says": "The app glues what was typed between two quote marks. With an ordinary email, that works: Ben’s row."
    },
    {
      "key": "Always true",
      "sql": "-- Typed into the form: ' OR '1'='1\nSELECT id, name FROM members\nWHERE email = '' OR '1'='1';",
      "grids": [
        {
          "columns": [
            "id",
            "name"
          ],
          "rows": [
            [
              "1",
              "Amara Okafor"
            ],
            [
              "2",
              "Ben Carter"
            ],
            [
              "3",
              "Chen Wei"
            ],
            [
              "4",
              "Daniela Ruiz"
            ]
          ]
        }
      ],
      "says": "The first quote mark typed closes the app’s quote, and the rest becomes SQL. 1 = 1 is true for every row, so every member comes back."
    },
    {
      "key": "Stealing with UNION",
      "sql": "-- Typed into the form: ' UNION SELECT email FROM members --\nSELECT title FROM books\nWHERE title = '' UNION SELECT email FROM members --';",
      "grids": [
        {
          "columns": [
            "title"
          ],
          "rows": [
            [
              "amara@example.com"
            ],
            [
              "ben@example.com"
            ],
            [
              "chen@example.com"
            ],
            [
              "daniela@example.com"
            ]
          ]
        }
      ],
      "says": "A book search, made to return another table: UNION adds every member’s email to the results, and -- turns the app’s last quote into a comment."
    },
    {
      "key": "A second statement",
      "sql": "-- Typed into the form: x'; DROP TABLE loans; --\nSELECT id, name FROM members\nWHERE email = 'x'; DROP TABLE loans; --';",
      "grids": [
        {
          "columns": [
            "table_name"
          ],
          "rows": [
            [
              "authors"
            ],
            [
              "book_authors"
            ],
            [
              "books"
            ],
            [
              "members"
            ]
          ],
          "name": "tables left"
        }
      ],
      "says": "A semicolon ends the app’s query and starts the attacker’s. loans is gone, with every loan in it."
    },
    {
      "key": "With a parameter",
      "sql": "PREPARE find_member(text) AS\n  SELECT id, name FROM members WHERE email = $1;\nEXECUTE find_member(''' OR ''1''=''1');",
      "grids": [
        {
          "columns": [
            "id",
            "name"
          ],
          "rows": []
        }
      ],
      "says": "The query is fixed first, with $1 as a gap. Whatever is typed fills the gap as a value, never as SQL, so the attack is just an odd email that matches nobody."
    }
  ],
  "role-check": [
    {
      "key": "As the owner",
      "sql": "SELECT current_user;",
      "grids": [
        {
          "columns": [
            "role",
            "members"
          ],
          "rows": [
            [
              "postgres",
              "4"
            ]
          ]
        }
      ],
      "says": "The practice database connects you as postgres, a superuser, which may do anything. That’s handy for learning and risky for an app."
    },
    {
      "key": "Reading books",
      "sql": "CREATE ROLE librarian;\nGRANT SELECT ON books TO librarian;\nSET ROLE librarian;\nSELECT title FROM books;",
      "grids": [
        {
          "columns": [
            "role",
            "title"
          ],
          "rows": [
            [
              "librarian",
              "Good Omens"
            ],
            [
              "librarian",
              "Things Fall Apart"
            ],
            [
              "librarian",
              "Homegoing"
            ]
          ]
        }
      ],
      "says": "A new role can do nothing until it’s granted something. librarian was granted SELECT on books, so it can read them."
    },
    {
      "key": "Reading members",
      "sql": "SET ROLE librarian;\nSELECT * FROM members;",
      "grids": [
        {
          "columns": [
            "table_name",
            "privilege_type"
          ],
          "rows": [
            [
              "books",
              "SELECT"
            ]
          ],
          "name": "librarian’s grants"
        }
      ],
      "says": "Nothing was granted on members, so librarian can’t read them. Its grants, below, are all it has.",
      "error": "permission denied for table members"
    },
    {
      "key": "Adding a book",
      "sql": "SET ROLE librarian;\nINSERT INTO books (title, published)\nVALUES ('Mort', 1987);",
      "grids": [
        {
          "columns": [
            "table_name",
            "privilege_type"
          ],
          "rows": [
            [
              "books",
              "SELECT"
            ]
          ],
          "name": "librarian’s grants"
        }
      ],
      "says": "SELECT lets a role read, and nothing more. Adding rows needs INSERT, changing them UPDATE, and removing them DELETE, each granted on its own.",
      "error": "permission denied for table books"
    },
    {
      "key": "Only some columns",
      "sql": "CREATE ROLE desk;\nGRANT SELECT (id, name) ON members TO desk;\nSET ROLE desk;\nSELECT email FROM members;",
      "grids": [
        {
          "columns": [
            "id",
            "name"
          ],
          "rows": [
            [
              "1",
              "Amara Okafor"
            ],
            [
              "2",
              "Ben Carter"
            ],
            [
              "3",
              "Chen Wei"
            ],
            [
              "4",
              "Daniela Ruiz"
            ]
          ]
        }
      ],
      "says": "A grant can name columns. The desk role can read ids and names, but not emails.",
      "error": "permission denied for table members"
    },
    {
      "key": "A group role",
      "sql": "CREATE ROLE staff;\nGRANT SELECT, INSERT ON loans TO staff;\nCREATE ROLE ben LOGIN;\nGRANT staff TO ben;\nSET ROLE ben;\nINSERT INTO loans (member_id, book_id, borrowed_on)\nVALUES (4, 6, '2026-11-04');",
      "grids": [
        {
          "columns": [
            "role",
            "loans"
          ],
          "rows": [
            [
              "ben",
              "7"
            ]
          ]
        }
      ],
      "says": "Grant to a group role, staff, then add people to the group. ben inherits what staff can do, so the loan goes in. Someone leaves, and you revoke one membership."
    },
    {
      "key": "REVOKE",
      "sql": "GRANT SELECT ON books TO librarian;\nREVOKE SELECT ON books FROM librarian;\nSET ROLE librarian;\nSELECT title FROM books;",
      "grids": [
        {
          "columns": [
            "table_name",
            "privilege_type"
          ],
          "rows": [],
          "name": "librarian’s grants"
        }
      ],
      "says": "REVOKE takes a privilege back, straight away. librarian has no grants left, so even books are refused.",
      "error": "permission denied for table books"
    }
  ],
  "backup-restore": [
    {
      "key": "The database",
      "sql": "SELECT COUNT(*) FROM members;  -- and books, and loans",
      "grids": [
        {
          "columns": [
            "table_name",
            "row_count"
          ],
          "rows": [
            [
              "members",
              "4"
            ],
            [
              "books",
              "6"
            ],
            [
              "loans",
              "6"
            ]
          ]
        }
      ],
      "says": "The library’s database, as it is today: three tables and their rows."
    },
    {
      "key": "A backup is SQL",
      "sql": "-- library-2026-11-04.sql, written by pg_dump\nCREATE TABLE members (...);\nINSERT INTO members VALUES (1, 'Amara Okafor', ...);\n…\nALTER TABLE loans ADD FOREIGN KEY (member_id)\n  REFERENCES members (id);",
      "grids": [
        {
          "columns": [
            "table_name",
            "row_count"
          ],
          "rows": [
            [
              "members",
              "4"
            ],
            [
              "books",
              "6"
            ],
            [
              "loans",
              "6"
            ]
          ],
          "name": "in the backup"
        }
      ],
      "says": "pg_dump writes the whole database out as SQL: every table, every row, then the foreign keys last. The file is kept somewhere else."
    },
    {
      "key": "A mistake",
      "sql": "DROP TABLE loans;\nROLLBACK;",
      "grids": [
        {
          "columns": [
            "table_name"
          ],
          "rows": [
            [
              "authors"
            ],
            [
              "book_authors"
            ],
            [
              "books"
            ],
            [
              "members"
            ]
          ],
          "name": "tables left"
        }
      ],
      "says": "Without BEGIN, the DROP is final as soon as it runs. ROLLBACK has nothing to undo, and every loan is gone."
    },
    {
      "key": "Restore",
      "sql": "-- On a fresh, empty database:\n\\i library-2026-11-04.sql",
      "grids": [
        {
          "columns": [
            "table_name",
            "row_count"
          ],
          "rows": [
            [
              "members",
              "4"
            ],
            [
              "books",
              "6"
            ],
            [
              "loans",
              "6"
            ]
          ],
          "name": "restored"
        }
      ],
      "says": "Restoring means running the backup on an empty database. Every table comes back, as it was when the backup was made."
    },
    {
      "key": "Check the restore",
      "sql": "SELECT b.table_name AS name, b.row_count AS expected,\n       r.row_count AS restored,\n       b.row_count = r.row_count AS matches\nFROM backup_counts AS b JOIN restored AS r ...;",
      "grids": [
        {
          "columns": [
            "name",
            "expected",
            "restored",
            "matches"
          ],
          "rows": [
            [
              "books",
              "6",
              "6",
              "true"
            ],
            [
              "loans",
              "6",
              "6",
              "true"
            ],
            [
              "members",
              "4",
              "4",
              "true"
            ]
          ],
          "on": [
            0,
            1,
            2
          ]
        }
      ],
      "says": "A backup is only as good as its last test. Compare the restored counts with the ones recorded at backup time: they match."
    }
  ],
  "privacy-view": [
    {
      "key": "Everything",
      "sql": "SELECT * FROM members;",
      "grids": [
        {
          "columns": [
            "id",
            "name",
            "email",
            "joined_on"
          ],
          "rows": [
            [
              "1",
              "Amara Okafor",
              "amara@example.com",
              "2025-03-14"
            ],
            [
              "2",
              "Ben Carter",
              "ben@example.com",
              "2025-06-02"
            ],
            [
              "3",
              "Chen Wei",
              "chen@example.com",
              "2026-01-20"
            ],
            [
              "4",
              "Daniela Ruiz",
              "daniela@example.com",
              "2026-09-05"
            ]
          ]
        }
      ],
      "says": "Names, emails and joining dates are personal data: each row is about a person you could identify."
    },
    {
      "key": "Only what’s needed",
      "sql": "CREATE VIEW loan_report AS\nSELECT b.title, l.borrowed_on\nFROM loans AS l\nJOIN books AS b ON b.id = l.book_id;",
      "grids": [
        {
          "columns": [
            "title",
            "borrowed_on"
          ],
          "rows": [
            [
              "Dune",
              "2026-09-01"
            ],
            [
              "Good Omens",
              "2026-09-20"
            ],
            [
              "Homegoing",
              "2026-10-02"
            ],
            [
              "Things Fall Apart",
              "2026-10-10"
            ],
            [
              "Coraline",
              "2026-10-12"
            ],
            [
              "Mort",
              "2026-10-20"
            ]
          ],
          "name": "loan_report"
        }
      ],
      "says": "Counting which books are popular needs no names at all. Grant the view, not the tables, and staff see only what the job needs."
    },
    {
      "key": "A pseudonym",
      "sql": "SELECT left(md5(email), 10) AS member_code,\n       joined_on\nFROM members;",
      "grids": [
        {
          "columns": [
            "member_code",
            "joined_on"
          ],
          "rows": [
            [
              "3bb9638f34",
              "2025-03-14"
            ],
            [
              "2c66f61429",
              "2025-06-02"
            ],
            [
              "62ad9c0568",
              "2026-01-20"
            ],
            [
              "3994d62b36",
              "2026-09-05"
            ]
          ]
        }
      ],
      "says": "A code in place of the email hides it at a glance. But anyone with the emails can work out the codes again, so this is still personal data, and the law still applies."
    },
    {
      "key": "Erased on request",
      "sql": "UPDATE members\nSET name = 'Deleted member',\n    email = 'deleted-' || id || '@example.invalid'\nWHERE id = 1;",
      "grids": [
        {
          "columns": [
            "id",
            "name",
            "email",
            "joined_on"
          ],
          "rows": [
            [
              "1",
              "Deleted member",
              "deleted-1@example.invalid",
              "2025-03-14"
            ],
            [
              "2",
              "Ben Carter",
              "ben@example.com",
              "2025-06-02"
            ],
            [
              "3",
              "Chen Wei",
              "chen@example.com",
              "2026-01-20"
            ],
            [
              "4",
              "Daniela Ruiz",
              "daniela@example.com",
              "2026-09-05"
            ]
          ],
          "on": [
            0
          ]
        }
      ],
      "says": "Amara asks to be forgotten. The name and email are replaced, while the loans stay, so the library’s counts still add up and nothing says who borrowed them."
    },
    {
      "key": "Kept too long",
      "sql": "DELETE FROM loans\nWHERE returned_on < DATE '2026-11-04' - 30;",
      "grids": [
        {
          "columns": [
            "id",
            "borrowed_on",
            "returned_on"
          ],
          "rows": [
            [
              "1",
              "2026-09-01",
              "2026-09-15"
            ],
            [
              "2",
              "2026-10-02",
              null
            ],
            [
              "3",
              "2026-09-20",
              "2026-10-04"
            ],
            [
              "4",
              "2026-10-10",
              null
            ],
            [
              "5",
              "2026-10-12",
              null
            ],
            [
              "6",
              "2026-10-20",
              null
            ]
          ],
          "off": [
            0,
            2
          ]
        }
      ],
      "says": "A rule such as keeping loan history for 30 days after a return, run on a schedule, stops old data piling up. The crossed-out loans go."
    }
  ],
  "lag-lead": [
    {
      "key": "LAG",
      "sql": "SELECT month, revenue,\n  LAG(revenue) OVER (ORDER BY month) AS last_month\nFROM monthly;",
      "grids": [
        {
          "columns": [
            "month",
            "revenue",
            "last_month"
          ],
          "rows": [
            [
              "2026-08",
              "80.71",
              null
            ],
            [
              "2026-09",
              "87.68",
              "80.71"
            ],
            [
              "2026-10",
              "98.24",
              "87.68"
            ]
          ]
        }
      ],
      "says": "LAG reads a value from the row before, in the window’s order. August has no row before it, so its last_month is NULL."
    },
    {
      "key": "LEAD",
      "sql": "SELECT month, revenue,\n  LEAD(revenue) OVER (ORDER BY month) AS next_month\nFROM monthly;",
      "grids": [
        {
          "columns": [
            "month",
            "revenue",
            "next_month"
          ],
          "rows": [
            [
              "2026-08",
              "80.71",
              "87.68"
            ],
            [
              "2026-09",
              "87.68",
              "98.24"
            ],
            [
              "2026-10",
              "98.24",
              null
            ]
          ]
        }
      ],
      "says": "LEAD looks the other way, at the row after. October is last, so it has no next_month."
    },
    {
      "key": "Change since last month",
      "sql": "SELECT month, revenue,\n  revenue - LAG(revenue) OVER (ORDER BY month) AS change\nFROM monthly;",
      "grids": [
        {
          "columns": [
            "month",
            "revenue",
            "change"
          ],
          "rows": [
            [
              "2026-08",
              "80.71",
              null
            ],
            [
              "2026-09",
              "87.68",
              "6.97"
            ],
            [
              "2026-10",
              "98.24",
              "10.56"
            ]
          ]
        }
      ],
      "says": "Take one row from the one before, and every month shows how much it grew: up 6.97 in September, and 10.56 in October."
    },
    {
      "key": "Per title",
      "sql": "LAG(sold_on) OVER (PARTITION BY title\n                   ORDER BY sold_on) AS last_sold",
      "grids": [
        {
          "columns": [
            "title",
            "sold_on",
            "last_sold"
          ],
          "rows": [
            [
              "Dune",
              "2026-08-03",
              null
            ],
            [
              "Dune",
              "2026-08-30",
              "2026-08-03"
            ],
            [
              "Dune",
              "2026-10-01",
              "2026-08-30"
            ],
            [
              "Gone Girl",
              "2026-08-21",
              null
            ],
            [
              "Gone Girl",
              "2026-09-25",
              "2026-08-21"
            ]
          ]
        }
      ],
      "says": "With PARTITION BY, each title has its own window, so LAG never reaches back into another title’s sales."
    },
    {
      "key": "Days since last sale",
      "sql": "sold_on - LAG(sold_on) OVER (ORDER BY sold_on)\n  AS days_since\n…\nWHERE title = 'Dune'",
      "grids": [
        {
          "columns": [
            "title",
            "sold_on",
            "days_since"
          ],
          "rows": [
            [
              "Dune",
              "2026-08-03",
              null
            ],
            [
              "Dune",
              "2026-08-30",
              "27"
            ],
            [
              "Dune",
              "2026-10-01",
              "32"
            ]
          ]
        }
      ],
      "says": "Dates take away to give days: 27 days between the first two copies of Dune, then 32."
    },
    {
      "key": "Share of the total",
      "sql": "SELECT genre, SUM(quantity) AS copies,\n  ROUND(100.0 * SUM(quantity)\n    / SUM(SUM(quantity)) OVER (), 1) AS pct\nFROM sales GROUP BY genre;",
      "grids": [
        {
          "columns": [
            "genre",
            "copies",
            "pct"
          ],
          "rows": [
            [
              "Sci-fi",
              "7",
              "28.0"
            ],
            [
              "Fiction",
              "6",
              "24.0"
            ],
            [
              "Classic",
              "5",
              "20.0"
            ],
            [
              "Self-help",
              "4",
              "16.0"
            ],
            [
              "Thriller",
              "3",
              "12.0"
            ]
          ]
        }
      ],
      "says": "SUM(SUM(quantity)) OVER () is the total of the group totals, 25 copies, on every row. Divide by it for each genre’s share."
    }
  ],
  "rank-kinds": [
    {
      "key": "ROW_NUMBER",
      "sql": "ROW_NUMBER() OVER (ORDER BY price DESC, id) AS n",
      "grids": [
        {
          "columns": [
            "id",
            "title",
            "price",
            "n"
          ],
          "rows": [
            [
              "7",
              "Project Hail Mary",
              "14.20",
              "1"
            ],
            [
              "2",
              "Atomic Habits",
              "12.50",
              "2"
            ],
            [
              "8",
              "Atomic Habits",
              "12.50",
              "3"
            ],
            [
              "6",
              "Homegoing",
              "12.00",
              "4"
            ],
            [
              "1",
              "Dune",
              "10.99",
              "5"
            ],
            [
              "5",
              "Dune",
              "10.99",
              "6"
            ],
            [
              "4",
              "Gone Girl",
              "8.99",
              "7"
            ],
            [
              "3",
              "Things Fall Apart",
              "8.75",
              "8"
            ]
          ]
        }
      ],
      "says": "ROW_NUMBER never repeats: tied prices still get 2 and 3, broken by id."
    },
    {
      "key": "RANK",
      "sql": "RANK() OVER (ORDER BY price DESC) AS n",
      "grids": [
        {
          "columns": [
            "id",
            "title",
            "price",
            "n"
          ],
          "rows": [
            [
              "7",
              "Project Hail Mary",
              "14.20",
              "1"
            ],
            [
              "2",
              "Atomic Habits",
              "12.50",
              "2"
            ],
            [
              "8",
              "Atomic Habits",
              "12.50",
              "2"
            ],
            [
              "6",
              "Homegoing",
              "12.00",
              "4"
            ],
            [
              "1",
              "Dune",
              "10.99",
              "5"
            ],
            [
              "5",
              "Dune",
              "10.99",
              "5"
            ],
            [
              "4",
              "Gone Girl",
              "8.99",
              "7"
            ],
            [
              "3",
              "Things Fall Apart",
              "8.75",
              "8"
            ]
          ]
        }
      ],
      "says": "RANK gives ties the same place, then skips: two share 2nd, so the next is 4th."
    },
    {
      "key": "DENSE_RANK",
      "sql": "DENSE_RANK() OVER (ORDER BY price DESC) AS n",
      "grids": [
        {
          "columns": [
            "id",
            "title",
            "price",
            "n"
          ],
          "rows": [
            [
              "7",
              "Project Hail Mary",
              "14.20",
              "1"
            ],
            [
              "2",
              "Atomic Habits",
              "12.50",
              "2"
            ],
            [
              "8",
              "Atomic Habits",
              "12.50",
              "2"
            ],
            [
              "6",
              "Homegoing",
              "12.00",
              "3"
            ],
            [
              "1",
              "Dune",
              "10.99",
              "4"
            ],
            [
              "5",
              "Dune",
              "10.99",
              "4"
            ],
            [
              "4",
              "Gone Girl",
              "8.99",
              "5"
            ],
            [
              "3",
              "Things Fall Apart",
              "8.75",
              "6"
            ]
          ]
        }
      ],
      "says": "DENSE_RANK gives ties the same place without skipping: two share 2nd, and the next is 3rd."
    },
    {
      "key": "Top 2 per genre",
      "sql": "RANK() OVER (PARTITION BY genre\n             ORDER BY revenue DESC) AS place\n…\nWHERE place <= 2",
      "grids": [
        {
          "columns": [
            "genre",
            "title",
            "revenue",
            "place"
          ],
          "rows": [
            [
              "Classic",
              "Things Fall Apart",
              "35.00",
              "1"
            ],
            [
              "Classic",
              "Pride and Prejudice",
              "6.50",
              "2"
            ],
            [
              "Fiction",
              "Homegoing",
              "36.00",
              "1"
            ],
            [
              "Fiction",
              "Half of a Yellow Sun",
              "33.75",
              "2"
            ],
            [
              "Sci-fi",
              "Dune",
              "43.96",
              "1"
            ],
            [
              "Sci-fi",
              "The Martian",
              "19.00",
              "2"
            ],
            [
              "Self-help",
              "Atomic Habits",
              "37.50",
              "1"
            ],
            [
              "Self-help",
              "Deep Work",
              "13.75",
              "2"
            ],
            [
              "Thriller",
              "Gone Girl",
              "26.97",
              "1"
            ]
          ]
        }
      ],
      "says": "Rank inside each genre, in a CTE, then keep places 1 and 2. Thriller has only one title, so it has only one row."
    },
    {
      "key": "Running total with ties",
      "sql": "SUM(quantity) OVER (ORDER BY sold_on) AS running",
      "grids": [
        {
          "columns": [
            "id",
            "sold_on",
            "quantity",
            "running"
          ],
          "rows": [
            [
              "1",
              "2026-08-03",
              "2",
              "3"
            ],
            [
              "2",
              "2026-08-03",
              "1",
              "3"
            ],
            [
              "3",
              "2026-08-14",
              "3",
              "6"
            ],
            [
              "4",
              "2026-08-21",
              "1",
              "7"
            ],
            [
              "5",
              "2026-08-30",
              "1",
              "8"
            ],
            [
              "6",
              "2026-09-02",
              "2",
              "11"
            ],
            [
              "7",
              "2026-09-02",
              "1",
              "11"
            ],
            [
              "8",
              "2026-09-11",
              "2",
              "13"
            ]
          ],
          "on": [
            0,
            1,
            5,
            6
          ]
        }
      ],
      "says": "Two sales on 3 August, and both show 3. With only sold_on to order by, rows on the same date are added together, as peers."
    },
    {
      "key": "Running total by row",
      "sql": "SUM(quantity) OVER (ORDER BY sold_on, id) AS running",
      "grids": [
        {
          "columns": [
            "id",
            "sold_on",
            "quantity",
            "running"
          ],
          "rows": [
            [
              "1",
              "2026-08-03",
              "2",
              "2"
            ],
            [
              "2",
              "2026-08-03",
              "1",
              "3"
            ],
            [
              "3",
              "2026-08-14",
              "3",
              "6"
            ],
            [
              "4",
              "2026-08-21",
              "1",
              "7"
            ],
            [
              "5",
              "2026-08-30",
              "1",
              "8"
            ],
            [
              "6",
              "2026-09-02",
              "2",
              "10"
            ],
            [
              "7",
              "2026-09-02",
              "1",
              "11"
            ],
            [
              "8",
              "2026-09-11",
              "2",
              "13"
            ]
          ],
          "on": [
            0,
            1,
            5,
            6
          ]
        }
      ],
      "says": "Add a tie-breaker, and every row is its own step: 2, then 3. ROWS UNBOUNDED PRECEDING after the ORDER BY does the same."
    },
    {
      "key": "Moving average",
      "sql": "AVG(quantity) OVER (ORDER BY sold_on, id\n  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)",
      "grids": [
        {
          "columns": [
            "id",
            "sold_on",
            "quantity",
            "avg3"
          ],
          "rows": [
            [
              "1",
              "2026-08-03",
              "2",
              "2.00"
            ],
            [
              "2",
              "2026-08-03",
              "1",
              "1.50"
            ],
            [
              "3",
              "2026-08-14",
              "3",
              "2.00"
            ],
            [
              "4",
              "2026-08-21",
              "1",
              "1.67"
            ],
            [
              "5",
              "2026-08-30",
              "1",
              "1.67"
            ],
            [
              "6",
              "2026-09-02",
              "2",
              "1.33"
            ],
            [
              "7",
              "2026-09-02",
              "1",
              "1.33"
            ],
            [
              "8",
              "2026-09-11",
              "2",
              "1.67"
            ]
          ]
        }
      ],
      "says": "A frame picks which rows count: this row and the two before it. The average moves along, smoothing out single big sales."
    }
  ],
  "pivot-build": [
    {
      "key": "Long",
      "sql": "SELECT genre, TO_CHAR(sold_on, 'YYYY-MM') AS month,\n       SUM(quantity) AS copies\nFROM sales GROUP BY genre, month;",
      "grids": [
        {
          "columns": [
            "genre",
            "month",
            "copies"
          ],
          "rows": [
            [
              "Classic",
              "2026-08",
              "3"
            ],
            [
              "Classic",
              "2026-09",
              "1"
            ],
            [
              "Classic",
              "2026-10",
              "1"
            ],
            [
              "Fiction",
              "2026-09",
              "2"
            ],
            [
              "Fiction",
              "2026-10",
              "4"
            ],
            [
              "Sci-fi",
              "2026-08",
              "3"
            ],
            [
              "Sci-fi",
              "2026-09",
              "1"
            ],
            [
              "Sci-fi",
              "2026-10",
              "3"
            ],
            [
              "Self-help",
              "2026-08",
              "1"
            ],
            [
              "Self-help",
              "2026-09",
              "2"
            ],
            [
              "Self-help",
              "2026-10",
              "1"
            ],
            [
              "Thriller",
              "2026-08",
              "1"
            ],
            [
              "Thriller",
              "2026-09",
              "2"
            ]
          ]
        }
      ],
      "says": "GROUP BY gives one row per genre and month: 13 rows, long and hard to compare."
    },
    {
      "key": "A column per month",
      "sql": "SELECT genre,\n  SUM(quantity) FILTER (WHERE month = '2026-08') AS aug,\n  SUM(quantity) FILTER (WHERE month = '2026-09') AS sep,\n  SUM(quantity) FILTER (WHERE month = '2026-10') AS oct\nFROM sales GROUP BY genre;",
      "grids": [
        {
          "columns": [
            "genre",
            "aug",
            "sep",
            "oct"
          ],
          "rows": [
            [
              "Classic",
              "3",
              "1",
              "1"
            ],
            [
              "Fiction",
              null,
              "2",
              "4"
            ],
            [
              "Sci-fi",
              "3",
              "1",
              "3"
            ],
            [
              "Self-help",
              "1",
              "2",
              "1"
            ],
            [
              "Thriller",
              "1",
              "2",
              null
            ]
          ]
        }
      ],
      "says": "Group by genre only, and give each month its own column. FILTER keeps that month’s rows for that one SUM. Five rows, one per genre."
    },
    {
      "key": "Gaps are NULL",
      "sql": "SUM(quantity) FILTER (WHERE month = '2026-08') AS aug",
      "grids": [
        {
          "columns": [
            "genre",
            "aug",
            "sep",
            "oct"
          ],
          "rows": [
            [
              "Classic",
              "3",
              "1",
              "1"
            ],
            [
              "Fiction",
              null,
              "2",
              "4"
            ],
            [
              "Sci-fi",
              "3",
              "1",
              "3"
            ],
            [
              "Self-help",
              "1",
              "2",
              "1"
            ],
            [
              "Thriller",
              "1",
              "2",
              null
            ]
          ],
          "on": [
            1,
            4
          ]
        }
      ],
      "says": "Fiction sold nothing in August, so its SUM has no rows to add, and SUM of nothing is NULL, not 0."
    },
    {
      "key": "Fill the gaps",
      "sql": "COALESCE(SUM(quantity) FILTER (WHERE month = '2026-08'), 0) AS aug",
      "grids": [
        {
          "columns": [
            "genre",
            "aug",
            "sep",
            "oct"
          ],
          "rows": [
            [
              "Classic",
              "3",
              "1",
              "1"
            ],
            [
              "Fiction",
              "0",
              "2",
              "4"
            ],
            [
              "Sci-fi",
              "3",
              "1",
              "3"
            ],
            [
              "Self-help",
              "1",
              "2",
              "1"
            ],
            [
              "Thriller",
              "1",
              "2",
              "0"
            ]
          ],
          "on": [
            1,
            4
          ]
        }
      ],
      "says": "COALESCE turns each NULL into 0, so the table reads as a report should."
    },
    {
      "key": "Add a total",
      "sql": "…, SUM(quantity) AS total\nFROM sales GROUP BY genre;",
      "grids": [
        {
          "columns": [
            "genre",
            "aug",
            "sep",
            "oct",
            "total"
          ],
          "rows": [
            [
              "Classic",
              "3",
              "1",
              "1",
              "5"
            ],
            [
              "Fiction",
              "0",
              "2",
              "4",
              "6"
            ],
            [
              "Sci-fi",
              "3",
              "1",
              "3",
              "7"
            ],
            [
              "Self-help",
              "1",
              "2",
              "1",
              "4"
            ],
            [
              "Thriller",
              "1",
              "2",
              "0",
              "3"
            ]
          ]
        }
      ],
      "says": "An ordinary SUM, with no FILTER, adds every month: a total column at the end."
    }
  ],
  "clean-steps": [
    {
      "key": "Raw",
      "sql": "SELECT * FROM signups_raw;",
      "grids": [
        {
          "columns": [
            "id",
            "name",
            "email",
            "city",
            "age"
          ],
          "rows": [
            [
              "1",
              "  amara okafor ",
              "Amara@Example.com",
              "lagos",
              "34"
            ],
            [
              "2",
              "BEN CARTER",
              "ben@example.com ",
              "Leeds",
              ""
            ],
            [
              "3",
              "Chen Wei",
              "chen@example.com",
              "SINGAPORE",
              "n/a"
            ],
            [
              "4",
              "amara okafor",
              "amara@example.com",
              "Lagos",
              "34"
            ],
            [
              "5",
              "Daniela Ruiz",
              "",
              "Madrid ",
              "29"
            ],
            [
              "6",
              "Emeka Obi",
              "emeka@example.com",
              " abuja",
              " 41"
            ]
          ]
        }
      ],
      "says": "Sign-ups typed in by hand: stray spaces, mixed capitals, an empty email, n/a for an age, and Amara twice."
    },
    {
      "key": "TRIM and INITCAP",
      "sql": "SELECT INITCAP(TRIM(name)) AS name,\n       LOWER(TRIM(email)) AS email,\n       INITCAP(TRIM(city)) AS city\nFROM signups_raw;",
      "grids": [
        {
          "columns": [
            "id",
            "name",
            "email",
            "city"
          ],
          "rows": [
            [
              "1",
              "Amara Okafor",
              "amara@example.com",
              "Lagos"
            ],
            [
              "2",
              "Ben Carter",
              "ben@example.com",
              "Leeds"
            ],
            [
              "3",
              "Chen Wei",
              "chen@example.com",
              "Singapore"
            ],
            [
              "4",
              "Amara Okafor",
              "amara@example.com",
              "Lagos"
            ],
            [
              "5",
              "Daniela Ruiz",
              "",
              "Madrid"
            ],
            [
              "6",
              "Emeka Obi",
              "emeka@example.com",
              "Abuja"
            ]
          ]
        }
      ],
      "says": "TRIM removes spaces from both ends, LOWER makes emails comparable, and INITCAP gives names and cities a capital at the start of each word."
    },
    {
      "key": "Empty to NULL",
      "sql": "SELECT NULLIF(TRIM(email), '') AS email,\n       NULLIF(TRIM(age), '') AS age\nFROM signups_raw;",
      "grids": [
        {
          "columns": [
            "id",
            "email",
            "age"
          ],
          "rows": [
            [
              "1",
              "Amara@Example.com",
              "34"
            ],
            [
              "2",
              "ben@example.com",
              null
            ],
            [
              "3",
              "chen@example.com",
              "n/a"
            ],
            [
              "4",
              "amara@example.com",
              "34"
            ],
            [
              "5",
              null,
              "29"
            ],
            [
              "6",
              "emeka@example.com",
              "41"
            ]
          ],
          "on": [
            1,
            4
          ]
        }
      ],
      "says": "NULLIF(x, '') gives NULL when x is empty text. Now a missing value looks missing, and COUNT(email) won’t count it."
    },
    {
      "key": "Ages that aren’t numbers",
      "sql": "SELECT TRIM(age)::integer AS age\nFROM signups_raw;",
      "grids": [
        {
          "columns": [
            "id",
            "age"
          ],
          "rows": [
            [
              "1",
              "34"
            ],
            [
              "2",
              ""
            ],
            [
              "3",
              "n/a"
            ],
            [
              "4",
              "34"
            ],
            [
              "5",
              "29"
            ],
            [
              "6",
              " 41"
            ]
          ],
          "on": [
            1,
            2
          ]
        }
      ],
      "says": "One value that won’t convert, and the whole query fails: an empty age can’t become a number, and nor can n/a.",
      "error": "invalid input syntax for type integer: \"\""
    },
    {
      "key": "Safe ages",
      "sql": "CASE WHEN TRIM(age) ~ '^[0-9]+$'\n     THEN TRIM(age)::integer\nEND AS age",
      "grids": [
        {
          "columns": [
            "id",
            "age"
          ],
          "rows": [
            [
              "1",
              "34"
            ],
            [
              "2",
              null
            ],
            [
              "3",
              null
            ],
            [
              "4",
              "34"
            ],
            [
              "5",
              "29"
            ],
            [
              "6",
              "41"
            ]
          ]
        }
      ],
      "says": "~ tests text against a pattern: ^[0-9]+$ means digits only, start to end. Only those are converted, and everything else becomes NULL."
    },
    {
      "key": "Duplicates",
      "sql": "ROW_NUMBER() OVER (\n  PARTITION BY LOWER(TRIM(email)) ORDER BY id) AS n\n…\nWHERE n = 1",
      "grids": [
        {
          "columns": [
            "email",
            "signups"
          ],
          "rows": [
            [
              "amara@example.com",
              "2"
            ]
          ],
          "name": "emails used twice"
        },
        {
          "columns": [
            "id",
            "name",
            "email"
          ],
          "rows": [
            [
              "1",
              "Amara Okafor",
              "amara@example.com"
            ],
            [
              "2",
              "Ben Carter",
              "ben@example.com"
            ],
            [
              "3",
              "Chen Wei",
              "chen@example.com"
            ],
            [
              "5",
              "Daniela Ruiz",
              null
            ],
            [
              "6",
              "Emeka Obi",
              "emeka@example.com"
            ]
          ],
          "name": "one row each"
        }
      ],
      "says": "Once cleaned, Amara’s two emails are the same. Number each email’s rows and keep the first, and Amara appears once."
    }
  ],
  "cohort-funnel": [
    {
      "key": "Orders and cohorts",
      "sql": "TO_CHAR(c.joined_on, 'YYYY-MM') AS cohort,\n(EXTRACT(YEAR FROM o.ordered_on) - EXTRACT(YEAR FROM c.joined_on)) * 12\n  + EXTRACT(MONTH FROM o.ordered_on)\n  - EXTRACT(MONTH FROM c.joined_on) AS month_no",
      "grids": [
        {
          "columns": [
            "name",
            "cohort",
            "ordered_on",
            "month_no"
          ],
          "rows": [
            [
              "Amara Okafor",
              "2026-07",
              "2026-07-06",
              "0"
            ],
            [
              "Amara Okafor",
              "2026-07",
              "2026-08-10",
              "1"
            ],
            [
              "Amara Okafor",
              "2026-07",
              "2026-09-14",
              "2"
            ],
            [
              "Amara Okafor",
              "2026-07",
              "2026-10-02",
              "3"
            ],
            [
              "Ben Carter",
              "2026-07",
              "2026-07-15",
              "0"
            ],
            [
              "Chen Wei",
              "2026-07",
              "2026-07-21",
              "0"
            ],
            [
              "Chen Wei",
              "2026-07",
              "2026-09-01",
              "2"
            ],
            [
              "Daniela Ruiz",
              "2026-08",
              "2026-08-03",
              "0"
            ],
            [
              "Daniela Ruiz",
              "2026-08",
              "2026-09-09",
              "1"
            ],
            [
              "Daniela Ruiz",
              "2026-08",
              "2026-10-11",
              "2"
            ],
            [
              "Emeka Obi",
              "2026-08",
              "2026-08-16",
              "0"
            ],
            [
              "Grace Mensah",
              "2026-08",
              "2026-08-29",
              "0"
            ],
            [
              "Grace Mensah",
              "2026-08",
              "2026-10-20",
              "2"
            ],
            [
              "Hana Sato",
              "2026-09",
              "2026-09-04",
              "0"
            ],
            [
              "Hana Sato",
              "2026-09",
              "2026-10-05",
              "1"
            ],
            [
              "Ivan Petrov",
              "2026-09",
              "2026-09-20",
              "0"
            ]
          ]
        }
      ],
      "says": "Each order, with the month its customer joined (their cohort) and how many months after joining it came: 0 is the month they joined."
    },
    {
      "key": "Count each cell",
      "sql": "SELECT cohort, month_no,\n       COUNT(DISTINCT customer_id) AS customers\nGROUP BY cohort, month_no;",
      "grids": [
        {
          "columns": [
            "cohort",
            "month_no",
            "customers"
          ],
          "rows": [
            [
              "2026-07",
              "0",
              "3"
            ],
            [
              "2026-07",
              "1",
              "1"
            ],
            [
              "2026-07",
              "2",
              "2"
            ],
            [
              "2026-07",
              "3",
              "1"
            ],
            [
              "2026-08",
              "0",
              "3"
            ],
            [
              "2026-08",
              "1",
              "1"
            ],
            [
              "2026-08",
              "2",
              "2"
            ],
            [
              "2026-09",
              "0",
              "2"
            ],
            [
              "2026-09",
              "1",
              "1"
            ]
          ]
        }
      ],
      "says": "Count the customers, not the orders, in each cohort and month. COUNT(DISTINCT ...) counts Amara once, however many orders there are."
    },
    {
      "key": "The cohort grid",
      "sql": "COUNT(DISTINCT customer_id) FILTER (WHERE month_no = 1) AS m1",
      "grids": [
        {
          "columns": [
            "cohort",
            "m0",
            "m1",
            "m2",
            "m3"
          ],
          "rows": [
            [
              "2026-07",
              "3",
              "1",
              "2",
              "1"
            ],
            [
              "2026-08",
              "3",
              "1",
              "2",
              "0"
            ],
            [
              "2026-09",
              "2",
              "1",
              "0",
              "0"
            ]
          ]
        }
      ],
      "says": "Pivot it: one row per cohort, one column per month since joining. Read across to see each cohort come back. The 0s at the bottom right are months that haven’t happened yet, not customers who left."
    },
    {
      "key": "A funnel",
      "sql": "WITH s(step, n) AS (VALUES ('viewed', 1), ('basket', 2),\n  ('checkout', 3), ('paid', 4))\nSELECT s.step, COUNT(DISTINCT v.session_id) AS sessions …",
      "grids": [
        {
          "columns": [
            "step",
            "sessions"
          ],
          "rows": [
            [
              "viewed",
              "10"
            ],
            [
              "basket",
              "6"
            ],
            [
              "checkout",
              "4"
            ],
            [
              "paid",
              "3"
            ]
          ]
        }
      ],
      "says": "A funnel counts the sessions that reach each step of buying a book. A small table of steps keeps them in order."
    },
    {
      "key": "How many go on",
      "sql": "ROUND(100.0 * sessions\n  / LAG(sessions) OVER (ORDER BY n), 1) AS pct_of_last",
      "grids": [
        {
          "columns": [
            "step",
            "sessions",
            "pct_of_last"
          ],
          "rows": [
            [
              "viewed",
              "10",
              null
            ],
            [
              "basket",
              "6",
              "60.0"
            ],
            [
              "checkout",
              "4",
              "66.7"
            ],
            [
              "paid",
              "3",
              "75.0"
            ]
          ],
          "on": [
            1
          ]
        }
      ],
      "says": "Divide by the step before, with LAG: 60% of viewers add to the basket, and it’s the biggest drop, so that’s the step to improve first."
    }
  ],
  "report-build": [
    {
      "key": "Monthly totals",
      "sql": "WITH monthly AS (\n  SELECT TO_CHAR(sold_on, 'YYYY-MM') AS month,\n         SUM(quantity) AS copies,\n         SUM(quantity * price) AS revenue\n  FROM sales GROUP BY month\n)",
      "grids": [
        {
          "columns": [
            "month",
            "copies",
            "revenue"
          ],
          "rows": [
            [
              "2026-08",
              "8",
              "80.71"
            ],
            [
              "2026-09",
              "8",
              "87.68"
            ],
            [
              "2026-10",
              "9",
              "98.24"
            ]
          ],
          "name": "monthly"
        }
      ],
      "says": "Step one answers one question: how much did each month sell?"
    },
    {
      "key": "Best seller each month",
      "sql": ", best AS (\n  SELECT month, title, SUM(quantity) AS copies,\n    ROW_NUMBER() OVER (PARTITION BY month\n      ORDER BY SUM(quantity) DESC, title) AS n\n  …\n)",
      "grids": [
        {
          "columns": [
            "month",
            "title",
            "copies",
            "n"
          ],
          "rows": [
            [
              "2026-08",
              "Dune",
              "3",
              "1"
            ],
            [
              "2026-08",
              "Things Fall Apart",
              "3",
              "2"
            ],
            [
              "2026-08",
              "Atomic Habits",
              "1",
              "3"
            ],
            [
              "2026-08",
              "Gone Girl",
              "1",
              "4"
            ],
            [
              "2026-09",
              "Atomic Habits",
              "2",
              "1"
            ],
            [
              "2026-09",
              "Gone Girl",
              "2",
              "2"
            ],
            [
              "2026-09",
              "Homegoing",
              "2",
              "3"
            ],
            [
              "2026-09",
              "Pride and Prejudice",
              "1",
              "4"
            ],
            [
              "2026-09",
              "Project Hail Mary",
              "1",
              "5"
            ],
            [
              "2026-10",
              "Half of a Yellow Sun",
              "3",
              "1"
            ],
            [
              "2026-10",
              "The Martian",
              "2",
              "2"
            ],
            [
              "2026-10",
              "Deep Work",
              "1",
              "3"
            ],
            [
              "2026-10",
              "Dune",
              "1",
              "4"
            ],
            [
              "2026-10",
              "Homegoing",
              "1",
              "5"
            ],
            [
              "2026-10",
              "Things Fall Apart",
              "1",
              "6"
            ]
          ],
          "name": "best",
          "on": [
            0,
            4,
            9
          ]
        }
      ],
      "says": "Step two answers another: which title sold most copies each month? Row 1 in each month wins. Dune and Things Fall Apart tie in August, and the title breaks the tie."
    },
    {
      "key": "Put it together",
      "sql": "SELECT m.month, m.revenue,\n  SUM(m.revenue) OVER (ORDER BY m.month) AS running,\n  b.title AS best\nFROM monthly AS m\nJOIN best AS b ON b.month = m.month AND b.n = 1;",
      "grids": [
        {
          "columns": [
            "month",
            "revenue",
            "running",
            "best"
          ],
          "rows": [
            [
              "2026-08",
              "80.71",
              "80.71",
              "Dune"
            ],
            [
              "2026-09",
              "87.68",
              "168.39",
              "Atomic Habits"
            ],
            [
              "2026-10",
              "98.24",
              "266.63",
              "Half of a Yellow Sun"
            ]
          ],
          "name": "report"
        }
      ],
      "says": "The final SELECT joins the two steps, then adds a running total. One query, ready to run again next month."
    },
    {
      "key": "Totals with ROLLUP",
      "sql": "SELECT COALESCE(genre, 'All genres') AS genre,\n       SUM(quantity) AS copies\nFROM sales\nGROUP BY ROLLUP (genre);",
      "grids": [
        {
          "columns": [
            "genre",
            "copies"
          ],
          "rows": [
            [
              "Classic",
              "5"
            ],
            [
              "Fiction",
              "6"
            ],
            [
              "Sci-fi",
              "7"
            ],
            [
              "Self-help",
              "4"
            ],
            [
              "Thriller",
              "3"
            ],
            [
              "All genres",
              "25"
            ]
          ],
          "on": [
            5
          ]
        }
      ],
      "says": "ROLLUP adds a grand total row to the groups. Its genre is NULL, so COALESCE gives it a label."
    }
  ]
}
