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
import ItemCustomizeModal from './components/ItemCustomizeModal'
import CompanyModal    from './components/CompanyModal'

let _nextId = 100

export default function App() {
  const [view,     setView]     = useState('pos')
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [cart,     setCart]     = useState([])
  const [sales,    setSales]    = useState([])
  const [addOpen,  setAddOpen]  = useState(false)
  const [companyModalOpen, setCompanyModalOpen] = useState(false)
  const [companies, setCompanies] = useState([
    { name: 'None', address: '' },
    { name: 'PastryStar', address: '123 Baker St, CDO' },
    { name: 'LegoStar', address: 'Zone 7, Poblacion, Tagoloan' },
    { name: 'SweetTreats', address: 'Market Site, Misamis Oriental' }
  ])
  const [customizingProduct, setCustomizingProduct] = useState(null)
  const [drCounters, setDRCounters] = useState({
    'None': 1,
    'PastryStar': 1,
    'LegoStar': 1,
    'SweetTreats': 1
  })
  const [receipt,  setReceipt]  = useState(null)
  const { toasts, toast } = useToast()

  // ── Cart actions ────────────────────────────────────────────
  const openCustomizeModal = (id) => {
    const product = products.find(p => p.id === id)
    if (!product || product.stock === 0) return
    setCustomizingProduct(product)
  }

  const confirmAddToCart = (data) => {
    const { id, name, price, qty, image, drNumber, company } = data;
    const companyData = companies.find(c => c.name === company);
    
    setCart(prev => {
      const cartId = `${id}-${price}-${drNumber}-${company}`
      const existing = prev.find(c => c.cartId === cartId)
      if (existing) {
        const product = products.find(p => p.id === id)
        if (existing.qty + qty > product.stock) { toast('Max stock reached', 'error'); return prev }
        return prev.map(c => c.cartId === cartId ? { ...c, qty: c.qty + qty, address: companyData?.address } : c)
      }
      return [...prev, { cartId, id, qty, name, price, image, drNumber, company, address: companyData?.address }]
    })

    // Increment the DR counter for the specific company
    setDRCounters(prev => ({
      ...prev,
      [company]: Math.max(prev[company], parseInt(drNumber) + 1)
    }))

    setCustomizingProduct(null)
    toast(`${name} added`, 'success')
  }

  const changeQty = (cartId, delta) => {
    setCart(prev => {
      const item = prev.find(c => c.cartId === cartId)
      if (!item) return prev
      const product = products.find(p => p.id === item.id)
      const newQty = item.qty + delta
      if (newQty <= 0) return prev.filter(c => c.cartId !== cartId)
      if (product && newQty > product.stock) { toast('Max stock reached', 'error'); return prev }
      return prev.map(c => c.cartId === cartId ? { ...c, qty: newQty } : c)
    })
  }

  const removeFromCart = (cartId) => setCart(prev => prev.filter(c => c.cartId !== cartId))
  const clearCart = () => setCart([])

  // ── Checkout ─────────────────────────────────────────────────
  const handleCheckout = ({ subtotal, discAmt, taxAmt, total, customer, method }) => {
    if (!cart.length) return

    // Deduct stock
    setProducts(prev => prev.map(p => {
      const totalQtyInCart = cart.filter(c => c.id === p.id).reduce((sum, item) => sum + item.qty, 0)
      return totalQtyInCart > 0 ? { ...p, stock: Math.max(0, p.stock - totalQtyInCart) } : p
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

  const handleAddCompany = (data) => {
    const { name, address, nextDr } = data
    if (!name || companies.some(c => c.name === name)) return
    setCompanies(prev => [...prev, { name, address }])
    setDRCounters(prev => ({ ...prev, [name]: nextDr }))
    setCompanyModalOpen(false)
    toast(`Company "${name}" added`, 'success')
  }

  const handleUpdateDR = (company, val) => {
    setDRCounters(prev => ({
      ...prev,
      [company]: parseInt(val) || 1
    }))
    toast(`DR counter for ${company} updated`, 'success')
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
              <POSView products={products} onAdd={openCustomizeModal} />
            )}
            {view === 'inventory' && (
              <InventoryView
                products={products}
                onEditPrice={handleEditPrice}
                onEditStock={handleEditStock}
                onDelete={handleDelete}
                onAddItem={() => setAddOpen(true)}
                companies={companies}
                onAddCompany={() => setCompanyModalOpen(true)}
                drCounters={drCounters}
                onUpdateDR={handleUpdateDR}
              />
            )}
            {view === 'sales' && (
              <SalesView sales={sales} onViewReceipt={setReceipt} />
            )}
          </main>

          {/* Right panel – cart (always visible) */}
          <CartPanel
            cart={cart}
            products={products}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onClear={clearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
      {/* Modals */}
      {addOpen  && <AddItemModal onSave={handleAddItem} onClose={() => setAddOpen(false)} />}
      {companyModalOpen && <CompanyModal onSave={handleAddCompany} onClose={() => setCompanyModalOpen(false)} />}
      {customizingProduct && (
        <ItemCustomizeModal 
          product={customizingProduct} 
          onConfirm={confirmAddToCart} 
          onClose={() => setCustomizingProduct(null)} 
          drCounters={drCounters}
          companies={companies}
        />
      )}
      {receipt  && <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />}

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
