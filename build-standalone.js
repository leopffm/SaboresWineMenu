#!/usr/bin/env node
/**
 * Build script: Creates a single self-contained HTML file for contest submission.
 * Inlines all JS libraries, fonts, images, and wine data.
 *
 * Usage: node build-standalone.js
 * Output: sabores-wine-menu-standalone.html
 */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = __dirname;
const NODE_MODULES = '/tmp/node_modules';
const OUTPUT_FILE = path.join(PROJECT_DIR, 'sabores-wine-menu-standalone.html');

// --- Helpers ---

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function toBase64DataURI(filePath, mimeType) {
  const data = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

function fontToBase64(filePath) {
  return toBase64DataURI(filePath, 'font/woff2');
}

function pngToBase64(filePath) {
  return toBase64DataURI(filePath, 'image/png');
}

// --- Build font-face CSS ---

function buildFontFaceCSS() {
  const fontDir = (name) => path.join(NODE_MODULES, '@fontsource', name, 'files');

  const cormorantWeights = [400, 500, 600, 700];
  const cormorantItalicWeights = [400, 500];
  const spectralWeights = [400, 500, 600, 700];
  const subsets = ['latin', 'latin-ext'];

  let css = '';

  // Unicode ranges (from Google Fonts)
  const unicodeRanges = {
    'latin': 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    'latin-ext': 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'
  };

  // Cormorant Garamond - normal
  for (const subset of subsets) {
    for (const weight of cormorantWeights) {
      const file = path.join(fontDir('cormorant-garamond'), `cormorant-garamond-${subset}-${weight}-normal.woff2`);
      if (fs.existsSync(file)) {
        css += `@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url(${fontToBase64(file)}) format('woff2');
  unicode-range: ${unicodeRanges[subset]};
}\n`;
      }
    }
  }

  // Cormorant Garamond - italic
  for (const subset of subsets) {
    for (const weight of cormorantItalicWeights) {
      const file = path.join(fontDir('cormorant-garamond'), `cormorant-garamond-${subset}-${weight}-italic.woff2`);
      if (fs.existsSync(file)) {
        css += `@font-face {
  font-family: 'Cormorant Garamond';
  font-style: italic;
  font-weight: ${weight};
  font-display: swap;
  src: url(${fontToBase64(file)}) format('woff2');
  unicode-range: ${unicodeRanges[subset]};
}\n`;
      }
    }
  }

  // Spectral - normal
  for (const subset of subsets) {
    for (const weight of spectralWeights) {
      const file = path.join(fontDir('spectral'), `spectral-${subset}-${weight}-normal.woff2`);
      if (fs.existsSync(file)) {
        css += `@font-face {
  font-family: 'Spectral';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url(${fontToBase64(file)}) format('woff2');
  unicode-range: ${unicodeRanges[subset]};
}\n`;
      }
    }
  }

  return css;
}

// --- Build image map ---

function buildImageMap() {
  const images = [
    'logo.png', 'bio_logo.png', 'prodi_logo.png', 'texture.png',
    'award_tripadvisor.png', 'award_michelin.png', 'award_winespectator.png', 'award_finewine.png',
    'icon-192.png', 'icon-512.png'
  ];

  const map = {};
  for (const img of images) {
    const filePath = path.join(PROJECT_DIR, img);
    if (fs.existsSync(filePath)) {
      map[img] = pngToBase64(filePath);
    }
  }
  return map;
}

// --- Read CSV data ---

function readCSVData() {
  const csvFiles = {
    wines: 'sample-wines.csv',
    config: 'sample-config.csv',
    category_mapping: 'sample-category_mapping.csv',
    subcategorias: 'sample-subcategorias.csv'
  };

  const data = {};
  for (const [key, file] of Object.entries(csvFiles)) {
    const filePath = path.join(PROJECT_DIR, file);
    if (fs.existsSync(filePath)) {
      data[key] = readFile(filePath);
    }
  }
  return data;
}

// --- Read JS libraries ---

function readJSLibraries() {
  return {
    react: readFile(path.join(NODE_MODULES, 'react/umd/react.production.min.js')),
    reactDOM: readFile(path.join(NODE_MODULES, 'react-dom/umd/react-dom.production.min.js')),
    papaParse: readFile(path.join(NODE_MODULES, 'papaparse/papaparse.min.js'))
  };
}

// --- Main build ---

function build() {
  console.log('Building self-contained HTML file...');

  // Read original HTML
  let html = readFile(path.join(PROJECT_DIR, 'index.html'));

  // 1. Read all assets
  console.log('  - Reading JS libraries...');
  const libs = readJSLibraries();

  console.log('  - Converting images to base64...');
  const imageMap = buildImageMap();

  console.log('  - Building embedded font CSS...');
  const fontCSS = buildFontFaceCSS();

  console.log('  - Reading CSV data...');
  const csvData = readCSVData();

  // 2. Replace Google Fonts links with embedded font CSS
  html = html.replace(
    /\s*<link rel="preconnect"[^>]*>\s*/g, ''
  );
  html = html.replace(
    /\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g, ''
  );

  // Insert font CSS into the <style> block
  html = html.replace(
    '<style>',
    `<style>\n${fontCSS}`
  );

  // 3. Remove manifest and service worker references
  html = html.replace(/\s*<link rel="manifest"[^>]*>\s*/g, '');

  // 4. Replace CDN script tags with inlined JS
  html = html.replace(
    /<script src="https:\/\/unpkg\.com\/react@18\/umd\/react\.production\.min\.js"><\/script>/,
    `<script>${libs.react}</script>`
  );
  html = html.replace(
    /<script src="https:\/\/unpkg\.com\/react-dom@18\/umd\/react-dom\.production\.min\.js"><\/script>/,
    `<script>${libs.reactDOM}</script>`
  );
  html = html.replace(
    /<script src="https:\/\/unpkg\.com\/papaparse@5\/papaparse\.min\.js"><\/script>/,
    `<script>${libs.papaParse}</script>`
  );

  // 5. Replace image references with base64 data URIs
  for (const [filename, dataURI] of Object.entries(imageMap)) {
    // Replace in src attributes: 'filename' and "filename"
    const escaped = filename.replace('.', '\\.');
    html = html.replace(new RegExp(`'${escaped}'`, 'g'), `'${dataURI}'`);
    html = html.replace(new RegExp(`"${escaped}"`, 'g'), `"${dataURI}"`);
  }

  // 6. Replace Google Sheets fetch logic with embedded data
  // We'll replace the fetchAllData function to use embedded CSV strings instead of fetching
  const embeddedDataScript = `
    // ============================================
    // EMBEDDED DATA (for standalone/offline use)
    // ============================================
    const EMBEDDED_CSV = {
      wines: ${JSON.stringify(csvData.wines || '')},
      config: ${JSON.stringify(csvData.config || '')},
      category_mapping: ${JSON.stringify(csvData.category_mapping || '')},
      subcategorias: ${JSON.stringify(csvData.subcategorias || '')}
    };
`;

  // Insert embedded data before the APP CODE section
  html = html.replace(
    "// ============================================\n    // APP CODE",
    embeddedDataScript + "\n    // ============================================\n    // APP CODE"
  );

  // Replace the fetchAllData function to use embedded data
  const oldFetchAllData = `const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch wines (required)
          const winesResponse = await fetch(SHEETS.wines);
          if (!winesResponse.ok) throw new Error('Failed to fetch wines');
          const winesCsv = await winesResponse.text();
          const wines = parseSheetData(winesCsv);
          setWineData(wines);

          // Fetch config sheets (optional - use defaults if not available)
          const [configCsv, categoryMappingCsv, subcategoriasCsv] = await Promise.all([
            fetchSheet(SHEETS.config),
            fetchSheet(SHEETS.category_mapping),
            fetchSheet(SHEETS.subcategorias)
          ]);

          // Parse config
          if (configCsv) {
            const config = parseConfigSheet(configCsv);
            setAppConfig(config);
            if (config.default_language) {
              setLanguage(config.default_language);
            }
          }

          // Parse category mapping
          let catMappings = [];
          if (categoryMappingCsv) {
            catMappings = parseCategoryMappingSheet(categoryMappingCsv);
            setCategoryMappings(catMappings);
          }

          // Parse subcategorias (ordering and translations)
          // We pass the CSV (even if null) to the parser, which now has defaults
          const subConfig = parseSubcategoriasSheet(subcategoriasCsv || '');
          setSubcategoriasConfig(subConfig);

          // Apply category mapping
          const orderedCategories = applyCategoryMapping(defaultCategories, catMappings);
          setCategories(orderedCategories);

        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Não foi possível carregar a carta de vinhos.');
        } finally {
          setLoading(false);
        }
      };`;

  const newFetchAllData = `const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Use embedded CSV data (standalone mode)
          const wines = parseSheetData(EMBEDDED_CSV.wines);
          setWineData(wines);

          // Parse config
          if (EMBEDDED_CSV.config) {
            const config = parseConfigSheet(EMBEDDED_CSV.config);
            setAppConfig(config);
            if (config.default_language) {
              setLanguage(config.default_language);
            }
          }

          // Parse category mapping
          let catMappings = [];
          if (EMBEDDED_CSV.category_mapping) {
            catMappings = parseCategoryMappingSheet(EMBEDDED_CSV.category_mapping);
            setCategoryMappings(catMappings);
          }

          // Parse subcategorias
          const subConfig = parseSubcategoriasSheet(EMBEDDED_CSV.subcategorias || '');
          setSubcategoriasConfig(subConfig);

          // Apply category mapping
          const orderedCategories = applyCategoryMapping(defaultCategories, catMappings);
          setCategories(orderedCategories);

        } catch (err) {
          console.error('Error loading data:', err);
          setError('Não foi possível carregar a carta de vinhos.');
        } finally {
          setLoading(false);
        }
      };`;

  html = html.replace(oldFetchAllData, newFetchAllData);

  // 7. Remove service worker registration block
  const swBlock = `if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
          .then(registration => console.log('SW registered:', registration.scope))
          .catch(error => console.log('SW registration failed:', error));
      });
    }`;
  html = html.replace(swBlock, '');

  // 8. Write output
  fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');

  const stats = fs.statSync(OUTPUT_FILE);
  const sizeKB = Math.round(stats.size / 1024);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\nDone! Output: ${OUTPUT_FILE}`);
  console.log(`File size: ${sizeKB} KB (${sizeMB} MB)`);
  console.log('\nThis file is completely self-contained and works offline.');
  console.log('Open it in any browser to view the wine menu.');
}

build();
