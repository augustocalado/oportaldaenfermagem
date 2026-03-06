import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Star,
    Loader2
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
import CourseForm from "@/components/admin/CourseForm";

const AdminCourses = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: courses, isLoading } = useQuery({
        queryKey: ["admin-courses"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("courses").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Curso excluído com sucesso");
        },
        onError: (error: any) => {
            toast.error("Erro ao excluir curso: " + error.message);
        },
    });

    const handleEdit = (course: any) => {
        setSelectedCourse(course);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedCourse(null);
        setIsFormOpen(true);
    };

    const filteredCourses = courses?.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar cursos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button className="gap-2" onClick={handleAdd}>
                    <Plus className="h-4 w-4" /> Novo Curso
                </Button>
            </div>

            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Capa</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Instrutor</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredCourses?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Nenhum curso encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCourses?.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>
                                        <div className="h-10 w-16 rounded overflow-hidden bg-muted border border-border">
                                            {course.image_url ? (
                                                <img src={course.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Star className="h-4 w-4 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {course.title}
                                            {course.free && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
                                        </div>
                                    </TableCell>
                                    <TableCell>{course.instructor}</TableCell>
                                    <TableCell>{course.category}</TableCell>
                                    <TableCell>{course.free ? "Grátis" : `R$ ${course.price}`}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                            Ativo
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2" onClick={() => handleEdit(course)}>
                                                    <Edit className="h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive"
                                                    onClick={() => {
                                                        if (confirm("Tem certeza que deseja excluir este curso?")) {
                                                            deleteMutation.mutate(course.id);
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
            <CourseForm
                course={selectedCourse}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-courses"] })}
            />
        </div>
    );
};

export default AdminCourses;
