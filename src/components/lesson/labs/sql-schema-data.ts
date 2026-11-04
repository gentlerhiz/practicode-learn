// The tables the SQL labs in Modules 7 and 8 draw: each stage's statements, run on PGlite (PostgreSQL 0.5.8,
// the runner's version), with its rows exactly as PostgreSQL returned them. `on` rows are picked out, `off` rows
// are crossed out, and `error` is what PostgreSQL said when it refused a step.
import type { Stage } from './sql-stage-data'

export const SCHEMA_STAGES: Record<string, Stage[]> = {
  "type-choice": [
    {
      "key": "Numbers as text",
      "sql": "pages text\n…\nSELECT title, pages FROM books\nORDER BY pages DESC;",
      "grids": [
        {
          "columns": [
            "title",
            "pages"
          ],
          "rows": [
            [
              "Coraline",
              "96"
            ],
            [
              "Dune",
              "412"
            ],
            [
              "Good Omens",
              "288"
            ],
            [
              "Mort",
              "272"
            ]
          ],
          "on": [
            0
          ]
        }
      ],
      "says": "Text sorts character by character, like words in a dictionary. 9 comes after 4, so the 96-page book looks like the longest."
    },
    {
      "key": "Numbers as integer",
      "sql": "pages integer\n…\nSELECT title, pages FROM books\nORDER BY pages DESC;",
      "grids": [
        {
          "columns": [
            "title",
            "pages"
          ],
          "rows": [
            [
              "Dune",
              "412"
            ],
            [
              "Good Omens",
              "288"
            ],
            [
              "Mort",
              "272"
            ],
            [
              "Coraline",
              "96"
            ]
          ],
          "on": [
            0
          ]
        }
      ],
      "says": "As integers, the pages sort by size: Dune really is the longest. Sums and averages work too."
    },
    {
      "key": "Money as double precision",
      "sql": "amount double precision\n…\nSELECT SUM(amount) AS total FROM fines;",
      "grids": [
        {
          "columns": [
            "total"
          ],
          "rows": [
            [
              "0.9999999999999999"
            ]
          ]
        }
      ],
      "says": "double precision stores numbers in binary, where 0.10 can only be stored nearly. Ten fines of 0.10 come to 0.9999999999999999, not 1."
    },
    {
      "key": "Money as numeric",
      "sql": "amount numeric(5, 2)\n…\nSELECT SUM(amount) AS total FROM fines;",
      "grids": [
        {
          "columns": [
            "total"
          ],
          "rows": [
            [
              "1.00"
            ]
          ]
        }
      ],
      "says": "numeric(5, 2) stores exact decimals, up to 5 digits with 2 after the point. Ten fines of 0.10 come to exactly 1.00. Use it for money."
    },
    {
      "key": "Dates as text",
      "sql": "borrowed_on text\n…\nSELECT borrowed_on FROM loans\nORDER BY borrowed_on;",
      "grids": [
        {
          "columns": [
            "borrowed_on"
          ],
          "rows": [
            [
              "01/12/2025"
            ],
            [
              "03/11/2026"
            ],
            [
              "15/10/2026"
            ]
          ],
          "on": [
            1
          ]
        }
      ],
      "says": "As text, 03/11/2026 sorts before 15/10/2026, because 0 comes before 1, though it’s the later date. Text would also take 30/02/2026, or the word soon."
    },
    {
      "key": "Dates as date",
      "sql": "borrowed_on date\n…\nSELECT borrowed_on FROM loans\nORDER BY borrowed_on;",
      "grids": [
        {
          "columns": [
            "borrowed_on"
          ],
          "rows": [
            [
              "2025-12-01"
            ],
            [
              "2026-10-15"
            ],
            [
              "2026-11-03"
            ]
          ]
        }
      ],
      "says": "The date type sorts by time, can add days, and refuses dates that don’t exist, such as 30 February."
    }
  ],
  "relationship-kinds": [
    {
      "key": "One-to-many",
      "sql": "loans.member_id integer NOT NULL\n  REFERENCES members (id)",
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
          ],
          "name": "members",
          "on": [
            0
          ]
        },
        {
          "columns": [
            "id",
            "member_id",
            "book_id"
          ],
          "rows": [
            [
              "1",
              "1",
              "6"
            ],
            [
              "2",
              "1",
              "3"
            ],
            [
              "3",
              "2",
              "1"
            ],
            [
              "4",
              "3",
              "2"
            ],
            [
              "5",
              "3",
              "5"
            ],
            [
              "6",
              "2",
              "4"
            ]
          ],
          "name": "loans",
          "on": [
            0,
            1
          ]
        }
      ],
      "says": "One member, many loans. The foreign key goes on the many side: each loan names its one member, and Amara (id 1) appears in two loans."
    },
    {
      "key": "One-to-one",
      "sql": "cards.member_id integer NOT NULL UNIQUE\n  REFERENCES members (id)\n…\nINSERT INTO cards VALUES (4, 1, '2026-11-03');",
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
          ],
          "name": "members",
          "on": [
            0
          ]
        },
        {
          "columns": [
            "id",
            "member_id",
            "issued_on"
          ],
          "rows": [
            [
              "1",
              "1",
              "2025-03-14"
            ],
            [
              "2",
              "2",
              "2025-06-02"
            ],
            [
              "3",
              "3",
              "2026-01-20"
            ]
          ],
          "name": "cards",
          "on": [
            0
          ]
        }
      ],
      "says": "One member, one library card. UNIQUE on the foreign key lets each member appear once, so a second card for Amara is refused.",
      "error": "duplicate key value violates unique constraint \"cards_member_id_key\""
    },
    {
      "key": "Many-to-many",
      "sql": "book_authors (\n  book_id REFERENCES books (id),\n  author_id REFERENCES authors (id)\n)",
      "grids": [
        {
          "columns": [
            "id",
            "title"
          ],
          "rows": [
            [
              "1",
              "Good Omens"
            ],
            [
              "2",
              "Things Fall Apart"
            ],
            [
              "3",
              "Homegoing"
            ],
            [
              "4",
              "Mort"
            ],
            [
              "5",
              "Coraline"
            ],
            [
              "6",
              "Dune"
            ]
          ],
          "name": "books",
          "on": [
            0
          ]
        },
        {
          "columns": [
            "id",
            "name"
          ],
          "rows": [
            [
              "1",
              "Terry Pratchett"
            ],
            [
              "2",
              "Neil Gaiman"
            ],
            [
              "3",
              "Chinua Achebe"
            ],
            [
              "4",
              "Yaa Gyasi"
            ],
            [
              "5",
              "Frank Herbert"
            ]
          ],
          "name": "authors",
          "on": [
            0,
            1
          ]
        },
        {
          "columns": [
            "book_id",
            "author_id"
          ],
          "rows": [
            [
              "1",
              "1"
            ],
            [
              "1",
              "2"
            ],
            [
              "2",
              "3"
            ],
            [
              "3",
              "4"
            ],
            [
              "4",
              "1"
            ],
            [
              "5",
              "2"
            ],
            [
              "6",
              "5"
            ]
          ],
          "name": "book_authors",
          "on": [
            0,
            1
          ]
        }
      ],
      "says": "A book can have many authors, and an author many books. Neither table can hold the key, so a third table holds one row per pairing. Good Omens has two."
    },
    {
      "key": "Key on the wrong side",
      "sql": "members.loan_id integer",
      "grids": [
        {
          "columns": [
            "id",
            "name",
            "loan_id"
          ],
          "rows": [
            [
              "1",
              "Amara Okafor",
              "2"
            ],
            [
              "2",
              "Ben Carter",
              "3"
            ],
            [
              "3",
              "Chen Wei",
              "4"
            ]
          ],
          "name": "members",
          "on": [
            0
          ]
        }
      ],
      "says": "With the key on the one side, each member has room for one loan. Amara has borrowed two books, and the second has nowhere to go."
    }
  ],
  "normal-forms": [
    {
      "key": "A list in a cell",
      "sql": "SELECT member FROM loan_sheet\nWHERE books = 'Homegoing';",
      "grids": [
        {
          "columns": [
            "member",
            "email",
            "books"
          ],
          "rows": [
            [
              "Amara Okafor",
              "amara@example.com",
              "Dune, Homegoing"
            ],
            [
              "Ben Carter",
              "ben@example.com",
              "Homegoing"
            ],
            [
              "Chen Wei",
              "chen@example.com",
              "Mort, Homegoing"
            ]
          ],
          "name": "loan_sheet",
          "on": [
            0,
            2
          ]
        }
      ],
      "says": "Two cells hold lists of books. Searching for one book misses the rows where it shares a cell: this finds only Ben, though three members have Homegoing."
    },
    {
      "key": "First normal form",
      "sql": "SELECT member FROM loans\nWHERE title = 'Homegoing';",
      "grids": [
        {
          "columns": [
            "member",
            "email",
            "title"
          ],
          "rows": [
            [
              "Amara Okafor",
              "amara@example.com",
              "Dune"
            ],
            [
              "Amara Okafor",
              "amara@example.com",
              "Homegoing"
            ],
            [
              "Ben Carter",
              "ben@example.com",
              "Homegoing"
            ],
            [
              "Chen Wei",
              "chen@example.com",
              "Mort"
            ],
            [
              "Chen Wei",
              "chen@example.com",
              "Homegoing"
            ]
          ],
          "name": "loans",
          "on": [
            0,
            1,
            3,
            4
          ]
        }
      ],
      "says": "One value in each cell, so each loan gets its own row, and the search finds all three. But the emails repeat: Amara’s and Chen’s are each typed twice."
    },
    {
      "key": "Second normal form",
      "sql": "members (id, name, email)\nbooks (id, title)\nloans (member_id, book_id)",
      "grids": [
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
            ]
          ],
          "name": "members"
        },
        {
          "columns": [
            "id",
            "title"
          ],
          "rows": [
            [
              "1",
              "Dune"
            ],
            [
              "2",
              "Homegoing"
            ],
            [
              "3",
              "Mort"
            ]
          ],
          "name": "books"
        },
        {
          "columns": [
            "member_id",
            "book_id"
          ],
          "rows": [
            [
              "1",
              "1"
            ],
            [
              "1",
              "2"
            ],
            [
              "2",
              "2"
            ],
            [
              "3",
              "3"
            ],
            [
              "3",
              "2"
            ]
          ],
          "name": "loans"
        }
      ],
      "says": "An email is a fact about a member, not about a loan, so it moves to members and is stored once. Loans just link a member to a book."
    },
    {
      "key": "A new column",
      "sql": "books (id, title, publisher, city)",
      "grids": [
        {
          "columns": [
            "id",
            "title",
            "publisher",
            "city"
          ],
          "rows": [
            [
              "1",
              "Dune",
              "Riverbend Press",
              "London"
            ],
            [
              "2",
              "Homegoing",
              "Harbour House",
              "Lagos"
            ],
            [
              "3",
              "Mort",
              "Riverbend Press",
              "London"
            ]
          ],
          "name": "books",
          "on": [
            0,
            2
          ]
        }
      ],
      "says": "The library adds each book’s publisher and city. But the city is a fact about the publisher, not the book, so London is typed for every Riverbend Press book."
    },
    {
      "key": "Third normal form",
      "sql": "books (id, title, publisher_id)\npublishers (id, name, city)",
      "grids": [
        {
          "columns": [
            "id",
            "title",
            "publisher_id"
          ],
          "rows": [
            [
              "1",
              "Dune",
              "1"
            ],
            [
              "2",
              "Homegoing",
              "2"
            ],
            [
              "3",
              "Mort",
              "1"
            ]
          ],
          "name": "books"
        },
        {
          "columns": [
            "id",
            "name",
            "city"
          ],
          "rows": [
            [
              "1",
              "Riverbend Press",
              "London"
            ],
            [
              "2",
              "Harbour House",
              "Lagos"
            ]
          ],
          "name": "publishers"
        }
      ],
      "says": "The city moves to publishers, stored once, and each book points at its publisher. Every column now describes its own table’s key and nothing else."
    }
  ],
  "junction-table": [
    {
      "key": "Authors of one book",
      "sql": "SELECT a.name\nFROM book_authors AS ba\nJOIN authors AS a ON a.id = ba.author_id\nWHERE ba.book_id = 1;",
      "grids": [
        {
          "columns": [
            "book_id",
            "author_id"
          ],
          "rows": [
            [
              "1",
              "1"
            ],
            [
              "1",
              "2"
            ],
            [
              "2",
              "3"
            ],
            [
              "3",
              "4"
            ],
            [
              "4",
              "1"
            ],
            [
              "5",
              "2"
            ],
            [
              "6",
              "5"
            ]
          ],
          "name": "book_authors",
          "on": [
            0,
            1
          ]
        },
        {
          "columns": [
            "name"
          ],
          "rows": [
            [
              "Neil Gaiman"
            ],
            [
              "Terry Pratchett"
            ]
          ],
          "name": "result"
        }
      ],
      "says": "Book 1, Good Omens, has two rows in book_authors, so it has two authors. Join each row to authors for their names."
    },
    {
      "key": "Books by one author",
      "sql": "SELECT b.title\nFROM book_authors AS ba\nJOIN books AS b ON b.id = ba.book_id\nWHERE ba.author_id = 1;",
      "grids": [
        {
          "columns": [
            "book_id",
            "author_id"
          ],
          "rows": [
            [
              "1",
              "1"
            ],
            [
              "1",
              "2"
            ],
            [
              "2",
              "3"
            ],
            [
              "3",
              "4"
            ],
            [
              "4",
              "1"
            ],
            [
              "5",
              "2"
            ],
            [
              "6",
              "5"
            ]
          ],
          "name": "book_authors",
          "on": [
            0,
            4
          ]
        },
        {
          "columns": [
            "title"
          ],
          "rows": [
            [
              "Good Omens"
            ],
            [
              "Mort"
            ]
          ],
          "name": "result"
        }
      ],
      "says": "Read the same table the other way: author 1, Terry Pratchett, has two rows, so two books."
    },
    {
      "key": "Books per author",
      "sql": "SELECT a.name, COUNT(*) AS books\nFROM authors AS a\nJOIN book_authors AS ba ON ba.author_id = a.id\nGROUP BY a.name;",
      "grids": [
        {
          "columns": [
            "name",
            "books"
          ],
          "rows": [
            [
              "Neil Gaiman",
              "2"
            ],
            [
              "Terry Pratchett",
              "2"
            ],
            [
              "Chinua Achebe",
              "1"
            ],
            [
              "Frank Herbert",
              "1"
            ],
            [
              "Yaa Gyasi",
              "1"
            ]
          ],
          "name": "result",
          "on": [
            0,
            1
          ]
        }
      ],
      "says": "Each row is one pairing, so counting rows per author counts books. Good Omens counts once for each of its two authors."
    },
    {
      "key": "The same pair twice",
      "sql": "INSERT INTO book_authors\nVALUES (1, 1);",
      "grids": [
        {
          "columns": [
            "book_id",
            "author_id"
          ],
          "rows": [
            [
              "1",
              "1"
            ],
            [
              "1",
              "2"
            ],
            [
              "2",
              "3"
            ],
            [
              "3",
              "4"
            ],
            [
              "4",
              "1"
            ],
            [
              "5",
              "2"
            ],
            [
              "6",
              "5"
            ]
          ],
          "name": "book_authors",
          "on": [
            0
          ]
        }
      ],
      "says": "The primary key is the pair (book_id, author_id), so the same pairing can’t be stored twice. Book 1 can still have other authors, and author 1 other books.",
      "error": "duplicate key value violates unique constraint \"book_authors_pkey\""
    },
    {
      "key": "A list in a column",
      "sql": "SELECT title FROM books\nWHERE authors = 'Neil Gaiman';",
      "grids": [
        {
          "columns": [
            "id",
            "title",
            "authors"
          ],
          "rows": [
            [
              "1",
              "Good Omens",
              "Terry Pratchett, Neil Gaiman"
            ],
            [
              "4",
              "Mort",
              "Terry Pratchett"
            ],
            [
              "5",
              "Coraline",
              "Neil Gaiman"
            ]
          ],
          "name": "books",
          "on": [
            0,
            2
          ]
        },
        {
          "columns": [
            "title"
          ],
          "rows": [
            [
              "Coraline"
            ]
          ],
          "name": "result"
        }
      ],
      "says": "Without a junction table, the authors end up as a list in one cell. Asking for Neil Gaiman’s books finds Coraline and misses Good Omens."
    }
  ],
  "naming-rules": [
    {
      "key": "Capital letters",
      "sql": "CREATE TABLE Members (\n  Id integer,\n  FullName text\n);",
      "grids": [
        {
          "columns": [
            "table_name",
            "column_name"
          ],
          "rows": [
            [
              "members",
              "id"
            ],
            [
              "members",
              "fullname"
            ]
          ]
        }
      ],
      "says": "PostgreSQL turns names without quotes into lower case. Members becomes members, and FullName becomes fullname, which is harder to read."
    },
    {
      "key": "Quotes around a name",
      "sql": "CREATE TABLE \"Members\" (id integer);\nSELECT * FROM Members;",
      "grids": [
        {
          "columns": [
            "table_name",
            "column_name"
          ],
          "rows": [
            [
              "Members",
              "id"
            ]
          ]
        }
      ],
      "says": "Quotes keep the capital M, but now every query must write \"Members\" in quotes. Without them, PostgreSQL looks for members and can’t find it.",
      "error": "relation \"members\" does not exist"
    },
    {
      "key": "A reserved word",
      "sql": "CREATE TABLE order (id integer);",
      "grids": [
        {
          "columns": [
            "table_name",
            "column_name"
          ],
          "rows": []
        }
      ],
      "says": "ORDER is part of SQL itself, as in ORDER BY, so it can’t be a name without quotes. Call the table orders instead.",
      "error": "syntax error at or near \"order\""
    },
    {
      "key": "A space in a name",
      "sql": "CREATE TABLE loan items (id integer);",
      "grids": [
        {
          "columns": [
            "table_name",
            "column_name"
          ],
          "rows": []
        }
      ],
      "says": "A space ends a name, so PostgreSQL reads loan, then trips over items. Join the words with an underscore: loan_items.",
      "error": "syntax error at or near \"items\""
    },
    {
      "key": "snake_case",
      "sql": "CREATE TABLE loan_items (\n  loan_id integer,\n  borrowed_on date\n);",
      "grids": [
        {
          "columns": [
            "table_name",
            "column_name"
          ],
          "rows": [
            [
              "loan_items",
              "loan_id"
            ],
            [
              "loan_items",
              "borrowed_on"
            ]
          ]
        }
      ],
      "says": "Lower-case words joined by underscores, called snake_case: no quotes needed, nothing changes case, and it’s easy to read."
    }
  ],
  "create-table": [
    {
      "key": "Columns and types",
      "sql": "CREATE TABLE members (\n  id integer PRIMARY KEY,\n  name text NOT NULL,\n  email text NOT NULL UNIQUE\n);",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type",
            "is_nullable"
          ],
          "rows": [
            [
              "id",
              "integer",
              "NO"
            ],
            [
              "name",
              "text",
              "NO"
            ],
            [
              "email",
              "text",
              "NO"
            ]
          ]
        }
      ],
      "says": "Each column gets a name, a type and its rules. PostgreSQL describes every table in information_schema.columns: the primary key is NOT NULL without being told."
    },
    {
      "key": "An identity id",
      "sql": "CREATE TABLE members (\n  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL\n);\nINSERT INTO members (name) VALUES ('Amara Okafor'), ('Ben Carter');\nINSERT INTO members (id, name) VALUES (9, 'Chen Wei');",
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
            ]
          ],
          "name": "members"
        }
      ],
      "says": "The database numbers the rows 1, 2 and so on. GENERATED ALWAYS also refuses an id you choose yourself, so the numbers can’t clash.",
      "error": "cannot insert a non-DEFAULT value into column \"id\""
    },
    {
      "key": "Defaults and checks",
      "sql": "CREATE TABLE members (\n  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL,\n  email text NOT NULL UNIQUE CHECK (email LIKE '%@%'),\n  joined_on date NOT NULL DEFAULT CURRENT_DATE\n);",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type",
            "column_default"
          ],
          "rows": [
            [
              "id",
              "integer",
              null
            ],
            [
              "name",
              "text",
              null
            ],
            [
              "email",
              "text",
              null
            ],
            [
              "joined_on",
              "date",
              "CURRENT_DATE"
            ]
          ]
        }
      ],
      "says": "DEFAULT CURRENT_DATE fills in today when no date is given. The CHECK doesn’t show in this list, but it guards every row that goes in."
    },
    {
      "key": "It already exists",
      "sql": "CREATE TABLE members (id integer PRIMARY KEY, name text NOT NULL);\nCREATE TABLE members (id integer PRIMARY KEY, name text NOT NULL);",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type",
            "is_nullable"
          ],
          "rows": [
            [
              "id",
              "integer",
              "NO"
            ],
            [
              "name",
              "text",
              "NO"
            ]
          ]
        }
      ],
      "says": "The second CREATE TABLE is refused, because members is already there. Usually that’s what you want: you find out straight away.",
      "error": "relation \"members\" already exists"
    },
    {
      "key": "IF NOT EXISTS",
      "sql": "CREATE TABLE members (id integer PRIMARY KEY, name text NOT NULL);\nCREATE TABLE IF NOT EXISTS members (\n  id integer PRIMARY KEY, name text NOT NULL, email text\n);",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type",
            "is_nullable"
          ],
          "rows": [
            [
              "id",
              "integer",
              "NO"
            ],
            [
              "name",
              "text",
              "NO"
            ]
          ]
        }
      ],
      "says": "IF NOT EXISTS skips quietly when the table is already there. But it doesn’t compare the two: members still has no email column."
    }
  ],
  "alter-table": [
    {
      "key": "Add a column",
      "sql": "ALTER TABLE members ADD COLUMN phone text;",
      "grids": [
        {
          "columns": [
            "id",
            "name",
            "email",
            "phone"
          ],
          "rows": [
            [
              "1",
              "Amara Okafor",
              "amara@example.com",
              null
            ],
            [
              "2",
              "Ben Carter",
              "ben@example.com",
              null
            ],
            [
              "3",
              "Chen Wei",
              "chen@example.com",
              null
            ]
          ],
          "name": "members"
        }
      ],
      "says": "The new column is added to every row, empty (NULL) until someone fills it in."
    },
    {
      "key": "Add a required column",
      "sql": "ALTER TABLE members ADD COLUMN phone text NOT NULL;",
      "grids": [
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
            ]
          ],
          "name": "members"
        }
      ],
      "says": "Refused: the three members already there would have no phone, which NOT NULL forbids. Nothing changes.",
      "error": "column \"phone\" of relation \"members\" contains null values"
    },
    {
      "key": "Required with a default",
      "sql": "ALTER TABLE members\n  ADD COLUMN active boolean NOT NULL DEFAULT true;",
      "grids": [
        {
          "columns": [
            "id",
            "name",
            "email",
            "active"
          ],
          "rows": [
            [
              "1",
              "Amara Okafor",
              "amara@example.com",
              "true"
            ],
            [
              "2",
              "Ben Carter",
              "ben@example.com",
              "true"
            ],
            [
              "3",
              "Chen Wei",
              "chen@example.com",
              "true"
            ]
          ],
          "name": "members"
        }
      ],
      "says": "With a DEFAULT, every existing row gets the value straight away, so NOT NULL is satisfied."
    },
    {
      "key": "Rename a column",
      "sql": "ALTER TABLE members RENAME COLUMN name TO full_name;",
      "grids": [
        {
          "columns": [
            "id",
            "full_name",
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
            ]
          ],
          "name": "members"
        }
      ],
      "says": "The data stays and only the name changes. Any query that still asks for name will now fail."
    },
    {
      "key": "Drop a column",
      "sql": "ALTER TABLE members DROP COLUMN email;",
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
            ]
          ],
          "name": "members"
        }
      ],
      "says": "The column and every value in it are gone. There’s no undo, unless you made the change inside a transaction."
    },
    {
      "key": "Change a type",
      "sql": "ALTER TABLE fines\n  ALTER COLUMN amount TYPE numeric(5, 2)\n  USING amount::numeric;",
      "grids": [
        {
          "columns": [
            "id",
            "amount"
          ],
          "rows": [
            [
              "1",
              "0.50"
            ],
            [
              "2",
              "1.20"
            ],
            [
              "3",
              "2.00"
            ]
          ],
          "name": "fines"
        },
        {
          "columns": [
            "column_name",
            "data_type"
          ],
          "rows": [
            [
              "id",
              "integer"
            ],
            [
              "amount",
              "numeric"
            ]
          ],
          "name": "information_schema.columns"
        }
      ],
      "says": "TYPE changes the column, and USING says how to convert each value: 2 becomes 2.00. If one value can’t convert, such as the word free, the whole change is refused."
    }
  ],
  "index-plan": [
    {
      "key": "No index",
      "sql": "EXPLAIN SELECT * FROM loans\nWHERE member_id = 42;",
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
              "  Filter: (member_id = 42)"
            ]
          ]
        }
      ],
      "says": "Seq Scan means a sequential scan: with no index, PostgreSQL reads all 20,000 loans to find member 42’s ten."
    },
    {
      "key": "With an index",
      "sql": "CREATE INDEX loans_member_id_idx ON loans (member_id);\nEXPLAIN SELECT * FROM loans\nWHERE member_id = 42;",
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
              "  Recheck Cond: (member_id = 42)"
            ],
            [
              "  ->  Bitmap Index Scan on loans_member_id_idx"
            ],
            [
              "        Index Cond: (member_id = 42)"
            ]
          ]
        }
      ],
      "says": "Now the plan uses the index: it looks up 42, finds where those ten rows are, and reads only them."
    },
    {
      "key": "The primary key",
      "sql": "EXPLAIN SELECT * FROM loans\nWHERE id = 42;",
      "grids": [
        {
          "columns": [
            "QUERY PLAN"
          ],
          "rows": [
            [
              "Index Scan using loans_pkey on loans"
            ],
            [
              "  Index Cond: (id = 42)"
            ]
          ]
        }
      ],
      "says": "You never made this index: every primary key gets one automatically, and so does every UNIQUE column."
    },
    {
      "key": "A different column",
      "sql": "CREATE INDEX loans_member_id_idx ON loans (member_id);\nEXPLAIN SELECT * FROM loans\nWHERE borrowed_on = '2021-03-01';",
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
              "  Filter: (borrowed_on = '2021-03-01'::date)"
            ]
          ]
        }
      ],
      "says": "An index helps only searches on its own column. This one is on member_id, so a search by date still reads every row."
    },
    {
      "key": "A tiny table",
      "sql": "CREATE INDEX loans_member_id_idx ON loans (member_id);\nEXPLAIN SELECT * FROM loans\nWHERE member_id = 2;",
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
              "  Filter: (member_id = 2)"
            ]
          ]
        }
      ],
      "says": "This loans table has six rows. Reading them all is quicker than using the index, and PostgreSQL knows it: indexes pay off on big tables."
    }
  ],
  "view-steps": [
    {
      "key": "CREATE VIEW",
      "sql": "CREATE VIEW on_loan AS\nSELECT m.name, b.title, l.borrowed_on\nFROM loans AS l\nJOIN members AS m ON m.id = l.member_id\nJOIN books AS b ON b.id = l.book_id\nWHERE l.returned_on IS NULL;",
      "grids": [
        {
          "columns": [
            "table_name",
            "table_type"
          ],
          "rows": [
            [
              "authors",
              "BASE TABLE"
            ],
            [
              "book_authors",
              "BASE TABLE"
            ],
            [
              "books",
              "BASE TABLE"
            ],
            [
              "loans",
              "BASE TABLE"
            ],
            [
              "members",
              "BASE TABLE"
            ],
            [
              "on_loan",
              "VIEW"
            ]
          ],
          "on": [
            5
          ]
        }
      ],
      "says": "The view is saved under its own name, beside the tables. It stores the query, not any rows."
    },
    {
      "key": "Use it like a table",
      "sql": "SELECT * FROM on_loan;",
      "grids": [
        {
          "columns": [
            "name",
            "title",
            "borrowed_on"
          ],
          "rows": [
            [
              "Amara Okafor",
              "Homegoing",
              "2026-10-02"
            ],
            [
              "Chen Wei",
              "Things Fall Apart",
              "2026-10-10"
            ],
            [
              "Chen Wei",
              "Coraline",
              "2026-10-12"
            ],
            [
              "Ben Carter",
              "Mort",
              "2026-10-20"
            ]
          ],
          "name": "on_loan"
        }
      ],
      "says": "Querying the view runs its query: the four loans not yet returned, with names and titles already joined."
    },
    {
      "key": "The data changes",
      "sql": "UPDATE loans SET returned_on = '2026-11-02'\nWHERE id = 5;",
      "grids": [
        {
          "columns": [
            "id",
            "member_id",
            "book_id",
            "returned_on"
          ],
          "rows": [
            [
              "1",
              "1",
              "6",
              "2026-09-15"
            ],
            [
              "2",
              "1",
              "3",
              null
            ],
            [
              "3",
              "2",
              "1",
              "2026-10-04"
            ],
            [
              "4",
              "3",
              "2",
              null
            ],
            [
              "5",
              "3",
              "5",
              "2026-11-02"
            ],
            [
              "6",
              "2",
              "4",
              null
            ]
          ],
          "name": "loans",
          "on": [
            4
          ]
        }
      ],
      "says": "Chen returns Coraline. Only the loans table changes: nobody touches the view."
    },
    {
      "key": "The view keeps up",
      "sql": "SELECT * FROM on_loan;",
      "grids": [
        {
          "columns": [
            "name",
            "title",
            "borrowed_on"
          ],
          "rows": [
            [
              "Amara Okafor",
              "Homegoing",
              "2026-10-02"
            ],
            [
              "Chen Wei",
              "Things Fall Apart",
              "2026-10-10"
            ],
            [
              "Ben Carter",
              "Mort",
              "2026-10-20"
            ]
          ],
          "name": "on_loan"
        }
      ],
      "says": "The view runs its query again, so it’s up to date by itself: three loans now."
    }
  ],
  "migration-run": [
    {
      "key": "Migration 001",
      "sql": "-- 001_create_members.sql\nCREATE TABLE members (\n  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL\n);\nINSERT INTO schema_migrations VALUES ('001');",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type"
          ],
          "rows": [
            [
              "id",
              "integer"
            ],
            [
              "name",
              "text"
            ]
          ],
          "name": "members"
        },
        {
          "columns": [
            "version"
          ],
          "rows": [
            [
              "001"
            ]
          ],
          "name": "schema_migrations",
          "on": [
            0
          ]
        }
      ],
      "says": "The first migration creates members, then records 001 in schema_migrations, the table that remembers what has run."
    },
    {
      "key": "Migration 002",
      "sql": "-- 002_add_email.sql\nALTER TABLE members ADD COLUMN email text;\nINSERT INTO schema_migrations VALUES ('002');",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type"
          ],
          "rows": [
            [
              "id",
              "integer"
            ],
            [
              "name",
              "text"
            ],
            [
              "email",
              "text"
            ]
          ],
          "name": "members",
          "on": [
            2
          ]
        },
        {
          "columns": [
            "version"
          ],
          "rows": [
            [
              "001"
            ],
            [
              "002"
            ]
          ],
          "name": "schema_migrations",
          "on": [
            1
          ]
        }
      ],
      "says": "The next file builds on the last: members gains an email column, and 002 is recorded."
    },
    {
      "key": "Migration 003",
      "sql": "-- 003_rename_name.sql\nALTER TABLE members RENAME COLUMN name TO full_name;\nINSERT INTO schema_migrations VALUES ('003');",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type"
          ],
          "rows": [
            [
              "id",
              "integer"
            ],
            [
              "full_name",
              "text"
            ],
            [
              "email",
              "text"
            ]
          ],
          "name": "members",
          "on": [
            1
          ]
        },
        {
          "columns": [
            "version"
          ],
          "rows": [
            [
              "001"
            ],
            [
              "002"
            ],
            [
              "003"
            ]
          ],
          "name": "schema_migrations",
          "on": [
            2
          ]
        }
      ],
      "says": "A rename is a change too, so it gets its own migration. Every copy of the database that runs 001 to 003 ends up the same."
    },
    {
      "key": "Run them again",
      "sql": "-- 001, 002 and 003 are already in schema_migrations.\n-- Nothing new to run.",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type"
          ],
          "rows": [
            [
              "id",
              "integer"
            ],
            [
              "full_name",
              "text"
            ],
            [
              "email",
              "text"
            ]
          ],
          "name": "members"
        },
        {
          "columns": [
            "version"
          ],
          "rows": [
            [
              "001"
            ],
            [
              "002"
            ],
            [
              "003"
            ]
          ],
          "name": "schema_migrations"
        }
      ],
      "says": "Next time, the tool checks schema_migrations first. All three are recorded, so it runs nothing, and the database stays as it is."
    },
    {
      "key": "Without the record",
      "sql": "-- 001_create_members.sql\nCREATE TABLE members (\n  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL\n);\nINSERT INTO schema_migrations VALUES ('001');",
      "grids": [
        {
          "columns": [
            "column_name",
            "data_type"
          ],
          "rows": [
            [
              "id",
              "integer"
            ],
            [
              "full_name",
              "text"
            ],
            [
              "email",
              "text"
            ]
          ],
          "name": "members"
        }
      ],
      "says": "Without schema_migrations, nothing would stop 001 running twice, and it fails: members already exists. That record is what makes migrations safe to run again.",
      "error": "relation \"members\" already exists"
    }
  ],
  "seed-run": [
    {
      "key": "Run a seed twice",
      "sql": "INSERT INTO genres (name)\nVALUES ('Fiction'), ('Sci-fi'), ('Poetry');\n-- and again",
      "grids": [
        {
          "columns": [
            "id",
            "name"
          ],
          "rows": [
            [
              "1",
              "Fiction"
            ],
            [
              "2",
              "Sci-fi"
            ],
            [
              "3",
              "Poetry"
            ]
          ],
          "name": "genres"
        }
      ],
      "says": "The first run adds three genres. The second is refused, because the names are already there, and a setup script that stops halfway is no use.",
      "error": "duplicate key value violates unique constraint \"genres_name_key\""
    },
    {
      "key": "Safe to run twice",
      "sql": "INSERT INTO genres (name)\nVALUES ('Fiction'), ('Sci-fi'), ('Poetry')\nON CONFLICT DO NOTHING;",
      "grids": [
        {
          "columns": [
            "id",
            "name"
          ],
          "rows": [
            [
              "1",
              "Fiction"
            ],
            [
              "2",
              "Sci-fi"
            ],
            [
              "5",
              "Poetry"
            ]
          ],
          "name": "genres",
          "on": [
            2
          ]
        }
      ],
      "says": "The seed ran once with two genres, then again with Poetry added. ON CONFLICT DO NOTHING skips the rows already there and adds the new one. Skipped rows still use up ids, so Poetry is 5: gaps are normal."
    },
    {
      "key": "Seed in the wrong order",
      "sql": "INSERT INTO loans (member_id, book_id, borrowed_on)\nVALUES (1, 1, '2026-11-03');",
      "grids": [
        {
          "columns": [
            "loans"
          ],
          "rows": [
            [
              "0"
            ]
          ],
          "name": "loans"
        }
      ],
      "says": "Loans point at members and books, so those rows must go in first. Seed tables in the order they were created.",
      "error": "insert or update on table \"loans\" violates foreign key constraint \"loans_member_id_fkey\""
    },
    {
      "key": "Your own ids",
      "sql": "INSERT INTO genres (id, name)\nVALUES (1, 'Fiction'), (2, 'Sci-fi');\n-- later, the app adds one:\nINSERT INTO genres (name) VALUES ('Poetry');",
      "grids": [
        {
          "columns": [
            "id",
            "name"
          ],
          "rows": [
            [
              "1",
              "Fiction"
            ],
            [
              "2",
              "Sci-fi"
            ]
          ],
          "name": "genres"
        }
      ],
      "says": "The seed chose ids 1 and 2 itself, so the counter never moved. The next genre is given id 1 and clashes. Leave ids out, and let the database number the rows.",
      "error": "duplicate key value violates unique constraint \"genres_pkey\""
    },
    {
      "key": "Lots of practice rows",
      "sql": "INSERT INTO members (name, email, joined_on)\nSELECT 'Member ' || n, 'member' || n || '@example.com', '2026-11-03'\nFROM generate_series(1, 100) AS n;",
      "grids": [
        {
          "columns": [
            "id",
            "name",
            "email"
          ],
          "rows": [
            [
              "1",
              "Member 1",
              "member1@example.com"
            ],
            [
              "2",
              "Member 2",
              "member2@example.com"
            ],
            [
              "3",
              "Member 3",
              "member3@example.com"
            ]
          ],
          "name": "members"
        },
        {
          "columns": [
            "members"
          ],
          "rows": [
            [
              "100"
            ]
          ],
          "name": "count"
        }
      ],
      "says": "generate_series(1, 100) makes the numbers 1 to 100, one row each. Build a name and an email from each number, and 100 made-up members go in at once."
    }
  ]
}
