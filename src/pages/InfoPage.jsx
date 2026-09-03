import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import HomeFooter from '../components/HomeFooter';
import { useI18n } from '../context/I18nContext';
import { getSiteContent } from '../services/siteContentService';

const ALLOWED = new Set(['about','shipping','returns','contact','faq','wholesale','careers']);

export default function InfoPage() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setError('');
      if (!ALLOWED.has(slug)) { if (active) { setError('not-found'); setLoading(false); } return; }
      const { data, error: queryError } = await getSiteContent(slug);
      if (!active) return;
      if (queryError || !data) setError('not-found');
      else setPage(data);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);

  const ar = lang === 'ar';
  const title = page ? (ar ? page.title_ar : page.title_en) : '';
  const summary = page ? (ar ? page.summary_ar : page.summary_en) : '';
  const body = page ? (ar ? page.body_ar : page.body_en) : '';

  return (
    <>
      <Header />
      <main className="info-page">
        <div className="container info-wrap">
          <Link to="/" className="info-back">← {ar ? 'العودة للمتجر' : 'Back to shop'}</Link>
          {loading ? <div className="info-card">{ar ? 'جاري التحميل...' : 'Loading...'}</div> : error ? (
            <div className="info-card"><h1>{ar ? 'الصفحة غير موجودة' : 'Page not found'}</h1></div>
          ) : (
            <article className="info-card">
              <div className="info-eyebrow">ARAM TOYS</div>
              <h1>{title}</h1>
              {summary && <p className="info-summary">{summary}</p>}
              <div className="info-body">{body.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
              {slug === 'contact' && (
                <div className="contact-grid">
                  <div className="contact-item"><span>{ar ? 'البريد الإلكتروني' : 'Email'}</span><strong>{page.contact_email || (ar ? 'سيتم إضافته من الإدارة' : 'To be added by management')}</strong></div>
                  <div className="contact-item"><span>{ar ? 'رقم الهاتف' : 'Phone'}</span><strong>{page.contact_phone || (ar ? 'سيتم إضافته من الإدارة' : 'To be added by management')}</strong></div>
                  <div className="contact-item"><span>WhatsApp</span><strong>{page.contact_whatsapp || (ar ? 'سيتم إضافته من الإدارة' : 'To be added by management')}</strong></div>
                </div>
              )}
            </article>
          )}
        </div>
      </main>
      <HomeFooter />
    </>
  );
}
