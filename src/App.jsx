import { useState } from 'react'
import { INITIAL_PRODUCTS } from './data/products'
import { useToast } from './hooks/useToast'

import Sidebar         from './components/Sidebar'
import POSView         from './components/POSView'
import InventoryView   from './components/InventoryView'
import SalesView       from './components/SalesView'
import CartPanel       from './components/CartPanel'
import AddItemModal    from './components/AddItemModal'
import ReceiptModal    from './components/ReceiptModal'
import ToastContainer  from './components/ToastContainer'

let _nextId = 100

export default function App() {
  const [view,     setView]     = useState('pos')
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [cart,     setCart]     = useState([])
  const [sales,    setSales]    = useState([])
  const [addOpen,  setAddOpen]  = useState(false)
  const [receipt,  setReceipt]  = useState(null)
  const { toasts, toast } = useToast()

  // ── Cart actions ────────────────────────────────────────────
  const addToCart = (id) => {
    const product = products.find(p => p.id === id)
    if (!product || product.stock === 0) return

    setCart(prev => {
      const existing = prev.find(c => c.id === id)
      if (existing) {
        if (existing.qty >= product.stock) { toast('Max stock reached', 'error'); return prev }
        return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c)
      }
      return [...prev, { id, qty: 1, name: product.name, price: product.price, image: product.image }]
    })
    toast(`${product.name} added`, 'success')
  }

  const changeQty = (id, delta) => {
    const product = products.find(p => p.id === id)
    setCart(prev => {
      const item = prev.find(c => c.id === id)
      if (!item) return prev
      const newQty = item.qty + delta
      if (newQty <= 0) return prev.filter(c => c.id !== id)
      if (product && newQty > product.stock) { toast('Max stock reached', 'error'); return prev }
      return prev.map(c => c.id === id ? { ...c, qty: newQty } : c)
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id))
  const clearCart = () => setCart([])

  // ── Checkout ─────────────────────────────────────────────────
  const handleCheckout = ({ subtotal, discAmt, taxAmt, total, customer, method }) => {
    if (!cart.length) return

    // Deduct stock
    setProducts(prev => prev.map(p => {
      const item = cart.find(c => c.id === p.id)
      return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p
    }))

    const sale = {
      id:       '#' + String(sales.length + 1001),
      time:     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date:     new Date().toLocaleDateString('en-PH'),
      items:    [...cart],
      subtotal, discAmt, taxAmt, total, customer, method,
    }

    setSales(prev => [sale, ...prev])
    setReceipt(sale)
    setCart([])
    toast('Sale completed!', 'success')
  }

  // ── Inventory actions ────────────────────────────────────────
  const handleAddItem = (data) => {
    setProducts(prev => [...prev, { id: _nextId++, ...data }])
    setAddOpen(false)
    toast('Product added!', 'success')
  }

  const handleEditPrice = (id) => {
    const p = products.find(x => x.id === id)
    if (!p) return
    const raw = prompt(`New price for "${p.name}":`, p.price)
    if (raw === null) return
    const val = parseFloat(raw)
    if (isNaN(val) || val < 0) { toast('Invalid price', 'error'); return }
    setProducts(prev => prev.map(x => x.id === id ? { ...x, price: val } : x))
    // Also update cart price live
    setCart(prev => prev.map(c => c.id === id ? { ...c, price: val } : c))
    toast('Price updated!', 'success')
  }

  const handleEditStock = (id) => {
    const p = products.find(x => x.id === id)
    if (!p) return
    const raw = prompt(`New stock quantity for "${p.name}":`, p.stock)
    if (raw === null) return
    const val = parseInt(raw)
    if (isNaN(val) || val < 0) { toast('Invalid quantity', 'error'); return }
    setProducts(prev => prev.map(x => x.id === id ? { ...x, stock: val } : x))
    toast('Stock updated!', 'success')
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return
    setProducts(prev => prev.filter(x => x.id !== id))
    setCart(prev => prev.filter(c => c.id !== id))
    toast('Product deleted', 'default')
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        setView={setView} 
        currentView={view} 
        onLogout={() => console.log('Logout clicked')}
        onAddItem={() => setAddOpen(true)}
      />
      
      <div className="app-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="main-layout">
          {/* Left panel */}
          <main className="panel-left">
            {view === 'pos' && (
              <POSView products={products} onAdd={addToCart} />
            )}
            {view === 'inventory' && (
              <InventoryView
                products={products}
                onEditPrice={handleEditPrice}
                onEditStock={handleEditStock}
                onDelete={handleDelete}
                onAddItem={() => setAddOpen(true)}
              />
            )}
            {view === 'sales' && (
              <SalesView sales={sales} />
            )}
          </main>

          {/* Right panel – cart (always visible) */}
          <CartPanel
            cart={cart}
            products={products}
            onAdd={addToCart}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onClear={clearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
      {/* Modals */}
      {addOpen  && <AddItemModal onSave={handleAddItem} onClose={() => setAddOpen(false)} />}
      {receipt  && <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />}

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
