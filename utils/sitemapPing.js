/**
 * Utility to notify search engines when the sitemap is updated.
 * Called after destinations or packages are created, updated, or deleted.
 */

const SITE_URL = process.env.SITE_URL || 'https://infinitymilesholiday.com';

async function pingSitemapUpdate() {
  const sitemapUrl = encodeURIComponent(`${SITE_URL}/sitemap.xml`);

  const pingUrls = [
    `https://www.google.com/ping?sitemap=${sitemapUrl}`,
    `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
  ];

  for (const url of pingUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`✅ Sitemap ping successful: ${url}`);
      } else {
        console.warn(`⚠️ Sitemap ping returned ${response.status}: ${url}`);
      }
    } catch (err) {
      // Non-critical — don't crash the app if ping fails
      console.warn(`⚠️ Sitemap ping failed: ${url} — ${err.message}`);
    }
  }
}

module.exports = { pingSitemapUpdate };
