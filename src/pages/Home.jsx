import { useState, useEffect } from "react";
import { Filter, ChevronDown, Check, Tag, Gamepad2, ArrowUpDown } from "lucide-react";
import { Banner } from "../components/common/Banner";
import { GameCard } from "../components/game/GameCard";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useGames } from "../hooks/useGames";

const normalizarBusca = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase(); 
};

const opcoesPreco = [
  { id: 'gratis', label: 'Gratuito' },
  { id: 'ate20', label: 'Até R$ 20,00' },
  { id: 'ate50', label: 'Até R$ 50,00' },
  { id: 'mais50', label: 'Acima de R$ 50,00' }
];

export function Home({ searchQuery }) {
  const navigate = useNavigate(); 
  
  const [listaGeneros, setListaGeneros] = useState([]);
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [filtroPreco, setFiltroPreco] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState("recentes");
  const [isPrecoOpen, setIsPrecoOpen] = useState(true);
  const [isGeneroOpen, setIsGeneroOpen] = useState(true);
  const [isOrdemOpen, setIsOrdemOpen] = useState(true);
  const [topAvaliados, setTopAvaliados] = useState([]);
  const [itensVisiveis, setItensVisiveis] = useState(20);
  
  const { games = [], carregando } = useGames({ generos: selectedGeneros });

  useEffect(() => {
    api.get('/generos')
      .then((r) => {
        if (Array.isArray(r.data)) {
          const generosOrdenados = [...r.data].sort((a, b) => a.nome.localeCompare(b.nome));
          setListaGeneros(generosOrdenados);
        }
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
    setItensVisiveis(20);
  }, [selectedGeneros, filtroPreco, ordenarPor, searchQuery]);

  const toggleGenero = (g) => {
    setSelectedGeneros(prev => prev.includes(g) ? prev.filter(i => i !== g) : [...prev, g]);
  };

  const togglePreco = (pId) => {
    setFiltroPreco(prev => prev.includes(pId) ? prev.filter(i => i !== pId) : [...prev, pId]);
  };

  const limparFiltros = () => {
    setSelectedGeneros([]);
    setFiltroPreco([]);
    setOrdenarPor("recentes");
    setItensVisiveis(20);
  };

  const qtdFiltrosAtivos = selectedGeneros.length + filtroPreco.length;

  const jogosRecentes = [...games].sort((a, b) => {
    const dataA = new Date(a.createdAt || a.created_at || a.dataCriacao || a.data_criacao || 0).getTime();
    const dataB = new Date(b.createdAt || b.created_at || b.dataCriacao || b.data_criacao || 0).getTime();
    return dataB - dataA || b.id - a.id;
  }).slice(0, 6);

  let jogosExibidos = [...games];
  
  const termoDeBuscaFinal = searchQuery || "";
  const buscaNormalizada = normalizarBusca(termoDeBuscaFinal);

  if (buscaNormalizada !== "") {
    jogosExibidos = jogosExibidos.filter(jogo => 
      normalizarBusca(jogo.titulo || "").includes(buscaNormalizada)
    );
  }

  if (filtroPreco.length > 0) {
    jogosExibidos = jogosExibidos.filter(g => {
      const preco = Number(g.preco || 0);
      const isGratis = preco === 0;
      const isAte20 = preco > 0 && preco <= 20;
      const isAte50 = preco > 20 && preco <= 50;
      const isMais50 = preco > 50;

      return (
        (filtroPreco.includes('gratis') && isGratis) ||
        (filtroPreco.includes('ate20') && isAte20) ||
        (filtroPreco.includes('ate50') && isAte50) ||
        (filtroPreco.includes('mais50') && isMais50)
      );
    });
  }

  if (ordenarPor === "az") {
    jogosExibidos.sort((a, b) => (a.titulo || "").localeCompare(b.titulo || ""));
  } else if (ordenarPor === "za") {
    jogosExibidos.sort((a, b) => (b.titulo || "").localeCompare(a.titulo || ""));
  } else if (ordenarPor === "recentes") {
    jogosExibidos.sort((a, b) => {
      const dataA = new Date(a.createdAt || a.created_at || a.dataCriacao || 0).getTime();
      const dataB = new Date(b.createdAt || b.created_at || b.dataCriacao || 0).getTime();
      return dataB - dataA || b.id - a.id;
    });
  } else if (ordenarPor === "menor_preco") {
    jogosExibidos.sort((a, b) => Number(a.preco || 0) - Number(b.preco || 0));
  } else if (ordenarPor === "maior_preco") {
    jogosExibidos.sort((a, b) => Number(b.preco || 0) - Number(a.preco || 0));
  }

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

      <section className="mt-16 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-white">Catálogo Completo</h2>
          <span className="text-zinc-500 font-medium">{jogosExibidos.length} jogos encontrados</span>
        </div>
        
        <div className="flex gap-8 items-start relative">
          
          <div className="w-72 shrink-0 hidden lg:block self-start sticky top-24">
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-xl max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 sticky top-0 bg-[#121212] z-10 pt-2">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#00ff9d]" /> Filtros
                  {qtdFiltrosAtivos > 0 && (
                    <span className="bg-[#00ff9d] text-black text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                      {qtdFiltrosAtivos}
                    </span>
                  )}
                </h3>
                {(qtdFiltrosAtivos > 0 || ordenarPor !== "recentes") && (
                  <button onClick={limparFiltros} className="text-xs font-bold text-[#00ff9d] hover:text-white transition-colors">
                    Limpar
                  </button>
                )}
              </div>

              <div className="space-y-6">
                
                <div>
                  <button onClick={() => setIsOrdemOpen(!isOrdemOpen)} className="flex items-center justify-between w-full text-white font-bold text-sm group mb-4">
                    <span className="flex items-center gap-2"><ArrowUpDown className="w-4 h-4 text-zinc-500 group-hover:text-[#00ff9d] transition-colors" /> Ordenar Por</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOrdemOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOrdemOpen && (
                    <div className="flex flex-col gap-2">
                      {[
                        {id: 'recentes', n: 'Mais Recentes'}, 
                        {id: 'menor_preco', n: 'Menor Preço'}, 
                        {id: 'maior_preco', n: 'Maior Preço'},
                        {id: 'az', n: 'Ordem Alfabética (A-Z)'}, 
                        {id: 'za', n: 'Ordem Alfabética (Z-A)'}
                      ].map(o => (
                        <button 
                          key={o.id}
                          onClick={() => setOrdenarPor(o.id)}
                          className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${ordenarPor === o.id ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20' : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                        >
                          {o.n}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/5 w-full"></div>

                <div>
                  <button onClick={() => setIsPrecoOpen(!isPrecoOpen)} className="flex items-center justify-between w-full text-white font-bold text-sm group mb-4">
                    <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-zinc-500 group-hover:text-[#00ff9d] transition-colors" /> Preço</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isPrecoOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isPrecoOpen && (
                    <div className="space-y-1">
                      {opcoesPreco.map(p => (
                        <label key={p.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors">
                          <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${filtroPreco.includes(p.id) ? 'bg-[#00ff9d] border-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]' : 'bg-zinc-900 border border-zinc-700 group-hover:border-zinc-500'}`}>
                            {filtroPreco.includes(p.id) && <Check className="w-3.5 h-3.5 text-black" strokeWidth={4} />}
                          </div>
                          <input type="checkbox" className="hidden" checked={filtroPreco.includes(p.id)} onChange={() => togglePreco(p.id)} />
                          <span className={`text-sm font-medium transition-colors ${filtroPreco.includes(p.id) ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                            {p.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/5 w-full"></div>

                <div>
                  <button onClick={() => setIsGeneroOpen(!isGeneroOpen)} className="flex items-center justify-between w-full text-white font-bold text-sm group mb-4">
                    <span className="flex items-center gap-2"><Gamepad2 className="w-4 h-4 text-zinc-500 group-hover:text-[#00ff9d] transition-colors" /> Gêneros</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isGeneroOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isGeneroOpen && (
                    <div className="space-y-1">
                      {listaGeneros.map(g => (
                        <label key={g.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors">
                          <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${selectedGeneros.includes(g.nome) ? 'bg-[#00ff9d] border-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]' : 'bg-zinc-900 border border-zinc-700 group-hover:border-zinc-500'}`}>
                            {selectedGeneros.includes(g.nome) && <Check className="w-3.5 h-3.5 text-black" strokeWidth={4} />}
                          </div>
                          <input type="checkbox" className="hidden" checked={selectedGeneros.includes(g.nome)} onChange={() => toggleGenero(g.nome)} />
                          <span className={`text-sm font-medium transition-colors ${selectedGeneros.includes(g.nome) ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                            {g.nome}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          <div className="flex-1">
            {carregando ? (
              <div className="text-center py-20 text-zinc-400 bg-[#121212] rounded-2xl border border-white/5">
                <div className="w-8 h-8 border-4 border-[#00ff9d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                Carregando catálogo...
              </div>
            ) : jogosExibidos.length === 0 ? (
               <div className="text-center py-20 bg-[#121212] rounded-2xl border border-white/5">
                 <Gamepad2 className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
                 <p className="text-zinc-500">Tente ajustar seus filtros para encontrar novos jogos.</p>
               </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                  {jogosPaginados.map((game) => <GameCard key={game.id} game={game} onViewDetails={() => navigate(`/jogo/${game.id}`)} />)}
                </div>
                
                {itensVisiveis < jogosExibidos.length && (
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={() => setItensVisiveis(prev => prev + 20)}
                      className="flex items-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] group"
                    >
                      Carregar mais jogos <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
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