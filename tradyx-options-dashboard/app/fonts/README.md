# Font Files

This directory previously contained Arteks font files, which have been replaced with Google Fonts.

## Current Font Setup

The application now uses three Google Fonts loaded via Next.js font optimization:

1. **Inter** - Primary UI font (optimized for dashboards)
   - License: SIL Open Font License
   - Usage: Main UI text, body content
   - CSS Variable: `--font-inter`
   - Tailwind Class: `font-sans` (default)

2. **JetBrains Mono** - Numeric/Value areas
   - License: Apache 2.0
   - Usage: Numbers, prices, percentages, volatility metrics
   - CSS Variable: `--font-jetbrains-mono`
   - Tailwind Class: `font-mono`

3. **Manrope** - Brand/Logo font
   - License: SIL Open Font License
   - Usage: Brand name, headings, premium UI elements
   - CSS Variable: `--font-manrope`
   - Tailwind Class: `font-brand`

## Font Configuration

Fonts are configured in `app/layout.tsx` using Next.js `next/font/google` for optimal performance with automatic font optimization, subsetting, and self-hosting.

## Usage Examples

```tsx
// Primary UI (Inter - default)
<div className="text-base">Regular text</div>

// Numeric values (JetBrains Mono)
<div className="font-mono text-2xl">₹24,500.00</div>

// Brand/Logo (Manrope)
<h1 className="font-brand text-3xl font-bold">Tradyxa Quant Dashboard</h1>
```

## Benefits

- **Performance**: Automatically optimized by Next.js
- **No Local Files**: Fonts are loaded from Google Fonts CDN
- **Better Alignment**: JetBrains Mono ensures perfect numeric alignment
- **Premium Look**: Manrope gives brand elements a high-tech edge
- **Dashboard Optimized**: Inter is specifically designed for data-heavy interfaces


