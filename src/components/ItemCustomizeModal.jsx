import { useState } from 'react'
import { X, ShoppingCart, Check } from 'lucide-react'

export default function ItemCustomizeModal({ product, onConfirm, onClose, drCounters, companies }) {
  const [form, setForm] = useState({
    price: product.price,
    qty: 1,
    drNumber: drCounters['None'],
    company: 'None'
  })

  const handleSave = () => {
    onConfirm({
      id: product.id,
      name: product.name,
      image: product.image,
      price: parseFloat(form.price) || 0,
      qty: parseInt(form.qty) || 1,
      drNumber: form.drNumber,
      company: form.company.trim()
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '400px', width: '90%' }}>
        <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <ShoppingCart size={20} color="var(--gold)" />
          Customize Order
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label style={{ color: 'var(--text-1)', fontWeight: 'bold' }}>{product.name}</label>
          </div>

          <div className="form-group">
            <label>Price (₱)</label>
            <input style={{ width: '100%' }} type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input style={{ width: '100%' }} type="number" min="1" max={product.stock} value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px' }}>In stock: {product.stock}</div>
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <select 
              value={form.company} 
              onChange={e => {
                const newCo = e.target.value;
                setForm(f => ({ ...f, company: newCo, drNumber: drCounters[newCo] }));
              }} 
              style={{ width: '100%', height: '38px' }}
            >
              {companies.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>DR Number</label>
            <input 
              style={{ width: '100%' }} 
              type="number" 
              value={form.drNumber} 
              onChange={e => setForm(f => ({ ...f, drNumber: e.target.value }))} 
            />
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '24px' }}>
          <button className="btn-modal-cancel" onClick={onClose}><X size={16} /> Cancel</button>
          <button className="btn-modal-save" onClick={handleSave} style={{ background: 'var(--gold)', color: '#000' }}><Check size={16} /> Add to Cart</button>
        </div>
      </div>
    </div>
  )
}