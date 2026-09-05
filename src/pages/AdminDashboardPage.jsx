import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { APP, ORDER_STATUSES, formatMoney, statusLabel } from '../config/app';
import { createProduct, getAdminSnapshot, markOrderPaid, updateOrderStatus, updateProduct } from '../services/adminService';
import { uploadProductImage } from '../services/storageService';

const emptyProduct = { name: '', name_ar: '', category_id: '', price: '', stock_quantity: '', badge: '' };

export default function AdminDashboardPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [newImage, setNewImage] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const snapshot = await getAdminSnapshot();
    for (const result of [snapshot.orders, snapshot.customers, snapshot.products, snapshot.categories]) if (result.error) console.error(result.error);
    setOrders(snapshot.orders.data || []);
    setCustomers(snapshot.customers.data || []);
    setProducts(snapshot.products.data || []);
    setCategories(snapshot.categories.data || []);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const delivered = orders.filter((o) => o.status === 'delivered');
  const openOrders = orders.filter((o) => !['delivered','cancelled'].includes(o.status));
  const today = new Date();
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === today.toDateString());
  const monthOrders = orders.filter((o) => { const d = new Date(o.created_at); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(); });
  const realizedRevenue = delivered.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const todayRevenue = todayOrders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + Number(o.total || 0), 0);
  const monthRevenue = monthOrders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + Number(o.total || 0), 0);
  const openValue = openOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const unpaidCount = orders.filter((o) => o.payment_status !== 'paid' && o.status !== 'cancelled').length;
  const lowStock = products.filter((p) => Number(p.stock_quantity) <= APP.lowStockThreshold);
  const avgOrder = orders.length ? orders.reduce((sum, o) => sum + Number(o.total || 0), 0) / orders.length : 0;

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const customer = order.profiles || {};
    const address = order.addresses || {};
    const haystack = [order.id, customer.full_name, customer.email, customer.phone, address.phone, address.city, address.governorate, ...(order.order_items || []).map((item) => item.product_name)].filter(Boolean).join(' ').toLowerCase();
    return (!search || haystack.includes(search.toLowerCase())) && (statusFilter === 'all' || order.status === statusFilter) && (paymentFilter === 'all' || order.payment_status === paymentFilter);
  }), [orders, search, statusFilter, paymentFilter]);

  const setOrderStatus = async (orderId, status) => {
    const { error } = await updateOrderStatus(orderId, status);
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    await loadAll();
  };

  const markPaid = async (orderId) => {
    const { error } = await markOrderPaid(orderId);
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    await loadAll();
  };

  const saveProduct = async (product) => {
    const { error } = await updateProduct(product);
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    await loadAll();
  };

  const addProduct = async (event) => {
    event.preventDefault(); setMessage(null);
    try {
      let imageUrl = null;
      if (newImage) imageUrl = await uploadProductImage(newImage);
      const slugBase = newProduct.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'product';
      const { error } = await createProduct({
        name: newProduct.name.trim(),
        name_ar: newProduct.name_ar.trim() || null,
        category_id: newProduct.category_id,
        price: Number(newProduct.price),
        stock_quantity: Number(newProduct.stock_quantity),
        badge: newProduct.badge.trim() || null,
        image_url: imageUrl,
        slug: `${slugBase}-${Date.now().toString(36)}`,
        is_active: true,
      });
      if (error) throw error;
      setNewProduct(emptyProduct); setNewImage(null); setShowProductForm(false); await loadAll();
    } catch (error) { setMessage({ type: 'error', text: error.message }); }
  };

  const logout = async () => { await signOut(); navigate('/admin/login'); };
  const pipelineClick = (status) => { setStatusFilter(status); setPaymentFilter('all'); setTab('orders'); };

  return (
    <div className="admin-shell">
      <div className="admin-topbar"><div className="container admin"><div className="admin-brand"><Logo compact /><span className="admin-tag">MANAGEMENT</span></div><div className="row"><Link className="btn btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,.25)' }} to="/">Shop</Link><button className="btn btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,.25)' }} onClick={logout}>Sign Out</button></div></div></div>
      <main className="container admin page">
        <div className="admin-nav">{['overview','orders','customers','inventory'].map((name) => <button key={name} className={`tab-btn ${tab === name ? 'active' : ''}`} onClick={() => setTab(name)}>{name[0].toUpperCase()+name.slice(1)}</button>)}</div>
        {message && <div className={`notice ${message.type}`} style={{ marginBottom: 16 }}>{message.text}</div>}
        {loading ? <div className="empty">Loading...</div> : (
          <>
            {tab === 'overview' && <>
              <div className="admin-hero"><div><h1>Store Operations</h1><div className="muted">Live view of orders, sales and inventory</div></div><div className="muted">Updated {new Date().toLocaleTimeString()}</div></div>
              <div className="admin-stat-grid">
                <div className="card admin-stat"><div className="k">REALIZED REVENUE</div><div className="v">{formatMoney(realizedRevenue)}</div><div className="s">Delivered orders only</div></div>
                <div className="card admin-stat"><div className="k">TODAY</div><div className="v">{formatMoney(todayRevenue)}</div><div className="s">{todayOrders.length} orders today</div></div>
                <div className="card admin-stat"><div className="k">THIS MONTH</div><div className="v">{formatMoney(monthRevenue)}</div><div className="s">{monthOrders.length} orders</div></div>
                <div className="card admin-stat"><div className="k">OPEN ORDER VALUE</div><div className="v">{formatMoney(openValue)}</div><div className="s">Not delivered/cancelled</div></div>
                <div className="card admin-stat"><div className="k">UNPAID</div><div className="v">{unpaidCount}</div><div className="s">Open unpaid orders</div></div>
                <div className="card admin-stat"><div className="k">AVERAGE ORDER</div><div className="v">{formatMoney(avgOrder)}</div><div className="s">Across all orders</div></div>
                <div className="card admin-stat"><div className="k">CUSTOMERS</div><div className="v">{customers.filter((c) => !c.is_admin).length}</div><div className="s">Registered shoppers</div></div>
                <div className="card admin-stat"><div className="k">LOW STOCK</div><div className="v">{lowStock.length}</div><div className="s">≤ {APP.lowStockThreshold} units</div></div>
              </div>
              <div className="pipeline-grid">{ORDER_STATUSES.map((status) => <button key={status.value} className={`card pipeline-card ${status.value}`} onClick={() => pipelineClick(status.value)}><strong>{orders.filter((o) => o.status === status.value).length}</strong><span>{status.labelAr}</span><small>{orders.filter((o) => o.status === status.value).reduce((sum,o)=>sum+Number(o.total||0),0).toFixed(0)} EGP</small></button>)}</div>
              <section className="card admin-section"><div className="row between wrap"><h2>Latest Orders</h2><button className="btn btn-ghost" onClick={() => setTab('orders')}>View all</button></div><OrdersTable orders={orders.slice(0,5)} onStatus={setOrderStatus} onPaid={markPaid} /></section>
            </>}

            {tab === 'orders' && <section className="card admin-section"><h2>Orders</h2><div className="admin-toolbar"><input className="input" placeholder="Search order, customer, phone, city or product" value={search} onChange={(e)=>setSearch(e.target.value)} /><select className="select" style={{ width: 'auto' }} value={paymentFilter} onChange={(e)=>setPaymentFilter(e.target.value)}><option value="all">All payments</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option></select></div><div className="filter-chips"><button className={`filter-chip ${statusFilter==='all'?'active':''}`} onClick={()=>setStatusFilter('all')}>All ({orders.length})</button>{ORDER_STATUSES.map((s)=><button key={s.value} className={`filter-chip ${statusFilter===s.value?'active':''}`} onClick={()=>setStatusFilter(s.value)}>{s.labelAr} ({orders.filter(o=>o.status===s.value).length})</button>)}</div><OrdersTable orders={filteredOrders} onStatus={setOrderStatus} onPaid={markPaid} /></section>}

            {tab === 'customers' && <section className="card admin-section"><h2>Customers</h2><div className="table-wrap"><table className="table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead><tbody>{customers.map((c)=><tr key={c.id}><td>{c.full_name||'—'}</td><td>{c.email||'—'}</td><td>{c.phone||'—'}</td><td>{c.is_admin?'Admin':'Customer'}</td><td>{new Date(c.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>}

            {tab === 'inventory' && <section className="card admin-section"><div className="row between wrap"><h2>Inventory</h2><button className="btn btn-primary" onClick={()=>setShowProductForm(v=>!v)}>+ Add Product</button></div>{showProductForm && <form className="stack" onSubmit={addProduct} style={{ marginBottom: 18 }}><div className="form-grid"><input className="input" placeholder="Product name" value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct,name:e.target.value})} required /><input className="input" placeholder="اسم المنتج" value={newProduct.name_ar} onChange={(e)=>setNewProduct({...newProduct,name_ar:e.target.value})} /><select className="select" value={newProduct.category_id} onChange={(e)=>setNewProduct({...newProduct,category_id:e.target.value})} required><option value="">Category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input className="input" type="number" min="0" step="0.01" placeholder="Price" value={newProduct.price} onChange={(e)=>setNewProduct({...newProduct,price:e.target.value})} required /><input className="input" type="number" min="0" placeholder="Stock" value={newProduct.stock_quantity} onChange={(e)=>setNewProduct({...newProduct,stock_quantity:e.target.value})} required /><input className="input" placeholder="Badge" value={newProduct.badge} onChange={(e)=>setNewProduct({...newProduct,badge:e.target.value})} /></div><input type="file" accept="image/*" onChange={(e)=>setNewImage(e.target.files?.[0]||null)} /><button className="btn btn-mint">Save Product</button></form>}<div className="table-wrap"><table className="table"><thead><tr><th>Photo</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Active</th><th></th></tr></thead><tbody>{products.map((p)=><ProductRow key={p.id} product={p} onSave={saveProduct} />)}</tbody></table></div></section>}
          </>
        )}
      </main>
    </div>
  );
}

function OrdersTable({ orders, onStatus, onPaid }) {
  if (!orders.length) return <div className="empty">No matching orders.</div>;
  return <div className="table-wrap"><table className="table"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Address</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead><tbody>{orders.map((o)=>{const customer=o.profiles||{};const address=o.addresses||{};return <tr key={o.id}><td><div className="order-code">#{o.id.slice(0,8).toUpperCase()}</div></td><td>{new Date(o.created_at).toLocaleDateString()}</td><td><strong>{customer.full_name||customer.phone||customer.email||'—'}</strong><div className="muted">{customer.phone||customer.email||''}</div></td><td>{address.full_address||'—'}<div className="muted">{address.city||''} {address.governorate||''}<br/>{address.phone||''}</div></td><td>{(o.order_items||[]).map((i,idx)=><div key={idx}>{i.product_name} ×{i.quantity}</div>)}</td><td><strong>{formatMoney(o.total)}</strong><div className="muted">Shipping {formatMoney(o.shipping_fee)}</div></td><td><span className={`badge ${o.payment_status}`}>{o.payment_status}</span><div className="muted">{o.payment_method}</div></td><td><select className="select" value={o.status} onChange={(e)=>onStatus(o.id,e.target.value)}>{ORDER_STATUSES.map(s=><option key={s.value} value={s.value}>{s.labelAr}</option>)}</select><div style={{marginTop:5}}><span className={`badge ${o.status}`}>{statusLabel(o.status,'ar')}</span></div></td><td>{o.payment_status!=='paid'&&<button className="btn btn-mint" onClick={()=>onPaid(o.id)}>Mark Paid</button>}</td></tr>})}</tbody></table></div>;
}

function ProductRow({ product, onSave }) {
  const [draft, setDraft] = useState(product);
  const [imgError, setImgError] = useState(false);
  useEffect(()=>setDraft(product),[product]);
  useEffect(()=>setImgError(false),[product.image_url]);
  return <tr><td>{draft.image_url && !imgError?<img className="product-admin-image" src={draft.image_url} alt="" onError={()=>setImgError(true)}/>:'🧸'}</td><td><input className="input" value={draft.name} onChange={(e)=>setDraft({...draft,name:e.target.value})}/></td><td>{draft.categories?.name||'—'}</td><td><input className="input" style={{width:90}} type="number" min="0" step="0.01" value={draft.price} onChange={(e)=>setDraft({...draft,price:e.target.value})}/></td><td><input className={`input ${Number(draft.stock_quantity)<=APP.lowStockThreshold?'low-stock':''}`} style={{width:80}} type="number" min="0" value={draft.stock_quantity} onChange={(e)=>setDraft({...draft,stock_quantity:e.target.value})}/></td><td><input type="checkbox" checked={Boolean(draft.is_active)} onChange={(e)=>setDraft({...draft,is_active:e.target.checked})}/></td><td><button className="btn btn-mint" onClick={()=>onSave(draft)}>Save</button></td></tr>;
}
