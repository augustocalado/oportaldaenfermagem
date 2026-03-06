import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": item.href ? `${window.location.origin}${item.href}` : undefined
        }))
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                    <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Início</span>
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 opacity-50" />
                        {item.href ? (
                            <Link to={item.href} className="hover:text-primary transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-medium text-foreground">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>

            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </nav>
    );
};
