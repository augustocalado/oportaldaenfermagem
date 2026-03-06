import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Download, Printer, ArrowLeft, Heart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Certificate = () => {
    const { id } = useParams();
    const { user, profile } = useAuth();

    const { data: certificate, isLoading } = useQuery({
        queryKey: ["certificate", id, user?.id],
        enabled: !!user && !!id,
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
                .eq("course_id", id)
                .eq("user_id", user?.id)
                .single();
            if (error) {
                console.error("Certificate: fetch error", error);
                throw error;
            }
            console.log("Certificate: fetched data", data);
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-6 px-4 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <p className="text-xl font-bold">Certificado não encontrado.</p>
                    <p className="text-muted-foreground max-w-sm">Não localizamos um registro de certificado para este curso e usuário.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="outline">
                        <Link to={`/cursos/${id}`}>Voltar ao Curso</Link>
                    </Button>
                    <Button asChild>
                        <Link to="/meus-cursos">Meus Cursos</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const isNameMissing = !profile?.full_name_certificate;

    if (isNameMissing) {
        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-yellow-200 text-center space-y-6">
                    <div className="mx-auto h-16 w-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Emissão Bloqueada</h2>
                        <p className="text-muted-foreground">
                            Por favor, preencha seu <strong>Nome Completo para Certificado</strong> em Configurações para poder visualizar e emitir seus certificados.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full">
                            <Link to="/configuracoes">Ir para Configurações</Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                            <Link to="/certificados">Voltar</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 print:p-0 print:bg-white">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Controls - Hidden on print */}
                <div className="flex items-center justify-between print:hidden">
                    <Button asChild variant="ghost" className="gap-2">
                        <Link to="/certificados">
                            <ArrowLeft className="h-4 w-4" /> Voltar
                        </Link>
                    </Button>
                    <div className="flex gap-4">
                        <Button onClick={handlePrint} variant="outline" className="gap-2">
                            <Printer className="h-4 w-4" /> Imprimir
                        </Button>
                        <Button onClick={handlePrint} className="gap-2">
                            <Download className="h-4 w-4" /> Baixar PDF
                        </Button>
                    </div>
                </div>

                {/* Certificate Content */}
                <div className="certificate-container bg-white shadow-2xl rounded-sm border-[16px] border-primary p-12 md:p-20 relative overflow-hidden aspect-[1.414/1] flex flex-col items-center text-center">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-full -ml-16 -mb-16 pointer-events-none"></div>

                    <div className="flex items-center gap-3 mb-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                            <Heart className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="font-display text-2xl font-bold text-foreground">
                            O Portal da Enfermagem
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6">
                        CERTIFICADO
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground mb-8">
                        Certificamos que para os devidos fins que
                    </p>

                    {console.log("Certificate: Rendering certificate content", certificate)}
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground underline decoration-primary/30 underline-offset-8 mb-8 uppercase">
                        {profile?.full_name_certificate || "Nome não informado"}
                    </h2>

                    <div className="space-y-4 max-w-2xl">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            concluiu com êxito o curso de aperfeiçoamento profissional em
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-primary">
                            {certificate?.courses?.title || "Curso não identificado"}
                        </p>
                        <p className="text-lg text-muted-foreground">
                            com carga horária total de <span className="font-bold text-foreground">{certificate?.courses?.hours || 0} horas</span>,
                            realizado em {certificate?.issue_date ? new Date(certificate.issue_date).toLocaleDateString('pt-BR') : "Data indefinida"}.
                        </p>
                    </div>

                    <div className="mt-auto pt-16 grid grid-cols-2 w-full gap-20">
                        <div className="text-center border-t border-border pt-4">
                            <p className="font-bold text-foreground">Augusto Calado</p>
                            <p className="text-sm text-muted-foreground">Diretor Acadêmico</p>
                        </div>
                        <div className="text-center border-t border-border pt-4">
                            <p className="font-mono text-xs text-muted-foreground">
                                Código de Autenticidade: {certificate.certificate_code}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                                Verifique a validade em {window.location.host}/validar-certificado
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground print:hidden">
                    Dica: Use a função de "Imprimir" e selecione "Salvar como PDF" para baixar o certificado.
                </p>
            </div>
        </div>
    );
};

export default Certificate;
