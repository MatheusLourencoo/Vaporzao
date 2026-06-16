import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Gamepad2, MessageSquare, Star, ArrowLeft, UserCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { api } from "../services/api";

const decodificarTexto = (textoBruto) => {
  if (!textoBruto) return "";
  let textoCorrigido = String(textoBruto);
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
    'Ã“': 'Ó', 'Ó': 'Ó', 'Ã”': 'Ô', 'Ã•': 'Õ', 'Ã–': 'Ö',
    'Ãš': 'Ú', 'Ã›': 'Û', 'Ãœ': 'Ü',
    'Ã‡': 'Ç', 'Ã‘': 'Ñ', '‰': 'É', '‡': 'Ç',
    'ã‡': 'ç'
  };

  for (const [erro, certo] of Object.entries(mapaErros)) {
    textoCorrigido = textoCorrigido.split(erro).join(certo);
  }
  return textoCorrigido.trim();
};

const formatarNomeTitleCase = (texto) => {
  if (!texto) return "Membro da Vaporzão";
  const textoLimpo = decodificarTexto(texto).toLowerCase();
  return textoLimpo.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
};

export function Perfil() {
  const { matricula } = useParams();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setErro(false);

    api.get(`/usuarios/${matricula}`)
      .then(res => setPerfil(res.data))
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
  }, [matricula]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-12 px-4 flex justify-center">
        <div className="w-full max-w-4xl space-y-8 animate-pulse">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-zinc-800 rounded-3xl"></div>
            <div className="space-y-4 flex-1">
              <div className="h-8 bg-zinc-800 rounded w-1/3"></div>
            </div>
          </div>
          <div className="h-64 bg-zinc-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (erro || !perfil) {
    return (
      <div className="min-h-screen bg-background pt-20 flex flex-col items-center">
        <UserCircle className="w-20 h-20 text-zinc-700 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Perfil não encontrado</h2>
        <p className="text-zinc-500 mb-6">Este usuário não existe ou a matrícula está incorreta.</p>
        <button onClick={() => navigate(-1)} className="text-[#00ff9d] hover:underline">Voltar</button>
      </div>
    );
  }

  let userData = perfil;
  if (perfil.usuario) userData = perfil.usuario;
  else if (perfil.data) userData = perfil.data;
  else if (perfil.user) userData = perfil.user;

  const nomeExibicao = formatarNomeTitleCase(userData.nome || userData.nomeUsuario || matricula);
  const inicial = nomeExibicao.charAt(0).toUpperCase();
  
  const jogosCriados = userData.jogos || userData.Jogos || userData.jogosCriados || userData.jogosPublicados || userData.games || [];
  const reviews = userData.reviews || userData.Reviews || userData.avaliacoes || userData.Avaliacoes || userData.comentarios || [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      <div className="relative border-b border-white/5 pt-28 pb-12 px-4 overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop" 
            alt="Banner de Perfil" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00ff9d] blur-xl opacity-20 rounded-3xl"></div>
            <div className="relative w-32 h-32 shrink-0 rounded-3xl bg-zinc-900/80 backdrop-blur-md border border-[#00ff9d]/40 flex items-center justify-center text-5xl font-black text-[#00ff9d]">
              {inicial}
            </div>
          </div>

          <div className="text-center md:text-left flex-1 mb-2">
            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">{nomeExibicao}</h1>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <div className="bg-black/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center shadow-lg flex flex-col justify-center">
              <span className="block text-3xl font-black text-white">{jogosCriados.length}</span>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1 block">Jogos Publicados</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center shadow-lg flex flex-col justify-center">
              <span className="block text-3xl font-black text-white">{reviews.length}</span>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1 block">Avaliações</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-10 space-y-12">
        <button onClick={() => navigate(-1)} className="text-sm text-zinc-500 hover:text-white flex items-center gap-2 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="w-6 h-6 text-[#00ff9d]" />
            <h2 className="text-2xl font-bold text-white">Jogos Publicados</h2>
          </div>
          
          {jogosCriados.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {jogosCriados.map((jogo) => (
                <Link key={jogo.id || Math.random()} to={`/jogo/${jogo.id || jogo.jogoId}`} className="group block cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-800 mb-3 border border-white/5 group-hover:border-[#00ff9d]/30 transition-all duration-300 shadow-md group-hover:shadow-[0_0_20px_rgba(0,255,157,0.1)]">
                    <img 
                      src={jogo.capaUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300"} 
                      alt={jogo.titulo || "Jogo"} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-[#00ff9d] transition-colors">
                    {decodificarTexto(jogo.titulo || "Jogo sem título")}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">
                    {jogo.preco === 0 || !jogo.preco ? 'Gratuito' : `R$ ${Number(jogo.preco).toFixed(2)}`}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/50 p-10 rounded-2xl border border-white/5 text-center flex flex-col items-center">
              <Gamepad2 className="w-12 h-12 text-zinc-800 mb-3" />
              <p className="text-zinc-400 font-medium">Este usuário ainda não publicou nenhum jogo.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-[#00ff9d]" />
            <h2 className="text-2xl font-bold text-white">Últimas Avaliações</h2>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((review, index) => {
                const notaReal = review.nota > 5 ? Math.round(review.nota / 2) : (review.nota || 0);
                const dataFormatada = new Date(review.createdAt || review.dataCriacao || review.data || new Date()).toLocaleDateString('pt-BR');
                const tituloJogo = review.jogo?.titulo || review.Jogo?.titulo || review.jogoTitulo || review.tituloJogo || review.game?.titulo || "Jogo Desconhecido";
                
                const recomenda = review.recomenda !== false;
                const textoReview = review.texto || review.comentario || review.conteudo;
                
                return (
                  <div key={index} className="relative bg-card border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:bg-zinc-900/80 transition-colors overflow-hidden group">
                    <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
                      {recomenda ? <ThumbsUp className="w-40 h-40" /> : <ThumbsDown className="w-40 h-40" />}
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-5">
                        <div className="pr-4">
                          <h3 className="text-lg font-black text-white group-hover:text-[#00ff9d] transition-colors line-clamp-1 mb-1">
                            {decodificarTexto(tituloJogo)}
                          </h3>
                          <span className="text-xs text-zinc-500 font-medium">Avaliado em {dataFormatada}</span>
                        </div>
                        <div className="flex bg-black/40 px-2 py-1.5 rounded-lg border border-white/5 shrink-0">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={`w-3.5 h-3.5 ${star <= notaReal ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"}`} />
                          ))}
                        </div>
                      </div>
                      
                      {textoReview ? (
                        <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                          "{decodificarTexto(textoReview)}"
                        </p>
                      ) : (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border backdrop-blur-sm ${recomenda ? 'bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          {recomenda ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                          {recomenda ? "Recomenda este jogo" : "Não recomenda este jogo"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-zinc-900/50 p-10 rounded-2xl border border-white/5 text-center flex flex-col items-center">
              <MessageSquare className="w-12 h-12 text-zinc-800 mb-3" />
              <p className="text-zinc-400 font-medium">Este usuário ainda não avaliou nenhum jogo.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}