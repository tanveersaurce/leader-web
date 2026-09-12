import React from 'react';
import { Helmet } from 'react-helmet-async';

const ReactHelmet = ({ title, description, keywords, image, url }) => {
  const defaultTitle = "नरेन्द्र मोदी - One Leader, One Vision";
  const defaultDesc = "नरेन्द्र मोदी जी का आधिकारिक डिजिटल पोर्टफोलियो। जीवन यात्रा, दृष्टिकोण, उपलब्धियां और यादगार पल।";
  const defaultKeywords = "Narendra Modi, Prime Minister of India, BJP, Portfolio, PM Modi, Modi Speech, India";
  const defaultImage = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&h=630&fit=crop";

  return (
    <Helmet>
      <title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? `${title} | ${defaultTitle}` : defaultTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || window.location.href} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title ? `${title} | ${defaultTitle}` : defaultTitle} />
      <meta property="twitter:description" content={description || defaultDesc} />
      <meta property="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default ReactHelmet;
