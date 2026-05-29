import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { api } from "../services/api";

const capasPadrao = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
];

const obterCapaAlternativa = (titulo = "") => capasPadrao[titulo.length % capasPadrao.length];

export function GameDetails({ adicionarNaBiblioteca, adicionarNaWishlist, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [reviewNota, setReviewNota] = useState(5);
  const [reviewTexto, setReviewTexto] = useState("");
  const [reviews, setReviews] = useState([]);
  
  const token = localStorage.getItem("vaporzao_token");

  useEffect(() => {
    api.get(`/jogos/${id}`)
      .then(res => setGame(res.data))
      .catch(err => console.error("Erro ao buscar jogo:", err));

    api.get(`/jogos/${id}/reviews`, { headers: { token } })
      .then(res => setReviews(res.data))
      .catch(err => console.error("Erro ao carregar reviews:", err));
  }, [id, token]);

  const handlePublicarAvaliacao = async () => {
    if (!token) {
      showToast("Você precisa estar logado para avaliar!", "aviso");
      return;
    }
    try {
      await api.post(`/jogos/${id}/reviews`, 
        { nota: reviewNota, texto: reviewTexto, recomenda: reviewNota >= 3 },
        { headers: { token } }
      );
      const res = await api.get(`/jogos/${id}/reviews`, { headers: { token } });
      setReviews(res.data);
      setReviewTexto("");
      setReviewNota(5);
      showToast("Avaliação publicada com sucesso!", "sucesso");
    } catch (err) { 
      showToast("Erro ao publicar avaliação!", "erro"); 
    }
  };

  if (!game) return <div className="text-center py-20 text-muted-foreground">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-5xl mx-auto pt-8 px-6">
        <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-white mb-6 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para a loja
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight">{game.titulo}</h1>
            <img 
              src={game.capaUrl || obterCapaAlternativa(game.titulo)} 
              className="w-full h-[400px] object-cover rounded-xl shadow-2xl"
              onError={(e) => { e.target.src = obterCapaAlternativa(game.titulo); }}
            />

            <section>
              <h2 className="text-2xl font-bold mb-4">Sobre o jogo</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{game.descricao}</p>
              
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
                      <div key={req}><p className="text-xs text-muted-foreground uppercase">{req}</p><p className="text-sm">{req === "SO" ? "Windows 10 (64-bit)" : req === "Processador" ? "Intel i3-8100 / Ryzen 3 2200G" : req === "Memória" ? "8 GB RAM" : "GTX 1050 / RX 560"}</p></div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-muted-foreground mb-4">Recomendado</h3>
                  <div className="space-y-4">
                    {["SO", "Processador", "Memória", "Placa de vídeo"].map(req => (
                      <div key={req}><p className="text-xs text-muted-foreground uppercase">{req}</p><p className="text-sm">{req === "SO" ? "Windows 11 (64-bit)" : req === "Processador" ? "Intel i5-12400 / Ryzen 5 5600X" : req === "Memória" ? "16 GB RAM" : "RTX 3060 / RX 6600 XT"}</p></div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
              <div className="bg-card border border-border p-6 rounded-lg mb-8">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <Star 
                      key={estrela} 
                      className={`w-8 h-8 cursor-pointer transition-colors ${estrela <= reviewNota ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} 
                      onClick={() => setReviewNota(estrela)} 
                    />
                  ))}
                  <span className="ml-3 font-bold text-lg">{reviewNota} / 5</span>
                </div>
                <textarea 
                  value={reviewTexto} 
                  onChange={(e) => setReviewTexto(e.target.value)} 
                  placeholder="Sua experiência..." 
                  className="w-full p-3 mb-4 bg-input rounded border border-border outline-none focus:ring-2 focus:ring-primary" 
                />
                <button onClick={handlePublicarAvaliacao} className="bg-[#00ff9d] text-black font-black px-6 py-2 rounded hover:bg-[#00e08a]">Publicar</button>
              </div>
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((r, i) => (
                  <div key={i} className="bg-card border border-border p-4 rounded-lg">
                    <p className="font-bold">Nota: {r.nota}/5</p>
                    <p className="text-muted-foreground">{r.texto}</p>
                  </div>
                )) : <p className="text-muted-foreground text-center">Nenhuma avaliação ainda.</p>}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl border border-white/5 sticky top-24">
              <div className="text-3xl font-bold mb-6 text-white">R$ {game.preco > 0 ? game.preco.toFixed(2) : "Gratuito"}</div>
              <div className="flex flex-col gap-3">
                <button onClick={() => adicionarNaBiblioteca(game)} className="w-full bg-[#00ff9d] text-black font-black py-4 rounded-lg hover:bg-[#00e08a] transition-all">Obter</button>
                <button onClick={() => adicionarNaWishlist(game)} className="w-full bg-[#2a2a2a] text-white font-bold py-4 rounded-lg hover:bg-[#3d3d3d] transition-all border border-white/10">Lista de desejos</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}