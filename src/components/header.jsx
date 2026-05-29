import { Gamepad2, Search, Upload, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function Header({ 
  searchQuery, 
  setSearchQuery, 
  isLoggedIn, 
  setIsLoggedIn, 
  setShowLogin 
}) {
  const navigate = useNavigate();

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

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="font-semibold text-muted-foreground hover:text-foreground transition-colors">Loja</Link>
            <Link to="/biblioteca" className="font-semibold text-muted-foreground hover:text-foreground transition-colors">Biblioteca</Link>
            <Link to="/wishlist" className="font-semibold text-muted-foreground hover:text-foreground transition-colors">Wishlist</Link>
            <Link to="/publicar" className="font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Publicar Jogo
            </Link>
          </nav>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar jogos..."
                className="w-full bg-input border border-border rounded-md pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:flex items-center gap-1.5 text-sm text-primary font-semibold bg-primary/10 px-3 py-1.5 rounded-full">
                  <User className="w-3.5 h-3.5" /> Logado
                </span>
                <button
                  onClick={() => { setIsLoggedIn(false); localStorage.removeItem("vaporzao_token"); }}
                  className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                iniciar sessão
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}