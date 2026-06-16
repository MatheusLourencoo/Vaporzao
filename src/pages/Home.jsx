import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Banner } from "../components/common/Banner";
import { GameCard } from "../components/game/GameCard";
import { FiltrosLateral } from "../components/home/FiltrosLateral";
import { SecaoJogos } from "../components/home/SecaoJogos";
import { useGames } from "../hooks/useGames";
import { api } from "../services/api";

const opcoesPreco = [
  { id: "gratis", label: "Gratuito" },
  { id: "ate20", label: "Até R$ 20,00" },
  { id: "ate50", label: "Até R$ 50,00" },
  { id: "mais50", label: "Acima de R$ 50,00" },
];

const normalizarBusca = (str) => {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

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

  const { games = [], carregando, erro } = useGames({ generos: selectedGeneros });

  useEffect(() => {
    api.get("/generos")
      .then((r) => {
        if (Array.isArray(r.data)) {
          setListaGeneros([...r.data].sort((a, b) => a.nome.localeCompare(b.nome)));
        }
      })
      .catch(console.error);

    api.get("/jogos/destaques")
      .then((r) => {
        if (r.data?.topAvaliados) {
          setTopAvaliados(r.data.topAvaliados.slice(0, 6));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setItensVisiveis(20);
  }, [selectedGeneros, filtroPreco, ordenarPor, searchQuery]);

  const toggleGenero = (g) =>
    setSelectedGeneros((prev) => prev.includes(g) ? prev.filter((i) => i !== g) : [...prev, g]);

  const togglePreco = (pId) =>
    setFiltroPreco((prev) => prev.includes(pId) ? prev.filter((i) => i !== pId) : [...prev, pId]);

  const limparFiltros = () => {
    setSelectedGeneros([]);
    setFiltroPreco([]);
    setOrdenarPor("recentes");
    setItensVisiveis(20);
  };

  const qtdFiltrosAtivos = selectedGeneros.length + filtroPreco.length;

  const jogosRecentes = [...games]
    .sort((a, b) => {
      const dataA = new Date(a.createdAt || a.created_at || a.dataCriacao || a.data_criacao || 0).getTime();
      const dataB = new Date(b.createdAt || b.created_at || b.dataCriacao || b.data_criacao || 0).getTime();
      return dataB - dataA || b.id - a.id;
    })
    .slice(0, 6);

  let jogosExibidos = [...games];

  const buscaNormalizada = normalizarBusca(searchQuery || "");
  if (buscaNormalizada) {
    jogosExibidos = jogosExibidos.filter((jogo) =>
      normalizarBusca(jogo.titulo || "").includes(buscaNormalizada)
    );
  }

  if (filtroPreco.length > 0) {
    jogosExibidos = jogosExibidos.filter((g) => {
      const preco = Number(g.preco || 0);
      return (
        (filtroPreco.includes("gratis") && preco === 0) ||
        (filtroPreco.includes("ate20") && preco > 0 && preco <= 20) ||
        (filtroPreco.includes("ate50") && preco > 20 && preco <= 50) ||
        (filtroPreco.includes("mais50") && preco > 50)
      );
    });
  }

  if (ordenarPor === "az") jogosExibidos.sort((a, b) => (a.titulo || "").localeCompare(b.titulo || ""));
  else if (ordenarPor === "za") jogosExibidos.sort((a, b) => (b.titulo || "").localeCompare(a.titulo || ""));
  else if (ordenarPor === "menor_preco") jogosExibidos.sort((a, b) => Number(a.preco || 0) - Number(b.preco || 0));
  else if (ordenarPor === "maior_preco") jogosExibidos.sort((a, b) => Number(b.preco || 0) - Number(a.preco || 0));
  else if (ordenarPor === "recentes") {
    jogosExibidos.sort((a, b) => {
      const dataA = new Date(a.createdAt || a.created_at || a.dataCriacao || 0).getTime();
      const dataB = new Date(b.createdAt || b.created_at || b.dataCriacao || 0).getTime();
      return dataB - dataA || b.id - a.id;
    });
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
          <FiltrosLateral
            listaGeneros={listaGeneros}
            selectedGeneros={selectedGeneros}
            filtroPreco={filtroPreco}
            ordenarPor={ordenarPor}
            isOrdemOpen={isOrdemOpen}
            isPrecoOpen={isPrecoOpen}
            isGeneroOpen={isGeneroOpen}
            qtdFiltrosAtivos={qtdFiltrosAtivos}
            opcoesPreco={opcoesPreco}
            onToggleGenero={toggleGenero}
            onTogglePreco={togglePreco}
            onSetOrdenarPor={setOrdenarPor}
            onSetIsOrdemOpen={setIsOrdemOpen}
            onSetIsPrecoOpen={setIsPrecoOpen}
            onSetIsGeneroOpen={setIsGeneroOpen}
            onLimparFiltros={limparFiltros}
          />

          <div className="flex-1">
            <SecaoJogos
              carregando={carregando}
              erro={erro}
              jogosExibidos={jogosExibidos}
              jogosPaginados={jogosPaginados}
              itensVisiveis={itensVisiveis}
              onCarregarMais={() => setItensVisiveis((prev) => prev + 20)}
              onVerDetalhes={(game) => navigate(`/jogo/${game.id}`)}
            />
          </div>
        </div>
      </section>
    </>
  );
}