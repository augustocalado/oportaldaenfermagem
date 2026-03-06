import { UserLayout } from "@/components/portal/UserLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock, Shield, Bell, User as UserIcon, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
    const { profile, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: profile?.full_name || "",
        full_name_certificate: profile?.full_name_certificate || "",
        phone: profile?.phone || "",
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            toast.success("Perfil atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserLayout
            title="Configurações"
            description="Gerencie sua conta, segurança e preferências."
        >
            <Tabs defaultValue="perfil" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="perfil" className="gap-2">
                        <UserIcon className="h-4 w-4" /> Conta
                    </TabsTrigger>
                    <TabsTrigger value="seguranca" className="gap-2">
                        <Shield className="h-4 w-4" /> Segurança
                    </TabsTrigger>
                    <TabsTrigger value="notificacoes" className="gap-2">
                        <Bell className="h-4 w-4" /> Notificações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="perfil" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Dados do Perfil</CardTitle>
                            <CardDescription>Estes dados serão usados em seu perfil público e certificados.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdate} className="grid gap-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Nome Completo</Label>
                                        <Input
                                            id="full_name"
                                            value={formData.full_name}
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Celular para Contato</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
                                    <Label htmlFor="full_name_certificate" className="text-primary font-bold">NOME COMPLETO PARA CERTIFICADO (Obrigatório)</Label>
                                    <Input
                                        id="full_name_certificate"
                                        className="border-primary/30 focus-visible:ring-primary shadow-sm"
                                        value={formData.full_name_certificate}
                                        onChange={e => setFormData({ ...formData, full_name_certificate: e.target.value })}
                                        placeholder="EXATAMENTE COMO APARECERÁ NO DOCUMENTO"
                                        required
                                    />
                                    <p className="text-[10px] font-medium text-primary/70">
                                        Atenção: Use letras maiúsculas e minúsculas corretamente. Este campo é validado pela nossa auditoria interna.
                                    </p>
                                </div>

                                <div className="flex items-center justify-end">
                                    <Button type="submit" disabled={loading} className="px-8 shadow-md">
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seguranca" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                Alterar Senha
                            </CardTitle>
                            <CardDescription>Crie uma senha forte para proteger seu acesso.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">Senha Atual</Label>
                                    <Input id="current_password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new_password">Nova Senha</Label>
                                    <Input id="new_password" type="password" />
                                </div>
                            </div>
                            <Button className="w-full md:w-auto">Atualizar Senha</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/20 bg-destructive/5 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-destructive text-lg">Área Critica</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <p className="text-sm text-destructive/80 font-medium">Excluir sua conta permanentemente. Todos os seus dados e certificados serão perdidos.</p>
                            <Button variant="destructive" className="shadow-lg">Excluir Conta</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notificacoes" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Preferências de E-mail</CardTitle>
                            <CardDescription>Escolha o que você deseja receber do portal.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "Novos Cursos", desc: "Receba alertas sobre lançamentos em sua área." },
                                { title: "Dicas Semanais", desc: "Conteúdo educativo exclusivo para membros." },
                                { title: "Certificados Emitidos", desc: "Avisos por e-mail quando um novo certificado estiver pronto." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                                    <div>
                                        <p className="font-bold text-foreground">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-center">
                <Button variant="ghost" className="text-muted-foreground gap-2">
                    <HelpCircle className="h-4 w-4" /> Precisa de ajuda com suas configurações?
                </Button>
            </div>
        </UserLayout>
    );
};

export default Settings;
