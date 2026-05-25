import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
}

const BASE_TITLE = 'DSAQuest';

export default function useSEO({ title, description, keywords }: SEOProps) {
  useEffect(() => {
    document.title = `${title} — ${BASE_TITLE}`;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    return () => {
      document.title = `${BASE_TITLE} — Learn Algorithms Visually`;
    };
  }, [title, description, keywords]);
}
