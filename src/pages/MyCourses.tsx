import { UserLayout } from "@/components/portal/UserLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Clock, CheckCircle, Award, PlayCircle, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const MyCourses = () => {
    const { user } = useAuth();

    const { data: enrollments, isLoading } = useQuery({
        queryKey: ["my-enrollments", user?.id],
        enabled: !!user,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("course_enrollments")
                .select(`
                    *,
                    courses (*)
                `)
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    return (
        <UserLayout title="Meus Cursos" description="Acompanhe seus estudos e acesse suas aulas.">
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-32 bg-muted rounded-t-xl" />
                            <CardHeader>
                                <div className="h-6 w-2/3 bg-muted rounded" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : !enrollments || enrollments.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Você ainda não possui cursos</CardTitle>
                    <CardDescription className="max-w-xs mt-2">
                        Explore nossa vitrine de cursos e comece a aprender hoje mesmo.
                    </CardDescription>
                    <Button asChild className="mt-6">
                        <Link to="/cursos">Explorar Cursos</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {enrollments.map((enrol, i) => (
                        <motion.div
                            key={enrol.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="overflow-hidden group hover:shadow-lg transition-all border-border shadow-sm">
                                <div className="flex flex-col md:flex-row h-full">
                                    <div className="md:w-48 bg-muted relative overflow-hidden flex-shrink-0">
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                            <PlayCircle className="h-12 w-12 text-primary opacity-50 group-hover:scale-110 transition-transform" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">{enrol.courses.title}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2 font-medium">
                                                        <Clock className="h-3.5 w-3.5" /> {enrol.courses.hours} horas de carga horária
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6 flex-1 flex flex-col">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                                    <span className="text-muted-foreground">Progresso no curso</span>
                                                    <span className="text-primary">{enrol.completed ? "100%" : "35%"}</span>
                                                </div>
                                                <Progress value={enrol.completed ? 100 : 35} className="h-1.5" />
                                            </div>

                                            <div className="flex items-center gap-3 mt-auto pt-2">
                                                <Button asChild className="flex-1 shadow-md gap-2" size="sm">
                                                    <Link to={`/cursos/${enrol.courses.id}`}>
                                                        <PlayCircle className="h-4 w-4" />
                                                        {enrol.completed ? "Rever Aulas" : "Continuar Aula"}
                                                    </Link>
                                                </Button>
                                                {enrol.completed && (
                                                    <Button asChild variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5">
                                                        <Link to={`/certificados/${enrol.courses.id}`}>
                                                            <Award className="h-4 w-4 text-primary" /> Certificado
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-12 pt-8 border-t border-border">
                <Card className="bg-muted/10 border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Dúvidas frequentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Seus certificados são emitidos automaticamente após a conclusão de 100% das atividades do curso.
                            Caso tenha problemas com a emissão, entre em contato com nosso suporte acadêmico.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
};

export default MyCourses;
