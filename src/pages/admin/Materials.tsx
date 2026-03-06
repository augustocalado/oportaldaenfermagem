import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Loader2,
    FileText,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import MaterialForm from "@/components/admin/MaterialForm";

const AdminMaterials = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: materials, isLoading } = useQuery({
        queryKey: ["admin-materials"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("materials")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("materials").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-materials"] });
            toast.success("Material excluído com sucesso");
        },
        onError: (error: any) => {
            toast.error("Erro ao excluir material: " + error.message);
        },
    });

    const handleEdit = (item: any) => {
        setSelectedMaterial(item);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedMaterial(null);
        setIsFormOpen(true);
    };

    const filteredMaterials = materials?.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar materiais..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button className="gap-2" onClick={handleAdd}>
                    <Plus className="h-4 w-4" /> Novo Material
                </Button>
            </div>

            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Tamanho</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredMaterials?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Nenhum material encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMaterials?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {item.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2" onClick={() => handleEdit(item)}>
                                                    <Edit className="h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2" asChild>
                                                    <a href={item.download_url} target="_blank" rel="noreferrer">
                                                        <Download className="h-4 w-4" /> Download
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive"
                                                    onClick={() => {
                                                        if (confirm("Tem certeza que deseja excluir este material?")) {
                                                            deleteMutation.mutate(item.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminMaterials;
