import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const I18nContext = createContext(null);

const copy = {
  ar: {
    shop:'المتجر', categories:'التصنيفات', account:'حسابي', cart:'السلة', login:'تسجيل الدخول', logout:'تسجيل الخروج',
    heroTitle:'ألعاب تنمّي الخيال وتكبر مع طفلك', heroSub:'اختيارات عملية وممتعة للأطفال حتى 12 سنة.', browse:'تسوق الآن', featured:'ألعاب مختارة',
    add:'أضف للسلة', emptyCart:'السلة فارغة', checkout:'إتمام الطلب', subtotal:'الإجمالي الفرعي', shipping:'الشحن', total:'الإجمالي', free:'مجاني',
    emailOrPhone:'البريد الإلكتروني أو رقم الهاتف', password:'كلمة المرور', createAccount:'إنشاء حساب', signIn:'دخول', phone:'رقم الهاتف', email:'البريد الإلكتروني', name:'الاسم',
    orderConfirmed:'تم استلام طلبك', continueShopping:'متابعة التسوق', management:'الإدارة',
  },
  en: {
    shop:'Shop', categories:'Categories', account:'Account', cart:'Cart', login:'Sign in', logout:'Sign out',
    heroTitle:'Play that grows imagination', heroSub:'Practical, fun toy picks for boys up to age 12.', browse:'Shop now', featured:'Featured toys',
    add:'Add to cart', emptyCart:'Your cart is empty', checkout:'Checkout', subtotal:'Subtotal', shipping:'Shipping', total:'Total', free:'Free',
    emailOrPhone:'Email or phone', password:'Password', createAccount:'Create account', signIn:'Sign in', phone:'Phone', email:'Email', name:'Name',
    orderConfirmed:'Your order is confirmed', continueShopping:'Continue shopping', management:'Management',
  },
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('aram_lang') || 'ar');
  useEffect(() => {
    localStorage.setItem('aram_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  const value = useMemo(() => ({ lang, setLang, toggleLang: () => setLang((v) => v === 'ar' ? 'en' : 'ar'), t: (key) => copy[lang][key] || key }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
