import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Email cadastrado com sucesso!");
      setEmail("");
    }
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl rounded-2xl gradient-hero p-8 text-center md:p-12">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20">
              <Mail className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold text-primary-foreground md:text-3xl">
            Receba novidades por email
          </h2>
          <p className="mb-6 text-primary-foreground/80">
            Cadastre-se e fique por dentro de cursos, notícias e materiais exclusivos.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
            <Input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
              required
            />
            <Button type="submit" variant="hero-outline" size="default">
              Cadastrar
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
