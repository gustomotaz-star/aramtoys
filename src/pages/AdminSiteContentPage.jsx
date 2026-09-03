import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { getAllSiteContent, updateSiteContent } from '../services/siteContentService';

const labels = {
  about: 'من نحن', shipping: 'معلومات الشحن', returns: 'الإرجاع والاستبدال', contact: 'اتصل بنا', faq: 'الأسئلة الشائعة', wholesale: 'البيع بالجملة', careers: 'وظائف',
};

export default function AdminSiteContentPage() {
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState('about');
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await getAllSiteContent();
    if (error) setMessage({ type: 'error', text: error.message });
    setPages(data || []);
    const row = (data || []).find((p) => p.slug === selected) || data?.[0] || null;
    setSelected(row?.slug || 'about');
    setDraft(row ? { ...row } : null);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const choose = (slug) => {
    setSelected(slug);
    const row = pages.find((p) => p.slug === slug);
    setDraft(row ? { ...row } : null);
    setMessage(null);
  };

  const save = async (event) => {
    event.preventDefault();
    setMessage(null);
    const changes = {
      title_ar: draft.title_ar,
      title_en: draft.title_en,
      summary_ar: draft.summary_ar || null,
      summary_en: draft.summary_en || null,
      body_ar: draft.body_ar,
      body_en: draft.body_en,
      contact_email: draft.contact_email || null,
      contact_phone: draft.contact_phone || null,
      contact_whatsapp: draft.contact_whatsapp || null,
      is_published: Boolean(draft.is_published),
    };
    const { data, error } = await updateSiteContent(selected, changes);
    if (error) { setMessage({ type: 'error', text: error.message }); return; }
    setPages((current) => current.map((p) => p.slug === selected ? data : p));
    setDraft({ ...data });
    setMessage({ type: 'success', text: 'تم حفظ محتوى الصفحة.' });
  };

  return (
    <div className="admin-content-page">
      <header className="admin-content-header">
        <div className="container admin row between wrap">
          <div className="admin-brand"><Logo compact /><span className="admin-tag">SITE CONTENT</span></div>
          <div className="row"><Link className="btn btn-ghost" to="/admin">لوحة الإدارة</Link><Link className="btn btn-ghost" to="/">المتجر</Link></div>
        </div>
      </header>
      <main className="container admin page">
        <div className="admin-hero"><div><h1>محتوى الموقع</h1><div className="muted">تعديل صفحات المعلومات وبيانات التواصل من مكان واحد.</div></div></div>
        {message && <div className={`notice ${message.type}`} style={{ marginBottom: 16 }}>{message.text}</div>}
        {loading ? <div className="empty">Loading...</div> : (
          <div className="content-admin-layout">
            <aside className="card content-admin-menu">
              {pages.map((page) => <button key={page.slug} className={`content-admin-menu-btn ${selected === page.slug ? 'active' : ''}`} onClick={() => choose(page.slug)}>{labels[page.slug] || page.slug}</button>)}
            </aside>
            {draft && <form className="card content-admin-form" onSubmit={save}>
              <div className="form-grid">
                <div className="field"><label className="label">العنوان بالعربي</label><input className="input" value={draft.title_ar || ''} onChange={(e)=>setDraft({...draft,title_ar:e.target.value})} required /></div>
                <div className="field"><label className="label">English title</label><input className="input" value={draft.title_en || ''} onChange={(e)=>setDraft({...draft,title_en:e.target.value})} required /></div>
              </div>
              <div className="form-grid">
                <div className="field"><label className="label">الوصف المختصر بالعربي</label><textarea className="input content-textarea-small" value={draft.summary_ar || ''} onChange={(e)=>setDraft({...draft,summary_ar:e.target.value})} /></div>
                <div className="field"><label className="label">English summary</label><textarea className="input content-textarea-small" value={draft.summary_en || ''} onChange={(e)=>setDraft({...draft,summary_en:e.target.value})} /></div>
              </div>
              <div className="form-grid">
                <div className="field"><label className="label">المحتوى بالعربي</label><textarea className="input content-textarea" value={draft.body_ar || ''} onChange={(e)=>setDraft({...draft,body_ar:e.target.value})} required /></div>
                <div className="field"><label className="label">English content</label><textarea className="input content-textarea" value={draft.body_en || ''} onChange={(e)=>setDraft({...draft,body_en:e.target.value})} required /></div>
              </div>
              {selected === 'contact' && <div className="form-grid contact-admin-fields">
                <div className="field"><label className="label">البريد الإلكتروني</label><input className="input" type="email" value={draft.contact_email || ''} onChange={(e)=>setDraft({...draft,contact_email:e.target.value})} /></div>
                <div className="field"><label className="label">رقم الهاتف</label><input className="input" value={draft.contact_phone || ''} onChange={(e)=>setDraft({...draft,contact_phone:e.target.value})} /></div>
                <div className="field"><label className="label">WhatsApp</label><input className="input" value={draft.contact_whatsapp || ''} onChange={(e)=>setDraft({...draft,contact_whatsapp:e.target.value})} /></div>
              </div>}
              <label className="row content-publish"><input type="checkbox" checked={Boolean(draft.is_published)} onChange={(e)=>setDraft({...draft,is_published:e.target.checked})} /> الصفحة منشورة</label>
              <div className="row between wrap"><a className="muted" href={`/info/${selected}`} target="_blank" rel="noreferrer">معاينة الصفحة ↗</a><button className="btn btn-primary">حفظ التعديلات</button></div>
            </form>}
          </div>
        )}
      </main>
    </div>
  );
}
