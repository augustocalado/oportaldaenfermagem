import { UserLayout } from "@/components/portal/UserLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, ExternalLink, Search, CheckCircle, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Certificates = () => {
    const { user, profile } = useAuth();

    const { data: certificates, isLoading } = useQuery({
        queryKey: ["user-certificates", user?.id],
        enabled: !!user,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("certificates")
                .select(`
                    *,
                    courses (
                        title,
                        hours
                    )
                `)
                .eq("user_id", user?.id)
                .order("issue_date", { ascending: false });
            if (error) throw error;
            return data;
        }
    });

    const isNameMissing = !profile?.full_name_certificate;

    return (
        <UserLayout
            title="Certificados"
            description="Acesse e baixe seus certificados de conclusão."
        >
            {isNameMissing && (
                <Card className="border-yellow-200 bg-yellow-50 mb-8 shadow-sm">
                    <CardContent className="pt-6 flex gap-4 items-start">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-yellow-800">Atenção: Nome para Certificado ausente</h3>
                            <p className="text-sm text-yellow-700 leading-relaxed">
                                Você precisa preencher seu <strong>Nome Completo para Certificado</strong> nas configurações para que possamos emitir seus documentos corretamente.
                            </p>
                            <Button asChild variant="link" className="p-0 h-auto text-yellow-800 font-bold underline decoration-yellow-400 underline-offset-4">
                                <Link to="/configuracoes">Preencher agora</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />)}
                    </div>
                ) : !certificates || certificates.length === 0 ? (
                    <Card className="border-dashed flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                            <Award className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-xl">Nenhum certificado emitido</CardTitle>
                        <CardDescription className="max-w-xs mt-2">
                            Conclua seus cursos em 100% para liberar seus certificados automaticamente.
                        </CardDescription>
                        <Button asChild className="mt-6">
                            <Link to="/meus-cursos">Ver meus cursos</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {certificates.map((cert) => (
                            <Card key={cert.id} className="group overflow-hidden hover:border-primary/50 transition-all border-border shadow-sm">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="p-6 flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                                    Válido
                                                </Badge>
                                                <span className="text-[10px] font-mono text-muted-foreground">CÓD: {cert.certificate_code}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                                                {cert.courses.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                                    {cert.courses.hours} Horas
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Award className="h-3.5 w-3.5 text-primary" />
                                                    Emitido em {new Date(cert.issue_date).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-muted/30 md:bg-transparent border-t md:border-t-0 md:border-l p-6 flex items-center gap-3">
                                            <Button asChild variant="outline" size="sm" className="flex-1 md:flex-none">
                                                <Link to={`/certificados/${cert.course_id}`}>
                                                    <ExternalLink className="mr-2 h-4 w-4" /> Visualizar
                                                </Link>
                                            </Button>
                                            <Button size="sm" className="flex-1 md:flex-none">
                                                <Download className="mr-2 h-4 w-4" /> PDF
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="pt-8 border-t">
                    <Card className="bg-primary/5 border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Search className="h-5 w-5 text-primary" />
                                Validação Ética e Transparência
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground leading-relaxed">
                            <p>
                                Todos os nossos certificados possuem um código único de autenticidade que pode ser validado por instituições e empresas em nossa página oficial de verificação. Nosso compromisso é com a qualidade do ensino e a integridade da sua formação.
                            </p>
                            <Button asChild variant="link" className="p-0 mt-2 h-auto text-primary font-bold">
                                <Link to="/validar-certificado">Acessar página de validação →</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
};

export default Certificates;
