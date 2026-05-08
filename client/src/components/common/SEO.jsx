import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteTitle = 'MediVoice AI — Next-Gen Healthcare';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription = 'AI-powered clinical communication platform for doctors and patients. Real-time translation, automated SOAP notes, and secure health records.';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || siteDescription} />
      <meta name="keywords" content={keywords || 'healthcare, ai, medical, transcription, telehealth, india'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || siteDescription} />
      <meta property="og:image" content={image || '/og-image.jpg'} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || window.location.href} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || siteDescription} />
      <meta property="twitter:image" content={image || '/og-image.jpg'} />
    </Helmet>
  );
};

export default SEO;
