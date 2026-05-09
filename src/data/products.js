export const INITIAL_PRODUCTS = [
  { id: 1, name: 'Chocolate Cake', price: 500, stock: 10, cat: 'Cakes', image: 'https://source.unsplash.com/100x100/?chocolate-cake' },
]

export const fmt = (n) =>
  '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
