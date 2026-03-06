import { useState, useEffect, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, Upload, X } from "lucide-react";

interface CourseFormProps {
    course?: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CourseForm = ({ course, isOpen, onClose, onSuccess }: CourseFormProps) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        instructor: "",
        hours: 0,
        price: 0,
        category: "Enfermagem Clínica",
        free: false,
        rating: 4.8,
        students: 0,
        image_url: ""
    });

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title || "",
                instructor: course.instructor || "",
                hours: course.hours || 0,
                price: course.price || 0,
                category: course.category || "Enfermagem Clínica",
                free: course.free || false,
                rating: course.rating || 4.8,
                students: course.students || 0,
                image_url: course.image_url || ""
            });
            setPreviewUrl(course.image_url || null);
        } else {
            setFormData({
                title: "",
                instructor: "",
                hours: 0,
                price: 0,
                category: "Enfermagem Clínica",
                free: false,
                rating: 4.8,
                students: 0,
                image_url: ""
            });
            setPreviewUrl(null);
        }
    }, [course, isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('course-covers')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('course-covers')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            toast.success("Imagem carregada com sucesso");
        } catch (error: any) {
            toast.error("Erro no upload: " + error.message);
            setPreviewUrl(formData.image_url || null);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreviewUrl(null);
        setFormData(prev => ({ ...prev, image_url: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (course) {
                const { error } = await supabase
                    .from("courses")
                    .update(formData)
                    .eq("id", course.id);
                if (error) throw error;
                toast.success("Curso atualizado com sucesso");
            } else {
                const { error } = await supabase
                    .from("courses")
                    .insert([formData]);
                if (error) throw error;
                toast.success("Curso criado com sucesso");
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
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{course ? "Editar Curso" : "Novo Curso"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Imagem de Capa</Label>
                        <div className="flex flex-col items-center gap-4">
                            {previewUrl ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full aspect-video flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                                        <Upload className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium">Clique para enviar</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (Max. 2MB)</p>
                                    </div>
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            {uploading && (
                                <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Enviando imagem...
                                </div>
                            )}
                        </div>
                    </div>

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
                        <Label htmlFor="instructor">Instrutor</Label>
                        <Input
                            id="instructor"
                            value={formData.instructor}
                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hours">Carga Horária (h)</Label>
                            <Input
                                id="hours"
                                type="number"
                                value={formData.hours}
                                onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Preço (R$)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                disabled={formData.free}
                                required={!formData.free}
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
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="free"
                            checked={formData.free}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, free: !!checked, price: checked ? 0 : formData.price })
                            }
                        />
                        <Label htmlFor="free">Curso Gratuito</Label>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || uploading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {course ? "Salvar Alterações" : "Criar Curso"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CourseForm;
