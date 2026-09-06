import { personalInfo } from '../../data';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

const defaultTitle = `${personalInfo.firstName} ${personalInfo.lastName} | ${personalInfo.title}`;
const defaultDescription = personalInfo.bio;
const defaultImage = personalInfo.profileImage;
const siteUrl = personalInfo.baseUrl || 'https://example.com';

export function SEO({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = siteUrl,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [personalInfo.name],
  section,
  tags = [],
}: SEOProps) {
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // JSON-LD structured data
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    url: siteUrl,
    image: fullImage,
    sameAs: personalInfo.socialLinks.map((link: { url: string }) => link.url),
    email: personalInfo.email,
    knowsAbout: personalInfo.skills?.flatMap((s: { items: string[] }) => s.items) || [],
    description: personalInfo.bio,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultTitle,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={tags.join(', ')} />
      <meta name="author" content={authors.join(', ')} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${personalInfo.name} - ${personalInfo.title}`} />
      <meta property="og:site_name" content={personalInfo.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={`${personalInfo.name} - ${personalInfo.title}`} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema, websiteSchema]) }}
      />

      {type === 'article' && (
        <>
          <meta property="article:published_time" content={publishedTime || ''} />
          <meta property="article:modified_time" content={modifiedTime || ''} />
          <meta property="article:author" content={authors.join(', ')} />
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.emailjs.com" />
      <link rel="preconnect" href="https://llm-backend-one.vercel.app" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://api.emailjs.com" />
      <link rel="dns-prefetch" href="https://llm-backend-one.vercel.app" />
    </>
  );
}

export default SEO;