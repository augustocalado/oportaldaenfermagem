import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Link, useLocation } from "react-router-dom";
import { User, BookOpen, Award, Settings, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
}

const menuItems = [
    { label: "Perfil", href: "/perfil", icon: User },
    { label: "Meus Cursos", href: "/meus-cursos", icon: BookOpen },
    { label: "Certificados", href: "/certificados", icon: Award },
    { label: "Configurações", href: "/configuracoes", icon: Settings },
];

export function UserLayout({ children, title, description }: UserLayoutProps) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container py-8 pb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full md:w-64 space-y-2">
                            <div className="px-3 py-4 bg-muted/20 rounded-xl border border-border/50 mb-6">
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-4">Menu do Aluno</h2>
                                <nav className="space-y-1">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                                location.pathname === item.href
                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn("h-4 w-4", location.pathname === item.href ? "" : "text-primary/70 group-hover:text-primary")} />
                                                {item.label}
                                            </div>
                                            {location.pathname === item.href && <ChevronRight className="h-4 w-4" />}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Content */}
                        <div className="flex-1 space-y-6">
                            <header className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                                {description && <p className="text-muted-foreground">{description}</p>}
                            </header>
                            <div className="min-h-[400px]">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
