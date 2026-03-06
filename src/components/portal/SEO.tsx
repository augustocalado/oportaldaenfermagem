import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: "website" | "article" | "course";
    canonical?: string;
    schema?: any;
}

export const SEO = ({
    title,
    description,
    keywords,
    ogImage,
    ogType = "website",
    canonical,
    schema
}: SEOProps) => {
    const { data: settings } = useQuery({
        queryKey: ["site-settings-seo"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*");
            if (error) return null;

            const map: Record<string, string> = {};
            data.forEach(s => map[s.key] = s.value);
            return map;
        }
    });

    const siteTitle = settings?.seo_title || "Portal da Enfermagem";
    const siteDescription = settings?.seo_description || "O maior portal de educação continuada para profissionais de enfermagem.";
    const siteKeywords = settings?.seo_keywords || "enfermagem, cursos, saúde, educação";

    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || siteDescription;
    const finalKeywords = keywords || siteKeywords;

    const url = canonical || window.location.href;
    const image = ogImage || "/og-image.png"; // Fallback image

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data (Schema.org) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Portal da Enfermagem",
                    "url": "https://enfermagembrilhante.com.br",
                    "logo": "https://enfermagembrilhante.com.br/logo.png"
                })}
            </script>

            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};
