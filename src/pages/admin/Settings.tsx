import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ShieldCheck, Search, LayoutPanelTop, Share2 } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
    const queryClient = useQueryClient();
    const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});

    const { data: settingsData, isLoading } = useQuery({
        queryKey: ["site-settings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*");
            if (error) throw error;

            const map: Record<string, string> = {};
            data.forEach((s: any) => {
                map[s.key] = s.value;
            });
            setSettingsMap(map);
            return data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (updates: { key: string; value: string }[]) => {
            const { error } = await supabase
                .from("site_settings")
                .upsert(updates.map(u => ({ ...u, updated_at: new Date().toISOString() })));
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["site-settings"] });
            toast.success("Configurações atualizadas com sucesso!");
        },
        onError: (error: any) => {
            toast.error("Erro ao atualizar: " + error.message);
        }
    });

    const handleSave = (keys: string[]) => {
        const updates = keys.map(key => ({
            key,
            value: settingsMap[key] || ""
        }));
        updateMutation.mutate(updates);
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleChange = (key: string, value: string) => {
        setSettingsMap(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-foreground">Configurações do Site</h1>

            <div className="grid gap-8">
                {/* SEO Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-primary" />
                            SEO e Meta Tags
                        </CardTitle>
                        <CardDescription>
                            Configure como o site aparece nos mecanismos de busca como Google.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Título do Site (SEO Title)</Label>
                            <Input
                                value={settingsMap["seo_title"] || ""}
                                onChange={(e) => handleChange("seo_title", e.target.value)}
                                placeholder="Portal da Enfermagem..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Meta Descrição</Label>
                            <Textarea
                                value={settingsMap["seo_description"] || ""}
                                onChange={(e) => handleChange("seo_description", e.target.value)}
                                placeholder="Breve descrição do portal..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Palavras-chave (Keywords)</Label>
                            <Input
                                value={settingsMap["seo_keywords"] || ""}
                                onChange={(e) => handleChange("seo_keywords", e.target.value)}
                                placeholder="enfermagem, saúde, educação..."
                            />
                        </div>
                        <Button onClick={() => handleSave(["seo_title", "seo_description", "seo_keywords"])} disabled={updateMutation.isPending}>
                            <Save className="mr-2 h-4 w-4" /> Salvar SEO
                        </Button>
                    </CardContent>
                </Card>

                {/* Footer Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LayoutPanelTop className="h-5 w-5 text-primary" />
                            Configurações do Rodapé
                        </CardTitle>
                        <CardDescription>
                            Altere as informações de contato e links exibidos no final de todas as páginas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Endereço</Label>
                                <Input
                                    value={settingsMap["footer_address"] || ""}
                                    onChange={(e) => handleChange("footer_address", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Telefone / WhatsApp</Label>
                                <Input
                                    value={settingsMap["footer_phone"] || ""}
                                    onChange={(e) => handleChange("footer_phone", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email de Contato</Label>
                                <Input
                                    value={settingsMap["footer_email"] || ""}
                                    onChange={(e) => handleChange("footer_email", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Share2 className="h-4 w-4" /> Redes Sociais
                            </h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Instagram (URL)</Label>
                                    <Input
                                        value={settingsMap["social_instagram"] || ""}
                                        onChange={(e) => handleChange("social_instagram", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Facebook (URL)</Label>
                                    <Input
                                        value={settingsMap["social_facebook"] || ""}
                                        onChange={(e) => handleChange("social_facebook", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>YouTube (URL)</Label>
                                    <Input
                                        value={settingsMap["social_youtube"] || ""}
                                        onChange={(e) => handleChange("social_youtube", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => handleSave(["footer_address", "footer_phone", "footer_email", "social_instagram", "social_facebook", "social_youtube"])} disabled={updateMutation.isPending}>
                            <Save className="mr-2 h-4 w-4" /> Salvar Rodapé
                        </Button>
                    </CardContent>
                </Card>

                {/* LGPD Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Privacidade e LGPD
                        </CardTitle>
                        <CardDescription>
                            Gerencie o texto do aviso de cookies e privacidade.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Texto do Aviso LGPD</Label>
                            <Textarea
                                value={settingsMap["lgpd_text"] || ""}
                                onChange={(e) => handleChange("lgpd_text", e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                        </div>
                        <Button onClick={() => handleSave(["lgpd_text"])} disabled={updateMutation.isPending}>
                            <Save className="mr-2 h-4 w-4" /> Salvar LGPD
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSettings;
