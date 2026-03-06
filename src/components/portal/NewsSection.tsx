import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function NewsSection() {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !news || news.length === 0) {
    return null; // Or show a fallback message
  }

  return (
    <section id="noticias" className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-health-blue-light px-4 py-1 text-sm font-medium text-secondary">
            Notícias
          </span>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Fique atualizado</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            As últimas notícias sobre enfermagem, saúde pública, carreira e educação.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group row-span-2 overflow-hidden rounded-xl border border-border bg-card shadow-card"
          >
            <div className="h-56 gradient-hero flex items-center justify-center">
              <span className="font-display text-6xl text-primary-foreground/20">📰</span>
            </div>
            <div className="p-6">
              <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                {news[0].category}
              </span>
              <h3 className="mb-2 font-display text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                {news[0].title}
              </h3>
              <p className="mb-4 text-muted-foreground">{news[0].excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {news[0].published_at ? new Date(news[0].published_at).toLocaleDateString("pt-BR") : "Recent"}
                </span>
                <a href="#" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Ler mais <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.article>

          {/* Other news */}
          {news.slice(1).map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div>
                <span className="mb-2 inline-block rounded-full bg-health-blue-light px-3 py-1 text-xs font-medium text-secondary">
                  {item.category}
                </span>
                <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {item.published_at ? new Date(item.published_at).toLocaleDateString("pt-BR") : "Recent"}
                </span>
                <a href="#" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Ler mais <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
