import { useState } from 'react'
import { PlusCircle, Save, X } from 'lucide-react'

const CATEGORIES = ['Cakes', 'Pastries', 'Breads', 'Cookies', 'Muffins', 'Donuts', 'Pies', 'Beverages'];

export default function AddItemModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', cat: CATEGORIES[0], price: '', stock: '', image: null })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        set('image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.cat.trim()) return
    onSave({
      name:  form.name.trim(),
      cat:   form.cat.trim(),
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock)   || 0,
      image: form.image,
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-1)', textTransform: 'uppercase', fontSize: '16px', letterSpacing: '1px' }}>
          <PlusCircle size={20} style={{ color: 'var(--primary)' }} />
          New Product
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label>Product Name <span style={{ color: 'var(--red)' }}>*</span></label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Sugar Pack 1" autoFocus style={{ width: '100%' }} />
          </div>

          <div className="form-group">
            <label>Category <span style={{ color: 'var(--red)' }}>*</span></label>
            <select value={form.cat} onChange={e => set('cat', e.target.value)} style={{ width: '100%', height: '38px' }}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0 10px', 
              borderRadius: '8px',
              height: '38px',
              background: 'var(--bg-2)',
              overflow: 'hidden'
            }}>
              {!form.image ? (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ fontSize: '10px', width: '100%' }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
                  <img src={form.image} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                  <span style={{ fontSize: '10px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-2)' }}>Image selected</span>
                  <button type="button" onClick={() => set('image', null)} style={{ border: 'none', background: 'none', color: 'var(--red)', cursor: 'pointer', display: 'flex' }}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Price (₱) <span style={{ color: 'var(--red)' }}>*</span></label>
            <input type="number" min="0" value={form.price}
              onChange={e => set('price', e.target.value)} placeholder="0.00" style={{ width: '100%' }} />
          </div>

          <div className="form-group">
            <label>Stock Qty <span style={{ color: 'var(--red)' }}>*</span></label>
            <input type="number" min="0" value={form.stock}
              onChange={e => set('stock', e.target.value)} placeholder="0" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <X size={16} />
            Cancel
          </button>
          <button className="btn-modal-save" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={16} />
            Save Product
          </button>
        </div>
      </div>
    </div>
  )
}
