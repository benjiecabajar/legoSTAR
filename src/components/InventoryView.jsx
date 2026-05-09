import { useState } from 'react';
import { fmt } from '../data/products';
import '../styles/sidebar.css';
import { Plus, Pencil, Trash2, Package, Building2, X, Check } from 'lucide-react';

export default function InventoryView({ products, onEditPrice, onEditStock, onDelete, onAddItem, companies, onAddCompany, drCounters, onUpdateDR }) {
  const [editDR, setEditDR] = useState(null); // { name, val }

  const stockClass = (s) => {
    if (s === 0) return 'stock-out-num'
    if (s <= 5)  return 'stock-low-num'
    return 'stock-ok-num'
  }

  const handleSaveDR = () => {
    if (editDR) onUpdateDR(editDR.name, editDR.val);
    setEditDR(null);
  };

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

      {/* Company Management Section */}
      <div style={{ marginTop: '30px', padding: '20px', background: 'var(--ink-3)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-1)', fontSize: '14px', margin: 0 }}>
            <Building2 size={18} color="var(--gold)" />
            Managed Companies
          </h3>
          <button 
            onClick={onAddCompany}
            style={{ padding: '4px 12px', fontSize: '12px', background: 'none', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '4px', cursor: 'pointer' }}
          >+ Add Company</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {companies.map(c => (
            <div key={c.name} style={{ 
              padding: '4px 10px', 
              background: 'var(--ink-4)', 
              color: 'var(--text-2)', 
              borderRadius: '4px', 
              fontSize: '12px', 
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span title={c.address}>{c.name} <small style={{ opacity: 0.6 }}>(DR: {drCounters[c.name]})</small></span>
              <button 
                onClick={() => setEditDR({ name: c.name, val: drCounters[c.name] })}
                style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', padding: 0, display: 'flex' }}
                title="Edit Starting DR"
              >
                <Pencil size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit DR Modal */}
      {editDR && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditDR(null)}>
          <div className="modal" style={{ maxWidth: 300 }}>
            <div className="modal-title">Edit Starting DR</div>
            <p style={{ marginBottom: 15, fontSize: 12, color: 'var(--text-3)' }}>Adjusting the sequence for <strong>{editDR.name}</strong></p>
            <div className="form-group">
              <label>Next DR Number</label>
              <input 
                type="number" 
                value={editDR.val} 
                onChange={e => setEditDR({ ...editDR, val: e.target.value })} 
                style={{ width: '100%' }}
              />
            </div>
            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn-modal-cancel" onClick={() => setEditDR(null)}><X size={16} /> Cancel</button>
              <button className="btn-modal-save" onClick={handleSaveDR} style={{ background: 'var(--gold)', color: '#000' }}><Check size={16} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
