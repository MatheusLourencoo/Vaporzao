import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogOut, Gamepad2, Upload } from "lucide-react";
import { api } from "../services/api";

export function Header({ 
  searchQuery, 
  setSearchQuery, 
  isLoggedIn, 
  setIsLoggedIn, 
  setShowLogin 
}) {
  const [nomeUsuario, setNomeUsuario] = useState("Logado");
  const navigate = useNavigate();
  const token = localStorage.getItem("vaporzao_token");

  useEffect(() => {
    if (isLoggedIn && token) {
      api.get('/auth/me', { headers: { token } })
        .then(res => {
          const rawName = res.data.nome || res.data.matricula || "Usuário";
          const firstName = rawName.split(' ')[0];
          const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
          setNomeUsuario(formattedName);
        })
        .catch(console.error);
    } else {
      setNomeUsuario("Logado");
    }
  }, [isLoggedIn, token]);

  const handleLogout = () => {
    localStorage.removeItem("vaporzao_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Gamepad2 className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Vaporzão
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-5 mr-auto ml-6">
            <Link to="/" className="text-[13px] font-bold tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors">Loja</Link>
            <Link to="/biblioteca" className="text-[13px] font-bold tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors">Biblioteca</Link>
            <Link to="/wishlist" className="text-[13px] font-bold tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link>
            <Link to="/publicar" className="text-[13px] font-bold tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Publicar Jogo
            </Link>
          </nav>

          <div className="flex-1 max-w-md hidden lg:block ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar jogos..."
                className="w-full bg-input border border-border rounded-md pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:flex items-center gap-1.5 text-[13px] text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                  <User className="w-3.5 h-3.5" /> {nomeUsuario}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-red-500"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Iniciar Sessão
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}