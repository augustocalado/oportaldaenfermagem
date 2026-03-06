import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface NewsFormProps {
    news?: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const NewsForm = ({ news, isOpen, onClose, onSuccess }: NewsFormProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "Geral",
        excerpt: "",
        content: "",
        image_url: "",
        published_at: new Date().toISOString()
    });

    useEffect(() => {
        if (news) {
            setFormData({
                title: news.title || "",
                category: news.category || "Geral",
                excerpt: news.excerpt || "",
                content: news.content || "",
                image_url: news.image_url || "",
                published_at: news.published_at || new Date().toISOString()
            });
        } else {
            setFormData({
                title: "",
                category: "Geral",
                excerpt: "",
                content: "",
                image_url: "",
                published_at: new Date().toISOString()
            });
        }
    }, [news, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (news) {
                const { error } = await supabase
                    .from("news")
                    .update(formData)
                    .eq("id", news.id);
                if (error) throw error;
                toast.success("Notícia atualizada com sucesso");
            } else {
                const { error } = await supabase
                    .from("news")
                    .insert([formData]);
                if (error) throw error;
                toast.success("Notícia criada com sucesso");
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{news ? "Editar Notícia" : "Nova Notícia"}</DialogTitle>
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
                        <Label htmlFor="excerpt">Resumo (Excerpt)</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="resize-none"
                            rows={3}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image_url">URL da Imagem</Label>
                        <Input
                            id="image_url"
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {news ? "Salvar Alterações" : "Criar Notícia"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewsForm;
