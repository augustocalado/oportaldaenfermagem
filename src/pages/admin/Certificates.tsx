import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Award, User, BookOpen, Calendar, Search, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const AdminCertificates = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: certificates, isLoading } = useQuery({
        queryKey: ["admin-certificates"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("certificates")
                .select(`
                    *,
                    profiles:user_id (full_name, email),
                    courses:course_id (title)
                `)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("certificates")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
            toast.success("Certificado removido com sucesso.");
        },
        onError: (error: any) => {
            toast.error("Erro ao remover certificado: " + error.message);
        }
    });

    const filtered = certificates?.filter((cert: any) => {
        const userName = cert.profiles?.full_name?.toLowerCase() || "";
        const userEmail = cert.profiles?.email?.toLowerCase() || "";
        const courseTitle = cert.courses?.title?.toLowerCase() || "";
        const code = cert.certificate_code?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        return userName.includes(search) || userEmail.includes(search) || courseTitle.includes(search) || code.includes(search);
    });

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestão de Certificados</h1>
                    <p className="text-sm text-muted-foreground">Visualize e gerencie todos os certificados emitidos pelo portal.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="font-medium">Total: {certificates?.length || 0}</span>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar por aluno, curso ou código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                />
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Data de Emissão</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="h-8 w-8 opacity-20" />
                                        <p>Nenhum certificado encontrado.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered?.map((cert: any) => (
                                <TableRow key={cert.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground leading-tight">
                                                    {cert.profiles?.full_name || "Sem Nome"}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {cert.profiles?.email || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm font-medium">{cert.courses?.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
                                            {cert.certificate_code}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(cert.issue_date).toLocaleDateString('pt-BR')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                title="Ver Certificado"
                                                asChild
                                            >
                                                <a href={`/certificados/${cert.course_id}`} target="_blank" rel="noreferrer">
                                                    <FileText className="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => {
                                                    if (window.confirm(`Excluir certificado de ${cert.profiles?.full_name}?`)) {
                                                        deleteMutation.mutate(cert.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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

export default AdminCertificates;
