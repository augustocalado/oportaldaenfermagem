import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, User, Briefcase, Trash2, Phone } from "lucide-react";

interface ProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
    const { profile, updateProfile, deleteAccount } = useAuth();
    const [formData, setFormData] = useState({
        full_name: "",
        full_name_certificate: "",
        profession: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || "",
                full_name_certificate: profile.full_name_certificate || "",
                profession: profile.profession || "",
                phone: profile.phone || "",
                address: profile.address || "",
                city: profile.city || "",
                state: profile.state || "",
                zip_code: profile.zip_code || ""
            });
        }
    }, [profile, open]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            toast.success("Perfil atualizado com sucesso!");
            onOpenChange(false);
        } catch (error) {
            toast.error("Erro ao atualizar perfil.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
            try {
                await deleteAccount();
                toast.success("Conta excluída com sucesso.");
            } catch (error) {
                toast.error("Erro ao excluir conta.");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Meu Perfil e Configurações</DialogTitle>
                    <DialogDescription>
                        Mantenha suas informações atualizadas para uma melhor experiência no portal.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-6 py-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Informações Pessoais</h3>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="pl-10"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profession">Profissão / Especialidade</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="profession"
                                        value={formData.profession}
                                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                        className="pl-10"
                                        placeholder="Ex: Enfermeiro Intensivista"
                                        list="professions"
                                    />
                                    <datalist id="professions">
                                        <option value="Estudante" />
                                        <option value="Enfermeiro(a)" />
                                        <option value="Técnico(a) em Enfermagem" />
                                        <option value="Auxiliar de Enfermagem" />
                                        <option value="Professor(a)" />
                                    </datalist>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Celular</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="pl-10"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Dados para Certificado</h3>
                            <div className="space-y-2">
                                <Label htmlFor="certificate_name">Nome completo para certificado</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="certificate_name"
                                        value={formData.full_name_certificate}
                                        onChange={(e) => setFormData({ ...formData, full_name_certificate: e.target.value })}
                                        className="pl-10 border-primary/50 focus:border-primary"
                                        placeholder="Nome impresso no certificado"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Endereço</h3>
                            <div className="space-y-2">
                                <Label htmlFor="zip_code">CEP</Label>
                                <Input
                                    id="zip_code"
                                    value={formData.zip_code}
                                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                                    placeholder="00000-000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Logradouro / Número</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Rua, Número, Complemento"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Cidade</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="Sua cidade"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">Estado</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        placeholder="UF"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações do Perfil
                        </Button>
                    </div>
                </form>
                <div className="border-t pt-4">
                    <Button
                        variant="ghost"
                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Minha Conta Permanentemente
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
