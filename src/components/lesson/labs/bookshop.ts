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
