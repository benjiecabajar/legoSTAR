import { fmt } from '../data/products';
import '../styles/sidebar.css';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

export default function InventoryView({ products, onEditPrice, onEditStock, onDelete, onAddItem }) {
  const stockClass = (s) => {
    if (s === 0) return 'stock-out-num'
    if (s <= 5)  return 'stock-low-num'
    return 'stock-ok-num'
  }

  return (
    <div className="inv-view">
      <div className="inv-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '18px' }}>
          <Package size={24} />
          Inventory
        </h2>
        <button 
          onClick={onAddItem} 
          className="sidebar-add-button"
          style={{ width: 'auto', margin: 0, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
        ><Plus size={18} /> Add Product</button>
      </div>

      <div className="inv-scroll">
        <table className="inv-table">
          <thead>
            <tr>
              <th style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase' }}>Product</th>
              <th style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase' }}>Category</th>
              <th style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase' }}>Price</th>
              <th style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase' }}>Stock</th>
              <th style={{ color: 'var(--text-3)', fontSize: '11px', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    marginRight: 12, 
                    display: 'inline-flex', 
                    width: '32px', 
                    height: '32px', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    verticalAlign: 'middle',
                    background: 'var(--bg-2)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    {p.image ? (
                      <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '📦'
                    )}
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{p.name}</span>
                </td>
                <td><span className="cat-tag">{p.cat}</span></td>
                <td>
                  <span
                    className="editable-cell price-cell"
                    onClick={() => onEditPrice(p.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="Click to edit price"
                  >
                    {fmt(p.price)}
                    <span className="edit-icon"><Pencil size={12} /></span>
                  </span>
                </td>
                <td>
                  <span
                    className={`editable-cell stock-num ${stockClass(p.stock)}`}
                    onClick={() => onEditStock(p.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="Click to edit stock"
                  >
                    {p.stock}
                    <span className="edit-icon"><Pencil size={12} /></span>
                  </span>
                </td>
                <td>
                  <button
                    style={{
                      fontSize: 11, padding: '6px 12px', borderRadius: 6,
                      border: 'none',
                      background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', 
                      color: '#ffffff',
                      fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                    onClick={() => onDelete(p.id)}
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: 32 }}>
                  No products yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
