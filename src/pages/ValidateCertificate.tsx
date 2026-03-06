import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Search, CheckCircle, XCircle, Loader2, QrCode, Shield } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const ValidateCertificate = () => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const { data, error: fetchError } = await supabase
                .from("certificates")
                .select(`
                    *,
                    courses (
                        title,
                        hours
                    ),
                    profiles:user_id (
                        full_name_certificate
                    )
                `)
                .eq("certificate_code", code.trim())
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (data) {
                setResult(data);
            } else {
                setError("Código de certificado não encontrado ou inválido.");
            }
        } catch (err) {
            setError("Ocorreu um erro ao validar o certificado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/10 flex flex-col">
            <Header />
            <main className="flex-1 container py-16 flex items-center justify-center px-4">
                <div className="w-full max-w-2xl space-y-8">
                    <div className="text-center space-y-3">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                            <Award className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Validar Certificado</h1>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Verifique a autenticidade de certificados emitidos pelo Portal da Enfermagem Brilhante.
                        </p>
                    </div>

                    <Card className="border-primary/20 shadow-xl overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/10 pb-6">
                            <CardTitle className="text-lg">Insira o código de validação</CardTitle>
                            <CardDescription>O código pode ser encontrado no rodapé do certificado (ex: ABC123DEF456)</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 pb-10">
                            <form onSubmit={handleValidate} className="flex flex-col md:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        value={code}
                                        onChange={e => setCode(e.target.value.toUpperCase())}
                                        placeholder="EX: 1A2B3C4D..."
                                        className="pl-10 h-12 text-lg font-mono tracking-widest uppercase border-primary/20 focus-visible:ring-primary shadow-inner"
                                    />
                                </div>
                                <Button size="lg" className="h-12 px-8 font-bold shadow-lg" disabled={loading}>
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Validar Agora"}
                                </Button>
                            </form>

                            {/* Result Display */}
                            <div className="mt-8 transition-all">
                                {result && (
                                    <div className="p-6 rounded-xl border-2 border-green-500 bg-green-50/50 animate-in zoom-in-95 duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                                <CheckCircle className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Badge className="bg-green-600 border-none">Autêntico e Válido</Badge>
                                                <h2 className="text-xl font-bold text-green-900 mt-1">Certificado Confirmado</h2>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="space-y-1 p-3 bg-white/80 rounded-lg border border-green-100 shadow-sm">
                                                <p className="text-[10px] text-green-700 uppercase font-black tracking-widest">Aluno</p>
                                                <p className="text-lg font-bold text-foreground">{(result.profiles as any)?.full_name_certificate || "Aluno Portal"}</p>
                                            </div>
                                            <div className="space-y-1 p-3 bg-white/80 rounded-lg border border-green-100 shadow-sm">
                                                <p className="text-[10px] text-green-700 uppercase font-black tracking-widest">Curso</p>
                                                <p className="text-lg font-bold text-foreground">{result.courses?.title}</p>
                                            </div>
                                            <div className="space-y-1 p-3 bg-white/80 rounded-lg border border-green-100 shadow-sm">
                                                <p className="text-[10px] text-green-700 uppercase font-black tracking-widest">Carga Horária</p>
                                                <p className="text-lg font-bold text-foreground">{result.courses?.hours} horas</p>
                                            </div>
                                            <div className="space-y-1 p-3 bg-white/80 rounded-lg border border-green-100 shadow-sm">
                                                <p className="text-[10px] text-green-700 uppercase font-black tracking-widest">Data de Conclusão</p>
                                                <p className="text-lg font-bold text-foreground">{new Date(result.issue_date).toLocaleDateString('pt-BR')}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-col items-center justify-center gap-2 pt-6 border-t border-green-200">
                                            <QrCode className="h-24 w-24 text-green-700/20" />
                                            <p className="text-xs text-green-700/60 font-medium">Digital Signature ID: {result.id}</p>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-6 rounded-xl border-2 border-destructive bg-destructive/5 animate-in shake-1 duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-destructive flex items-center justify-center text-white">
                                                <XCircle className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-destructive">Validação Falhou</h3>
                                                <p className="text-sm text-destructive/80 font-medium">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Shield className="h-3 w-3" /> Sistema de Verificação Segura do Portal da Enfermagem Brilhante
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ValidateCertificate;
