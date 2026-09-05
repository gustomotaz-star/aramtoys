import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import { formatMoney } from '../config/app';
import { useI18n } from '../context/I18nContext';

export default function OrderConfirmationPage(){
  const {orderId}=useParams(); const {lang,toggleLang}=useI18n(); const ar=lang==='ar';
  const [order,setOrder]=useState(null); const [error,setError]=useState(null);
  useEffect(()=>{(async()=>{const {data,error:queryError}=await supabase.from('orders').select('id,total,shipping_fee,payment_method,status,created_at,order_items(product_name,product_name_ar,quantity,line_total),addresses(full_address,city,governorate)').eq('id',orderId).single(); if(queryError)setError(queryError.message);else setOrder(data);})();},[orderId]);
  return <main className="confirm-wrap">
    <div className="confirm-logo"><Logo compact /></div>
    <div className="confirm-check">🎉</div>
    <h1>{ar?'شكراً! تم استلام طلبك.':'Thank you! Your order is in.'}</h1>
    <p className="confirm-sub">{error?(ar?'تعذر العثور على الطلب.':'Could not find this order.'):(order?`Order #${order.id.slice(0,8).toUpperCase()}`:(ar?'جاري تحميل تفاصيل الطلب...':'Loading order details...'))}</p>
    {error&&<div className="auth-message error">{error}</div>}
    {order&&<div className="confirm-card">
      {order.order_items?.map((item,index)=><div className="legacy-row" key={`${item.product_name}-${index}`}><span>{(ar?(item.product_name_ar||item.product_name):item.product_name)} × {item.quantity}</span><span>{formatMoney(item.line_total)}</span></div>)}
      <div className="legacy-row"><span>{ar?'الشحن':'Shipping'}</span><span>{Number(order.shipping_fee)===0?(ar?'مجاني':'Free'):formatMoney(order.shipping_fee)}</span></div>
      <div className="legacy-row"><span>{ar?'الإجمالي':'Total'}</span><span>{formatMoney(order.total)}</span></div>
      <div className="legacy-row"><span>{ar?'الدفع':'Payment'}</span><span>{order.payment_method==='cash'?(ar?'الدفع عند الاستلام':'Cash on Delivery'):order.payment_method}</span></div>
      <div className="legacy-row"><span>{ar?'التوصيل':'Deliver to'}</span><span>{order.addresses?`${order.addresses.full_address}, ${order.addresses.city||''}`:'—'}</span></div>
    </div>}
    <Link className="confirm-home" to="/">{ar?'متابعة التسوق':'Continue Shopping'}</Link>
    <div className="auth-bottom-lang" style={{marginTop:20}}><button className="lang-toggle" onClick={toggleLang}>{ar?'English':'العربية'}</button></div>
  </main>;
}
