import { useState, useEffect } from "react";
import {
  Gamepad2, Search, Library, Heart, User,
  Star, Clock, TrendingUp, Filter, Eye, Plus, Upload, LogOut
} from "lucide-react";
import { useGames } from "./hooks/useGames";
import { GameCard } from "./components/GameCard";
import { GameDetailsModal } from "./components/GameDetailsModal";
import { LoginModal } from "./components/LoginModal";
import PublicarJogo from './components/PublicarJogo';
import { Banner } from "./components/Banner";
import { api } from "./services/api";

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [activeTab, setActiveTab] = useState("recentes");
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState("popularidade");
  const [searchQuery, setSearchQuery] = useState("");
  const [listaGeneros, setListaGeneros] = useState([]); 

  useEffect(() => {
    api.get('/generos')
      .then((resposta) => {
        setListaGeneros(resposta.data);
      })
      .catch((erro) => console.error("Erro ao carregar gêneros:", erro));
  }, []);

  const toggleGenero = (generoNome) => {
    setSelectedGeneros((prev) =>
      prev.includes(generoNome) ? prev.filter((g) => g !== generoNome) : [...prev, generoNome]
    );
  };

  const { games: filteredGames = [], carregando } = useGames({
    generos: selectedGeneros,
    ordenarPor,
    busca: searchQuery
  });

  const jogoDestaque = filteredGames.length > 0 ? filteredGames[0] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("home")}>
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Vaporzão
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {["home", "biblioteca", "wishlist"].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`font-semibold transition-colors capitalize ${currentView === view ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {view === "home" ? "Loja" : view === "biblioteca" ? "Biblioteca" : "Wishlist"}
                </button>
              ))}
              <button
                onClick={() => setCurrentView("publicar")}
                className={`font-semibold transition-colors flex items-center gap-1.5 ${currentView === "publicar" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Upload className="w-4 h-4" />
                Publicar Jogo
              </button>
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
                    <User className="w-3.5 h-3.5" />
                    Logado
                  </span>
                  <button
                    onClick={() => { setIsLoggedIn(false); localStorage.removeItem("vaporzao_token"); }}
                    className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                    title="Sair"
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "home" && (
          <>
            <Banner
              jogoDestaque={jogoDestaque}
              onVerDetalhes={() => setSelectedGame(jogoDestaque)}
            />

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Destaques</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.slice(0, 6).map((game) => (
                  <GameCard key={game.id} game={game} onViewDetails={() => setSelectedGame(game)} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6">Todos os Jogos</h2>
              <div className="flex gap-6">
                <div className="w-64 shrink-0 hidden lg:block">
                  <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Filter className="w-5 h-5" /> Filtros
                    </h3>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Gêneros</h4>
                      <div className="space-y-2">
                        {listaGeneros.map((genero) => (
                          <label key={genero.id || genero.nome} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedGeneros.includes(genero.nome)}
                              onChange={() => toggleGenero(genero.nome)}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm">{genero.nome}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  {carregando ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">Carregando...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredGames.map((game) => (
                        <GameCard key={game.id} game={game} onViewDetails={() => setSelectedGame(game)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === "publicar" && <PublicarJogo isLoggedIn={isLoggedIn} onRequestLogin={() => setShowLogin(true)} />}

      </main>

      {selectedGame && <GameDetailsModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={() => { setIsLoggedIn(true); setShowLogin(false); }} />}
    </div>
  );
}