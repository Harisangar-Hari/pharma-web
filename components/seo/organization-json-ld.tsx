const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PharmaCare",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description:
      "Licensed online pharmacy delivering genuine medicines and health essentials.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@pharmacare.example",
      telephone: "+91-98765-43210",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}