import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogOut, Gamepad2, Upload, ExternalLink, ChevronDown } from "lucide-react";
import { api } from "../../services/api";
import { useGames } from "../../hooks/useGames";

const capasPadrao = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=1000&auto=format&fit=crop"
];

const obterCapaAlternativa = (titulo = "") => {
  const indice = titulo.length % capasPadrao.length;
  return capasPadrao[indice];
};

export function Header({ searchQuery, setSearchQuery, isLoggedIn, setIsLoggedIn, setShowLogin }) {
  const [nomeUsuario, setNomeUsuario] = useState("Logado");
  const [userMatricula, setUserMatricula] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [buscaDebounced, setBuscaDebounced] = useState("");
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("vaporzao_token");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setBuscaDebounced(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { games: resultadosBusca = [], carregando: loadingBusca } = useGames({ busca: buscaDebounced });

  useEffect(() => {
    if (isLoggedIn && token) {
      api.get('/auth/me', { headers: { token } })
        .then(res => {
          const rawName = res.data.nome || res.data.matricula || "Usuário";
          const firstName = rawName.split(' ')[0];
          const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
          
          setNomeUsuario(formattedName);
          if (res.data.matricula) setUserMatricula(res.data.matricula);
        })
        .catch(console.error);
    } else {
      setNomeUsuario("Logado");
      setUserMatricula("");
    }
  }, [isLoggedIn, token]);

  const handleConfirmLogout = () => {
    localStorage.removeItem("vaporzao_token");
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate("/");
  };

  const irParaJogo = (id) => {
    navigate(`/jogo/${id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Vaporzão
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6 mr-auto ml-8">
              <Link to="/" className="text-[13px] font-bold tracking-wide uppercase text-muted-foreground hover:text-white transition-colors">Loja</Link>
              <Link to="/comunidade" className="text-[13px] font-bold tracking-wide uppercase text-muted-foreground hover:text-white transition-colors relative">
                Comunidade
                <span className="absolute -top-1 -right-3 w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse"></span>
              </Link>
              <Link to="/biblioteca" className="text-[13px] font-bold tracking-wide uppercase text-muted-foreground hover:text-white transition-colors">Biblioteca</Link>
            </nav>

            <div className="flex-1 max-w-md hidden lg:block ml-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  placeholder="Buscar jogos..."
                  className="w-full bg-input border border-border rounded-md pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />

                {isSearchOpen && searchQuery.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px]">
                    <div className="bg-muted/50 px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Resultados na Loja</div>
                    <div className="overflow-y-auto flex-1">
                      {loadingBusca ? <div className="p-4 text-sm text-muted-foreground text-center">Buscando...</div> : resultadosBusca.length > 0 ? resultadosBusca.slice(0, 5).map((jogo) => {
                          const capaFinal = jogo.capaUrl || obterCapaAlternativa(jogo.titulo || "");
                          return (
                            <div key={jogo.id} onClick={() => irParaJogo(jogo.id)} className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors border-b border-border/30 last:border-0">
                              <img src={capaFinal} alt={jogo.titulo} className="w-9 h-12 object-cover rounded opacity-90" />
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-foreground">{jogo.titulo}</h4>
                                <span className="text-xs text-muted-foreground line-clamp-1">{jogo.desenvolvedora || "Vaporzão"}</span>
                              </div>
                              <ExternalLink className="w-4 h-4 text-muted-foreground/50" />
                            </div>
                          );
                        }) : <div className="p-4 text-sm text-muted-foreground text-center">Nenhum resultado encontrado.</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pl-4">
              {isLoggedIn ? (
                <>
                  <Link to="/wishlist" className="text-[13px] font-bold tracking-wide uppercase text-muted-foreground hover:text-white transition-colors">
                    Lista de desejos
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center gap-2 text-[13px] text-primary font-bold px-4 py-2 rounded-full border transition-all ${isDropdownOpen ? "bg-primary/20 border-primary/50" : "bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/40"}`}
                    >
                      <User className="w-3.5 h-3.5" /> {nomeUsuario} <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link to={userMatricula ? `/perfil/${userMatricula}` : "#"} onClick={() => setIsDropdownOpen(false)} className="px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors">
                          <User className="w-4 h-4" /> Meu Perfil
                        </Link>
                        <Link to="/publicar" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2.5 text-sm text-zinc-300 hover:text-[#00ff9d] hover:bg-white/5 flex items-center gap-3 transition-colors">
                          <Upload className="w-4 h-4" /> Publicar Jogo
                        </Link>
                        <div className="h-px bg-border my-1 mx-2" />
                        <button onClick={() => { setIsDropdownOpen(false); setShowLogoutModal(true); }} className="px-4 py-2.5 text-sm text-red-400 hover:text-red-500 hover:bg-red-500/10 flex items-center gap-3 text-left transition-colors w-full">
                          <LogOut className="w-4 h-4" /> Sair
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button onClick={() => setShowLogin(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2">
                  <User className="w-4 h-4" /> Iniciar Sessão
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-foreground mb-2">Sair da conta?</h3>
            <p className="text-sm text-muted-foreground mb-6">Tem certeza que deseja sair?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 rounded-md text-sm font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">Cancelar</button>
              <button onClick={handleConfirmLogout} className="px-4 py-2 rounded-md text-sm font-bold bg-red-500 hover:bg-red-600 text-white transition-colors">Sair</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}