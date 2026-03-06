import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/portal/SEO";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, BookOpen, Clock, User, CheckCircle, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: course, isLoading: courseLoading } = useQuery({
        queryKey: ["course", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            return data;
        },
    });

    const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
        queryKey: ["enrollment", id, user?.id],
        enabled: !!user && !!id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("course_enrollments")
                .select("*")
                .eq("course_id", id)
                .eq("user_id", user?.id)
                .maybeSingle();
            if (error) throw error;
            return data;
        },
    });

    const enrollMutation = useMutation({
        mutationFn: async () => {
            if (!user) {
                navigate("/login");
                return;
            }
            if (!course.free) {
                navigate(`/checkout/${id}`);
                return;
            }

            const { error } = await supabase
                .from("course_enrollments")
                .insert({ user_id: user.id, course_id: id });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollment", id, user?.id] });
            toast.success("Matrícula realizada com sucesso!");
        },
        onError: (error: any) => {
            toast.error("Erro ao se matricular: " + error.message);
        },
    });

    const completeMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from("course_enrollments")
                .update({ completed: true, completed_at: new Date().toISOString() })
                .eq("id", enrollment.id);
            if (error) throw error;

            // Generate certificate code
            const certificateCode = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
            const { error: certError } = await supabase
                .from("certificates")
                .insert({
                    user_id: user.id,
                    course_id: id,
                    enrollment_id: enrollment.id,
                    certificate_code: certificateCode
                });
            if (certError) throw certError;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["enrollment", id, user?.id] });
            toast.success("Parabéns! Você concluiu o curso.");
        },
        onError: (error: any) => {
            toast.error("Erro ao concluir curso: " + error.message);
        },
    });

    if (courseLoading || enrollmentLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <p>Curso não encontrado.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO
                title={course.title}
                description={course.instructor} // Simplified
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Course",
                    "name": course.title,
                    "description": `Curso de ${course.title} ministrado por ${course.instructor}`,
                    "provider": {
                        "@type": "Organization",
                        "name": "Portal da Enfermagem",
                        "sameAs": window.location.origin
                    }
                }}
            />
            <Header />
            <main className="flex-1 py-12">
                <div className="container max-w-5xl">
                    <Breadcrumbs
                        items={[
                            { label: "Cursos", href: "/cursos" },
                            { label: course.title }
                        ]}
                    />
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    {course.category}
                                </span>
                                <h1 className="text-4xl font-bold text-foreground leading-tight">
                                    {course.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{course.instructor}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{course.hours} horas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        <span>{course.students.toLocaleString()} alunos</span>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="aspect-video w-full rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                                <BookOpen className="h-16 w-16 opacity-20" />
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <h2 className="text-2xl font-bold">Sobre este curso</h2>
                                <p>
                                    Este curso foi desenvolvido para proporcionar uma visão aprofundada sobre {course.title.toLowerCase()}.
                                    Com foco na prática clínica e nas melhores evidências científicas, você aprenderá técnicas e protocolos essenciais
                                    para a sua jornada na enfermagem.
                                </p>
                                <h3>O que você vai aprender:</h3>
                                <ul>
                                    <li>Protocolos atualizados de atendimento</li>
                                    <li>Gestão de cuidados e segurança do paciente</li>
                                    <li>Abordagem humanizada e ética profissional</li>
                                    <li>Novas tecnologias e tendências da área</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <div className="mb-6">
                                    <span className="text-sm font-medium text-muted-foreground">Investimento</span>
                                    <div className="text-3xl font-bold text-foreground">
                                        {course.free ? "Grátis" : `R$ ${course.price.toFixed(2).replace('.', ',')}`}
                                    </div>
                                </div>

                                {!enrollment ? (
                                    <Button
                                        className="w-full py-6 text-lg"
                                        onClick={() => enrollMutation.mutate()}
                                        disabled={enrollMutation.isPending}
                                    >
                                        {enrollMutation.isPending ? "Matriculando..." : "Quero me matricular"}
                                    </Button>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="rounded-xl bg-primary/5 p-4 flex items-center gap-3 text-primary border border-primary/10">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-medium text-sm">Você está matriculado neste curso</span>
                                        </div>

                                        {!enrollment.completed ? (
                                            <Button
                                                variant="outline"
                                                className="w-full py-6 text-lg border-2 border-primary text-primary hover:bg-primary/5"
                                                onClick={() => completeMutation.mutate()}
                                                disabled={completeMutation.isPending}
                                            >
                                                {completeMutation.isPending ? "Processando..." : "Marcar como concluído"}
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
                                                onClick={() => navigate(`/certificados/${course.id}`)}
                                            >
                                                Baixar Certificado
                                            </Button>
                                        )}
                                    </div>
                                )}

                                <p className="mt-4 text-center text-xs text-muted-foreground">
                                    Acesso vitalício e suporte personalizado incluso.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CourseDetail;
