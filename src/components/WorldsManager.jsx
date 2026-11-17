import { useEffect, useRef, useState } from 'react';
import { createCategory, deleteCategory, updateCategory } from '../services/adminService';

const ICONS = ['💄', '👷', '🏆', '🚗', '🧱', '🫧', '🧸', '🍼', '🧩', '🤖', '🛠️', '🎨', '⚽', '🦖', '🚂', '🪀', '🎲', '👸', '🦸', '🎵', '📚'];
const emptyWorld = { name: '', name_ar: '', icon: '🧸' };

const PERMISSION_HINT = 'لا توجد صلاحية لتعديل العوالم. تأكد إنك داخل بحساب المدير.';

function friendlyError(error) {
  const text = error?.message || String(error);
  if (/permission|policy|row-level|0 rows|no rows|PGRST116/i.test(text) || error?.code === '42501' || error?.code === 'PGRST116') return PERMISSION_HINT;
  if (error?.code === '23505') return 'يوجد عالم بنفس الرابط (slug) بالفعل. غيّر الاسم الإنجليزي.';
  if (error?.code === '23503') return 'لا يمكن حذف هذا العالم لأن فيه منتجات. انقل المنتجات أولاً.';
  return text;
}

export function makeSlug(name, existing) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'world';
  let slug = base;
  let n = 2;
  while (existing.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

export default function WorldsManager({ categories, products, onChanged }) {
  const [form, setForm] = useState(emptyWorld);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const counts = products.reduce((acc, p) => { if (p.category_id) acc[p.category_id] = (acc[p.category_id] || 0) + 1; return acc; }, {});

  const add = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.name_ar.trim()) return;
    setBusy(true); setMessage(null);
    const slug = makeSlug(form.name, new Set(categories.map((c) => c.slug)));
    const { error } = await createCategory({ name: form.name.trim(), name_ar: form.name_ar.trim(), icon: form.icon || '🧸', slug });
    setBusy(false);
    if (error) { setMessage({ type: 'error', text: friendlyError(error) }); return; }
    setForm(emptyWorld);
    setMessage({ type: 'success', text: `تم إنشاء "${form.name_ar.trim()}" ✅` });
    onChanged();
  };

  const save = async (world) => {
    setMessage(null);
    const { error } = await updateCategory(world.id, { name: world.name.trim(), name_ar: world.name_ar.trim(), icon: world.icon || '🧸' });
    if (error) { setMessage({ type: 'error', text: friendlyError(error) }); return false; }
    setMessage({ type: 'success', text: `تم حفظ "${world.name_ar.trim()}" ✅` });
    onChanged();
    return true;
  };

  const remove = async (world) => {
    if (counts[world.id]) { setMessage({ type: 'error', text: `"${world.name_ar || world.name}" فيه ${counts[world.id]} منتج. انقل المنتجات لعالم ثاني أولاً.` }); return; }
    setMessage(null);
    const { data, error } = await deleteCategory(world.id);
    if (error || !data?.length) { setMessage({ type: 'error', text: friendlyError(error || { code: 'PGRST116' }) }); return; }
    setMessage({ type: 'success', text: 'تم الحذف ✅' });
    onChanged();
  };

  return (
    <section className="card admin-section" dir="rtl">
      <div className="row between wrap"><h2>العوالم · Worlds</h2><span className="muted">{categories.length} عالم</span></div>
      <p className="muted" style={{ marginTop: 0 }}>كل عالم يظهر كقسم في المتجر. اكتب الاسم بالعربي والإنجليزي واختر أيقونة.</p>
      {message && <div className={`notice ${message.type}`} style={{ marginBottom: 14 }}>{message.text}</div>}

      <form className="world-form" onSubmit={add}>
        <input className="input" placeholder="الاسم بالعربي — مثال: عالم السيارات" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required />
        <input className="input" dir="ltr" placeholder="English name — e.g. Car World" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <IconPicker alignEnd value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
        <button className="btn btn-primary" disabled={busy}>{busy ? '...' : '+ إنشاء عالم'}</button>
      </form>

      <div className="world-list">
        {categories.map((c) => <WorldRow key={c.id} world={c} count={counts[c.id] || 0} onSave={save} onDelete={remove} />)}
        {!categories.length && <div className="empty">لا توجد عوالم بعد.</div>}
      </div>
    </section>
  );
}

function IconPicker({ value, onChange, alignEnd = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div className="icon-picker" ref={ref}>
      <button type="button" className="icon-picker-btn" onClick={() => setOpen((v) => !v)} aria-label="اختيار أيقونة">{value || '🧸'}</button>
      {open && (
        <div className={`icon-picker-pop ${alignEnd ? 'align-end' : ''}`}>
          {ICONS.map((icon) => <button type="button" key={icon} onClick={() => { onChange(icon); setOpen(false); }}>{icon}</button>)}
          <input className="input" maxLength={4} placeholder="أو الصق" onChange={(e) => e.target.value && onChange(e.target.value)} />
        </div>
      )}
    </div>
  );
}

function WorldRow({ world, count, onSave, onDelete }) {
  const [draft, setDraft] = useState(world);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => setDraft(world), [world.id, world.name, world.name_ar, world.icon]); // eslint-disable-line react-hooks/exhaustive-deps
  const dirty = draft.name !== world.name || draft.name_ar !== world.name_ar || draft.icon !== world.icon;
  const submit = async () => { setSaving(true); await onSave(draft); setSaving(false); };
  return (
    <div className="world-row">
      <IconPicker value={draft.icon} onChange={(icon) => setDraft({ ...draft, icon })} />
      <input className="input" value={draft.name_ar || ''} onChange={(e) => setDraft({ ...draft, name_ar: e.target.value })} />
      <input className="input" dir="ltr" value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
      <span className="world-count">{count} منتج</span>
      <a className="muted world-link" href={`/category/${world.slug}`} target="_blank" rel="noreferrer">/{world.slug}</a>
      <div className="row">
        <button className="btn btn-mint" disabled={!dirty || saving || !draft.name?.trim() || !draft.name_ar?.trim()} onClick={submit}>{saving ? '...' : 'حفظ'}</button>
        {confirming
          ? <><button autoFocus className="btn btn-danger" onClick={() => { setConfirming(false); onDelete(world); }}>تأكيد الحذف</button><button className="btn btn-ghost" onClick={() => setConfirming(false)}>إلغاء</button></>
          : <button className="btn btn-ghost world-delete" onClick={() => setConfirming(true)} title={count ? 'فيه منتجات' : 'حذف'} aria-label={`حذف ${world.name_ar || world.name}`}>🗑️</button>}
      </div>
    </div>
  );
}
