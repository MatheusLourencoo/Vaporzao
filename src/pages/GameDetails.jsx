import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Clock } from "lucide-react";
import { api } from "../services/api";

const capasPadrao = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
];

const obterCapaAlternativa = (titulo = "") => capasPadrao[titulo.length % capasPadrao.length];

// Função para calcular "há quanto tempo" a review foi feita
const calcularTempoDecorrido = (dataString) => {
  if (!dataString) return "Recentemente";
  
  const dataPostagem = new Date(dataString);
  const agora = new Date();
  const diferencaMs = agora - dataPostagem;
  
  const minutos = Math.floor(diferencaMs / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(dias / 30);
  const anos = Math.floor(dias / 365);

  if (minutos < 1) return "Agora mesmo";
  if (minutos < 60) return `há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  if (horas < 24) return `há ${horas} hora${horas > 1 ? 's' : ''}`;
  if (dias < 7) return `há ${dias} dia${dias > 1 ? 's' : ''}`;
  if (semanas < 4) return `há ${semanas} semana${semanas > 1 ? 's' : ''}`;
  if (meses < 12) return `há ${meses} mês${meses > 1 ? 'es' : ''}`;
  return `há ${anos} ano${anos > 1 ? 's' : ''}`;
};

// Função para corrigir caracteres especiais e formatar o nome
const formatarNomeReview = (nomeBruto) => {
  if (!nomeBruto) return "Membro da Vaporzão";

  let nomeCorrigido = String(nomeBruto);
  
  const mapaErros = {
    'Ã¡': 'á', 'Ã¢': 'â', 'Ã£': 'ã', 'Ã¤': 'ä',
    'Ã©': 'é', 'Ãª': 'ê', 'Ã«': 'ë',
    'Ã­': 'í', 'Ã®': 'î', 'Ã¯': 'ï',
    'Ã³': 'ó', 'Ã´': 'ô', 'Ãµ': 'õ', 'Ã¶': 'ö',
    'Ãº': 'ú', 'Ã»': 'û', 'Ã¼': 'ü',
    'Ã§': 'ç', 'Ã±': 'ñ',
    'Ã ': 'Á', 'Ã‚': 'Â', 'Ãƒ': 'Ã', 'Ã„': 'Ä',
    'Ã‰': 'É', 'ÃŠ': 'Ê', 'Ã‹': 'Ë',
    'Ã': 'Í', 'ÃŽ': 'Î', 'Ã': 'Ï',
    'Ã“': 'Ó', 'Ã”': 'Ô', 'Ã•': 'Õ', 'Ã–': 'Ö',
    'Ãš': 'Ú', 'Ã›': 'Û', 'Ãœ': 'Ü',
    'Ã‡': 'Ç', 'Ã‘': 'Ñ', '‰': 'É', '‡': 'Ç'
  };

  for (const [erro, certo] of Object.entries(mapaErros)) {
    nomeCorrigido = nomeCorrigido.split(erro).join(certo);
  }

  try {
    nomeCorrigido = decodeURIComponent(escape(nomeCorrigido));
  } catch (e) {
  }

  // Divide o nome, passa para minúsculo e pega Primeiro e Último nome
  const partes = nomeCorrigido.toLowerCase().trim().split(/\s+/);
  const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (partes.length === 1) return capitalizar(partes[0]);
  const primeiroNome = partes[0];
  const ultimoNome = partes[partes.length - 1];

  return `${capitalizar(primeiroNome)} ${capitalizar(ultimoNome)}`;
};

export function GameDetails({ biblioteca = [], wishlist = [], adicionarNaBiblioteca, adicionarNaWishlist, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [imagemDestaque, setImagemDestaque] = useState("");
  const [reviewNota, setReviewNota] = useState(5);
  const [reviewTexto, setReviewTexto] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewFeita, setReviewFeita] = useState(false);
  const [localInLib, setLocalInLib] = useState(false);
  const [localInWish, setLocalInWish] = useState(false);
  const token = localStorage.getItem("vaporzao_token");

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get(`/jogos/${id}`)
      .then(res => {
        setGame(res.data);
        setImagemDestaque(res.data.capaUrl || obterCapaAlternativa(res.data.titulo));
      })
      .catch(err => console.error(err));

    api.get(`/jogos/${id}/imagens`)
      .then(res => setGaleria(res.data))
      .catch(err => console.error(err));

    api.get(`/jogos/${id}/reviews`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));

    if (token) {
      api.get('/biblioteca/me', { headers: { token } })
        .then(res => setLocalInLib(res.data.some(g => String(g.id) === String(id))))
        .catch(err => console.error(err));

      api.get('/wishlist/me', { headers: { token } })
        .then(res => setLocalInWish(res.data.some(g => String(g.id) === String(id))))
        .catch(err => console.error(err));

      api.get(`/jogos/${id}/status`, { headers: { token } })
        .then(res => setReviewFeita(res.data.review || res.data.revisado || res.data.hasReview || false))
        .catch(err => console.error(err));
    }
  }, [id, token]);

  const handlePublicarAvaliacao = async () => {
    if (!token) return showToast("Autenticação necessária para avaliar o título.", "aviso");
    
    try {
      await api.post(`/jogos/${id}/reviews`, 
        { nota: reviewNota, texto: reviewTexto, recomenda: reviewNota >= 3 },
        { headers: { token } }
      );
      const res = await api.get(`/jogos/${id}/reviews`);
      setReviews(res.data);
      setReviewFeita(true);
      setReviewTexto("");
      setReviewNota(5);
      showToast("Avaliação publicada com sucesso!", "sucesso");
    } catch (err) { 
      showToast("Erro ao publicar avaliação no servidor.", "erro"); 
    }
  };

  const handleObter = async () => {
    if (!token) return showToast("Autenticação necessária para registrar licenças.", "aviso");
    if (localInLib) return showToast("Este título já consta na sua biblioteca de jogos.", "aviso");

    try {
      await api.post(`/biblioteca/${id}`, {}, { headers: { token } });
      setLocalInLib(true);
      if (adicionarNaBiblioteca) adicionarNaBiblioteca(game);
      showToast("Licença adicionada à sua conta!", "sucesso");
    } catch (error) {
      showToast("Falha de comunicação com os servidores.", "erro");
    }
  };

  const handleWishlist = async () => {
    if (!token) return showToast("Autenticação necessária.", "aviso");
    if (localInWish) return showToast("Este título já está sendo monitorado na sua lista de desejos.", "aviso");

    try {
      await api.post(`/wishlist/${id}`, {}, { headers: { token } });
      setLocalInWish(true);
      if (adicionarNaWishlist) adicionarNaWishlist(game);
      showToast("Título inserido na sua lista de desejos!", "sucesso");
    } catch (error) {
      showToast("Falha ao atualizar a lista no servidor.", "erro");
    }
  };

  if (!game) return <div className="text-center py-20 text-muted-foreground">Estabelecendo conexão...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-5xl mx-auto pt-8 px-6">
        <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-white mb-6 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para a loja
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
              
              {!reviewFeita && (
                <div className="bg-card border border-border p-6 rounded-xl mb-8">
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
                    placeholder="Conte para a comunidade o que você achou do jogo..." 
                    className="w-full p-4 mb-4 bg-input rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y" 
                  />
                  <button onClick={handlePublicarAvaliacao} className="bg-[#00ff9d] text-black font-black px-8 py-3 rounded-lg hover:bg-[#00e08a] transition-colors">Publicar Avaliação</button>
                </div>
              )}

              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((r, i) => {
                  const notaNormalizada = r.nota > 5 ? Math.round(r.nota / 2) : r.nota;
                  
                  let nomeBruto = r.usuario?.nome || r.nomeUsuario || r.autor || "Membro da Vaporzão";
                  
                  if (typeof nomeBruto === 'object' && nomeBruto !== null) {
                    nomeBruto = nomeBruto.nome || nomeBruto.nomeUsuario || "Membro da Vaporzão";
                  }
                  
                  const nomeExibicao = formatarNomeReview(nomeBruto);
                  const inicial = nomeExibicao.charAt(0).toUpperCase();
                  const dataPostagem = r.createdAt || r.dataCriacao || r.data || null;
                  const tempoFormatado = calcularTempoDecorrido(dataPostagem);
                  
                  return (
                    <div key={i} className="bg-[#1a1a1a] border border-white/5 p-6 rounded-xl flex gap-4 transition-colors hover:bg-zinc-900">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10 text-xl font-black text-zinc-500 shadow-inner">
                        {inicial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-zinc-100">{nomeExibicao}</h4>
                            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{tempoFormatado}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((estrela) => (
                              <Star 
                                key={estrela} 
                                className={`w-4 h-4 ${estrela <= notaNormalizada ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-zinc-400 leading-relaxed mt-2">{r.texto}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-muted-foreground text-center py-10 bg-[#1a1a1a] rounded-xl border border-white/5">
                    Nenhuma avaliação ainda. Seja o primeiro a dar sua opinião!
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl border border-white/5 sticky top-24">
              <div className="text-3xl font-bold mb-6 text-white">R$ {game.preco > 0 ? game.preco.toFixed(2) : "Gratuito"}</div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleObter} 
                  className={`w-full font-black py-4 rounded-lg transition-all ${
                    localInLib 
                      ? "bg-[#2a2a2a] text-muted-foreground cursor-default" 
                      : "bg-[#00ff9d] text-black hover:bg-[#00e08a]"
                  }`}
                >
                  {localInLib ? "Na Biblioteca" : "Obter"}
                </button>
                <button 
                  onClick={handleWishlist} 
                  className={`w-full font-bold py-4 rounded-lg transition-all border ${
                    localInWish
                      ? "bg-[#1a1a1a] border-white/5 text-muted-foreground cursor-default"
                      : "bg-[#2a2a2a] text-white hover:bg-[#3d3d3d] border-white/10"
                  }`}
                >
                  {localInWish ? "Na Lista de Desejos" : "Lista de desejos"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}