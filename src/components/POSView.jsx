import { useState } from 'react'
import ItemCard from './ItemCard'

export default function POSView({ products, onAdd }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  const cats = ['All', ...new Set(products.map(p => p.cat))]

  const visible = products.filter(p => {
    const matchCat = cat === 'All' || p.cat === cat
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.cat.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      {/* Search bar */}
      <div className="pos-toolbar">
        <div className="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="cat-strip">
        {cats.map(c => (
          <button
            key={c}
            className={`cat-pill${cat === c ? ' active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="items-grid">
        {visible.length === 0
          ? (
            <div className="empty-state">
              <span className="empty-state-icon">🔍</span>
              No products found
            </div>
          )
          : visible.map(p => (
            <ItemCard key={p.id} product={p} onAdd={onAdd} />
          ))
        }
      </div>
    </>
  )
}
