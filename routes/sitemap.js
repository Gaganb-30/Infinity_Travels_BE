const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const Package = require('../models/Package');

const SITE_URL = process.env.SITE_URL || 'https://infinitymilesholiday.com';

/**
 * GET /sitemap.xml
 * Dynamically generates a sitemap from all active destinations and packages.
 */
router.get('/sitemap.xml', async (req, res) => {
  try {
    const [destinations, packages] = await Promise.all([
      Destination.find({ isActive: true }).select('slug updatedAt').lean(),
      Package.find({ isActive: true }).select('slug updatedAt').lean(),
    ]);

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/destinations', priority: '0.9', changefreq: 'daily' },
      { url: '/packages', priority: '0.9', changefreq: 'daily' },
      { url: '/about-us', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    ];

    const now = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Destination pages
    for (const dest of destinations) {
      xml += `  <url>
    <loc>${SITE_URL}/destinations/${dest.slug}</loc>
    <lastmod>${dest.updatedAt ? dest.updatedAt.toISOString() : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    // Package pages
    for (const pkg of packages) {
      xml += `  <url>
    <loc>${SITE_URL}/packages/${pkg.slug}</loc>
    <lastmod>${pkg.updatedAt ? pkg.updatedAt.toISOString() : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=600'); // cache for 10 minutes
    res.set('X-Robots-Tag', 'noindex'); // sitemap itself shouldn't be indexed
    res.send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

/**
 * GET /robots.txt
 */
router.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

module.exports = router;
