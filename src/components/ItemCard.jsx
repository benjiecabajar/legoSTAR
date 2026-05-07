import { fmt } from '../data/products'

export default function ItemCard({ product, onAdd }) {
  const { name, price, stock, image } = product
  const out = stock === 0
  const low = stock > 0 && stock <= 5

  return (
    <div
      className={`item-card${out ? ' out' : ''}`}
      onClick={() => !out && onAdd(product.id)}
      title={out ? 'Out of stock' : `Add ${name} to cart`}
    >
      {out && <span className="stock-badge badge-out">Out</span>}
      {low && !out && <span className="stock-badge badge-low">Low</span>}

      <div className="item-image-container" style={{ 
        height: '100px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '40px',
        marginBottom: '12px'
      }}>
        {image ? (
          <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} />
        ) : (
          '📦'
        )}
      </div>
      <div className="item-name" style={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        width: '100%'
      }}>{name}</div>
      <div className="item-price">{fmt(price)}</div>
      <div className="item-stock-info">{stock} in stock</div>
    </div>
  )
}
