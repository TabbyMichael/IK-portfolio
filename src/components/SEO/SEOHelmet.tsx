import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
}

export default function SEOHelmet({
  title = "Ian Kibugu | Software Developer Portfolio",
  description = "Experienced Software Developer specializing in React, TypeScript, and full-stack development. Explore my portfolio of innovative projects and technical expertise.",
  keywords = "Ian Kibugu, Software Developer, Web Development, Full Stack Developer, React, TypeScript, Portfolio, Nairobi Kenya",
  image = "/assets/og-image.png",
  url,
  type = "website",
  author = "Ian Kibugu"
}: SEOProps) {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Ian Kibugu Portfolio', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:creator', '@IanKibugu');

    // Additional SEO tags
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'English');
    updateMetaTag('revisit-after', '7 days');

  }, [title, description, keywords, image, currentUrl, type, author]);

  useEffect(() => {
    // Add JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Ian Kibugu",
      "jobTitle": "Software Developer",
      "description": "Self-taught software developer specializing in modern web technologies",
      "url": currentUrl,
      "image": image,
      "sameAs": [
        "https://github.com/TabbyMichael",
        "https://www.linkedin.com/in/kibugu-ian-6162961ab",
        "mailto:kibuguzian@gmail.com"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nairobi",
        "addressCountry": "Kenya"
      },
      "knowsAbout": [
        "React",
        "TypeScript", 
        "JavaScript",
        "Node.js",
        "Web Development",
        "Frontend Development",
        "Full Stack Development"
      ]
    };

    let jsonLdScript = document.querySelector('#json-ld-person') as HTMLScriptElement;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'json-ld-person';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(structuredData);

  }, [currentUrl, image]);

  return null;
}