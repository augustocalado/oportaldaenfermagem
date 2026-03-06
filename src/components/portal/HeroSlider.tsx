import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Capacite-se com os melhores cursos de Enfermagem",
    subtitle: "Cursos online com certificado reconhecido. Aprenda no seu ritmo com profissionais experientes.",
    cta: "Ver Cursos",
    href: "#cursos",
  },
  {
    title: "Fique por dentro das últimas notícias da Enfermagem",
    subtitle: "Notícias atualizadas sobre saúde pública, SUS, carreira e educação em enfermagem.",
    cta: "Ler Notícias",
    href: "#noticias",
  },
  {
    title: "Materiais gratuitos para sua formação",
    subtitle: "Acesse apostilas, protocolos e PDFs essenciais para profissionais e estudantes de enfermagem.",
    cta: "Acessar Materiais",
    href: "#materiais",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  return (
    <section id="inicio" className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
        }} />
      </div>

      <div className="container relative flex min-h-[500px] items-center py-20 md:min-h-[560px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="mb-4 font-display text-3xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              {slides[current].title}
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              {slides[current].subtitle}
            </p>
            <div className="flex gap-3">
              <Button variant="hero-outline" size="lg" asChild>
                <a href={slides[current].href}>{slides[current].cta}</a>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <a href="#sobre">Saiba Mais</a>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground transition hover:bg-primary-foreground/30">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 text-primary-foreground transition hover:bg-primary-foreground/30">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
