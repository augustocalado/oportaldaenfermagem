import { useState } from "react";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, User, Star, BookOpen, Loader2, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { SEO } from "@/components/portal/SEO";

const categories = ["Todos", "Cursos Gratuitos", "Enfermagem Clínica", "UTI", "Saúde Pública", "Gestão"];

const Courses = () => {
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");

    const { data: courses, isLoading, error } = useQuery({
        queryKey: ["all-courses"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    const filtered = !courses ? [] : courses.filter((c) => {
        const matchesCategory = activeCategory === "Todos"
            ? true
            : activeCategory === "Cursos Gratuitos"
                ? c.free
                : c.category === activeCategory;

        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.instructor.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Cursos de Enfermagem"
                description="Explore nossa lista de cursos especializados em enfermagem UTI, Clínica, Saúde Pública e muito mais."
                keywords="cursos enfermagem, especialização saúde, cursos gratuitos enfermagem"
            />
            <Header />

            <main>
                {/* Banner Section */}
                <section className="relative overflow-hidden py-16 lg:py-24 gradient-hero">
                    <div className="container relative z-10">
                        <div className="max-w-2xl text-white">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-md"
                            >
                                Cursos de Enfermagem
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mb-6 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
                            >
                                Evolua sua carreira com nossos <span className="text-white">cursos especializados</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-white/80"
                            >
                                Explore nossa ampla variedade de cursos certificados, desde especialidades clínicas até gestão hospitalar. Aprenda com os melhores profissionais do mercado.
                            </motion.p>
                        </div>
                    </div>

                    {/* Abstract Background Elements */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-10 pointer-events-none">
                        <BookOpen className="h-[400px] w-[400px]" />
                    </div>
                </section>

                {/* Filter and Search Bar */}
                <section className="sticky top-16 z-30 border-b border-border bg-background/80 py-4 backdrop-blur-md">
                    <div className="container">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por título ou instrutor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-10 border-border focus:ring-primary"
                                />
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                                <div className="flex items-center gap-1.5 mr-2 text-sm font-medium text-muted-foreground shrink-0 border-r pr-3 border-border">
                                    <Filter className="h-4 w-4" /> Categorias:
                                </div>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Courses Listing */}
                <section className="py-12 bg-muted/20 min-h-[500px]">
                    <div className="container">
                        {isLoading ? (
                            <div className="flex h-64 items-center justify-center">
                                <div className="text-center">
                                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                                    <p className="mt-4 text-muted-foreground">Carregando catálogo de cursos...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
                                <p className="font-medium">Ocorreu um erro ao carregar os cursos.</p>
                                <p className="text-sm">Por favor, tente novamente mais tarde ou contate o suporte.</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="rounded-xl border border-border bg-background p-12 text-center text-muted-foreground">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <Search className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">Nenhum curso encontrado</h3>
                                <p className="mt-2 text-sm italic">"{searchTerm}"</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSearchTerm(""); setActiveCategory("Todos") }}
                                    className="mt-4"
                                >
                                    Limpar todos os filtros
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((course, i) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (i % 6) * 0.05 }}
                                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-elevated"
                                    >
                                        {/* Course Card Header (Image/Gradient) */}
                                        <div className="relative h-48 w-full overflow-hidden">
                                            {course.image_url ? (
                                                <img
                                                    src={course.image_url}
                                                    alt={course.title}
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 gradient-hero opacity-90 group-hover:scale-105 transition-transform duration-500"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
                                                        <BookOpen className="h-20 w-20 text-white" />
                                                    </div>
                                                </>
                                            )}

                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <span className="inline-block rounded-md bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                                    {course.category}
                                                </span>
                                            </div>

                                            {course.free && (
                                                <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                                                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-lg">
                                                        Gratuito
                                                    </span>
                                                    <span className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-[9px] font-bold text-white shadow-lg">
                                                        <Star className="h-2 w-2 fill-current" /> Certificado Grátis
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Course Card Body */}
                                        <div className="flex flex-1 flex-col p-6">
                                            <div className="mb-4 flex flex-1 flex-col">
                                                <h3 className="mb-2 line-clamp-2 font-display text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                                                    {course.title}
                                                </h3>
                                                <div className="mt-auto space-y-3">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                                            <User className="h-3 w-3" />
                                                        </div>
                                                        <span className="font-medium">{course.instructor}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1.5 text-secondary">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{course.hours} horas</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="flex items-center gap-0.5 font-bold text-yellow-500">
                                                                <Star className="h-3.5 w-3.5 fill-current" />
                                                                {course.rating}
                                                            </span>
                                                            <span>({course.students.toLocaleString("pt-BR")} alunos)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Course Card Footer */}
                                            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-medium uppercase text-muted-foreground">Investimento</span>
                                                    <span className="text-2xl font-bold text-foreground">
                                                        {course.free ? "Grátis" : `R$ ${course.price.toFixed(2).replace('.', ',')}`}
                                                    </span>
                                                </div>
                                                <Button className="rounded-xl px-6 group/btn transition-all" asChild>
                                                    <Link to={`/cursos/${course.id}`}>Ver Detalhes</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Courses;
