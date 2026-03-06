import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MaterialsSection() {
  const { data: materials, isLoading, error } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="materiais" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
            Materiais
          </span>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Biblioteca de conteúdos</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            PDFs, apostilas e protocolos essenciais para sua formação e prática profissional.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-10">
            Erro ao carregar os materiais. Por favor, verifique se a tabela foi criada no Supabase.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials?.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <FileText className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 font-display text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                    {m.title}
                  </h3>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {m.category} • {m.size}
                  </p>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" asChild>
                    <a href={m.download_url || "#"} target="_blank" rel="noopener noreferrer">
                      <Download className="h-3 w-3" /> Baixar
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
