import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LocaleContext = createContext();

const dictionaries = {
  en: {
    code: 'EN',
    nav: {
      home: 'Home',
      jobs: 'Jobs',
      talent: 'Talent',
      candidate: 'Candidate',
      employer: 'Employer',
      admin: 'Admin',
      login: 'Login',
      signup: 'Sign up',
    },
    home: {
      badge: 'Admin verified hiring marketplace',
      description:
        'A centralized platform for candidates, employers, and admins with profile verification, job approvals, paid advertisements, profile unlocks, dashboards, and local-language access.',
      keyword: 'Job title, skill, or company',
      location: 'City or area',
      search: 'Search',
      seeking: 'Seeking jobs',
      hiring: 'Hiring talent',
      featuredEyebrow: 'Featured jobs',
      featuredTitle: 'Verified listings ready to apply',
      viewAll: 'View all jobs',
      modulesEyebrow: 'Marketplace modules',
      modulesTitle: 'Built around the project document',
      modulesBody:
        'The UI now covers seeking jobs, hiring talent, profile review, paid promotion, admin approval, and dashboard monitoring in one consistent front-end.',
    },
  },
  hi: {
    code: 'HI',
    nav: {
      home: 'होम',
      jobs: 'नौकरियां',
      talent: 'टैलेंट',
      candidate: 'कैंडिडेट',
      employer: 'एम्प्लॉयर',
      admin: 'एडमिन',
      login: 'लॉगिन',
      signup: 'साइन अप',
    },
    home: {
      badge: 'एडमिन वेरिफाइड हायरिंग मार्केटप्लेस',
      description:
        'कैंडिडेट, एम्प्लॉयर और एडमिन के लिए एक सेंट्रल प्लेटफॉर्म जिसमें प्रोफाइल वेरिफिकेशन, जॉब अप्रूवल, पेड विज्ञापन, प्रोफाइल अनलॉक, डैशबोर्ड और लोकल भाषा सपोर्ट है।',
      keyword: 'जॉब टाइटल, स्किल या कंपनी',
      location: 'शहर या एरिया',
      search: 'सर्च',
      seeking: 'जॉब ढूंढें',
      hiring: 'टैलेंट हायर करें',
      featuredEyebrow: 'फीचर्ड जॉब्स',
      featuredTitle: 'वेरिफाइड जॉब्स जिन पर अभी अप्लाई कर सकते हैं',
      viewAll: 'सभी जॉब्स देखें',
      modulesEyebrow: 'मार्केटप्लेस मॉड्यूल',
      modulesTitle: 'प्रोजेक्ट डॉक्यूमेंट के अनुसार बनाया गया',
      modulesBody:
        'इस UI में जॉब सर्च, टैलेंट हायरिंग, प्रोफाइल रिव्यू, पेड प्रमोशन, एडमिन अप्रूवल और डैशबोर्ड मॉनिटरिंग शामिल है।',
    },
  },
};

export const LocaleProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('jobPortalLanguage') || 'en');

  useEffect(() => {
    localStorage.setItem('jobPortalLanguage', language);
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  const value = useMemo(() => {
    const dictionary = dictionaries[language] || dictionaries.en;
    return {
      language,
      dictionary,
      t: dictionary,
      toggleLanguage: () => setLanguage((current) => (current === 'en' ? 'hi' : 'en')),
    };
  }, [language]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
