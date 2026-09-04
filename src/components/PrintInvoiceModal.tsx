import React, { useState } from 'react';
import { Order } from '../types';
import { X, Printer, Receipt, FileText, QrCode, Sparkles, CheckCircle2 } from 'lucide-react';

interface PrintInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const [printMode, setPrintMode] = useState<'THERMAL' | 'A4'>('THERMAL');

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = order.totalAmount;
  const gstAmount = order.gstAmount || Math.round((subtotal * 18) / 100);
  const grandTotal = subtotal + gstAmount;
  const advancePaid = order.advancePaid || 0;
  const balanceDue = grandTotal - advancePaid;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      
      {/* Modal Container */}
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-slide-up my-6 print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Header - Hidden during print */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Print Invoice & Receipt</h3>
              <p className="text-xs text-slate-400">Select Thermal 80mm POS slip or Formal A4 Tax Invoice</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mode Switcher */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center space-x-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setPrintMode('THERMAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  printMode === 'THERMAL' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>80mm Thermal Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintMode('A4')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  printMode === 'A4' 
                    ? 'bg-red-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>A4 Tax Invoice</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center space-x-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 bg-slate-950 text-slate-200 overflow-y-auto max-h-[78vh] flex justify-center print:p-0 print:bg-white print:text-black print:max-h-none print:overflow-visible">
          
          {/* THERMAL 80MM SLIP FORMAT */}
          {printMode === 'THERMAL' && (
            <div className="w-[80mm] min-h-[500px] bg-white text-black p-4 text-[12px] font-mono leading-tight shadow-xl rounded-xl print:shadow-none print:rounded-none print:w-full">
              {/* Header */}
              <div className="text-center pb-3 border-b border-dashed border-black">
                <h1 className="text-base font-black tracking-tighter uppercase">GS DESIGNS</h1>
                <p className="text-[10px] font-sans">Offset Printing, Flex & Digital Studio</p>
                <p className="text-[10px] font-sans">Nagercoil, Kanyakumari Dist.</p>
                <p className="text-[10px]">Ph: 98432 19951 / 94432 88123</p>
                <p className="text-[9px] mt-0.5">GSTIN: 33AAACK1234F1Z9</p>
              </div>

              {/* Order Info */}
              <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span>Job No: {order.jobNo}</span>
                  <span>{order.invoiceNo || 'INV-POS'}</span>
                </div>
                <div>Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                <div>Cust: <strong className="font-sans font-bold">{order.customerName}</strong></div>
                <div>Phone: {order.customerPhone}</div>
              </div>

              {/* Items Breakdown */}
              <div className="py-2 border-b border-dashed border-black">
                <div className="font-bold font-sans mb-1 uppercase text-[11px]">{order.title}</div>
                <div className="text-[10px] text-gray-700">Category: {order.category}</div>
                
                {/* Specifics */}
                {order.flexSpecs && (
                  <div className="text-[10px] text-gray-800 font-sans mt-1 bg-gray-100 p-1 rounded">
                    Size: {order.flexSpecs.widthFt}x{order.flexSpecs.heightFt} ft ({order.flexSpecs.sqFt || order.flexSpecs.widthFt * order.flexSpecs.heightFt} SqFt)<br />
                    Material: {order.flexSpecs.flexType || order.flexSpecs.finishType || 'Star Flex'}
                  </div>
                )}
                {order.invitationSpecs && (
                  <div className="text-[10px] text-gray-800 font-sans mt-1 bg-gray-100 p-1 rounded">
                    Qty: {order.invitationSpecs.quantity} Cards | {order.invitationSpecs.paperGsm || order.invitationSpecs.paperType}<br />
                    Finish: {order.invitationSpecs.printingType || order.invitationSpecs.printType}
                  </div>
                )}
                {order.noticeSpecs && (
                  <div className="text-[10px] text-gray-800 font-sans mt-1 bg-gray-100 p-1 rounded">
                    Size: {order.noticeSpecs.paperSize || order.noticeSpecs.size} | Qty: {order.noticeSpecs.quantity}<br />
                    Print: {order.noticeSpecs.printType}
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                {order.gstAmount ? (
                  <div className="flex justify-between text-[10px]">
                    <span>GST (18%):</span>
                    <span>₹{order.gstAmount}</span>
                  </div>
                ) : null}
                <div className="flex justify-between font-bold border-t border-dotted border-gray-400 pt-1 text-[12px]">
                  <span>Total Amount:</span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Advance Paid:</span>
                  <span>₹{advancePaid}</span>
                </div>
                <div className="flex justify-between font-black text-red-700 text-[13px] border-t border-black pt-1">
                  <span>DUE BALANCE:</span>
                  <span>₹{balanceDue}</span>
                </div>
              </div>

              {/* UPI Payment QR Footer */}
              <div className="pt-3 text-center space-y-1">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg p-1 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-black" />
                  </div>
                </div>
                <p className="text-[9px] font-sans font-semibold text-gray-700">Scan UPI QR to Pay Balance Dues</p>
                <p className="text-[9px] font-sans font-bold text-slate-800">gsdesigns@upi</p>
                <p className="text-[9px] text-gray-500 pt-1">*** Thank You! Visit Again ***</p>
              </div>
            </div>
          )}

          {/* FORMAL A4 TAX INVOICE FORMAT */}
          {printMode === 'A4' && (
            <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 font-sans shadow-2xl rounded-xl print:shadow-none print:rounded-none print:w-full print:p-0">
              
              {/* Header Banner */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">GS DESIGNS</h1>
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-widest">Offset Printing, Flex & Digital Studio</p>
                  <p className="text-xs text-slate-600 mt-1">Main Road, Opp. Collectorate, Nagercoil - 629001</p>
                  <p className="text-xs text-slate-600">Phone: +91 98432 19951 | Email: gsdesignsngt@gmail.com</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">GSTIN: 33AAACK1234F1Z9</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-slate-900 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider rounded mb-2">TAX INVOICE</span>
                  <p className="text-sm font-bold text-slate-800">Invoice #: {order.invoiceNo || 'INV-2026-001'}</p>
                  <p className="text-xs text-slate-600">Job No: <strong>{order.jobNo}</strong></p>
                  <p className="text-xs text-slate-600">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Customer & Billing Details */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1 text-red-600">Billed To Customer</h3>
                  <p className="font-bold text-sm text-slate-900">{order.customerName}</p>
                  <p className="text-slate-600">Phone: {order.customerPhone}</p>
                  {order.customerEmail && <p className="text-slate-600">Email: {order.customerEmail}</p>}
                  {order.customerGstNo && <p className="font-bold text-slate-800">GSTIN: {order.customerGstNo}</p>}
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-1 text-red-600">Order Information</h3>
                  <p><span className="text-slate-500">Service Category:</span> <strong className="uppercase">{order.category}</strong></p>
                  <p><span className="text-slate-500">Assigned Designer:</span> {order.designerName}</p>
                  <p><span className="text-slate-500">Current Status:</span> <strong className="text-emerald-700">{order.status.replace(/_/g, ' ')}</strong></p>
                </div>
              </div>

              {/* Particulars Table */}
              <table className="w-full text-xs text-left mb-6 border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                    <th className="p-3 font-semibold rounded-tl-lg">S.No</th>
                    <th className="p-3 font-semibold">Job Particulars & Specifications</th>
                    <th className="p-3 font-semibold">HSN / SAC</th>
                    <th className="p-3 font-semibold text-center">Qty / Size</th>
                    <th className="p-3 font-semibold text-right">Rate (₹)</th>
                    <th className="p-3 font-semibold text-right rounded-tr-lg">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                  <tr>
                    <td className="p-3 font-bold text-slate-500">01</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900 text-sm">{order.title}</p>
                      <p className="text-slate-600 mt-0.5">{order.description}</p>
                      
                      {/* Flex Details */}
                      {order.flexSpecs && (
                        <p className="text-[11px] text-slate-700 bg-amber-50 border border-amber-200 p-1.5 rounded mt-1">
                          Dimensions: {order.flexSpecs.widthFt} ft × {order.flexSpecs.heightFt} ft = {order.flexSpecs.sqFt || order.flexSpecs.widthFt * order.flexSpecs.heightFt} Sq.Ft | 
                          Type: {order.flexSpecs.flexType || order.flexSpecs.finishType || 'Star Flex'} | 
                          Frame: {order.flexSpecs.frameRequired ? '1-inch Square Pipe Frame Included' : 'No Frame'}
                        </p>
                      )}

                      {/* Invitation Specs */}
                      {order.invitationSpecs && (
                        <p className="text-[11px] text-slate-700 bg-red-50 border border-red-200 p-1.5 rounded mt-1">
                          Cards: {order.invitationSpecs.quantity} Pcs | Paper: {order.invitationSpecs.paperGsm || order.invitationSpecs.paperType} | Printing: {order.invitationSpecs.printingType || order.invitationSpecs.printType}
                        </p>
                      )}

                      {/* Notice Specs */}
                      {order.noticeSpecs && (
                        <p className="text-[11px] text-slate-700 bg-emerald-50 border border-emerald-200 p-1.5 rounded mt-1">
                          Flyer Size: {order.noticeSpecs.paperSize || order.noticeSpecs.size} | Qty: {order.noticeSpecs.quantity} Sheets | Printing: {order.noticeSpecs.printType}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 font-mono">998386</td>
                    <td className="p-3 text-center font-bold">1 Job</td>
                    <td className="p-3 text-right font-mono">₹{order.totalAmount}</td>
                    <td className="p-3 text-right font-bold font-mono">₹{order.totalAmount}</td>
                  </tr>
                </tbody>
              </table>

              {/* Financial Calculation & Breakdown */}
              <div className="grid grid-cols-2 gap-6 text-xs mb-8">
                
                {/* Terms & Bank Details */}
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">Bank Payment Details</h4>
                    <p className="text-slate-600">Bank: <strong>State Bank of India (SBI)</strong></p>
                    <p className="text-slate-600">A/C Name: <strong>GS DESIGNS</strong></p>
                    <p className="text-slate-600">A/C No: <strong>38291049281</strong></p>
                    <p className="text-slate-600">IFSC Code: <strong>SBIN0000885</strong></p>
                    <p className="text-slate-600">UPI ID: <strong className="text-emerald-700">gsdesigns@upi</strong></p>
                  </div>

                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <p className="font-bold text-slate-700">Terms & Conditions:</p>
                    <p>1. Proof approved by customer is final. GS Designs is not liable for spelling errors after approval.</p>
                    <p>2. Advance paid is non-refundable once printing has commenced.</p>
                    <p>3. Goods once sold will not be taken back.</p>
                  </div>
                </div>

                {/* Amount Totals Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Taxable Value:</span>
                    <span className="font-mono font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>CGST (9%):</span>
                    <span className="font-mono">₹{Math.round(gstAmount / 2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>SGST (9%):</span>
                    <span className="font-mono">₹{Math.round(gstAmount / 2)}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base">₹{grandTotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                    <span>Advance Received:</span>
                    <span className="font-mono">₹{advancePaid}</span>
                  </div>
                  <div className="border-t-2 border-slate-900 pt-2 flex justify-between font-black text-red-600 text-base">
                    <span>BALANCE DUE:</span>
                    <span className="font-mono">₹{balanceDue}</span>
                  </div>
                </div>

              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-300 text-xs">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">Customer Signature</p>
                  <div className="h-12 border-b border-slate-300 border-dashed"></div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 uppercase">For GS DESIGNS</p>
                  <div className="h-10"></div>
                  <p className="text-slate-600 text-[11px] font-semibold">Authorized Signatory</p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
