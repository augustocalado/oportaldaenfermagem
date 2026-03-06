import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { SEO } from "@/components/portal/SEO";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="Termos de Uso" />
            <Header />
            <main className="py-20">
                <div className="container max-w-4xl">
                    <Breadcrumbs items={[{ label: "Termos de Uso" }]} />
                    <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
                    <div className="prose prose-blue max-w-none dark:prose-invert">
                        <h2 className="text-2xl font-bold mt-8 mb-4">1. Termos</h2>
                        <p>Ao acessar este site, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso de Licença</h2>
                        <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Portal Enfermagem Brilhante, apenas para visualização transitória pessoal e não comercial.</p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">3. Isenção de Responsabilidade</h2>
                        <p>Os materiais no site são fornecidos 'como estão'. O Portal Enfermagem Brilhante não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias.</p>

                        <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitações</h2>
                        <p>Em nenhum caso o Portal Enfermagem Brilhante será responsável por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais no site.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Terms;
