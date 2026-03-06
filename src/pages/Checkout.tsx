import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, QrCode, ClipboardCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Checkout = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const { data: course, isLoading } = useQuery({
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

    const enrollMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from("course_enrollments")
                .insert({ user_id: user?.id, course_id: id });
            if (error) throw error;
        },
        onSuccess: () => {
            setIsFinished(true);
            toast.success("Pagamento confirmado e matrícula realizada!");
        },
        onError: (error: any) => {
            toast.error("Erro ao processar matrícula: " + error.message);
            setIsProcessing(false);
        }
    });

    const handleConfirmPayment = () => {
        setIsProcessing(true);
        // Simulating payment processing delay
        setTimeout(() => {
            enrollMutation.mutate();
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!course) return <div>Curso não encontrado.</div>;

    if (isFinished) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full text-center space-y-6"
                    >
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Pagamento Confirmado!</h1>
                        <p className="text-muted-foreground">
                            Parabéns! Sua matrícula no curso <strong>{course.title}</strong> foi realizada com sucesso. Você já pode começar a estudar.
                        </p>
                        <Button className="w-full py-6 text-lg" onClick={() => navigate(`/cursos/${id}`)}>
                            Acessar meu curso
                        </Button>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 py-12 px-4">
                <div className="container max-w-4xl">
                    <Button
                        variant="ghost"
                        className="mb-6 gap-2"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-4 w-4" /> Voltar
                    </Button>

                    <div className="grid gap-8 md:grid-cols-5">
                        {/* Order Summary */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-primary/20 shadow-lg overflow-hidden">
                                <div className="bg-primary/5 p-4 border-b border-primary/10">
                                    <h2 className="font-bold text-lg">Resumo do Pedido</h2>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Curso selecionado:</p>
                                        <p className="font-bold text-foreground leading-tight">{course.title}</p>
                                    </div>
                                    <div className="pt-4 border-t flex justify-between items-center">
                                        <span className="text-muted-foreground">Total:</span>
                                        <span className="text-2xl font-bold text-primary">
                                            R$ {course.price.toFixed(2).replace(".", ",")}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 p-4 block text-xs text-muted-foreground text-center">
                                    Pagamento 100% seguro e acesso imediato após confirmação.
                                </CardFooter>
                            </Card>

                            <div className="p-4 rounded-xl border border-dashed border-muted-foreground/30 text-center space-y-2">
                                <p className="text-sm font-medium">Dúvidas com o pagamento?</p>
                                <p className="text-xs text-muted-foreground">Fale conosco pelo WhatsApp: (11) 99999-9999</p>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="md:col-span-3">
                            <h2 className="text-2xl font-bold mb-6">Método de Pagamento</h2>

                            <RadioGroup
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                                className="grid gap-4"
                            >
                                <Label
                                    htmlFor="pix"
                                    className={`flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all ${paymentMethod === "pix" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="pix" id="pix" />
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                                            <QrCode className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold">PIX (Mais rápido)</p>
                                            <p className="text-xs text-muted-foreground">Aprovação instantânea</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600">DESCONTO 5%</span>
                                </Label>

                                <Label
                                    htmlFor="card"
                                    className={`flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="card" id="card" />
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Cartão de Crédito</p>
                                            <p className="text-xs text-muted-foreground">Em até 12x no cartão</p>
                                        </div>
                                    </div>
                                </Label>
                            </RadioGroup>

                            <AnimatePresence mode="wait">
                                {paymentMethod === "pix" ? (
                                    <motion.div
                                        key="pix-area"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-8 p-6 rounded-2xl border bg-card space-y-6 text-center"
                                    >
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Escaneie o QR Code abaixo:</p>
                                            <div className="mx-auto h-48 w-48 bg-white p-2 rounded-lg border flex items-center justify-center">
                                                {/* Simulated QR Code */}
                                                <div className="grid grid-cols-4 gap-1 opacity-80">
                                                    {Array.from({ length: 16 }).map((_, i) => (
                                                        <div key={i} className={`h-8 w-8 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground">Ou copie a chave aleatória:</p>
                                            <div className="flex gap-2">
                                                <Input
                                                    readOnly
                                                    value="00020126580014BR.GOV.BCB.PIX011400000000000000520400005303986540510.005802BR5913PORTAL ENFERM6009SAO PAULO62070503***6304ABCD"
                                                    className="bg-muted font-mono text-[10px]"
                                                />
                                                <Button size="icon" variant="outline" onClick={() => toast.success("Código copiado!")}>
                                                    <ClipboardCheck className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full py-6 text-lg gap-2"
                                            onClick={handleConfirmPayment}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Já realizei o pagamento"}
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="card-area"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-8 p-6 rounded-2xl border bg-card space-y-4"
                                    >
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="card-number">Número do Cartão</Label>
                                                <Input id="card-number" placeholder="0000 0000 0000 0000" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="card-expiry">Validade</Label>
                                                    <Input id="card-expiry" placeholder="MM/AA" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="card-cvv">CVV</Label>
                                                    <Input id="card-cvv" placeholder="123" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="card-name">Nome no Cartão</Label>
                                                <Input id="card-name" placeholder="Como impresso no cartão" />
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full py-6 text-lg gap-2 mt-4"
                                            onClick={handleConfirmPayment}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Finalizar Pagamento"}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
