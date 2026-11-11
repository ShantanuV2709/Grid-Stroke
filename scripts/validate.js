/**
 * Quality & Schema Validation Test Suite for GRID STROKE STUDIO
 * Validates Sticky One-Page View, Social Media Packages, Real Badges & FAQs
 */

const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('GRID STROKE STUDIO - PRODUCTION VALIDATION SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. Validate index.html existence & structure
const htmlPath = path.join(__dirname, '../index.html');
assert(fs.existsSync(htmlPath), 'index.html exists');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Check H1 Count
const h1Matches = htmlContent.match(/<h1[^>]*>/gi);
assert(h1Matches && h1Matches.length === 2, `H1 count is exactly 2: found ${h1Matches ? h1Matches.length : 0}`);

// Check Sticky Stage Sections
const sectionMatches = htmlContent.match(/class="[^"]*sticky-stage-section[^"]*"/gi);
assert(sectionMatches && sectionMatches.length >= 7, `Sticky one-page sections present: found ${sectionMatches ? sectionMatches.length : 0}`);

// Check Real App Badges
assert(htmlContent.includes('content/badges/ai.png'), 'Real Illustrator badge linked');
assert(htmlContent.includes('content/badges/ps.png'), 'Real Photoshop badge linked');
assert(htmlContent.includes('content/badges/pr.png'), 'Real Premiere Pro badge linked');
assert(htmlContent.includes('content/badges/ae.png'), 'Real After Effects badge linked');
assert(htmlContent.includes('content/badges/cd.png'), 'Real Corel Draw badge linked');

// Check Social Media Management Packages
assert(htmlContent.includes('01 / COMPLETE') && htmlContent.includes('Complete Presence'), 'Package 01 present');
assert(htmlContent.includes('02 / SOCIAL') && htmlContent.includes('Social Presence'), 'Package 02 present');
assert(htmlContent.includes('03 / CONTENT') && htmlContent.includes('Content Studio'), 'Package 03 present');
assert(htmlContent.includes('04 / DIGITAL') && htmlContent.includes('Digital Growth'), 'Package 04 present');
assert(htmlContent.includes('05 / ESSENTIAL') && htmlContent.includes('Essential Creative'), 'Package 05 present');

// Check Real Case Studies & Deliverables
assert(htmlContent.includes('content/branding/meura-1.png'), 'Real Meura branding sheet linked');
assert(htmlContent.includes('content/ecommerce/sundrunk-1.jpg'), 'Real Sun Drunk Amazon A+ banner linked');
assert(htmlContent.includes('content/3d/klickpin-walkthrough.mp4'), 'Real Klickpin 3D walkthrough linked');
assert(htmlContent.includes('content/invitations/wedding-1.mp4'), 'Real Wedding video invitation linked');
assert(htmlContent.includes('content/motion/eemos-newyear.mp4'), 'Real commercial reel linked');

// Check FAQs (all 8 questions)
for (let i = 1; i <= 8; i++) {
  assert(htmlContent.includes(`Q${i}.`), `FAQ Q${i} present in accordion`);
}

// Check Tagline
assert(htmlContent.includes('Think Creative. Design Different. Make an Impact.'), 'Final tagline present');

// 2. Validate JSON-LD Schema
console.log('\n--- Validating JSON-LD Structured Data ---');
const jsonLdMatch = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
assert(jsonLdMatch && jsonLdMatch[1], 'JSON-LD script tag located');

if (jsonLdMatch && jsonLdMatch[1]) {
  try {
    const jsonLd = JSON.parse(jsonLdMatch[1]);
    assert(jsonLd['@graph'] && Array.isArray(jsonLd['@graph']), 'JSON-LD contains valid @graph array');
    
    const types = jsonLd['@graph'].map(item => item['@type']);
    assert(types.includes('Organization'), 'Schema includes Organization');
    assert(types.includes('LocalBusiness'), 'Schema includes LocalBusiness');
    assert(types.includes('FAQPage'), 'Schema includes FAQPage');
    
    const services = jsonLd['@graph'].filter(item => item['@type'] === 'Service');
    assert(services.length === 6, `Schema includes all 6 Services: found ${services.length}`);
    
    const faq = jsonLd['@graph'].find(item => item['@type'] === 'FAQPage');
    assert(faq && faq.mainEntity && faq.mainEntity.length === 8, `FAQPage has exactly 8 Q&As: found ${faq ? faq.mainEntity.length : 0}`);
  } catch (err) {
    assert(false, `JSON-LD JSON parsing failed: ${err.message}`);
  }
}

// 3. Validate /content/media.json
console.log('\n--- Validating /content/media.json ---');
const mediaPath = path.join(__dirname, '../content/media.json');
assert(fs.existsSync(mediaPath), 'content/media.json exists');

try {
  const mediaData = JSON.parse(fs.readFileSync(mediaPath, 'utf8'));
  assert(mediaData.items && mediaData.items.length >= 12, `media.json contains items array (>= 12): found ${mediaData.items ? mediaData.items.length : 0}`);
} catch (err) {
  assert(false, `media.json validation error: ${err.message}`);
}

// 4. Validate Static SEO Manifests
console.log('\n--- Validating Search & LLM Manifests ---');
assert(fs.existsSync(path.join(__dirname, '../llms.txt')), 'llms.txt exists');
assert(fs.existsSync(path.join(__dirname, '../llms-full.txt')), 'llms-full.txt exists');
assert(fs.existsSync(path.join(__dirname, '../robots.txt')), 'robots.txt exists');
assert(fs.existsSync(path.join(__dirname, '../sitemap.xml')), 'sitemap.xml exists');

// 5. Validate Scripts & Styles
console.log('\n--- Validating Scripts & Styles ---');
assert(fs.existsSync(path.join(__dirname, '../styles/main.css')), 'styles/main.css exists');
assert(fs.existsSync(path.join(__dirname, '../scripts/app.js')), 'scripts/app.js exists');

console.log('\n====================================================');
console.log(`TOTAL PASSES: ${passCount}`);
console.log(`TOTAL FAILS:  ${failCount}`);
console.log('====================================================');

if (failCount > 0) process.exit(1);
