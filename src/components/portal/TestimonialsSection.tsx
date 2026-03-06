import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { id: 1, name: "Ana Paula Silva", role: "Enfermeira - Hospital Albert Einstein", text: "O Portal da Enfermagem transformou minha carreira. Os cursos são excelentes e os materiais me ajudam diariamente na prática clínica.", rating: 5 },
  { id: 2, name: "Carlos Eduardo Santos", role: "Técnico de Enfermagem", text: "Consegui minha certificação através dos cursos gratuitos. A qualidade do conteúdo é impressionante e acessível.", rating: 5 },
  { id: 3, name: "Mariana Costa", role: "Estudante de Enfermagem - USP", text: "As apostilas e protocolos disponíveis são fundamentais para meus estudos. Recomendo a todos os colegas de faculdade!", rating: 5 },
];

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
            Comunidade
          </span>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">O que dizem nossos alunos</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Histórias de profissionais e estudantes que fazem parte da nossa comunidade.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-accent" />
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current text-yellow-500" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {t.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
