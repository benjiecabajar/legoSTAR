import { fmt } from '../data/products'
import { Utensils, Check } from 'lucide-react'

export default function ReceiptModal({ sale, onClose }) {
  if (!sale) return null
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 360 }}>
        <div className="receipt-header">
          <div className="receipt-logo"><Utensils size={24} /></div>
          <div className="receipt-name">{sale.date} · {sale.time} · {sale.id}</div>
          <div className="receipt-meta" style={{ marginTop: 4 }}>
            {sale.customer} · {sale.method}
          </div>
        </div>

        <div className="receipt-lines">
          {sale.items.map((item, i) => (
            <div key={i} className="receipt-line">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.image ? (
                  <img src={item.image} alt="" style={{ width: '18px', height: '18px', objectFit: 'cover', borderRadius: '2px' }} />
                ) : (
                  '📦'
                )}
                {item.name} 
                ×{item.qty}
              </span>
              <span>{fmt(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="receipt-line" style={{ fontSize: 12 }}>
          <span>Subtotal</span><span>{fmt(sale.subtotal)}</span>
        </div>
        {sale.discAmt > 0 && (
          <div className="receipt-line" style={{ fontSize: 12 }}>
            <span>Discount</span><span>− {fmt(sale.discAmt)}</span>
          </div>
        )}
        <div className="receipt-line" style={{ fontSize: 12 }}>
          <span>Tax</span><span>{fmt(sale.taxAmt)}</span>
        </div>

        <div className="receipt-total">
          <span>TOTAL</span>
          <span>{fmt(sale.total)}</span>
        </div>

        <div className="receipt-footer">
          Thank you for visiting Pastry
        </div>

        <button className="btn-checkout" style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={onClose}>
          <Check size={18} />
          Done
        </button>
      </div>
    </div>
  )
}