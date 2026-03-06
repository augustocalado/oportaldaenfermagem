import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const LGPDNotice = () => {
    const [accepted, setAccepted] = useState(true); // Default to true so it doesn't flicker
    const [visible, setVisible] = useState(false);

    const { data: settings } = useQuery({
        queryKey: ["site-settings"],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("site_settings")
                .select("*");
            if (error) throw error;
            return data as any[];
        },
    });

    const lgpdText = (settings as any[])?.find(s => s.key === "lgpd_text")?.value ||
        "Nós utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa política de privacidade.";

    useEffect(() => {
        const hasAccepted = localStorage.getItem("lgpd_accepted");
        if (!hasAccepted) {
            setAccepted(false);
            // Show after a short delay
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("lgpd_accepted", "true");
        setVisible(false);
        setTimeout(() => setAccepted(true), 500);
    };

    if (accepted && !visible) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-8 md:max-w-md"
                >
                    <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        <div className="flex gap-4 items-start">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-bold text-foreground">Aviso de Privacidade</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {lgpdText}
                                </p>
                                <div className="flex items-center gap-3 pt-1">
                                    <Button size="sm" onClick={handleAccept} className="px-6">
                                        Entendi e Aceito
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setVisible(false)}>
                                        Depois
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
