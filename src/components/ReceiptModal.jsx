import { fmt } from '../data/products'
import { Check, Printer } from 'lucide-react'

export default function ReceiptModal({ sale, onClose }) {
  if (!sale) return null

  // Use the DR number from the first item in the sale as the document number.
  // If no items have a DR number, fall back to the internal sale ID.
  const primaryDr = sale.items.find(i => i.drNumber)?.drNumber;
  const drDisplay = primaryDr || sale.id.replace('#', '');
  const primaryAddress = sale.items.find(i => i.address)?.address;

  // Ensure at least 15 rows in the table
  const displayItems = [...sale.items];
  const emptyRowsNeeded = Math.max(0, 15 - displayItems.length);
  const emptyRows = Array(emptyRowsNeeded).fill(null);

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal receipt-printable" style={{ 
        maxWidth: '800px', 
        width: '95%', 
        maxHeight: '90vh', 
        padding: '0', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#fff', 
        color: '#000' 
      }}>
        
        {/* Print Styling */}
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .receipt-printable, .receipt-printable * { visibility: visible; }
            .receipt-printable {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 20px !important;
            }
            .no-print { display: none !important; }
          }
          .dr-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          .dr-table th, .dr-table td { border: 1px solid #000; padding: 6px 8px; text-align: left; height: 28px; }
          .dr-table th { background: #f2f2f2; font-weight: bold; }
          .dr-field-line { border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding-left: 5px; }
        `}</style>

        <div style={{ padding: '25px 40px', flex: 1, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>LEGO STAR CORPORATION</h1>
            <p style={{ margin: 0, fontSize: '14px' }}>Sona 7, Poblacion, Tagoloan, Misamis Oriental</p>
          </div>

          {/* Title & Number */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline' }}>DELIVERY RECEIPT</h2>
            <div style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>No. <span style={{ fontSize: '20px' }}>{String(drDisplay).padStart(5, '0')}</span></div>
          </div>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', fontSize: '14px' }}>
            <div>
              <div style={{ marginBottom: '10px' }}>
                Delivered to: <span className="dr-field-line" style={{ minWidth: '250px' }}>{sale.customer}</span>
              </div>
              <div>
                Address: <span className="dr-field-line" style={{ minWidth: '275px' }}>{primaryAddress}</span>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: '10px' }}>
                Date: <span className="dr-field-line" style={{ minWidth: '200px' }}>{sale.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>Due Date: <span className="dr-field-line" style={{ minWidth: '80px' }}></span></div>
                <div style={{ flex: 1 }}>Inv. No.: <span className="dr-field-line" style={{ minWidth: '80px' }}></span></div>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="dr-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>QTY</th>
                <th style={{ width: '80px', textAlign: 'center' }}>UNIT</th>
                <th>DESCRIPTION</th>
                <th style={{ width: '120px', textAlign: 'right' }}>UNIT PRICE</th>
                <th style={{ width: '120px', textAlign: 'right' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, i) => (
                <tr key={i}>
                  <td style={{ textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ textAlign: 'center' }}>pcs</td>
                  <td>
                    {item.name}
                    {item.drNumber && <span style={{ fontSize: '10px', marginLeft: '8px', opacity: 0.7 }}>(DR: {item.drNumber})</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>{fmt(item.price).replace('₱', '')}</td>
                  <td style={{ textAlign: 'right' }}>{fmt(item.price * item.qty).replace('₱', '')}</td>
                </tr>
              ))}
              {emptyRows.map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ border: 'none' }}></td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', borderTop: '2px solid #000' }}>TOTAL AMOUNT P</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', borderTop: '2px solid #000', backgroundColor: '#f9f9f9' }}>{fmt(sale.total).replace('₱', '')}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '55%', fontSize: '11px', lineHeight: '1.4', fontStyle: 'italic' }}>
              <strong>NOTE:</strong> This Delivery Receipt at the same Serves as temporary invoice 
              and as such the items listed herein remain the property of LEGO STAR CORPORATION 
              until fully paid by the customer.
            </div>
            <div style={{ width: '40%' }}>
              <p style={{ fontSize: '12px', margin: '0 0 40px 0', textAlign: 'center' }}>
                Received the above goods in good order and condition.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ borderBottom: '1px solid #000', width: '100%', marginBottom: '4px' }}></div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase' }}>Checked by:</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ borderBottom: '1px solid #000', width: '100%', marginBottom: '4px' }}></div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase' }}>Customer's Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ 
          padding: '20px', 
          background: 'var(--ink-2)', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px',
          borderTop: '1px solid var(--border)' 
        }}>
          <button 
            onClick={handlePrint}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              background: 'var(--ink-4)', 
              color: 'var(--text-1)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            <Printer size={18} /> Print Receipt
          </button>
          <button 
            className="btn-modal-save" 
            style={{ 
              marginTop: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              background: 'var(--gold)',
              color: '#000'
            }} 
            onClick={onClose}
          >
            <Check size={18} /> Done
          </button>
        </div>
      </div>
    </div>
  )
}