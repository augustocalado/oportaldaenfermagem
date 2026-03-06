import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { SEO } from "@/components/portal/SEO";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Privacy = () => {
    const { data: settings } = useQuery({
        queryKey: ["site-settings-privacy"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*");
            if (error) return null;
            const map: Record<string, string> = {};
            data.forEach(s => map[s.key] = s.value);
            return map;
        }
    });

    return (
        <div className="min-h-screen bg-background">
            <SEO title="Política de Privacidade" />
            <Header />
            <main className="py-20">
                <div className="container max-w-4xl">
                    <Breadcrumbs items={[{ label: "Privacidade" }]} />
                    <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
                    <div className="prose prose-blue max-w-none dark:prose-invert">
                        <p className="text-lg text-muted-foreground mb-6">
                            Sua privacidade é importante para nós. É política do Portal Enfermagem Brilhante respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site.
                        </p>

                        <div className="bg-muted/50 p-6 rounded-xl border border-border mb-8">
                            <h2 className="text-xl font-bold mb-4">Informações LGPD</h2>
                            <p className="whitespace-pre-wrap">
                                {settings?.lgpd_text || "Estamos adequando nossos serviços às diretrizes da Lei Geral de Proteção de Dados (LGPD). Seus dados estão seguros conosco."}
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold mt-8 mb-4">1. Coleta de Informações</h2>
                        <p>Coletamos informações quando você se cadastra em nosso site, faz login na sua conta, realiza uma compra ou se inscreve em nossa newsletter.</p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso das Informações</h2>
                        <p>Qualquer informação que coletamos de você pode ser usada para personalizar sua experiência, melhorar o nosso site, melhorar o serviço ao cliente e processar transações.</p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">3. Proteção de Dados</h2>
                        <p>Implementamos uma série de medidas de segurança para manter a segurança de suas informações pessoais.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Privacy;
