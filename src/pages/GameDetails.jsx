import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { api } from "../services/api";
import { Review } from "../components/game/Review";
import {
  formatarNomeCompleto,
  formatarPrimeiroEUltimoNome,
  formatarDataLancamento,
} from "../utils/formatacao";

const capasPadrao = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
];

const obterCapaAlternativa = (titulo = "") => capasPadrao[titulo.length % capasPadrao.length];

export function GameDetails({ biblioteca = [], wishlist = [], adicionarNaBiblioteca, adicionarNaWishlist, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [imagemDestaque, setImagemDestaque] = useState("");

  const [reviews, setReviews] = useState([]);

  const [localInLib, setLocalInLib] = useState(false);
  const [localInWish, setLocalInWish] = useState(false);
  const [processandoObter, setProcessandoObter] = useState(false);
  const [processandoWishlist, setProcessandoWishlist] = useState(false);
  const [processandoReview, setProcessandoReview] = useState(false);

  const token = localStorage.getItem("vaporzao_token");

  useEffect(() => {
    if (biblioteca && id) {
      setLocalInLib(biblioteca.some(g => String(g.id) === String(id) || String(g.jogoId) === String(id)));
    }
    if (wishlist && id) {
      setLocalInWish(wishlist.some(g => String(g.id) === String(id) || String(g.jogoId) === String(id)));
    }
  }, [biblioteca, wishlist, id]);

  useEffect(() => {
    if (!id || id === "undefined") return;

    window.scrollTo(0, 0);

    api.get(`/jogos/${id}`)
      .then(res => {
        setGame(res.data);
        setImagemDestaque(res.data.capaUrl || obterCapaAlternativa(res.data.titulo));
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.response?.data?.error || "Erro ao carregar dados do jogo.";
        showToast(msg, "erro");
      });

    api.get(`/jogos/${id}/imagens`)
      .then(res => setGaleria(res.data))
      .catch(() => {});

    api.get(`/jogos/${id}/reviews`)
      .then(res => setReviews(res.data))
      .catch(() => {});
  }, [id, token, showToast]);

  const handlePublicarAvaliacao = async (nota, texto, resetForm) => {
    if (!token) {
      showToast("Autenticação necessária para avaliar o título.", "aviso");
      return;
    }

    if (!texto.trim()) {
      showToast("Escreva um comentário para publicar sua avaliação.", "aviso");
      return;
    }

    if (processandoReview) return;

    setProcessandoReview(true);
    try {
      await api.post(`/jogos/${id}/reviews`,
        { nota, texto, recomenda: nota >= 3 },
        { headers: { token } }
      );
      const res = await api.get(`/jogos/${id}/reviews`);
      setReviews(res.data);
      resetForm();
      showToast("Sua avaliação foi publicada com sucesso!", "sucesso");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Erro ao publicar avaliação. Tente novamente.";
      showToast(msg, "erro");
    } finally {
      setProcessandoReview(false);
    }
  };

  const handleObter = async () => {
    if (!token) {
      showToast("Faça login para adicionar jogos à sua biblioteca.", "aviso");
      return;
    }
    if (localInLib) {
      showToast(`O jogo "${game?.titulo}" já está na sua biblioteca!`, "aviso");
      return;
    }
    if (processandoObter) return;

    setProcessandoObter(true);
    try {
      await api.post(`/biblioteca/${id}`, {}, { headers: { token } });
      if (adicionarNaBiblioteca) adicionarNaBiblioteca(game);
      showToast(`"${game?.titulo}" foi adicionado à sua biblioteca!`, "sucesso");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Não foi possível adicionar o jogo.";
      showToast(msg, "erro");
    } finally {
      setProcessandoObter(false);
    }
  };

  const handleWishlist = async () => {
    if (!token) {
      showToast("Faça login para gerenciar sua lista de desejos.", "aviso");
      return;
    }
    if (localInWish) {
      showToast(`O jogo "${game?.titulo}" já está na sua lista de desejos!`, "aviso");
      return;
    }
    if (processandoWishlist) return;

    setProcessandoWishlist(true);
    try {
      await api.post(`/wishlist/${id}`, {}, { headers: { token } });
      if (adicionarNaWishlist) adicionarNaWishlist(game);
      showToast(`"${game?.titulo}" foi adicionado à sua lista de desejos!`, "sucesso");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Não foi possível adicionar à lista.";
      showToast(msg, "erro");
    } finally {
      setProcessandoWishlist(false);
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        <div className="max-w-5xl mx-auto pt-8 px-6">
          <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="w-3/4 h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
              <div className="w-full h-[400px] bg-zinc-800 rounded-xl animate-pulse"></div>
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-32 h-20 bg-zinc-800 rounded-lg animate-pulse shrink-0"></div>
                ))}
              </div>
              <div className="space-y-4 pt-4">
                <div className="w-48 h-8 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-zinc-800 rounded animate-pulse"></div>
                <div className="w-5/6 h-4 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-2xl border border-white/5 sticky top-24">
                <div className="w-32 h-10 bg-zinc-800 rounded animate-pulse mb-6"></div>
                <div className="flex flex-col gap-3">
                  <div className="w-full h-14 bg-zinc-800 rounded-lg animate-pulse"></div>
                  <div className="w-full h-14 bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-5xl mx-auto pt-8 px-6">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-white mb-6 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight">{game.titulo}</h1>

            <div className="space-y-4">
              <img
                src={imagemDestaque}
                alt={game.titulo}
                className="w-full h-[400px] object-cover rounded-xl shadow-2xl transition-all duration-300"
                onError={(e) => { e.target.src = obterCapaAlternativa(game.titulo); }}
              />

              {galeria.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
                  <img
                    src={game.capaUrl || obterCapaAlternativa(game.titulo)}
                    onClick={() => setImagemDestaque(game.capaUrl || obterCapaAlternativa(game.titulo))}
                    className={`w-32 h-20 shrink-0 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                      imagemDestaque === (game.capaUrl || obterCapaAlternativa(game.titulo)) ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    alt="Capa Original"
                  />

                  {galeria.map((img, index) => (
                    <img
                      key={img.id || index}
                      src={img.url}
                      onClick={() => setImagemDestaque(img.url)}
                      className={`w-32 h-20 shrink-0 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                        imagemDestaque === img.url ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      alt={`Screenshot ${index + 1}`}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ))}
                </div>
              )}
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4">Sobre o jogo</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 whitespace-pre-wrap">{game.descricao}</p>

              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Gêneros</h3>
              <div className="flex flex-wrap gap-2">
                {game.generos?.map((genero, index) => (
                  <span key={index} className="px-4 py-1.5 bg-[#2a2a2a] text-white text-sm font-medium rounded-md cursor-default">
                    {typeof genero === 'string' ? genero : genero.nome}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-card p-8 rounded-2xl border border-white/5">
              <h2 className="text-2xl font-bold mb-8">Requisitos de sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-muted-foreground mb-4">Mínimo</h3>
                  <div className="space-y-4">
                    {["SO", "Processador", "Memória", "Placa de vídeo"].map(req => (
                      <div key={req}>
                        <p className="text-xs text-muted-foreground uppercase">{req}</p>
                        <p className="text-sm">
                          {req === "SO" ? "Windows 10 (64-bit)" : req === "Processador" ? "Intel i3-8100 / Ryzen 3 2200G" : req === "Memória" ? "8 GB RAM" : "GTX 1050 / RX 560"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-muted-foreground mb-4">Recomendado</h3>
                  <div className="space-y-4">
                    {["SO", "Processador", "Memória", "Placa de vídeo"].map(req => (
                      <div key={req}>
                        <p className="text-xs text-muted-foreground uppercase">{req}</p>
                        <p className="text-sm">
                          {req === "SO" ? "Windows 11 (64-bit)" : req === "Processador" ? "Intel i5-12400 / Ryzen 5 5600X" : req === "Memória" ? "16 GB RAM" : "RTX 3060 / RX 6600 XT"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <Review
              reviews={reviews}
              onPublicar={handlePublicarAvaliacao}
              processando={processandoReview}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl border border-white/5 sticky top-24">
              <div className="text-3xl font-bold mb-6 text-white">
                {game.preco > 0 ? `R$ ${game.preco.toFixed(2)}` : "Gratuito"}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleObter}
                  disabled={processandoObter}
                  className={`w-full flex items-center justify-center gap-2 font-black py-4 rounded-lg transition-all ${
                    processandoObter
                      ? "bg-[#00ff9d] text-black opacity-70 cursor-wait"
                      : localInLib
                      ? "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                      : "bg-[#00ff9d] text-black hover:bg-[#00e08a] shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_25px_rgba(0,255,157,0.4)]"
                  }`}
                >
                  {processandoObter ? (
                    "Adicionando..."
                  ) : localInLib ? (
                    <><Check className="w-5 h-5 text-[#00ff9d]" /> Na Biblioteca</>
                  ) : (
                    "Obter"
                  )}
                </button>

                <button
                  onClick={handleWishlist}
                  disabled={processandoWishlist}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-lg transition-all border ${
                    processandoWishlist
                      ? "bg-[#2a2a2a] border-white/10 text-white opacity-70 cursor-wait"
                      : localInWish
                      ? "bg-transparent border-white/10 text-white hover:bg-white/5"
                      : "bg-[#2a2a2a] border-white/10 text-white hover:bg-[#3d3d3d]"
                  }`}
                >
                  {processandoWishlist ? (
                    "Adicionando..."
                  ) : localInWish ? (
                    <><Check className="w-5 h-5 text-white" /> Na Lista de Desejos</>
                  ) : (
                    "Lista de desejos"
                  )}
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-400 whitespace-nowrap">Desenvolvedor</span>
                  <span className="text-white font-medium text-right break-words line-clamp-2">
                    {formatarNomeCompleto(game.desenvolvedora || game.desenvolvedor, "Não informado")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-400 whitespace-nowrap">Autor / Autora</span>
                  <span className="text-white font-medium text-right break-words line-clamp-2">
                    {formatarPrimeiroEUltimoNome(game.autor || game.publicadora, "Não informado")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-400 whitespace-nowrap">Lançamento</span>
                  <span className="text-white font-medium text-right whitespace-nowrap">
                    {formatarDataLancamento(game)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
