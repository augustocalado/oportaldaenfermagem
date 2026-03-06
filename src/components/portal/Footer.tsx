import { Heart, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings-footer"],
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

  const quickLinks = [
    { label: "Cursos", href: "/cursos" },
    { label: "Notícias", href: "/#noticias" },
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Contato", href: "/#contato" },
  ];

  const legalLinks = [
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Termos de Uso", href: "/termos" },
  ];

  return (
    <footer id="contato" className="border-t border-border bg-card pt-16 pb-8">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Portal Enfermagem
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Sua jornada de excelência na enfermagem começa aqui. Educação continuada e informação de qualidade.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-6 font-display text-base font-bold text-foreground">Mapa do Site</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-6 font-display text-base font-bold text-foreground">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <h4 className="mb-2 font-display text-base font-bold text-foreground">Fale Conosco</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>{settings?.footer_address || "Av. Paulista, 1000 - SP"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>{settings?.footer_phone || "(11) 99999-0000"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>{settings?.footer_email || "contato@enfermagem.com.br"}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              {[
                { icon: Instagram, href: settings?.social_instagram || "#", label: "Instagram" },
                { icon: Facebook, href: settings?.social_facebook || "#", label: "Facebook" },
                { icon: Youtube, href: settings?.social_youtube || "#", label: "YouTube" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow-sm"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Enfermagem Brilhante. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            Feito com <Heart className="h-3 w-3 text-primary fill-primary" /> para heróis da saúde.
          </div>
        </div>
      </div>
    </footer>
  );
}
