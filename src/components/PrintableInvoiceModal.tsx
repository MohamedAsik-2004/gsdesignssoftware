import React, { useState } from 'react';
import { Order } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  Receipt, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Mail,
  QrCode
} from 'lucide-react';

interface PrintableInvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const PrintableInvoiceModal: React.FC<PrintableInvoiceModalProps> = ({ order, onClose }) => {
  const [printFormat, setPrintFormat] = useState<'A4' | 'THERMAL'>('A4');
  const [includeGst, setIncludeGst] = useState<boolean>(true);

  const handlePrint = () => {
    window.print();
  };

  const gstPercent = order.gstPercent || 18;
  const baseTotal = order.totalAmount;
  const gstAmount = includeGst ? Math.round((baseTotal * gstPercent) / 100) : 0;
  const grandTotal = baseTotal + gstAmount;
  const balanceDue = Math.max(0, grandTotal - order.advancePaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-slate-900 print:w-full print:max-w-none">
        
        {/* Modal Controls Top Bar (Hidden during printing) */}
        <div className="print:hidden bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Print Invoice & POS Receipt</h3>
              <p className="text-xs text-slate-400">Job No: <span className="text-red-400 font-semibold">{order.jobNo}</span> | Invoice: #{order.invoiceNo || 'INV-2026-001'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Format Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center space-x-1 text-xs font-semibold">
              <button
                onClick={() => setPrintFormat('A4')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  printFormat === 'A4'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Standard A4 Invoice</span>
              </button>
              <button
                onClick={() => setPrintFormat('THERMAL')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  printFormat === 'THERMAL'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>3-Inch Thermal POS</span>
              </button>
            </div>

            {/* GST Toggle */}
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <input
                type="checkbox"
                checked={includeGst}
                onChange={e => setIncludeGst(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 bg-slate-900 border-slate-700"
              />
              <span>Include GST ({gstPercent}%)</span>
            </label>

            {/* Print Action Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-900/40 flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area Wrapper */}
        <div className="p-8 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          
          {/* A4 FORMAL INVOICE FORMAT */}
          {printFormat === 'A4' && (
            <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none font-sans text-xs">
              
              {/* Header Section */}
              <div className="flex justify-between items-start border-b-2 border-red-600 pb-6 mb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-600 text-white text-xl font-black px-2.5 py-1 rounded-lg">GS</span>
                    <div>
                      <h1 className="text-2xl font-black tracking-tight text-slate-900">GS DESIGNS</h1>
                      <p className="text-[10px] font-bold tracking-widest text-red-600 uppercase">ADVERTISING AGENCY</p>
                    </div>
                  </div>
                  <p className="text-slate-600 mt-2 text-xs leading-relaxed max-w-sm">
                    1/31, Public Office Road, Next to CRC Depot,<br />
                    Velippalayam, Nagapattinam - 611001.<br />
                    <strong>GSTIN:</strong> 33AAAAA0000A1Z5 | <strong>State:</strong> Tamil Nadu (33)
                  </p>
                  <p className="text-slate-700 mt-1 font-semibold text-xs flex items-center space-x-3">
                    <span>📞 98432 19951</span>
                    <span>📞 77088 66844</span>
                    <span>✉️ gsdesignsngt@gmail.com</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-extrabold px-3 py-1 rounded-md uppercase tracking-wider mb-2">
                    TAX INVOICE
                  </span>
                  <p className="text-sm font-bold text-slate-800">Invoice No: <span className="text-red-600">{order.invoiceNo || 'INV-2026-001'}</span></p>
                  <p className="text-xs text-slate-600">Job Sheet No: <strong>{order.jobNo}</strong></p>
                  <p className="text-xs text-slate-600">Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p className="text-xs text-slate-600">Payment: <strong className="text-slate-800">{order.paymentMethod || 'Cash'}</strong></p>
                </div>
              </div>

              {/* Customer & Bill To Box */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Billed To (Customer):</h4>
                  <p className="font-extrabold text-slate-900 text-sm">{order.customerName}</p>
                  <p className="text-slate-600 text-xs">Phone: <strong>{order.customerPhone}</strong></p>
                  {order.customerEmail && <p className="text-slate-600 text-xs">Email: {order.customerEmail}</p>}
                  {order.customerGstNo && <p className="text-slate-700 text-xs font-semibold">GSTIN: {order.customerGstNo}</p>}
                </div>
                <div className="text-right">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Order Summary:</h4>
                  <p className="text-slate-700">Category: <strong className="uppercase text-slate-900">{order.category}</strong></p>
                  <p className="text-slate-700">Designer: <strong>{order.designerName}</strong></p>
                  <p className="text-slate-700">Status: <span className="font-bold text-emerald-700 uppercase">{order.status.replace(/_/g, ' ')}</span></p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4 text-left rounded-l-md">S.No</th>
                    <th className="py-2.5 px-4 text-left">Description & Specifications</th>
                    <th className="py-2.5 px-4 text-center">Category</th>
                    <th className="py-2.5 px-4 text-right">Qty / Size</th>
                    <th className="py-2.5 px-4 text-right rounded-r-md">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 text-xs">
                  <tr>
                    <td className="py-3 px-4 font-bold">1</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{order.title}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{order.description}</p>

                      {/* Flex Specs */}
                      {order.flexSpecs && (
                        <div className="mt-1.5 text-[11px] bg-slate-100 p-2 rounded border border-slate-200 inline-block text-slate-700">
                          <span>Dimensions: <strong>{order.flexSpecs.widthFt} × {order.flexSpecs.heightFt} ft ({order.flexSpecs.sqFt} Sq.Ft)</strong></span> • 
                          <span className="ml-2">Finish: <strong>{order.flexSpecs.finishType}</strong> @ ₹{order.flexSpecs.ratePerSqFt}/sqft</span>
                          {order.flexSpecs.frameIncluded && <span className="ml-2 font-bold text-red-600">+ 1" Iron Pipe Frame</span>}
                        </div>
                      )}

                      {/* Invitation Specs */}
                      {order.invitationSpecs && (
                        <div className="mt-1.5 text-[11px] bg-slate-100 p-2 rounded border border-slate-200 inline-block text-slate-700">
                          <span>Paper: <strong>{order.invitationSpecs.paperType}</strong></span> • 
                          <span className="ml-2">Type: <strong>{order.invitationSpecs.printType}</strong></span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold uppercase text-slate-600">{order.category}</td>
                    <td className="py-3 px-4 text-right font-bold">
                      {order.flexSpecs ? `${order.flexSpecs.sqFt} Sq.Ft` : (order.invitationSpecs?.quantity || order.noticeSpecs?.quantity || 1)}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">₹{order.totalAmount}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals & Payments Calculation */}
              <div className="flex justify-between items-start border-t border-slate-200 pt-4">
                <div className="w-1/2 pr-6">
                  <h5 className="font-bold text-slate-800 text-xs mb-1">Terms & Conditions:</h5>
                  <ul className="text-[10px] text-slate-600 list-disc list-inside space-y-0.5">
                    <li>Proof approved by customer is final. Errors after print will not be accepted.</li>
                    <li>50% advance required for order confirmation.</li>
                    <li>Goods once printed cannot be returned or exchanged.</li>
                  </ul>
                  <div className="mt-6 flex items-center space-x-3 text-slate-500 text-[10px]">
                    <QrCode className="w-10 h-10 text-slate-800" />
                    <div>
                      <p className="font-bold text-slate-800">Scan & Pay via GPay / PhonePe</p>
                      <p>UPI ID: gsdesigns@upi / 9843219951</p>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Sub Total Amount:</span>
                    <span className="font-bold text-slate-900">₹{baseTotal}</span>
                  </div>

                  {includeGst && (
                    <div className="flex justify-between text-slate-600">
                      <span>GST ({gstPercent}%):</span>
                      <span className="font-bold text-slate-900">₹{gstAmount}</span>
                    </div>
                  )}

                  {order.discount && order.discount > 0 ? (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount Offered:</span>
                      <span className="font-bold">- ₹{order.discount}</span>
                    </div>
                  ) : null}

                  <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
                    <span>Grand Total:</span>
                    <span className="text-red-600">₹{grandTotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-700 border-t border-slate-200 pt-2">
                    <span>Advance Received:</span>
                    <span className="font-bold text-emerald-700">₹{order.advancePaid}</span>
                  </div>

                  <div className="flex justify-between text-sm font-black p-2 bg-red-100 text-red-900 rounded-md">
                    <span>Balance Due Amount:</span>
                    <span>₹{balanceDue}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end mt-12 pt-6 border-t border-slate-200 text-xs">
                <div>
                  <p className="text-slate-400">Customer Signature</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">For GS DESIGNS</p>
                  <p className="text-slate-500 text-[10px] mt-8">Authorized Signatory</p>
                </div>
              </div>

            </div>
          )}

          {/* 3-INCH THERMAL POS RECEIPT FORMAT */}
          {printFormat === 'THERMAL' && (
            <div className="w-[300px] mx-auto bg-white text-slate-900 p-4 rounded-xl shadow-lg border border-slate-300 font-mono text-[11px] leading-tight print:shadow-none print:border-none print:w-[80mm] print:mx-0">
              
              <div className="text-center pb-3 border-b border-dashed border-slate-400">
                <h2 className="text-base font-black tracking-tighter">GS DESIGNS</h2>
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-700">ADVERTISING AGENCY</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Public Office Rd, Nagapattinam.<br />
                  Ph: 98432 19951 / 77088 66844
                </p>
              </div>

              <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
                <p className="flex justify-between">
                  <span>Job No: <strong>{order.jobNo}</strong></span>
                  <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
                </p>
                <p className="flex justify-between">
                  <span>Invoice: #{order.invoiceNo || 'INV-2026'}</span>
                  <span>Time: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
                <p>Cust: <strong>{order.customerName}</strong></p>
                <p>Phone: <strong>{order.customerPhone}</strong></p>
              </div>

              <div className="py-2 border-b border-dashed border-slate-400">
                <p className="font-bold uppercase text-[12px]">{order.title}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{order.description}</p>
                {order.flexSpecs && (
                  <p className="text-[10px] mt-1 font-semibold">
                    Size: {order.flexSpecs.widthFt}x{order.flexSpecs.heightFt} ft ({order.flexSpecs.sqFt} sqft)<br />
                    Type: {order.flexSpecs.finishType}
                  </p>
                )}
                {order.invitationSpecs && (
                  <p className="text-[10px] mt-1 font-semibold">
                    Qty: {order.invitationSpecs.quantity} cards | {order.invitationSpecs.paperType}
                  </p>
                )}
              </div>

              <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{order.totalAmount}</span>
                </div>
                {includeGst && (
                  <div className="flex justify-between">
                    <span>GST ({gstPercent}%):</span>
                    <span>₹{gstAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black pt-1 border-t border-slate-300">
                  <span>TOTAL:</span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Advance Paid:</span>
                  <span>₹{order.advancePaid}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-red-600 border-t border-dashed border-slate-400 pt-1">
                  <span>BALANCE DUE:</span>
                  <span>₹{balanceDue}</span>
                </div>
              </div>

              <div className="text-center pt-3 space-y-1">
                <p className="font-bold text-[10px]">Thank you for choosing GS Designs!</p>
                <p className="text-[9px] text-slate-500">Please check proof before final print.</p>
                <div className="mt-2 pt-1 border-t border-slate-200">
                  <p className="text-[8px] text-slate-400 font-sans">Powered by GS Design POS Engine</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
