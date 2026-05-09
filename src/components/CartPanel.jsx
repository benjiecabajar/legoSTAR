import { useState } from 'react'
import { fmt } from '../data/products'
import { ShoppingCart, Trash2, X, CreditCard } from 'lucide-react'

export default function CartPanel({ cart, products, onChangeQty, onRemove, onClear, onCheckout }) {
  const [discount, setDiscount] = useState('')
  const [tax,      setTax]      = useState('12')
  const [customer, setCustomer] = useState('')
  const [method,   setMethod]   = useState('Cash')

  const subtotal   = cart.reduce((a, c) => a + c.price * c.qty, 0)
  const discPct    = parseFloat(discount) || 0
  const taxPct     = parseFloat(tax) || 0
  const discAmt    = subtotal * (discPct / 100)
  const afterDisc  = subtotal - discAmt
  const taxAmt     = afterDisc * (taxPct / 100)
  const total      = afterDisc + taxAmt

  const totalQty   = cart.reduce((a, c) => a + c.qty, 0)

  const handleCheckout = () => {
    onCheckout({ subtotal, discAmt, taxAmt, total, customer: customer || 'Walk-in', method })
    setDiscount('')
    setCustomer('')
    setMethod('Cash')
  }

  return (
    <aside className="panel-right">
      {/* Header */}
      <div className="cart-head">
        <div className="cart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingCart size={20} />
          Cart
          {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
        </div>
        <button className="btn-clear" onClick={onClear} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      {/* Items */}
      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={40} style={{ marginBottom: '12px', opacity: 0.2 }} />
            Your cart is empty.<br />Tap a product to add it.
          </div>
        ) : cart.map(item => {
          const prod = products.find(p => p.id === item.id)
          return (
            <div key={item.cartId} className="cart-item">
              <span className="cart-item-image-container" style={{ 
                width: '40px', 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'var(--bg-2)',
                borderRadius: '6px',
                flexShrink: 0
              }}>
                {item.image ? (
                  <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  '📦'
                )}
              </span>
              <div className="cart-item-info">
                <div className="cart-item-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <div className="cart-item-sub">{fmt(item.price)} each</div>
                {(item.drNumber || item.company) && (
                  <div style={{ fontSize: '10px', color: 'var(--text-3)', display: 'flex', gap: '4px' }}>
                    {item.drNumber && <span>DR: {item.drNumber}</span>}
                    {item.drNumber && item.company && <span>·</span>}
                    {item.company && <span>{item.company}</span>}
                  </div>
                )}
              </div>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => onChangeQty(item.cartId, -1)}>−</button>
                <span className="qty-num">{item.qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => onChangeQty(item.cartId, +1)}
                  disabled={prod && item.qty >= prod.stock}
                >+</button>
              </div>
              <button className="remove-btn" onClick={() => onRemove(item.cartId)} title="Remove">
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="cart-footer">
        {/* Discount / tax inputs */}
        <div className="inputs-grid" style={{ marginBottom: 10 }}>
          <div className="input-group">
            <label>Discount %</label>
            <input type="number" min="0" max="100" value={discount}
              onChange={e => setDiscount(e.target.value)} placeholder="0" />
          </div>
          <div className="input-group">
            <label>Tax %</label>
            <input type="number" min="0" max="50" value={tax}
              onChange={e => setTax(e.target.value)} placeholder="12" />
          </div>
        </div>

        {/* Totals */}
        <div className="totals-block">
          <div className="total-row">
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          {discPct > 0 && (
            <div className="total-row">
              <span>Discount ({discPct}%)</span><span>− {fmt(discAmt)}</span>
            </div>
          )}
          <div className="total-row">
            <span>Tax ({taxPct}%)</span><span>{fmt(taxAmt)}</span>
          </div>
          <div className="total-row grand">
            <span>Total</span>
            <span className="grand-val">{fmt(total)}</span>
          </div>
        </div>

        {/* Customer / payment */}
        <div className="inputs-grid">
          <div className="input-group full">
            <label>Customer</label>
            <input type="text" value={customer}
              onChange={e => setCustomer(e.target.value)} placeholder="Walk-in" />
          </div>
          <div className="input-group full">
            <label>Payment</label>
            <select value={method} onChange={e => setMethod(e.target.value)}>
              {['Cash','Card','GCash','Maya','Bank Transfer'].map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="btn-checkout"
          onClick={handleCheckout}
          disabled={cart.length === 0}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backgroundColor: 'var(--gold)',
            color: '#1a1a1a',
            fontWeight: '700',
            ...(cart.length === 0 ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {})
          }}
        >
          <CreditCard size={18} />
          Checkout
        </button>
      </div>
    </aside>
  )
}
