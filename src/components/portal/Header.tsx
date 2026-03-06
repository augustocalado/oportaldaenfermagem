import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Shield, User as UserIcon, BookOpen, ChevronDown, Award } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileDialog } from "./ProfileDialog";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Cursos", href: "/cursos", isPage: true },
  { label: "Notícias", href: "/#noticias" },
  { label: "Área do Aluno", href: "/meus-cursos", isPage: true },
  { label: "Sobre", href: "/sobre", isPage: true },
  { label: "Contato", href: "/contato", isPage: true },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/"; // Force a full reload to clear all states
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            O Portal da <span className="text-primary">Enfermagem</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            item.isPage ? (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </a>
            )
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-4 hover:bg-accent/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-medium text-foreground">
                      {(profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "").split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {profile?.profession || (isAdmin ? "Administrador" : "Profissional")}
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Minha Conta</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="w-full flex items-center cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/meus-cursos" className="w-full flex items-center cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Meus Cursos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/certificados" className="w-full flex items-center cursor-pointer">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Certificados</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/configuracoes" className="w-full flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center cursor-pointer w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Painel Administrativo</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/cadastro">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <nav className="container flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                item.isPage ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </a>
                )
              ))}
              <div className="mt-2 flex gap-2">
                {user ? (
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center gap-3 px-3 py-2 border rounded-md">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {(profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "").split(" ")[0]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {profile?.profession || (isAdmin ? "Administrador" : "Profissional")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                        <Link to="/perfil">
                          <UserIcon className="mr-2 h-4 w-4" /> Meu Perfil
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                        <Link to="/meus-cursos">
                          <BookOpen className="mr-2 h-4 w-4" /> Meus Cursos
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                        <Link to="/certificados">
                          <Award className="mr-2 h-4 w-4" /> Certificados
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                        <Link to="/configuracoes">
                          <Settings className="mr-2 h-4 w-4" /> Configurações
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" /> Sair
                      </Button>
                    </div>
                    {isAdmin && (
                      <Button asChild size="sm" className="w-full">
                        <Link to="/admin" onClick={() => setMobileOpen(false)}>
                          <Shield className="mr-2 h-4 w-4" /> Painel Admin
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link to="/cadastro">Cadastrar</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
}
