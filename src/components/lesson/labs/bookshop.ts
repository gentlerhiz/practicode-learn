// The practice bookshop the SQL labs draw, the same rows the SQL lessons' setup.sql creates.
export type Book = { id: number; title: string; author: string; genre: string; price: number; stock: number }

export const BOOKS: Book[] = [
  { id: 1, title: 'Things Fall Apart', author: 'Chinua Achebe', genre: 'Classic', price: 8.75, stock: 12 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', price: 12.5, stock: 4 },
  { id: 3, title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', price: 9.99, stock: 0 },
  { id: 4, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-fi', price: 10.99, stock: 7 },
  { id: 5, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic', price: 6.5, stock: 9 },
  { id: 6, title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-fi', price: 14.2, stock: 3 },
]

export const money = (n: number) => n.toFixed(2)

/**
 * The bigger shop from SQL Module 2 on: twelve books, each with a rating (NULL for books not rated yet)
 * and the year it came out. The same rows as Module 2's setup.sql.
 */
export type ShelfBook = Book & { rating: number | null; published: number }

export const SHELF: ShelfBook[] = [
  { id: 1, title: 'Things Fall Apart', author: 'Chinua Achebe', genre: 'Classic', price: 8.75, stock: 12, rating: 4.6, published: 1958 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', price: 12.5, stock: 4, rating: 4.4, published: 2018 },
  { id: 3, title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', price: 9.99, stock: 0, rating: 4.1, published: 2019 },
  { id: 4, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-fi', price: 10.99, stock: 7, rating: 4.5, published: 1965 },
  { id: 5, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic', price: 6.5, stock: 9, rating: 4.7, published: 1813 },
  { id: 6, title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-fi', price: 14.2, stock: 3, rating: 4.8, published: 2021 },
  { id: 7, title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', genre: 'Fiction', price: 11.25, stock: 6, rating: 4.6, published: 2006 },
  { id: 8, title: 'The Martian', author: 'Andy Weir', genre: 'Sci-fi', price: 9.5, stock: 0, rating: 4.6, published: 2011 },
  { id: 9, title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', price: 8.99, stock: 5, rating: 4.2, published: 2012 },
  { id: 10, title: 'Deep Work', author: 'Cal Newport', genre: 'Self-help', price: 13.75, stock: 2, rating: null, published: 2016 },
  { id: 11, title: 'The Thursday Murder Club', author: 'Richard Osman', genre: 'Thriller', price: 10.5, stock: 8, rating: null, published: 2020 },
  { id: 12, title: 'Homegoing', author: 'Yaa Gyasi', genre: 'Fiction', price: 12, stock: 0, rating: 4.5, published: 2016 },
]

/**
 * The shop's sales from SQL Module 3 on, one row for each sale: the same rows as Module 3's setup.sql. It's
 * one flat table because joins come later, and Module 4 opens with what's wrong with storing data this way.
 */
export type Sale = { id: number; soldOn: string; title: string; genre: string; quantity: number; price: number; city: string }

export const SALES: Sale[] = [
  { id: 1, soldOn: '2026-08-03', title: 'Dune', genre: 'Sci-fi', quantity: 2, price: 10.99, city: 'Lagos' },
  { id: 2, soldOn: '2026-08-03', title: 'Atomic Habits', genre: 'Self-help', quantity: 1, price: 12.5, city: 'Leeds' },
  { id: 3, soldOn: '2026-08-14', title: 'Things Fall Apart', genre: 'Classic', quantity: 3, price: 8.75, city: 'Lagos' },
  { id: 4, soldOn: '2026-08-21', title: 'Gone Girl', genre: 'Thriller', quantity: 1, price: 8.99, city: 'Accra' },
  { id: 5, soldOn: '2026-08-30', title: 'Dune', genre: 'Sci-fi', quantity: 1, price: 10.99, city: 'Accra' },
  { id: 6, soldOn: '2026-09-02', title: 'Homegoing', genre: 'Fiction', quantity: 2, price: 12, city: 'Accra' },
  { id: 7, soldOn: '2026-09-02', title: 'Project Hail Mary', genre: 'Sci-fi', quantity: 1, price: 14.2, city: 'Singapore' },
  { id: 8, soldOn: '2026-09-11', title: 'Atomic Habits', genre: 'Self-help', quantity: 2, price: 12.5, city: 'Lagos' },
  { id: 9, soldOn: '2026-09-19', title: 'Pride and Prejudice', genre: 'Classic', quantity: 1, price: 6.5, city: 'Leeds' },
  { id: 10, soldOn: '2026-09-25', title: 'Gone Girl', genre: 'Thriller', quantity: 2, price: 8.99, city: 'Lagos' },
  { id: 11, soldOn: '2026-10-01', title: 'Dune', genre: 'Sci-fi', quantity: 1, price: 10.99, city: 'Lagos' },
  { id: 12, soldOn: '2026-10-04', title: 'The Martian', genre: 'Sci-fi', quantity: 2, price: 9.5, city: 'Singapore' },
  { id: 13, soldOn: '2026-10-04', title: 'Deep Work', genre: 'Self-help', quantity: 1, price: 13.75, city: 'Leeds' },
  { id: 14, soldOn: '2026-10-12', title: 'Things Fall Apart', genre: 'Classic', quantity: 1, price: 8.75, city: 'Accra' },
  { id: 15, soldOn: '2026-10-18', title: 'Homegoing', genre: 'Fiction', quantity: 1, price: 12, city: 'Lagos' },
  { id: 16, soldOn: '2026-10-27', title: 'Half of a Yellow Sun', genre: 'Fiction', quantity: 3, price: 11.25, city: 'Lagos' },
]

/** The shop split into linked tables, from SQL Module 4 on: the same rows as Module 4's setup.sql. */
export const CUSTOMERS = [
  { id: 1, name: 'Amara Okafor', city: 'Lagos' },
  { id: 2, name: 'Ben Carter', city: 'Leeds' },
  { id: 3, name: 'Chen Wei', city: 'Singapore' },
  { id: 4, name: 'Daniela Ruiz', city: 'Madrid' },
  { id: 5, name: 'Emeka Obi', city: 'Abuja' },
  { id: 6, name: 'Grace Mensah', city: 'Accra' },
]

export const ORDERS = [
  { id: 1, customerId: 1, orderedOn: '2026-09-03' },
  { id: 2, customerId: 3, orderedOn: '2026-09-05' },
  { id: 3, customerId: 1, orderedOn: '2026-09-14' },
  { id: 4, customerId: 2, orderedOn: '2026-09-20' },
  { id: 5, customerId: 3, orderedOn: '2026-10-02' },
  { id: 6, customerId: 5, orderedOn: '2026-10-08' },
  { id: 7, customerId: 1, orderedOn: '2026-10-19' },
]

/** The staff, for self joins: manager_id points at another row of the same table. */
export const STAFF = [
  { id: 1, name: 'Ngozi Eze', role: 'Owner', managerId: null },
  { id: 2, name: 'Tunde Bello', role: 'Shop manager', managerId: 1 },
  { id: 3, name: 'Sade Ali', role: 'Online manager', managerId: 1 },
  { id: 4, name: 'Kofi Mensah', role: 'Bookseller', managerId: 2 },
  { id: 5, name: 'Lila Shah', role: 'Bookseller', managerId: 2 },
  { id: 6, name: 'Yusuf Adam', role: 'Web assistant', managerId: 3 },
]