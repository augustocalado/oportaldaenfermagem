import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, User, Star, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const categories = ["Todos", "Cursos Gratuitos", "Enfermagem Clínica", "UTI", "Saúde Pública", "Gestão"];

export function CoursesSection() {
  const [active, setActive] = useState("Todos");

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filtered = !courses ? [] : active === "Todos"
    ? courses
    : active === "Cursos Gratuitos"
      ? courses.filter((c) => c.free)
      : courses.filter((c) => c.category === active);

  return (
    <section id="cursos" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
            Cursos
          </span>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Aprenda com os melhores</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Cursos online com certificado digital, desenvolvidos por profissionais renomados da enfermagem.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${active === cat
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-10">
            Erro ao carregar os cursos. Por favor, verifique se a tabela foi criada no Supabase.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="relative h-40 gradient-hero flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-primary-foreground/30" />
                  {course.free && (
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                      <span className="rounded-full bg-primary-foreground px-3 py-1 text-xs font-bold text-primary shadow-sm">
                        Gratuito
                      </span>
                      <span className="rounded-full bg-green-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-current" /> Certificado Grátis
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {course.instructor}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.hours}h</span>
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-current text-yellow-500" /> {course.rating ?? "N/A"}</span>
                    <span>{(course.students ?? 0).toLocaleString("pt-BR")} alunos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-foreground">
                      {course.free ? "Grátis" : `R$ ${course.price}`}
                    </span>
                    <Button size="sm" asChild>
                      <Link to={`/cursos/${course.id}`}>Inscrever-se</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
