import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { CheckCircle2, Printer, Truck, ArrowRight, Package } from 'lucide-react';

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
      timeline: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-[#FAF9FF] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#4F24E8]">
            Order Confirmed & Logged
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-[#171936]">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Your fashion order has been successfully placed with ID <strong className="text-[#171936] font-mono">{order.orderNumber}</strong>. We are preparing it with meticulous care at our central logistics facility.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/track-order?code=${order.orderNumber}`}
              className="px-5 py-2.5 rounded-full bg-[#4F24E8] text-white text-xs font-bold shadow-md hover:bg-[#431ec9] transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Shipment</span>
            </Link>

            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-full bg-gray-100 text-[#171936] text-xs font-bold hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Printable Invoice Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6 print:m-0 print:border-none print:shadow-none">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 gap-4">
            <div>
              <span className="font-serif text-2xl font-black text-[#171936]">DELIED</span>
              <span className="block text-[10px] tracking-widest text-[#4F24E8] font-bold uppercase">
                HAUTE COUTURE & ERP INVOICE
              </span>
              <p className="text-xs text-gray-500 mt-1">Invoice #: {order.orderNumber}</p>
              <p className="text-xs text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
            </div>

            <div className="text-right sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-50 text-[#4F24E8] border border-purple-200">
                Status: {order.status}
              </span>
              <p className="text-xs text-gray-600">
                Payment: <strong className="text-[#171936]">{order.paymentMethod}</strong> ({order.paymentStatus})
              </p>
              {order.trackingNumber && (
                <p className="text-xs text-gray-600">
                  Tracking: <strong className="font-mono text-[#4F24E8]">{order.trackingNumber}</strong> ({order.deliveryCourier})
                </p>
              )}
            </div>
          </div>

          {/* Shipping & Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl">
            <div>
              <h4 className="font-bold text-[#171936] uppercase tracking-wider mb-1">Delivered To:</h4>
              <p className="font-semibold text-gray-800">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.upazila ? `${order.upazila}, ` : ''}{order.district}, Bangladesh</p>
              <p>Phone: {order.customerPhone}</p>
              {order.customerEmail && <p>Email: {order.customerEmail}</p>}
            </div>

            <div>
              <h4 className="font-bold text-[#171936] uppercase tracking-wider mb-1">Logistics Info:</h4>
              <p>Courier Service: {order.deliveryCourier || 'Steadfast / Express'}</p>
              <p>Estimated Transit: 24 - 48 hours</p>
              <p>Order Type: {order.orderType}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F3FF] text-[#171936] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Item & SKU</th>
                  <th className="py-3 px-4 text-center">Size / Spec</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#171936]">{item.productName}</p>
                      <span className="text-[10px] font-mono text-gray-400">{item.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{item.size || 'Standard'}</td>
                    <td className="py-3 px-4 text-center font-bold text-[#171936]">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      ৳{(item.customResellerPrice || item.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#171936]">
                      ৳{item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-800">৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>- ৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-gray-800">৳{order.deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-extrabold text-[#171936]">
                <span>Total Amount:</span>
                <span className="text-[#4F24E8]">৳{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
