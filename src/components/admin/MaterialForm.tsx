import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface MaterialFormProps {
    material?: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const MaterialForm = ({ material, isOpen, onClose, onSuccess }: MaterialFormProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        type: "PDF",
        category: "Protocolos",
        size: "1.0 MB",
        download_url: ""
    });

    useEffect(() => {
        if (material) {
            setFormData({
                title: material.title || "",
                type: material.type || "PDF",
                category: material.category || "Protocolos",
                size: material.size || "1.0 MB",
                download_url: material.download_url || ""
            });
        } else {
            setFormData({
                title: "",
                type: "PDF",
                category: "Protocolos",
                size: "1.0 MB",
                download_url: ""
            });
        }
    }, [material, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (material) {
                const { error } = await supabase
                    .from("materials")
                    .update(formData)
                    .eq("id", material.id);
                if (error) throw error;
                toast.success("Material atualizado com sucesso");
            } else {
                const { error } = await supabase
                    .from("materials")
                    .insert([formData]);
                if (error) throw error;
                toast.success("Material criado com sucesso");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{material ? "Editar Material" : "Novo Material"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo (ex: PDF)</Label>
                            <Input
                                id="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="size">Tamanho (ex: 2MB)</Label>
                            <Input
                                id="size"
                                value={formData.size}
                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="download_url">URL de Download</Label>
                        <Input
                            id="download_url"
                            placeholder="https://exemplo.com/arquivo.pdf"
                            value={formData.download_url}
                            onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                            required
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {material ? "Salvar Alterações" : "Criar Material"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MaterialForm;
