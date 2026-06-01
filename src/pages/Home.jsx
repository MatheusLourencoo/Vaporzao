import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Banner } from "../components/Banner";
import { GameCard } from "../components/GameCard";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useGames } from "../hooks/useGames";

export function Home({ 
  searchQuery, 
  adicionarNaBiblioteca, 
  adicionarNaWishlist 
}) {
  const navigate = useNavigate(); 
  
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [listaGeneros, setListaGeneros] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState("popularidade");
  
  // Debounce
  const [buscaDebounced, setBuscaDebounced] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscaDebounced(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    api.get('/generos')
      .then((r) => setListaGeneros(r.data))
      .catch(console.error);
  }, []);

  const toggleGenero = (g) => {
    setSelectedGeneros(prev => prev.includes(g) ? prev.filter(i => i !== g) : [...prev, g]);
  };

  const { games = [], carregando } = useGames({ 
    generos: selectedGeneros,
    ordenarPor,
    busca: buscaDebounced // busca com delay para a API
  });

  const jogosGratuitos = games.filter(game => Number(game.preco) === 0);

  return (
    <>
      <Banner jogos={games} onVerDetalhes={(game) => navigate(`/jogo/${game.id}`)} />

      {jogosGratuitos.length > 0 && (
        <section className="mt-12 bg-zinc-900/30 p-8 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-white">Jogos gratuitos</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {jogosGratuitos.slice(0, 5).map((game) => {
              const descontoFake = 100; 
              const precoOriginalFake = (Math.random() * (200 - 50) + 50).toFixed(2);
              
              return (
                <div key={game.id} className="cursor-pointer group" onClick={() => navigate(`/jogo/${game.id}`)}>
                  <GameCard game={game} />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{descontoFake}%
                    </span>
                    <span className="text-zinc-500 line-through text-sm">R$ {precoOriginalFake}</span>
                    <span className="text-white font-bold text-sm">GRÁTIS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Catálogo Completo</h2>
        <div className="flex gap-6">
          <div className="w-64 shrink-0 hidden lg:block">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filtros
              </h3>
              <div className="space-y-2">
                {listaGeneros.map((genero) => (
                  <label key={genero.id} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedGeneros.includes(genero.nome)}
                      onChange={() => toggleGenero(genero.nome)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>{genero.nome}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {carregando ? (
              <div className="text-center py-12 text-muted-foreground">Buscando na API...</div>
            ) : games.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
                 Nenhum jogo encontrado.
               </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onViewDetails={() => navigate(`/jogo/${game.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}