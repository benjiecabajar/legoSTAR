import { useState } from 'react'
import { fmt } from '../data/products'
import { BarChart3, TrendingUp, Award, History, PieChart, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SalesView({ sales }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredSales = sales.filter(s => {
    if (!startDate && !endDate) return true
    const [m, d, y] = s.date.split('/')
    const saleTime = new Date(y, m - 1, d).setHours(0, 0, 0, 0)

    if (startDate) {
      const [sY, sM, sD] = startDate.split('-')
      const startTime = new Date(sY, sM - 1, sD).setHours(0, 0, 0, 0)
      if (saleTime < startTime) return false
    }
    if (endDate) {
      const [eY, eM, eD] = endDate.split('-')
      const endTime = new Date(eY, eM - 1, eD).setHours(0, 0, 0, 0)
      if (saleTime > endTime) return false
    }
    return true
  })

  const totalRev  = filteredSales.reduce((a, s) => a + s.total, 0)
  const totalUnits = filteredSales.reduce((a, s) => a + s.items.reduce((b, i) => b + i.qty, 0), 0)
  const avgOrder  = filteredSales.length ? totalRev / filteredSales.length : 0

  // Prepare chart data (Revenue over time)
  const chartDataRaw = filteredSales.reduce((acc, sale) => {
    acc[sale.date] = (acc[sale.date] || 0) + sale.total
    return acc
  }, {})

  const chartData = Object.entries(chartDataRaw)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => {
      const [am, ad, ay] = a.date.split('/').map(Number)
      const [bm, bd, by] = b.date.split('/').map(Number)
      return new Date(ay, am - 1, ad) - new Date(by, bm - 1, bd)
    })

  // Calculate Top Sellers
  const itemMap = {}
  filteredSales.forEach(s => {
    s.items.forEach(item => {
      if (!itemMap[item.name]) itemMap[item.name] = { name: item.name, qty: 0, rev: 0 }
      itemMap[item.name].qty += item.qty
      itemMap[item.name].rev += item.qty * item.price
    })
  })
  const topProducts = Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5)

  // Calculate Payment Methods
  const methodMap = {}
  filteredSales.forEach(s => {
    methodMap[s.method] = (methodMap[s.method] || 0) + s.total
  })
  const methodStats = Object.entries(methodMap).map(([name, val]) => ({ name, val }))

  const stats = [
    { label: 'Revenue',      val: fmt(totalRev),           sub: 'all time' },
    { label: 'Transactions', val: filteredSales.length,    sub: 'orders' },
    { label: 'Units Sold',   val: totalUnits,              sub: 'items' },
    { label: 'Avg Order',    val: fmt(avgOrder),           sub: 'per txn' },
  ]

  return (
    <div className="sales-view">
      <div className="sales-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '18px', margin: 0 }}>
            <BarChart3 size={24} />
            Sales Dashboard
          </h2>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '4px', display: 'block' }}>From</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                style={{ padding: '6px 10px', fontSize: '12px', background: 'var(--ink-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: '6px' }} 
              />
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '4px', display: 'block' }}>To</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                style={{ padding: '6px 10px', fontSize: '12px', background: 'var(--ink-3)', border: '1px solid var(--border)', color: 'var(--text-2)', borderRadius: '6px' }} 
              />
            </div>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                style={{ 
                  background: 'var(--ink-4)', border: '1px solid var(--border)', color: 'var(--text-2)', 
                  padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex' 
                }}
                title="Clear Filters"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="stats-row">
          {stats.map(s => (
            <div key={s.label} className="stat-tile">
              <div className="stat-label">{s.label}</div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="stat-tile" style={{ marginBottom: '30px', padding: '20px', height: '300px', textAlign: 'left' }}>
        <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', padding: 0, border: 'none' }}>
          <TrendingUp size={18} color="var(--gold)" />
          Sales Trend (Daily Revenue)
        </div>
        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="var(--text-3)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="var(--text-3)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `₱${value}`}
              />
              <Tooltip 
                contentStyle={{ background: 'var(--ink-2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: 'var(--gold)' }}
                labelStyle={{ color: 'var(--text-1)', marginBottom: '4px' }}
                formatter={(value) => [fmt(value), 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="var(--gold)" 
                strokeWidth={2} 
                dot={{ fill: 'var(--gold)', r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Top Sellers */}
        <div className="stat-tile" style={{ textAlign: 'left', padding: '20px' }}>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', padding: 0, border: 'none' }}>
            <Award size={18} color="var(--gold)" />
            Top Selling Pastries
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topProducts.length === 0 ? (
              <div style={{ color: 'var(--text-3)', fontSize: '13px' }}>No data available</div>
            ) : topProducts.map((p, idx) => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>
                  <span style={{ color: 'var(--gold)', marginRight: '8px', fontWeight: '700' }}>#{idx + 1}</span>
                  {p.name}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-1)' }}>{p.qty} sold</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="stat-tile" style={{ textAlign: 'left', padding: '20px' }}>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', padding: 0, border: 'none' }}>
            <PieChart size={18} color="var(--gold)" />
            Revenue by Method
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {methodStats.length === 0 ? (
              <div style={{ color: 'var(--text-3)', fontSize: '13px' }}>No data available</div>
            ) : methodStats.map(m => (
              <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-2)' }}>{m.name}</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-1)' }}>{fmt(m.val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-1)', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>
        <History size={18} />
        Transaction History
      </div>

      <div className="sales-scroll" style={{ marginTop: '15px' }}>
        {filteredSales.length === 0 ? (
          <div className="empty-state" style={{ padding: 48, background: 'var(--ink-3)', borderRadius: '12px' }}>
            <TrendingUp size={40} style={{ marginBottom: '12px', opacity: 0.2 }} />
            <div style={{ color: 'var(--text-3)' }}>No transactions found for the selected range.</div>
          </div>
        ) : filteredSales.map(s => (
          <div key={s.id} className="sale-row" style={{ borderLeft: '4px solid var(--gold)', marginBottom: '10px', background: 'var(--ink-3)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span className="sale-id" style={{ color: 'var(--gold)', fontWeight: '700' }}>{s.id}</span>
                <span className="badge-method" style={{ 
                  fontSize: '10px', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  background: 'var(--ink-4)', 
                  color: 'var(--text-2)',
                  border: '1px solid var(--border)'
                }}>{s.method}</span>
              </div>
              <div className="sale-meta" style={{ color: 'var(--text-3)', fontSize: '12px' }}>
                {s.date} · {s.time} · <span style={{ color: 'var(--text-2)' }}>{s.customer}</span> · {s.items.length} item(s)
              </div>
            </div>
            <div className="sale-total" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)' }}>
              {fmt(s.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
