import { useState, useEffect } from "react";
import { Filter, Search, ChevronDown, Check } from "lucide-react";
import { Banner } from "../components/Banner";
import { GameCard } from "../components/GameCard";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useGames } from "../hooks/useGames";

// Função para remover acentos e deixar tudo  maiúsculas e minúsculas
const normalizarBusca = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase(); 
};

export function Home({ 
  searchQuery, 
  adicionarNaBiblioteca, 
  adicionarNaWishlist 
}) {
  const navigate = useNavigate(); 
  
  const [listaGeneros, setListaGeneros] = useState([]);
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [filtroPreco, setFiltroPreco] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState("recentes");
  const [filtroPalavraChave, setFiltroPalavraChave] = useState("");
  const [isPrecoOpen, setIsPrecoOpen] = useState(false);
  const [isGeneroOpen, setIsGeneroOpen] = useState(true);
  const [isOrdemOpen, setIsOrdemOpen] = useState(false);
  const [topAvaliados, setTopAvaliados] = useState([]);
  const [itensVisiveis, setItensVisiveis] = useState(15);
  const { games = [], carregando } = useGames({ generos: selectedGeneros });

  useEffect(() => {
    api.get('/generos')
      .then((r) => {
        const generosOrdenados = r.data.sort((a, b) => a.nome.localeCompare(b.nome));
        setListaGeneros(generosOrdenados);
      })
      .catch(console.error);

    api.get('/jogos/destaques')
      .then((r) => {
        if (r.data && r.data.topAvaliados) {
          setTopAvaliados(r.data.topAvaliados.slice(0, 6));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setItensVisiveis(15);
  }, [selectedGeneros, filtroPreco, ordenarPor, filtroPalavraChave]);

  const toggleGenero = (g) => {
    setSelectedGeneros(prev => prev.includes(g) ? prev.filter(i => i !== g) : [...prev, g]);
  };

  const togglePreco = (p) => {
    setFiltroPreco(prev => prev.includes(p) ? prev.filter(i => i !== p) : [...prev, p]);
  };

  const limparFiltros = () => {
    setSelectedGeneros([]);
    setFiltroPreco([]);
    setFiltroPalavraChave("");
    setOrdenarPor("recentes");
  };

  const qtdFiltrosAtivos = selectedGeneros.length + filtroPreco.length;

  const jogosRecentes = [...games].sort((a, b) => {
    const dataA = new Date(a.createdAt || a.created_at || a.dataCriacao || a.data_criacao || 0).getTime();
    const dataB = new Date(b.createdAt || b.created_at || b.dataCriacao || b.data_criacao || 0).getTime();
    return dataB - dataA || b.id - a.id;
  }).slice(0, 6);

  let jogosExibidos = [...games];
  
  // Normaliza o texto digitado pelo usuário antes de comparar
  const buscaNormalizada = normalizarBusca(filtroPalavraChave);

  if (buscaNormalizada !== "") {
    jogosExibidos = jogosExibidos.filter(jogo => 
      normalizarBusca(jogo.titulo).includes(buscaNormalizada)
    );
  }

  if (filtroPreco.includes("gratis") && !filtroPreco.includes("pago")) {
    jogosExibidos = jogosExibidos.filter(g => Number(g.preco) === 0);
  } else if (filtroPreco.includes("pago") && !filtroPreco.includes("gratis")) {
    jogosExibidos = jogosExibidos.filter(g => Number(g.preco) > 0);
  }

  if (ordenarPor === "az") {
    jogosExibidos.sort((a, b) => a.titulo.localeCompare(b.titulo));
  } else if (ordenarPor === "za") {
    jogosExibidos.sort((a, b) => b.titulo.localeCompare(a.titulo));
  } else if (ordenarPor === "recentes") {
    jogosExibidos.sort((a, b) => {
      const dataA = new Date(a.createdAt || a.created_at || a.dataCriacao || 0).getTime();
      const dataB = new Date(b.createdAt || b.created_at || b.dataCriacao || 0).getTime();
      return dataB - dataA || b.id - a.id;
    });
  }

  // Normaliza a busca também na barra lateral de Gêneros
  const generosFiltrados = listaGeneros.filter(g => 
    normalizarBusca(g.nome).includes(buscaNormalizada)
  );

  const jogosPaginados = jogosExibidos.slice(0, itensVisiveis);

  return (
    <>
      <Banner jogos={games} onVerDetalhes={(game) => navigate(`/jogo/${game.id}`)} />

      {jogosRecentes.length > 0 && (
        <section className="mt-12 bg-zinc-900/30 p-8 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-white">Adicionados Recentemente</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {jogosRecentes.map((game) => (
              <div key={game.id} className="cursor-pointer group" onClick={() => navigate(`/jogo/${game.id}`)}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </section>
      )}

      {topAvaliados.length > 0 && (
        <section className="mt-12 bg-zinc-900/30 p-8 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-white">Top Avaliados</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {topAvaliados.map((game) => (
              <div key={game.id} className="cursor-pointer group" onClick={() => navigate(`/jogo/${game.id}`)}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Catálogo Completo</h2>
        <div className="flex gap-8">
          <div className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-zinc-100">Filtros {qtdFiltrosAtivos > 0 && <span>({qtdFiltrosAtivos})</span>}</h3>
                {(qtdFiltrosAtivos > 0 || ordenarPor !== "recentes") && (
                  <button onClick={limparFiltros} className="text-xs font-medium text-primary hover:underline">Redefinir</button>
                )}
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Palavras-chave"
                  value={filtroPalavraChave}
                  onChange={(e) => setFiltroPalavraChave(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-transparent rounded-md pl-9 pr-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="border-b border-white/10">
                <button onClick={() => setIsPrecoOpen(!isPrecoOpen)} className="flex items-center justify-between w-full py-4 text-zinc-200 hover:text-white font-bold text-sm">
                  Preço <ChevronDown className={`w-4 h-4 transition-transform ${isPrecoOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPrecoOpen && (
                  <div className="space-y-2 pb-4">
                    {['gratis', 'pago'].map(p => (
                      <label key={p} className="flex items-center gap-3 cursor-pointer group py-1">
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${filtroPreco.includes(p) ? 'bg-primary border-primary' : 'border border-zinc-600'}`}>
                          {filtroPreco.includes(p) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={filtroPreco.includes(p)} onChange={() => togglePreco(p)} />
                        <span className="text-sm text-zinc-400 capitalize">{p}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b border-white/10">
                <button onClick={() => setIsGeneroOpen(!isGeneroOpen)} className="flex items-center justify-between w-full py-4 text-zinc-200 hover:text-white font-bold text-sm">
                  Gênero <ChevronDown className={`w-4 h-4 transition-transform ${isGeneroOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGeneroOpen && (
                  <div className="space-y-2 pb-4 max-h-[40vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-700">
                    {generosFiltrados.map(g => (
                      <label key={g.id} className="flex items-center gap-3 cursor-pointer py-1">
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${selectedGeneros.includes(g.nome) ? 'bg-primary border-primary' : 'border border-zinc-600'}`}>
                          {selectedGeneros.includes(g.nome) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedGeneros.includes(g.nome)} onChange={() => toggleGenero(g.nome)} />
                        <span className="text-sm text-zinc-400">{g.nome}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b border-white/10">
                <button onClick={() => setIsOrdemOpen(!isOrdemOpen)} className="flex items-center justify-between w-full py-4 text-zinc-200 hover:text-white font-bold text-sm">
                  Ordenar Por <ChevronDown className={`w-4 h-4 transition-transform ${isOrdemOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOrdemOpen && (
                  <div className="space-y-2 pb-4">
                    {[{id: 'recentes', n: 'Mais Recentes'}, {id: 'az', n: 'A-Z'}, {id: 'za', n: 'Z-A'}].map(o => (
                      <label key={o.id} className="flex items-center gap-3 cursor-pointer py-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${ordenarPor === o.id ? 'border-2 border-primary' : 'border border-zinc-600'}`}>
                          {ordenarPor === o.id && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        <input type="radio" className="hidden" checked={ordenarPor === o.id} onChange={() => setOrdenarPor(o.id)} />
                        <span className="text-sm text-zinc-400">{o.n}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 pb-16">
            {carregando ? (
              <div className="text-center py-12 text-zinc-400">Carregando catálogo...</div>
            ) : jogosExibidos.length === 0 ? (
               <div className="text-center py-12 text-zinc-400 bg-zinc-900/30 rounded-xl border border-white/5">Nenhum jogo encontrado.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                  {jogosPaginados.map((game) => <GameCard key={game.id} game={game} onViewDetails={() => navigate(`/jogo/${game.id}`)} />)}
                </div>
                
                {itensVisiveis < jogosExibidos.length && (
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={() => setItensVisiveis(prev => prev + 15)}
                      className="flex items-center gap-2 px-8 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/10 text-white font-bold rounded-lg transition-colors"
                    >
                      Carregar mais jogos <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}