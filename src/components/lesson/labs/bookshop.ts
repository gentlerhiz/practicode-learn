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
