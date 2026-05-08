---
name: Clinical Innovation
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#00687b'
  on-secondary: '#ffffff'
  secondary-container: '#50dcff'
  on-secondary-container: '#005f71'
  tertiary: '#7b2600'
  on-tertiary: '#ffffff'
  tertiary-container: '#a33500'
  on-tertiary-container: '#ffc6b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#afecff'
  secondary-fixed-dim: '#48d7f9'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5d'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
  label:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

This design system is built on the intersection of clinical precision and futuristic technology. The brand personality is authoritative yet visionary, aiming to evoke a sense of absolute reliability and cutting-edge intelligence. It targets healthcare professionals and institutions who require high-performance tools that don't sacrifice human-centric usability.

The visual style is **Modern Corporate with Glassmorphism accents**. It prioritizes a "breathable" interface through ample whitespace, ensuring that complex medical data remains legible and non-intimidating. The aesthetic is premium and high-trust, utilizing translucent layers and crisp geometry to suggest a "digital-first" healthcare environment.

## Colors

The palette is anchored by "Trustworthy Medical Blue" (#0052CC), used for primary actions and brand presence to establish authority. "Vibrant Teal" (#00B8D9) serves as a secondary accent to highlight AI-driven features and positive health indicators, injecting a futuristic energy into the UI.

The background remains a clean, laboratory white, while light gray surfaces (#F4F5F7) are used to define content areas and dashboard modules. Functional colors for success, warning, and error should be desaturated to maintain the professional, clinical tone.

## Typography

This design system utilizes a dual-font strategy to balance innovation with readability. **Space Grotesk** is used for headlines to provide a technical, cutting-edge feel that aligns with the AI aspect of the platform. **Manrope** is used for all body copy and UI labels, chosen for its exceptional legibility in dense medical contexts and its modern, professional geometric structure.

The hierarchy is strict: large headlines use tighter letter spacing for a "designed" feel, while body text uses generous line heights to ensure long-form medical reports are easy to scan.

## Layout & Spacing

The layout philosophy is based on a **12-column fluid grid** with a fixed maximum container width for desktop views. A strict 8px rhythm governs all padding and margins, ensuring consistent vertical cadence across complex data dashboards.

Ample whitespace is a core requirement; sections should be separated by large gaps (48px+) to prevent cognitive overload. Grouping of related medical data should utilize the "md" spacing unit (24px) to create clear visual clusters.

## Elevation & Depth

This design system conveys depth through a combination of **Subtle Glassmorphism** and **Ambient Shadows**. 

1.  **Surfaces:** Primary containers use a solid white background. Overlays, modals, and floating navigation bars utilize a backdrop-filter (blur: 12px) with a semi-transparent white fill (opacity: 80%) to create a futuristic, airy feel.
2.  **Shadows:** Shadows are highly diffused and low-opacity, tinted with a hint of the primary blue (#0052CC) to maintain color harmony. They should feel like soft glows rather than harsh traditional dropshadows.
3.  **Borders:** All cards and containers feature a 1px "crisp" border using a light gray/blue tint to provide structural definition even on white backgrounds.

## Shapes

The shape language is defined by **roundedness level 2**. This provides a 0.5rem (8px) base radius for standard components like input fields and buttons, increasing to 1rem (16px) for cards and larger containers. 

This level of rounding softens the technical nature of the AI platform, making it feel more approachable and "human," while avoiding the overly playful look of pill-shaped buttons for primary functional elements.

## Components

-   **Buttons:** Primary buttons feature a solid #0052CC fill with white text and 8px corners. Secondary buttons use a crisp #0052CC border with a subtle 4% blue hover state.
-   **Cards:** Use a white background with a 1px #E1E4E8 border and a soft ambient shadow. For "AI-powered" insights, cards should switch to the glassmorphic style with a teal-tinted border.
-   **Input Fields:** Clean, minimalist borders that thicken slightly and change to #0052CC on focus. Labels sit clearly above the field in the "label" typography style.
-   **Chips/Tags:** Used for patient status or medical categories. These use a pill-shape (fully rounded) to contrast against the more structural 8px corners of primary buttons.
-   **Lists:** High-density medical lists should use alternating light-gray row backgrounds (#F9FAFB) and subtle dividers to maintain horizontal tracking across data points.
-   **Additional Components:** This design system includes "Health-Trend Micro-graphs"—small, simplified sparklines using the Vibrant Teal color to show patient vitals over time within card components.