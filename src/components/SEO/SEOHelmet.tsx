import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string;
}

interface ProjectItem {
  "@type": "CreativeWork";
  name: string;
  description: string;
  url: string;
  creator: {
    "@type": "Person";
    name: string;
  };
  dateCreated: string;
  programmingLanguage?: string[];
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  canonical?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  projects?: ProjectItem[];
  publishDate?: string;
  modifiedDate?: string;
}

const getPageSpecificData = (pathname: string) => {
  
  switch (pathname) {
    case '/':
      return {
        title: 'Ian Kibugu | Full-Stack Software Developer Portfolio',
        description: 'Experienced Software Developer specializing in React, TypeScript, Node.js, and modern web technologies. View my portfolio of innovative projects and technical expertise.',
        keywords: 'Ian Kibugu, Software Developer, Full Stack Developer, React Developer, TypeScript, JavaScript, Node.js, Web Development, Portfolio, Nairobi Kenya',
        type: 'website'
      };
    case '/about':
      return {
        title: 'About Ian Kibugu | Software Developer & Tech Enthusiast',
        description: 'Learn about Ian Kibugu\'s journey as a self-taught software developer, technical skills, experience, and passion for creating innovative web solutions.',
        keywords: 'Ian Kibugu About, Software Developer Biography, Technical Skills, Programming Experience, Self-taught Developer',
        type: 'profile'
      };
    case '/projects':
      return {
        title: 'Projects | Ian Kibugu Software Development Portfolio',
        description: 'Explore Ian Kibugu\'s software development projects featuring React, TypeScript, full-stack applications, and innovative web solutions.',
        keywords: 'Software Development Projects, React Projects, TypeScript Applications, Full Stack Projects, Web Development Portfolio',
        type: 'website'
      };
    case '/contact':
      return {
        title: 'Contact Ian Kibugu | Hire Software Developer',
        description: 'Get in touch with Ian Kibugu for software development opportunities, freelance projects, or collaboration. Available for React and full-stack development.',
        keywords: 'Contact Ian Kibugu, Hire Software Developer, React Developer for Hire, Full Stack Developer Contact, Freelance Developer',
        type: 'website'
      };
    case '/news':
    case '/newsletter':
      return {
        title: 'Newsletter | Ian Kibugu Tech Insights & Updates',
        description: 'Subscribe to Ian Kibugu\'s newsletter for the latest insights on web development, programming tips, and industry trends.',
        keywords: 'Tech Newsletter, Web Development Tips, Programming Insights, Software Development Trends',
        type: 'website'
      };
    default:
      return {
        title: 'Ian Kibugu | Software Developer Portfolio',
        description: 'Experienced Software Developer specializing in React, TypeScript, and full-stack development.',
        keywords: 'Ian Kibugu, Software Developer, Web Development, Portfolio',
        type: 'website'
      };
  }
};

export default function SEOHelmet({
  title,
  description,
  keywords,
  image = "/assets/1.png",
  url,
  type,
  author = "Ian Kibugu",
  canonical,
  noindex = false,
  breadcrumbs,
  projects,
  publishDate,
  modifiedDate
}: SEOProps) {
  const location = useLocation();
  const pageData = getPageSpecificData(location.pathname);
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;
  
  // Use page-specific data as defaults if not provided
  const finalTitle = title || pageData.title;
  const finalDescription = description || pageData.description;
  const finalKeywords = keywords || pageData.keywords;
  const finalType = type || pageData.type;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

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

    // Add or update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Basic meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('author', author);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('theme-color', '#0A192F');

    // Open Graph tags
    updateMetaTag('og:title', finalTitle, true);
    updateMetaTag('og:description', finalDescription, true);
    updateMetaTag('og:image', `${window.location.origin}${image}`, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', `${finalTitle} - Portfolio Screenshot`, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', finalType, true);
    updateMetaTag('og:site_name', 'Ian Kibugu Portfolio', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', `${window.location.origin}${image}`);
    updateMetaTag('twitter:image:alt', `${finalTitle} - Portfolio Screenshot`);
    updateMetaTag('twitter:creator', '@IanKibugu');
    updateMetaTag('twitter:site', '@IanKibugu');

    // Additional SEO tags
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('googlebot', noindex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('language', 'English');
    updateMetaTag('geo.region', 'KE');
    updateMetaTag('geo.placename', 'Nairobi');
    updateMetaTag('geo.position', '-1.286389;36.817223');
    updateMetaTag('ICBM', '-1.286389, 36.817223');
    
    if (publishDate) updateMetaTag('article:published_time', publishDate, true);
    if (modifiedDate) updateMetaTag('article:modified_time', modifiedDate, true);

  }, [finalTitle, finalDescription, finalKeywords, image, currentUrl, finalType, author, canonicalUrl, noindex, publishDate, modifiedDate]);

  useEffect(() => {
    // Remove existing JSON-LD scripts to avoid duplicates
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Base Person schema
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Ian Kibugu",
      "alternateName": "IK",
      "jobTitle": "Full-Stack Software Developer",
      "description": "Self-taught software developer specializing in React, TypeScript, Node.js, and modern web technologies",
      "url": window.location.origin,
      "image": `${window.location.origin}${image}`,
      "email": "mailto:kibuguzian@gmail.com",
      "telephone": "+254-XXX-XXXXXX", // Replace with actual number
      "sameAs": [
        "https://github.com/TabbyMichael",
        "https://www.linkedin.com/in/kibugu-ian-6162961ab",
        "https://twitter.com/IanKibugu"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nairobi",
        "addressRegion": "Nairobi County",
        "addressCountry": "Kenya",
        "postalCode": "00100"
      },
      "knowsAbout": [
        "React", "TypeScript", "JavaScript", "Node.js", "Express.js",
        "MongoDB", "PostgreSQL", "AWS", "Docker", "Git",
        "Web Development", "Frontend Development", "Backend Development",
        "Full Stack Development", "API Development", "Database Design",
        "Responsive Design", "Progressive Web Apps", "SEO Optimization"
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Software Developer",
        "occupationLocation": {
          "@type": "City",
          "name": "Nairobi, Kenya"
        },
        "skills": "React, TypeScript, Node.js, Full-Stack Development"
      }
    };

    // Add breadcrumbs if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs
      };
      
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(breadcrumbScript);
    }

    // Add projects schema if provided
    if (projects && projects.length > 0) {
      const portfolioSchema = {
        "@context": "https://schema.org",
        "@type": "CreativeWorkSeries",
        "name": "Ian Kibugu Development Portfolio",
        "description": "A collection of software development projects and applications",
        "creator": {
          "@type": "Person",
          "name": "Ian Kibugu"
        },
        "hasPart": projects
      };
      
      const projectsScript = document.createElement('script');
      projectsScript.type = 'application/ld+json';
      projectsScript.textContent = JSON.stringify(portfolioSchema);
      document.head.appendChild(projectsScript);
    }

    // Organization schema for business context
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Ian Kibugu Software Development",
      "description": "Professional software development services specializing in web applications",
      "founder": {
        "@type": "Person",
        "name": "Ian Kibugu"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nairobi",
        "addressCountry": "Kenya"
      },
      "serviceType": [
        "Web Development",
        "Frontend Development",
        "Backend Development",
        "Full Stack Development",
        "React Development",
        "TypeScript Development"
      ]
    };

    // Add all schemas
    const schemas = [personSchema, organizationSchema];
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `json-ld-${index}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

  }, [currentUrl, image, breadcrumbs, projects]);

  return null;
}