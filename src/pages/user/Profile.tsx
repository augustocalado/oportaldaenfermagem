import { UserLayout } from "@/components/portal/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Calendar, MapPin, Briefcase, Camera, Edit2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
    const { user, profile } = useAuth();

    const { data: stats } = useQuery({
        queryKey: ["user-stats", user?.id],
        enabled: !!user,
        queryFn: async () => {
            const { data: enrollments } = await supabase
                .from("course_enrollments")
                .select("*")
                .eq("user_id", user?.id);

            const total = enrollments?.length || 0;
            const completed = enrollments?.filter(e => e.completed).length || 0;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return { total, completed, progress };
        }
    });

    return (
        <UserLayout
            title="Meu Perfil"
            description="Visualize suas informações públicas e seu progresso acadêmico."
        >
            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1 border-primary/10 shadow-sm overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-primary/80 to-primary/40" />
                    <CardContent className="relative pt-0 px-6 pb-8">
                        <div className="flex flex-col items-center -translate-y-12">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center text-primary overflow-hidden">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name || ""} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-3 w-3" />
                                </button>
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-foreground">{profile?.full_name || "Aluno Brilhante"}</h2>
                            <p className="text-sm text-muted-foreground font-medium">{profile?.profession || "Profissional de Saúde"}</p>
                            <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                Aluno
                            </Badge>
                        </div>

                        <div className="space-y-4 -mt-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-muted/30">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-muted/30">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>Membro desde {new Date(profile?.created_at || user?.created_at || "").toLocaleDateString('pt-BR')}</span>
                            </div>
                            {profile?.city && (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-muted/30">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{profile.city}, {profile.state}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* Stats */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Progresso Acadêmico</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-center">
                                    <p className="text-2xl font-bold text-primary">{stats?.total || 0}</p>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Cursos Inscritos</p>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-center">
                                    <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Cursos Concluídos</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-foreground">Progresso Geral</span>
                                    <span className="font-bold text-primary">{stats?.progress || 0}%</span>
                                </div>
                                <Progress value={stats?.progress} className="h-2 bg-muted transition-all" />
                                <p className="text-xs text-muted-foreground">Você concluiu {stats?.completed || 0} de {stats?.total || 0} cursos matriculados.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bio or About */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Sobre Mim / Biografia</CardTitle>
                                <CardDescription>Um breve resumo profissional (opcional)</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground italic bg-muted/20 p-4 rounded-lg border border-dashed text-center">
                                Compartilhe um pouco sobre sua trajetória na enfermagem e seus objetivos profissionais.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
};

export default Profile;
