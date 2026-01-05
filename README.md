# Carta de Vinhos - PWA

A digital wine menu for restaurants, powered by Google Sheets with full configuration support.

## Quick Overview

```
Edit Google Sheets → App automatically updates → Tablet displays menu
```

---

## Google Sheets Structure

Your Google Sheet needs these tabs:

### Tab 1: `wines` (required)

Your wine data:

| Column | Description | Example |
|--------|-------------|---------|
| categoria | Category (must match exactly) | Tinto, Branco, Champagne |
| subcategoria | Region/Subcategory | Douro, Alentejo, Minho |
| nome | Wine name | Quinta do Crasto |
| produtor | Producer | Crasto |
| castas | Grape varieties | Touriga Nacional, Tinta Roriz |
| ano | Vintage year | 2019 |
| notas | Notes/Ratings | WS 95, RP 93 |
| vol1 | First volume | 75cl |
| preco1 | First price | 45 |
| vol2 | Second volume (optional) | 150cl |
| preco2 | Second price (optional) | 85 |
| vol3 | Third volume (optional) | 15cl |
| preco3 | Third price (optional) | 9 |
| bio | Organic certification | TRUE or FALSE |
| prodi | Integrated production | TRUE or FALSE |
| exclusivo | Exclusive to restaurant | TRUE or FALSE |

### Tab 2: `config` (optional)

General settings - if not present, defaults are used:

| setting | value | description |
|---------|-------|-------------|
| default_language | pt | Starting language (pt, en, fr) |
| show_awards | true | Show awards on cover page |
| restaurant_name | | Custom title (empty = "Carta de Vinhos") |

### Tab 3: `category_mapping` (optional)

**Full control over menu categories** - mapping, names, order, and visibility:

| Column | Description | Example |
|--------|-------------|---------|
| menu_id | Unique ID for the menu item | GinVodka, Tinto, CervejaSidra |
| categorias | Google Sheets categories (comma-separated) | Gin,Vodka |
| nome_pt | Display name in Portuguese | Gin Tonic / Vodka Tonic |
| nome_en | Display name in English | Gin Tonic / Vodka Tonic |
| nome_fr | Display name in French | Gin Tonic / Vodka Tonic |
| subtitulo_pt | Subtitle in Portuguese | Clássicos & Premium |
| subtitulo_en | Subtitle in English | Classic & Premium |
| subtitulo_fr | Subtitle in French | Classiques et Premium |
| vinho_copo | Show "wine by glass" note | true or false |
| ordem | Display order (lower = first) | 1, 2, 3... |
| visivel | Show/hide category | true or false |

**Example:**
| menu_id | categorias | nome_pt | nome_en | nome_fr | subtitulo_pt | subtitulo_en | subtitulo_fr | vinho_copo | ordem | visivel |
|---------|------------|---------|---------|---------|--------------|--------------|--------------|------------|-------|---------|
| Tinto | Tinto | Vinhos Tintos | Red Wines | Vins Rouges | Seleção de Tintos | Red Selection | Sélection de Rouges | true | 1 | true |
| GinVodka | Gin,Vodka | Gin Tonic / Vodka Tonic | Gin Tonic / Vodka Tonic | Gin Tonic / Vodka Tonic | Clássicos & Premium | Classic & Premium | Classiques et Premium | false | 2 | true |

**Default behavior:**
- Categories NOT in this sheet use built-in defaults (won't disappear!)
- Set `visivel` to `false` to explicitly hide a category
- Lower `ordem` numbers appear first

### Tab 4: `subcategorias` (optional)

Control ordering, translations, AND subtitles of subcategories/regions:

| Column | Description | Example |
|--------|-------------|---------|
| categoria | Google Sheets category | Tinto, Branco, Bebida |
| subcategoria | Subcategory key (as in wines sheet) | Douro, Alentejo |
| nome_pt | Display name in Portuguese | Douro |
| nome_en | Display name in English | Douro Valley |
| nome_fr | Display name in French | Vallée du Douro |
| subtitulo_pt | Subtitle in Portuguese (optional) | O coração vínico de Portugal |
| subtitulo_en | Subtitle in English (optional) | The heart of Portuguese wine |
| subtitulo_fr | Subtitle in French (optional) | Le cœur viticole du Portugal |
| ordem | Display order (lower = first) | 1, 2, 3... |

**Example:**
| categoria | subcategoria | nome_pt | nome_en | nome_fr | subtitulo_pt | subtitulo_en | subtitulo_fr | ordem |
|-----------|--------------|---------|---------|---------|--------------|--------------|--------------|-------|
| Tinto | Douro | Douro | Douro Valley | Vallée du Douro | O coração vínico de Portugal | The heart of Portuguese wine | Le cœur viticole du Portugal | 1 |
| Generoso | Porto Tinto | Porto Tinto | Ruby Port | Porto Rouge | Vinhos jovens e frutados | Young and fruity wines | Vins jeunes et fruités | 1 |

**For combined menu categories** (like `BebidaCafetaria`), list each source category separately:

| categoria | subcategoria | nome_pt | nome_en | nome_fr | subtitulo_pt | subtitulo_en | subtitulo_fr | ordem |
|-----------|--------------|---------|---------|---------|--------------|--------------|--------------|-------|
| Bebida | Água | Água | Water | Eau | | | | 1 |
| Cafetaria | Café | Café | Coffee | Café | | | | 3 |

**Default behavior:**
- Subcategories NOT in this sheet appear alphabetically after ordered ones (using original name)
- If translations are empty, falls back to Portuguese, then to the subcategoria key
- Subtitles are optional - if empty, no subtitle is shown
- Use the **Google Sheets categoria** values (not the menu_id)

---

## Default Menu Categories

These are the built-in menu categories (used if `category_mapping` sheet is not provided):

| menu_id | Google Sheets categorias | Menu Display (PT) |
|---------|-------------------------|-------------------|
| Aperitivo | Aperitivo | Aperitivos |
| GinVodka | Gin, Vodka | Gin Tonic / Vodka Tonic |
| Espumante | Espumante | Espumantes |
| Champagne | Champagne | Champagne |
| Rosé | Rosé | Vinhos Rosés |
| Branco | Branco | Vinhos Brancos |
| Tinto | Tinto | Vinhos Tintos |
| CervejaSidra | Cerveja, Sidra | Cervejas & Sidras |
| Generoso | Generoso | Generosos |
| Rhum | Rhum | Rum & Tequila |
| Aguardente | Aguardente | Aguardentes |
| LicorWhisky | Licor, Whisky | Licores & Whiskies |
| BebidaCafetaria | Bebida, Cafetaria | Águas & Cafetaria |

**Note:** In the `wines` tab, use the values from the "Google Sheets categorias" column.

---

## Setup Instructions

### 1. Create & Share Google Sheet

1. Create a new Google Sheet
2. Create tabs: `wines`, `config`, `category_mapping`, `subcategorias`
3. Click **Share** → **Anyone with the link can view**
4. Copy the Sheet ID from the URL (between `/d/` and `/edit`)

### 2. Configure the App

Edit `index.html` and update:
```javascript
const GOOGLE_SHEET_ID = 'your-sheet-id-here';
```

### 3. Deploy

Upload all files to Netlify, Vercel, or GitHub Pages.

### 4. Install on Tablet

1. Open URL in Chrome
2. Menu → "Add to Home Screen"
3. For kiosk mode, use Android's Screen Pinning

---

## Local Testing

To test without deploying:

```bash
cd wine-menu-pwa
python -m http.server 8000
```

Then open: `http://localhost:8000`

---

## Files Included

| File | Description |
|------|-------------|
| index.html | Main application |
| manifest.json | PWA configuration |
| service-worker.js | Offline support |
| logo.png | Restaurant logo |
| bio_logo.png | Organic certification icon |
| prodi_logo.png | Integrated production icon |
| award_*.png | Restaurant award images |
| sample-config.csv | Example config settings |
| sample-category_mapping.csv | Example category configuration |
| sample-subcategorias.csv | Example subcategory ordering & translations |
| generate-icons.html | Tool to generate PWA icons |

---

## Troubleshooting

### Menu not loading?
- Check Google Sheet is public (Anyone with link can view)
- Verify Sheet ID is correct
- Check tab is named `wines` (lowercase)

### Config not working?
- Tab names must be exact: `config`, `category_mapping`, `subcategorias`
- Column headers must match exactly
- Config sheets are optional - app works without them

### Changes not showing?
- Wait 10-30 seconds and refresh
- Clear browser/app cache
- Check service worker version

---

Enjoy your digital wine menu! 🍷
