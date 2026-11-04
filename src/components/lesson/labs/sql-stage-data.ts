// The tables the SQL labs in Modules 5 and 6 draw: each stage's query, run on PGlite (PostgreSQL 0.5.8, the
// runner's version), with its rows exactly as PostgreSQL returned them. `on` rows are picked out (changed,
// added or kept), `off` rows are crossed out, and `error` is what PostgreSQL said when it refused a step.
export type Grid = {
  name?: string
  columns: string[]
  rows: (string | null)[][]
  on?: number[]
  off?: number[]
}
export type Stage = { key: string; sql: string; grids: Grid[]; error?: string; says: string }

export const STAGES: Record<string, Stage[]> = {
  'subquery-steps': [
    {
      key: 'The inner query',
      sql: 'SELECT AVG(price) FROM books',
      grids: [
        {
          columns: ['avg'],
          rows: [['11.1633333333333333']],
        },
      ],
      says: 'The query in brackets runs first, on its own: the average price of all six books.',
    },
    {
      key: 'Its answer',
      sql: 'WHERE price > 11.1633333333333333',
      grids: [
        {
          columns: ['title', 'price'],
          rows: [
            ['Things Fall Apart', '8.75'],
            ['Atomic Habits', '12.50'],
            ['Dune', '10.99'],
            ['Gone Girl', '8.99'],
            ['Homegoing', '12.00'],
            ['Deep Work', '13.75'],
          ],
          name: 'books',
          on: [1, 4, 5],
        },
      ],
      says: 'Its one answer takes the place of the brackets, as if you had typed the number in yourself.',
    },
    {
      key: 'The outer query',
      sql: 'SELECT title, price FROM books\nWHERE price > (SELECT AVG(price) FROM books);',
      grids: [
        {
          columns: ['title', 'price'],
          rows: [
            ['Atomic Habits', '12.50'],
            ['Homegoing', '12.00'],
            ['Deep Work', '13.75'],
          ],
        },
      ],
      says: 'Then the outer query runs with it: 3 books cost more than the average.',
    },
  ],
  'from-subquery': [
    {
      key: 'The inner query',
      sql: 'SELECT oi.order_id, SUM(oi.quantity * b.price) AS total\nFROM order_items AS oi JOIN books AS b ON b.id = oi.book_id\nGROUP BY oi.order_id',
      grids: [
        {
          columns: ['order_id', 'total'],
          rows: [
            ['1', '28.49'],
            ['2', '12.50'],
            ['3', '12.00'],
            ['4', '21.98'],
            ['5', '33.49'],
            ['6', '8.75'],
            ['7', '28.97'],
          ],
        },
      ],
      says: 'The query in brackets runs first and builds a table of its own: one total for each order.',
    },
    {
      key: 'A table called t',
      sql: 'FROM ( … ) AS t\nWHERE total > 20',
      grids: [
        {
          columns: ['order_id', 'total'],
          rows: [
            ['1', '28.49'],
            ['2', '12.50'],
            ['3', '12.00'],
            ['4', '21.98'],
            ['5', '33.49'],
            ['6', '8.75'],
            ['7', '28.97'],
          ],
          name: 't',
          on: [0, 3, 4, 6],
        },
      ],
      says: 'Named t, that result is a table like any other. The outer query can filter its rows.',
    },
    {
      key: 'The outer query',
      sql: 'SELECT COUNT(*) AS big_orders\nFROM ( … ) AS t\nWHERE total > 20;',
      grids: [
        {
          columns: ['big_orders'],
          rows: [['4']],
        },
      ],
      says: 'Then the outer query summarises it: 4 orders came to more than 20.',
    },
  ],
  'cte-steps': [
    {
      key: 'WITH spent',
      sql: 'WITH spent AS (\n  SELECT c.name, SUM(oi.quantity * b.price) AS spent\n  … GROUP BY c.name\n)',
      grids: [
        {
          columns: ['name', 'spent'],
          rows: [
            ['Amara Okafor', '69.46'],
            ['Chen Wei', '45.99'],
            ['Ben Carter', '21.98'],
            ['Emeka Obi', '8.75'],
          ],
          name: 'spent',
        },
      ],
      says: 'WITH names a step: spent is each customer’s total, ready to be used by name.',
    },
    {
      key: 'Use it once',
      sql: 'SELECT AVG(spent) FROM spent',
      grids: [
        {
          columns: ['avg'],
          rows: [['36.5450000000000000']],
        },
      ],
      says: 'The next query can read spent like a table: the average customer spent this much.',
    },
    {
      key: 'Use it again',
      sql: 'SELECT name, spent FROM spent\nWHERE spent > (SELECT AVG(spent) FROM spent);',
      grids: [
        {
          columns: ['name', 'spent'],
          rows: [
            ['Amara Okafor', '69.46'],
            ['Chen Wei', '45.99'],
          ],
        },
      ],
      says: 'And the same name can be used twice in one query: the customers who spent more than average.',
    },
  ],
  'exists-check': [
    {
      key: 'Has an order',
      sql: 'EXISTS (SELECT 1 FROM orders AS o\n        WHERE o.customer_id = c.id)',
      grids: [
        {
          columns: ['name', 'answer'],
          rows: [
            ['Amara Okafor', 'true'],
            ['Ben Carter', 'true'],
            ['Chen Wei', 'true'],
            ['Daniela Ruiz', 'false'],
            ['Emeka Obi', 'true'],
            ['Grace Mensah', 'false'],
          ],
          on: [0, 1, 2, 4],
        },
      ],
      says: 'For each customer, EXISTS asks: is there at least one matching order? It never needs to count them.',
    },
    {
      key: 'Has no order',
      sql: 'NOT EXISTS (SELECT 1 FROM orders AS o\n            WHERE o.customer_id = c.id)',
      grids: [
        {
          columns: ['name', 'answer'],
          rows: [
            ['Amara Okafor', 'false'],
            ['Ben Carter', 'false'],
            ['Chen Wei', 'false'],
            ['Daniela Ruiz', 'true'],
            ['Emeka Obi', 'false'],
            ['Grace Mensah', 'true'],
          ],
          on: [3, 5],
        },
      ],
      says: 'NOT EXISTS flips it: the customers with nothing to match.',
    },
    {
      key: 'NOT IN a clean list',
      sql: 'id NOT IN (1, 2, 3, 5)',
      grids: [
        {
          columns: ['name', 'answer'],
          rows: [
            ['Amara Okafor', 'false'],
            ['Ben Carter', 'false'],
            ['Chen Wei', 'false'],
            ['Daniela Ruiz', 'true'],
            ['Emeka Obi', 'false'],
            ['Grace Mensah', 'true'],
          ],
          on: [3, 5],
        },
      ],
      says: 'With a list of real values, NOT IN gives the same customers as NOT EXISTS.',
    },
    {
      key: 'NOT IN a list with a NULL',
      sql: 'id NOT IN (1, 2, 3, 5, NULL)',
      grids: [
        {
          columns: ['name', 'answer'],
          rows: [
            ['Amara Okafor', 'false'],
            ['Ben Carter', 'false'],
            ['Chen Wei', 'false'],
            ['Daniela Ruiz', null],
            ['Emeka Obi', 'false'],
            ['Grace Mensah', null],
          ],
          on: [],
        },
      ],
      says: 'One NULL in the list, and nobody can be shown not to be in it: the answer is unknown, and WHERE keeps no rows at all. NOT EXISTS doesn’t have this trap.',
    },
  ],
  'set-ops': [
    {
      key: 'UNION',
      sql: 'SELECT name FROM customers\nUNION\nSELECT name FROM signups;',
      grids: [
        {
          columns: ['name'],
          rows: [
            ['Amara Okafor'],
            ['Ben Carter'],
            ['Chen Wei'],
            ['Daniela Ruiz'],
            ['Emeka Obi'],
            ['Grace Mensah'],
          ],
          name: 'customers',
        },
        {
          columns: ['name'],
          rows: [['Amara Okafor'], ['Kemi Adeyemi'], ['Grace Mensah'], ['Liam Byrne'], ['Kemi Adeyemi']],
          name: 'signups',
        },
        {
          columns: ['name'],
          rows: [
            ['Amara Okafor'],
            ['Ben Carter'],
            ['Chen Wei'],
            ['Daniela Ruiz'],
            ['Emeka Obi'],
            ['Grace Mensah'],
            ['Kemi Adeyemi'],
            ['Liam Byrne'],
          ],
          name: 'result',
        },
      ],
      says: 'Both lists stacked into one, with repeats removed: 8 different people.',
    },
    {
      key: 'UNION ALL',
      sql: 'SELECT name FROM customers\nUNION ALL\nSELECT name FROM signups;',
      grids: [
        {
          columns: ['name'],
          rows: [
            ['Amara Okafor'],
            ['Ben Carter'],
            ['Chen Wei'],
            ['Daniela Ruiz'],
            ['Emeka Obi'],
            ['Grace Mensah'],
          ],
          name: 'customers',
        },
        {
          columns: ['name'],
          rows: [['Amara Okafor'], ['Kemi Adeyemi'], ['Grace Mensah'], ['Liam Byrne'], ['Kemi Adeyemi']],
          name: 'signups',
        },
        {
          columns: ['name'],
          rows: [
            ['Amara Okafor'],
            ['Ben Carter'],
            ['Chen Wei'],
            ['Daniela Ruiz'],
            ['Emeka Obi'],
            ['Grace Mensah'],
            ['Amara Okafor'],
            ['Kemi Adeyemi'],
            ['Grace Mensah'],
            ['Liam Byrne'],
            ['Kemi Adeyemi'],
          ],
          name: 'result',
        },
      ],
      says: 'Both lists stacked, repeats kept: all 11 rows. It’s quicker, because nothing has to be compared.',
    },
    {
      key: 'INTERSECT',
      sql: 'SELECT name FROM customers\nINTERSECT\nSELECT name FROM signups;',
      grids: [
        {
          columns: ['name'],
          rows: [
            ['Amara Okafor'],
            ['Ben Carter'],
            ['Chen Wei'],
            ['Daniela Ruiz'],
            ['Emeka Obi'],
            ['Grace Mensah'],
          ],
          name: 'customers',
        },
        {
          columns: ['name'],
          rows: [['Amara Okafor'], ['Kemi Adeyemi'], ['Grace Mensah'], ['Liam Byrne'], ['Kemi Adeyemi']],
          name: 'signups',
        },
        {
          columns: ['name'],
          rows: [['Amara Okafor'], ['Grace Mensah']],
          name: 'result',
        },
      ],
      says: 'Only the names in both lists: the two customers who also signed up at the fair.',
    },
    {
      key: 'EXCEPT',
      sql: 'SELECT name FROM customers\nEXCEPT\nSELECT name FROM signups;',
      grids: [
        {
          columns: ['name'],
          rows: [
            ['Amara Okafor'],
            ['Ben Carter'],
            ['Chen Wei'],
            ['Daniela Ruiz'],
            ['Emeka Obi'],
            ['Grace Mensah'],
          ],
          name: 'customers',
        },
        {
          columns: ['name'],
          rows: [['Amara Okafor'], ['Kemi Adeyemi'], ['Grace Mensah'], ['Liam Byrne'], ['Kemi Adeyemi']],
          name: 'signups',
        },
        {
          columns: ['name'],
          rows: [['Ben Carter'], ['Chen Wei'], ['Daniela Ruiz'], ['Emeka Obi']],
          name: 'result',
        },
      ],
      says: 'Names in the first list that aren’t in the second: customers who didn’t sign up. Swap the lists and you get a different answer.',
    },
  ],
  'window-view': [
    {
      key: 'GROUP BY city',
      sql: 'SELECT city, SUM(quantity) AS copies\nFROM sales WHERE id <= 8\nGROUP BY city;',
      grids: [
        {
          columns: ['city', 'copies'],
          rows: [
            ['Accra', '4'],
            ['Lagos', '7'],
            ['Leeds', '1'],
            ['Singapore', '1'],
          ],
        },
      ],
      says: 'GROUP BY folds the rows: 8 sales become 4 rows, one per city, and the single sales are gone.',
    },
    {
      key: 'SUM OVER everything',
      sql: 'SUM(quantity) OVER ()',
      grids: [
        {
          columns: ['id', 'city', 'quantity', 'total'],
          rows: [
            ['1', 'Lagos', '2', '13'],
            ['2', 'Leeds', '1', '13'],
            ['3', 'Lagos', '3', '13'],
            ['4', 'Accra', '1', '13'],
            ['5', 'Accra', '1', '13'],
            ['6', 'Accra', '2', '13'],
            ['7', 'Singapore', '1', '13'],
            ['8', 'Lagos', '2', '13'],
          ],
        },
      ],
      says: 'OVER () adds the total to every row instead: all 8 sales stay.',
    },
    {
      key: 'SUM by city',
      sql: 'SUM(quantity) OVER (PARTITION BY city)',
      grids: [
        {
          columns: ['id', 'city', 'quantity', 'city_total'],
          rows: [
            ['1', 'Lagos', '2', '7'],
            ['2', 'Leeds', '1', '1'],
            ['3', 'Lagos', '3', '7'],
            ['4', 'Accra', '1', '4'],
            ['5', 'Accra', '1', '4'],
            ['6', 'Accra', '2', '4'],
            ['7', 'Singapore', '1', '1'],
            ['8', 'Lagos', '2', '7'],
          ],
        },
      ],
      says: 'PARTITION BY works like GROUP BY without folding: each row gets its own city’s total.',
    },
    {
      key: 'Running total',
      sql: 'SUM(quantity) OVER (ORDER BY sold_on, id)',
      grids: [
        {
          columns: ['id', 'sold_on', 'quantity', 'running'],
          rows: [
            ['1', '2026-08-03', '2', '2'],
            ['2', '2026-08-03', '1', '3'],
            ['3', '2026-08-14', '3', '6'],
            ['4', '2026-08-21', '1', '7'],
            ['5', '2026-08-30', '1', '8'],
            ['6', '2026-09-02', '2', '10'],
            ['7', '2026-09-02', '1', '11'],
            ['8', '2026-09-11', '2', '13'],
          ],
        },
      ],
      says: 'With ORDER BY inside OVER, the sum runs: each row adds itself to the ones before.',
    },
    {
      key: 'ROW_NUMBER',
      sql: 'ROW_NUMBER() OVER (ORDER BY price DESC, id)',
      grids: [
        {
          columns: ['id', 'title', 'price', 'n'],
          rows: [
            ['7', 'Project Hail Mary', '14.20', '1'],
            ['2', 'Atomic Habits', '12.50', '2'],
            ['8', 'Atomic Habits', '12.50', '3'],
            ['6', 'Homegoing', '12.00', '4'],
            ['1', 'Dune', '10.99', '5'],
            ['5', 'Dune', '10.99', '6'],
            ['4', 'Gone Girl', '8.99', '7'],
            ['3', 'Things Fall Apart', '8.75', '8'],
          ],
        },
      ],
      says: 'ROW_NUMBER numbers the rows 1, 2, 3 in the order you give, even when prices tie.',
    },
    {
      key: 'RANK',
      sql: 'RANK() OVER (ORDER BY price DESC)',
      grids: [
        {
          columns: ['id', 'title', 'price', 'place'],
          rows: [
            ['7', 'Project Hail Mary', '14.20', '1'],
            ['2', 'Atomic Habits', '12.50', '2'],
            ['8', 'Atomic Habits', '12.50', '2'],
            ['6', 'Homegoing', '12.00', '4'],
            ['1', 'Dune', '10.99', '5'],
            ['5', 'Dune', '10.99', '5'],
            ['4', 'Gone Girl', '8.99', '7'],
            ['3', 'Things Fall Apart', '8.75', '8'],
          ],
        },
      ],
      says: 'RANK gives tied rows the same place, then skips: two books share 2nd, so the next is 4th.',
    },
  ],
  'insert-shapes': [
    {
      key: 'Named columns',
      sql: "INSERT INTO books (title, genre, price, stock)\nVALUES ('Purple Hibiscus', 'Fiction', 9.50, 3);",
      grids: [
        {
          columns: ['id', 'title', 'genre', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', 'Classic', '8.75', '12'],
            ['2', 'Atomic Habits', 'Self-help', '12.50', '4'],
            ['3', 'Dune', 'Sci-fi', '10.99', '7'],
            ['4', 'Gone Girl', 'Thriller', '8.99', '5'],
            ['5', 'Homegoing', 'Fiction', '12.00', '0'],
            ['6', 'Deep Work', 'Self-help', '13.75', '2'],
            ['7', 'Purple Hibiscus', 'Fiction', '9.50', '3'],
          ],
          on: [6],
        },
      ],
      says: 'Name the columns, then give the values in the same order. The id is filled in for you.',
    },
    {
      key: 'Several rows',
      sql: "INSERT INTO books (title, genre, price, stock) VALUES\n  ('Purple Hibiscus', 'Fiction', 9.50, 3),\n  ('Americanah', 'Fiction', 11.00, 5);",
      grids: [
        {
          columns: ['id', 'title', 'genre', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', 'Classic', '8.75', '12'],
            ['2', 'Atomic Habits', 'Self-help', '12.50', '4'],
            ['3', 'Dune', 'Sci-fi', '10.99', '7'],
            ['4', 'Gone Girl', 'Thriller', '8.99', '5'],
            ['5', 'Homegoing', 'Fiction', '12.00', '0'],
            ['6', 'Deep Work', 'Self-help', '13.75', '2'],
            ['7', 'Purple Hibiscus', 'Fiction', '9.50', '3'],
            ['8', 'Americanah', 'Fiction', '11.00', '5'],
          ],
          on: [6, 7],
        },
      ],
      says: 'One INSERT can add several rows, with a comma between each one.',
    },
    {
      key: 'A column left out',
      sql: "INSERT INTO books (title, genre, price)\nVALUES ('Purple Hibiscus', 'Fiction', 9.50);",
      grids: [
        {
          columns: ['id', 'title', 'genre', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', 'Classic', '8.75', '12'],
            ['2', 'Atomic Habits', 'Self-help', '12.50', '4'],
            ['3', 'Dune', 'Sci-fi', '10.99', '7'],
            ['4', 'Gone Girl', 'Thriller', '8.99', '5'],
            ['5', 'Homegoing', 'Fiction', '12.00', '0'],
            ['6', 'Deep Work', 'Self-help', '13.75', '2'],
            ['7', 'Purple Hibiscus', 'Fiction', '9.50', '0'],
          ],
          on: [6],
        },
      ],
      says: 'Leave a column out and it gets its default: stock has DEFAULT 0. A column with no default would be NULL.',
    },
    {
      key: 'Columns in the wrong order',
      sql: "INSERT INTO books (genre, title, price)\nVALUES ('Purple Hibiscus', 'Fiction', 9.50);",
      grids: [
        {
          columns: ['id', 'title', 'genre', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', 'Classic', '8.75', '12'],
            ['2', 'Atomic Habits', 'Self-help', '12.50', '4'],
            ['3', 'Dune', 'Sci-fi', '10.99', '7'],
            ['4', 'Gone Girl', 'Thriller', '8.99', '5'],
            ['5', 'Homegoing', 'Fiction', '12.00', '0'],
            ['6', 'Deep Work', 'Self-help', '13.75', '2'],
            ['7', 'Fiction', 'Purple Hibiscus', '9.50', '0'],
          ],
          on: [6],
        },
      ],
      says: 'No error: both are text, so the database can’t tell. The book is now called Fiction. Values follow the column list, not your intentions.',
    },
    {
      key: 'No column names',
      sql: "INSERT INTO books\nVALUES ('Purple Hibiscus', 'Fiction', 9.50, 3);",
      grids: [
        {
          columns: ['id', 'title', 'genre', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', 'Classic', '8.75', '12'],
            ['2', 'Atomic Habits', 'Self-help', '12.50', '4'],
            ['3', 'Dune', 'Sci-fi', '10.99', '7'],
            ['4', 'Gone Girl', 'Thriller', '8.99', '5'],
            ['5', 'Homegoing', 'Fiction', '12.00', '0'],
            ['6', 'Deep Work', 'Self-help', '13.75', '2'],
          ],
        },
      ],
      says: 'Without a column list, values must match every column in the table’s order, starting with id. Here the title lands in id, and it’s refused.',
      error: 'invalid input syntax for type integer: "Purple Hibiscus"',
    },
  ],
  'update-where': [
    {
      key: 'One book by id',
      sql: 'UPDATE books SET price = 9.99 WHERE id = 5;',
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '7'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '9.99', '0'],
            ['6', 'Deep Work', '13.75', '2'],
          ],
          on: [4],
        },
      ],
      says: 'WHERE id = 5 picks exactly one row, because id is the primary key.',
    },
    {
      key: 'One genre',
      sql: "UPDATE books SET price = price * 1.10\nWHERE genre = 'Self-help';",
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '13.75', '4'],
            ['3', 'Dune', '10.99', '7'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '15.13', '2'],
          ],
          on: [1, 5],
        },
      ],
      says: 'Every row the WHERE matches changes. The new value can use the old one: price * 1.10.',
    },
    {
      key: 'Two columns at once',
      sql: 'UPDATE books SET price = 9.99, stock = 10\nWHERE id = 5;',
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '7'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '9.99', '10'],
            ['6', 'Deep Work', '13.75', '2'],
          ],
          on: [4],
        },
      ],
      says: 'SET can change several columns, with commas between them.',
    },
    {
      key: 'No WHERE at all',
      sql: 'UPDATE books SET stock = 0;',
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '0'],
            ['2', 'Atomic Habits', '12.50', '0'],
            ['3', 'Dune', '10.99', '0'],
            ['4', 'Gone Girl', '8.99', '0'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '13.75', '0'],
          ],
          on: [0, 1, 2, 3, 5],
        },
      ],
      says: 'No WHERE means every row. There’s no warning and no undo: the whole shop is now sold out.',
    },
  ],
  'delete-safety': [
    {
      key: 'One book',
      sql: 'DELETE FROM books WHERE id = 5;',
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '7'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '13.75', '2'],
          ],
          off: [4],
        },
      ],
      says: 'The crossed-out row is gone for good. Homegoing had no orders, so nothing stops it.',
    },
    {
      key: 'Books with no stock',
      sql: 'DELETE FROM books WHERE stock = 0;',
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '7'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '13.75', '2'],
          ],
          off: [4],
        },
      ],
      says: 'Every row the WHERE matches goes. Check it first with SELECT and the same WHERE.',
    },
    {
      key: 'No WHERE at all',
      sql: 'DELETE FROM order_items;',
      grids: [
        {
          columns: ['order_id', 'book_id', 'quantity'],
          rows: [
            ['1', '3', '1'],
            ['1', '1', '2'],
            ['2', '2', '1'],
            ['3', '3', '2'],
            ['3', '4', '1'],
            ['4', '6', '1'],
          ],
          name: 'order_items',
          off: [0, 1, 2, 3, 4, 5],
        },
      ],
      says: 'With no WHERE, every row goes: all six items of every order. The table stays, empty.',
    },
    {
      key: 'A customer with orders',
      sql: 'DELETE FROM customers WHERE id = 1;',
      grids: [
        {
          columns: ['id', 'name'],
          rows: [
            ['1', 'Amara Okafor'],
            ['2', 'Ben Carter'],
            ['3', 'Chen Wei'],
            ['4', 'Daniela Ruiz'],
          ],
        },
      ],
      says: 'Refused: Amara’s orders still point at this row, so the foreign key protects it. Nothing is deleted.',
      error:
        'update or delete on table "customers" violates foreign key constraint "orders_customer_id_fkey" on table "orders"',
    },
    {
      key: 'A customer with no orders',
      sql: 'DELETE FROM customers WHERE id = 4;',
      grids: [
        {
          columns: ['id', 'name'],
          rows: [
            ['1', 'Amara Okafor'],
            ['2', 'Ben Carter'],
            ['3', 'Chen Wei'],
            ['4', 'Daniela Ruiz'],
          ],
          off: [3],
        },
      ],
      says: 'Daniela has no orders, so nothing points at the row and it can go.',
    },
  ],
  'transaction-flow': [
    {
      key: 'Both steps work',
      sql: 'UPDATE books SET stock = stock - 2 WHERE id = 3;\nUPDATE books SET stock = stock - 2 WHERE id = 4;',
      grids: [
        {
          columns: ['id', 'title', 'stock'],
          rows: [
            ['3', 'Dune', '5'],
            ['4', 'Gone Girl', '3'],
            ['5', 'Homegoing', '0'],
          ],
          on: [0, 1],
        },
      ],
      says: 'Two changes, both fine. Nothing went wrong, so both stay.',
    },
    {
      key: 'Step 2 fails without a transaction',
      sql: 'UPDATE books SET stock = stock - 2 WHERE id = 3;\nUPDATE books SET stock = stock - 2 WHERE id = 5;',
      grids: [
        {
          columns: ['id', 'title', 'stock'],
          rows: [
            ['3', 'Dune', '5'],
            ['4', 'Gone Girl', '5'],
            ['5', 'Homegoing', '0'],
          ],
          on: [0],
        },
      ],
      says: 'Sent one at a time, as an app sends them: the first change is kept, and the second is refused (Homegoing has 0). The shop is now half updated.',
      error: 'new row for relation "books" violates check constraint "books_stock_check"',
    },
    {
      key: 'Step 2 fails in a transaction',
      sql: 'BEGIN;\nUPDATE books SET stock = stock - 2 WHERE id = 3;\nUPDATE books SET stock = stock - 2 WHERE id = 5;\nROLLBACK;',
      grids: [
        {
          columns: ['id', 'title', 'stock'],
          rows: [
            ['3', 'Dune', '7'],
            ['4', 'Gone Girl', '5'],
            ['5', 'Homegoing', '0'],
          ],
          on: [],
        },
      ],
      says: 'Inside BEGIN, the failure means the transaction can’t commit. ROLLBACK undoes the first change too: all or nothing.',
      error: 'new row for relation "books" violates check constraint "books_stock_check"',
    },
    {
      key: 'ROLLBACK on purpose',
      sql: 'BEGIN;\nUPDATE books SET stock = 0;\nROLLBACK;',
      grids: [
        {
          columns: ['id', 'title', 'stock'],
          rows: [
            ['3', 'Dune', '7'],
            ['4', 'Gone Girl', '5'],
            ['5', 'Homegoing', '0'],
          ],
          on: [],
        },
      ],
      says: 'A transaction is a safety net: change your mind before COMMIT, and ROLLBACK puts everything back.',
    },
  ],
  'constraint-guard': [
    {
      key: 'Negative stock',
      sql: 'UPDATE books SET stock = -1 WHERE id = 1;',
      grids: [
        {
          columns: ['id', 'title', 'stock'],
          rows: [['1', 'Things Fall Apart', '12']],
        },
      ],
      says: 'CHECK (stock >= 0) refuses it. The rule lives in the table, so no app can get it wrong.',
      error: 'new row for relation "books" violates check constraint "books_stock_check"',
    },
    {
      key: 'No title',
      sql: "INSERT INTO books (genre, price)\nVALUES ('Fiction', 9);",
      grids: [
        {
          columns: ['books'],
          rows: [['6']],
        },
      ],
      says: 'NOT NULL refuses a book with no title.',
      error: 'null value in column "title" of relation "books" violates not-null constraint',
    },
    {
      key: 'Same email twice',
      sql: "INSERT INTO customers (name, email, city)\nVALUES ('Amara O', 'amara@example.com', 'Abuja');",
      grids: [
        {
          columns: ['customers'],
          rows: [['4']],
        },
      ],
      says: 'UNIQUE refuses a second customer with an email that’s already used.',
      error: 'duplicate key value violates unique constraint "customers_email_key"',
    },
    {
      key: 'Order for nobody',
      sql: "INSERT INTO orders (customer_id, ordered_on)\nVALUES (99, '2026-10-25');",
      grids: [
        {
          columns: ['orders'],
          rows: [['4']],
        },
      ],
      says: 'The foreign key refuses an order for a customer who doesn’t exist.',
      error: 'insert or update on table "orders" violates foreign key constraint "orders_customer_id_fkey"',
    },
    {
      key: 'Leave status out',
      sql: "INSERT INTO orders (customer_id, ordered_on)\nVALUES (4, '2026-10-25');",
      grids: [
        {
          columns: ['id', 'customer_id', 'ordered_on', 'status'],
          rows: [
            ['1', '1', '2026-10-02', 'delivered'],
            ['2', '3', '2026-10-05', 'delivered'],
            ['3', '1', '2026-10-19', 'new'],
            ['4', '2', '2026-10-21', 'new'],
            ['5', '4', '2026-10-25', 'new'],
          ],
          on: [4],
        },
      ],
      says: 'Not every constraint refuses: DEFAULT fills in a value you leave out. The new order’s status is new.',
    },
  ],
  'upsert-flow': [
    {
      key: 'Plain INSERT',
      sql: "INSERT INTO books (id, title, genre, price, stock)\nVALUES (3, 'Dune', 'Sci-fi', 10.99, 5);",
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '7'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '13.75', '2'],
          ],
        },
      ],
      says: 'Book 3 is already there, so a plain INSERT is refused: the id must be unique.',
      error: 'duplicate key value violates unique constraint "books_pkey"',
    },
    {
      key: 'DO NOTHING',
      sql: "INSERT INTO books (id, title, genre, price, stock)\nVALUES (3, 'Dune', 'Sci-fi', 10.99, 5)\nON CONFLICT (id) DO NOTHING;",
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '7'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '13.75', '2'],
          ],
          on: [],
        },
      ],
      says: 'With ON CONFLICT DO NOTHING, the clash is quietly skipped: no error, and no change.',
    },
    {
      key: 'DO UPDATE',
      sql: "INSERT INTO books (id, title, genre, price, stock)\nVALUES (3, 'Dune', 'Sci-fi', 10.99, 5)\nON CONFLICT (id) DO UPDATE SET stock = EXCLUDED.stock;",
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '5'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '13.75', '2'],
          ],
          on: [2],
        },
      ],
      says: 'DO UPDATE changes the row that’s already there. EXCLUDED is the row you tried to insert, so stock becomes 5.',
    },
    {
      key: 'Add to stock',
      sql: "INSERT INTO books (id, title, genre, price, stock)\nVALUES (3, 'Dune', 'Sci-fi', 10.99, 5)\nON CONFLICT (id) DO UPDATE\n  SET stock = books.stock + EXCLUDED.stock;",
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '12'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '13.75', '2'],
          ],
          on: [2],
        },
      ],
      says: 'books.stock is what’s on the shelf and EXCLUDED.stock is the delivery: 7 + 5 = 12.',
    },
    {
      key: 'A new book',
      sql: "INSERT INTO books (id, title, genre, price, stock)\nVALUES (7, 'Purple Hibiscus', 'Fiction', 9.50, 4)\nON CONFLICT (id) DO UPDATE\n  SET stock = books.stock + EXCLUDED.stock;",
      grids: [
        {
          columns: ['id', 'title', 'price', 'stock'],
          rows: [
            ['1', 'Things Fall Apart', '8.75', '12'],
            ['2', 'Atomic Habits', '12.50', '4'],
            ['3', 'Dune', '10.99', '7'],
            ['4', 'Gone Girl', '8.99', '5'],
            ['5', 'Homegoing', '12.00', '0'],
            ['6', 'Deep Work', '13.75', '2'],
            ['7', 'Purple Hibiscus', '9.50', '4'],
          ],
          on: [6],
        },
      ],
      says: 'No clash this time, so the same statement simply inserts. That’s the point of an upsert: one statement for new and known rows.',
    },
  ],
}
