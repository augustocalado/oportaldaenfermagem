import { Heart, Award, History, Users, MessageCircle } from "lucide-react";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { SEO } from "@/components/portal/SEO";

const Sobre = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="Sobre Nós" description="Conheça a história e a missão do Portal da Enfermagem Brilhante, transformando a educação desde 2008." />
            <Header />
            <main className="pt-24">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden bg-primary/5">
                    <div className="container px-4 mx-auto relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                                Nossa História e Missão
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Desde 2008, o Portal da Enfermagem Brilhante dedica-se a transformar a educação e a prática da enfermagem no Brasil, oferecendo recursos de alta qualidade para profissionais e estudantes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20">
                    <div className="container px-4 mx-auto">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    <History className="h-4 w-4" />
                                    <span>Ativos desde 2008</span>
                                </div>
                                <h2 className="text-3xl font-bold text-foreground">Semeando Conhecimento há mais de 15 anos</h2>
                                <p className="text-muted-foreground">
                                    O que começou como uma pequena iniciativa para compartilhar materiais de estudo evoluiu para um dos maiores portais especializados em enfermagem do país. Nossa trajetória é marcada pelo compromisso com a ciência e o cuidado.
                                </p>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <Award className="h-5 w-5 text-primary" />
                                            Excelência
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Conteúdo revisado por especialistas e atualizado com as últimas diretrizes.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            Comunidade
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Milhares de enfermeiros, técnicos e estudantes conectados em uma só rede.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative border border-border bg-card rounded-2xl p-8 shadow-xl">
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                                            <Heart className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">Nossa Visão</h4>
                                            <p className="text-muted-foreground">Ser a principal referência em educação digital para enfermagem na América Latina.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <MessageCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold">Nosso Compromisso</h4>
                                            <p className="text-muted-foreground">Democratizar o acesso a materiais de estudo e atualização profissional de alta qualidade.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Sobre;
