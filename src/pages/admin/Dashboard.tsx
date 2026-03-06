import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    Newspaper,
    FileText,
    TrendingUp,
    Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const [courses, news, materials, profiles] = await Promise.all([
                supabase.from("courses").select("id", { count: "exact" }),
                supabase.from("news").select("id", { count: "exact" }),
                supabase.from("materials").select("id", { count: "exact" }),
                supabase.from("profiles").select("id", { count: "exact" }),
            ]);

            return {
                courses: courses.count || 0,
                news: news.count || 0,
                materials: materials.count || 0,
                users: profiles.count || 0,
            };
        },
    });

    const cards = [
        { title: "Total de Usuários", value: stats?.users || 0, icon: Users, color: "text-blue-500" },
        { title: "Cursos Ativos", value: stats?.courses || 0, icon: BookOpen, color: "text-green-500" },
        { title: "Notícias", value: stats?.news || 0, icon: Newspaper, color: "text-purple-500" },
        { title: "Materiais", value: stats?.materials || 0, icon: FileText, color: "text-orange-500" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-muted-foreground mb-4">Visão Geral</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoading ? "..." : card.value}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +0% desde o mês passado
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Sistema atualizado</p>
                                        <p className="text-xs text-muted-foreground">Há {i * 2} horas</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-48">
                        <TrendingUp className="h-16 w-16 text-muted/30" />
                        <p className="absolute text-sm text-muted-foreground">Gráfico em breve</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
