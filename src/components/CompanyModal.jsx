import { useState } from 'react'
import { X, Building2, Check } from 'lucide-react'

export default function CompanyModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    nextDr: '1'
  })

  const handleSave = () => {
    if (!form.name.trim()) return
    onSave({
      name: form.name.trim(),
      address: form.address.trim(),
      nextDr: parseInt(form.nextDr) || 1
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '400px', width: '90%' }}>
        <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Building2 size={20} color="var(--gold)" />
          Add New Company
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label>Company Name *</label>
            <input 
              style={{ width: '100%' }} 
              type="text" 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. PastryStar Main"
              autoFocus
            />
          </div>

          <div className="form-group full">
            <label>Address</label>
            <textarea 
              style={{ 
                width: '100%', height: '80px', padding: '10px', borderRadius: '8px', 
                background: 'var(--bg-2)', border: '1px solid var(--border)', 
                color: 'var(--text-1)', fontFamily: 'inherit', fontSize: '14px', resize: 'none'
              }} 
              value={form.address} 
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Enter delivery address..."
            />
          </div>

          <div className="form-group full">
            <label>Starting DR Number</label>
            <input style={{ width: '100%' }} type="number" value={form.nextDr} onChange={e => setForm(f => ({ ...f, nextDr: e.target.value }))} />
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '24px' }}>
          <button className="btn-modal-cancel" onClick={onClose}><X size={16} /> Cancel</button>
          <button className="btn-modal-save" onClick={handleSave} style={{ background: 'var(--gold)', color: '#000' }}><Check size={16} /> Save Company</button>
        </div>
      </div>
    </div>
  )
}