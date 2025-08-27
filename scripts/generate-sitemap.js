#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://your-deployed-url-here'; // Replace with actual domain
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Define routes with their metadata
const routes = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/projects',
    changefreq: 'weekly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/news',
    changefreq: 'weekly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/testimonials',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/case',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    path: '/blog',
    changefreq: 'weekly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Generate sitemap XML
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <mobile:mobile/>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Write sitemap to file
function writeSitemap() {
  try {
    const sitemapContent = generateSitemap();
    fs.writeFileSync(OUTPUT_PATH, sitemapContent, 'utf8');
    console.log(`✅ Sitemap generated successfully at ${OUTPUT_PATH}`);
    console.log(`📊 Generated ${routes.length} URLs`);
    console.log(`🌐 Site URL: ${SITE_URL}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Generate robots.txt with sitemap reference
function generateRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Security
Disallow: /api/
Disallow: /.env
Disallow: /node_modules/
Disallow: /src/

# Performance
User-agent: *
Crawl-delay: 1

# Block specific bots if needed (uncomment if required)
# User-agent: BadBot
# Disallow: /

# Allow search engines to index images
User-agent: Googlebot-Image
Allow: /assets/
Allow: /public/assets/
`;

  const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log(`✅ robots.txt updated at ${robotsPath}`);
}

// Main execution - simplified approach
console.log('🚀 Generating SEO files...');
writeSitemap();
generateRobotsTxt();
console.log('✨ SEO files generation complete!');

export { generateSitemap, routes };