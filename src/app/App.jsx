import { useState } from "react";
import {
  Gamepad2, Search, Library, Heart, User,
  Star, Clock, TrendingUp, Filter, Eye, Plus, Upload, LogOut
} from "lucide-react";
import { GENEROS, MOCK_LIBRARY, MOCK_WISHLIST } from "../data/mockData"; 
import { useGames } from "../hooks/useGames";
import { GameCard } from "./components/GameCard";
import { GameDetailsModal } from "./components/GameDetailsModal";
import { LoginModal } from "./components/LoginModal";
import PublicarJogo  from './components/PublicarJogo';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [activeTab, setActiveTab] = useState("recentes");
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState("popularidade");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleGenero = (genero) => {
    setSelectedGeneros((prev) =>
      prev.includes(genero) ? prev.filter((g) => g !== genero) : [...prev, genero]
    );
  };

  // Aqui é onde os jogos reais da API entram!
  const { games: filteredGames = [], carregando } = useGames({
    generos: selectedGeneros,
    ordenarPor,
    busca: searchQuery
  });

  // Pegamos o primeiro jogo da API para ser o destaque do Banner
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
              <button onClick={() => setCurrentView("biblioteca")} className="p-2 hover:bg-muted rounded-md transition-colors">
                <Library className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentView("wishlist")} className="p-2 hover:bg-muted rounded-md transition-colors">
                <Heart className="w-5 h-5" />
              </button>
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
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === "home" && (
          <>
            {/* O Banner só aparece se a API trouxer algum jogo */}
            {jogoDestaque && (
              <section className="mb-12">
                <div className="relative rounded-xl overflow-hidden h-[500px]">
                  <img
                    src={jogoDestaque.capaUrl || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f"}
                    alt={jogoDestaque.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex items-center">
                    <div className="p-12 max-w-2xl">
                      <h1 className="text-5xl font-bold mb-4">{jogoDestaque.titulo}</h1>
                      <p className="text-xl text-gray-300 mb-4">{jogoDestaque.descricao}</p>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Star className="w-6 h-6 fill-primary text-primary" />
                          <span className="text-2xl font-bold">{jogoDestaque.nota || 0}</span>
                        </div>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-300">{jogoDestaque.avaliacoes || 0} avaliações</span>
                      </div>

                      <div className="flex gap-3 mb-6">
                        <button
                          onClick={() => setSelectedGame(jogoDestaque)}
                          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-md font-bold text-lg transition-all flex items-center gap-2"
                        >
                          <Eye className="w-5 h-5" />
                          Ver Detalhes
                        </button>
                        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-bold text-lg transition-all flex items-center gap-2">
                          <Plus className="w-5 h-5" />
                          Adicionar à Biblioteca
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-primary">
                          R$ {Number(jogoDestaque.preco).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Destaques puxando direto da API */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Destaques</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.slice(0, 6).map((game) => (
                  <GameCard key={game.id} game={game} onViewDetails={() => setSelectedGame(game)} />
                ))}
              </div>
            </section>

            {/* Todos os Jogos (API) */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Todos os Jogos</h2>

              <div className="flex gap-6">
                <div className="w-64 shrink-0 hidden lg:block">
                  <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filtros
                    </h3>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Gêneros</h4>
                      <div className="space-y-2">
                        {GENEROS.map((genero) => (
                          <label key={genero} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedGeneros.includes(genero)}
                              onChange={() => toggleGenero(genero)}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm">{genero}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Ordenar por</h4>
                      <select
                        value={ordenarPor}
                        onChange={(e) => setOrdenarPor(e.target.value)}
                        className="w-full bg-input border border-border rounded-md p-2 text-foreground"
                      >
                        <option value="popularidade">Popularidade</option>
                        <option value="lancamento">Lançamento</option>
                        <option value="preco">Preço</option>
                        <option value="titulo">Título</option>
                        <option value="nota">Avaliação</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  {carregando ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">Carregando jogos do servidor...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredGames.map((game) => (
                          <GameCard key={game.id} game={game} onViewDetails={() => setSelectedGame(game)} />
                        ))}
                      </div>

                      {filteredGames.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground text-lg">
                            Nenhum jogo encontrado com os filtros selecionados.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === "biblioteca" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Minha Biblioteca</h2>
            {/* Temporário usando mock até integrarmos a rota da biblioteca */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_LIBRARY.map(({ game, horasJogadas }) => (
                <div key={game.id} className="bg-card rounded-lg overflow-hidden border border-border">
                  <img src={game.capaUrl} alt={game.titulo} className="w-full aspect-[16/9] object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{game.titulo}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{horasJogadas} horas jogadas</span>
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-md font-bold mt-3 transition-all">
                      Jogar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentView === "wishlist" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Minha Wishlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_WISHLIST.map((game) => (
                <GameCard key={game.id} game={game} onViewDetails={() => setSelectedGame(game)} />
              ))}
            </div>
          </section>
        )}

        {currentView === "publicar" && (
          <PublicarJogo
            isLoggedIn={isLoggedIn}
            onRequestLogin={() => setShowLogin(true)}
          />
        )}
      </main>

      <footer className="bg-card border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2026 Vaporzão - A melhor loja de jogos 🇧🇷</p>
        </div>
      </footer>

      {selectedGame && <GameDetailsModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => { setIsLoggedIn(true); setShowLogin(false); }}
        />
      )}
    </div>
  );
}