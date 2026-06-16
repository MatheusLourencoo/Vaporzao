import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, ThumbsUp, 
  ThumbsDown, MessageCircle, MoreHorizontal, 
  Filter, Search, ChevronDown } from "lucide-react";
import { api } from "../../services/api";
import { 
  decodificarTexto, 
  formatarPrimeiroEUltimoNome, 
  calcularTempoDecorrido 
} from "../../utils/formatacao";

const removerAcentos = (str) => {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export function FeedAvaliacoes() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [busca, setBusca] = useState('');
  const [filtroSentimento, setFiltroSentimento] = useState('todas'); 
  const [itensVisiveis, setItensVisiveis] = useState(5);

  useEffect(() => {
    carregarFeed();
  }, []);

  async function carregarFeed() {
    setLoading(true);
    setErro(false);
    try {
      const resJogos = await api.get("/jogos?limite=30&ordenar=lancamento&direcao=desc");
      
      let ultimosJogos = [];
      const dados = resJogos.data;
      if (Array.isArray(dados)) ultimosJogos = dados;
      else if (dados && Array.isArray(dados.jogos)) ultimosJogos = dados.jogos;
      else if (dados && Array.isArray(dados.data)) ultimosJogos = dados.data;
      else if (dados && Array.isArray(dados.content)) ultimosJogos = dados.content;
      else if (dados && Array.isArray(dados.itens)) ultimosJogos = dados.itens;
      else if (dados && Array.isArray(dados.games)) ultimosJogos = dados.games;

      if (!ultimosJogos || ultimosJogos.length === 0) {
        setFeed([]);
        setLoading(false);
        return;
      }

      const reviewsPromises = ultimosJogos.map(async (jogo) => {
        try {
          const id = jogo.id || jogo.jogoId;
          if (!id) return [];
          const resRev = await api.get(`/jogos/${id}/reviews`);
          const reviewsDoJogo = resRev.data || [];
          return Array.isArray(reviewsDoJogo) ? reviewsDoJogo.map(rev => ({
            ...rev,
            idUnico: `${id}-${Math.random()}`, 
            jogoVinculado: { 
              id, 
              titulo: decodificarTexto(jogo.titulo),
              capaUrl: jogo.capaUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300"
            }
          })) : [];
        } catch (e) { return []; }
      });

      const arraysDeReviews = await Promise.all(reviewsPromises);
      let todasReviews = arraysDeReviews.flat();

      setFeed(todasReviews);
    } catch (error) {
      setErro(true);
    } finally {
      setLoading(false);
    }
  }

  const getNotaReal = (notaCrua) => {
    const n = Number(notaCrua) || 0;
    return n > 5 ? Math.round(n / 2) : n;
  };

  const feedFiltrado = feed.filter((review) => {
    const notaReal = getNotaReal(review.nota);
    const recomenda = review.recomenda !== undefined ? review.recomenda : notaReal >= 3;
    
    const passaSentimento = 
      filtroSentimento === 'todas' || 
      (filtroSentimento === 'positivas' && recomenda) || 
      (filtroSentimento === 'negativas' && !recomenda);

    const termoBuscaLimpo = removerAcentos(busca);
    const tituloJogoLimpo = removerAcentos(review.jogoVinculado?.titulo);
    const textoReviewLimpo = removerAcentos(review.texto || review.comentario);
    
    const passaBusca = tituloJogoLimpo.includes(termoBuscaLimpo) || textoReviewLimpo.includes(termoBuscaLimpo);

    return passaSentimento && passaBusca;
  });

  const feedOrdenado = [...feedFiltrado].sort((a, b) => {
    if (ordenacao === 'recentes') {
      return new Date(b.createdAt || b.data || b.dataCriacao || 0).getTime() - new Date(a.createdAt || a.data || a.dataCriacao || 0).getTime();
    } else if (ordenacao === 'mais_avaliado') {
      return getNotaReal(b.nota) - getNotaReal(a.nota);
    } else if (ordenacao === 'menos_avaliado') {
      return getNotaReal(a.nota) - getNotaReal(b.nota);
    }
    return 0;
  });

  const feedExibido = feedOrdenado.slice(0, itensVisiveis);
  const temMaisItens = itensVisiveis < feedOrdenado.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-full h-12 bg-zinc-800 rounded-xl animate-pulse mb-6"></div>
          <div className="w-1/3 h-12 bg-zinc-800 rounded-xl animate-pulse mb-6"></div>
        </div>
        {[1, 2, 3].map(i => <div key={i} className="bg-card border border-white/5 rounded-3xl h-64 animate-pulse" />)}
      </div>
    );
  }

  if (erro) return <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center text-red-400 font-bold">Erro ao carregar a comunidade. Tente novamente mais tarde.</div>;

  return (
    <div className="space-y-6">
      
      <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Pesquisar por jogo ou palavra-chave..." 
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setItensVisiveis(5); }}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#00ff9d] transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 shrink-0">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select 
              value={ordenacao}
              onChange={(e) => { setOrdenacao(e.target.value); setItensVisiveis(5); }}
              className="bg-transparent text-white text-sm focus:outline-none py-3 cursor-pointer"
            >
              <option value="recentes" className="bg-zinc-900">Mais Recentes</option>
              <option value="mais_avaliado" className="bg-zinc-900">Maior Nota</option>
              <option value="menos_avaliado" className="bg-zinc-900">Menor Nota</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          <button 
            onClick={() => { setFiltroSentimento('todas'); setItensVisiveis(5); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filtroSentimento === 'todas' ? 'bg-white text-black' : 'bg-transparent border border-white/10 text-zinc-400 hover:text-white'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => { setFiltroSentimento('positivas'); setItensVisiveis(5); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${filtroSentimento === 'positivas' ? 'bg-[#00ff9d] text-black shadow-[0_0_10px_rgba(0,255,157,0.3)]' : 'bg-transparent border border-[#00ff9d]/20 text-[#00ff9d] hover:bg-[#00ff9d]/10'}`}
          >
            <ThumbsUp className="w-3.5 h-3.5" /> Positivas
          </button>
          <button 
            onClick={() => { setFiltroSentimento('negativas'); setItensVisiveis(5); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${filtroSentimento === 'negativas' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-transparent border border-red-500/20 text-red-500 hover:bg-red-500/10'}`}
          >
            <ThumbsDown className="w-3.5 h-3.5" /> Negativas
          </button>
        </div>
      </div>

      {feedExibido.length === 0 ? (
        <div className="bg-zinc-900/50 border border-white/5 p-16 rounded-3xl text-center flex flex-col items-center shadow-lg">
          <MessageCircle className="w-16 h-16 text-zinc-800 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum resultado</h3>
          <p className="text-zinc-500">Tente mudar os filtros ou o termo pesquisado.</p>
          {(busca !== '' || filtroSentimento !== 'todas') && (
            <button 
              onClick={() => { setBusca(''); setFiltroSentimento('todas'); }}
              className="mt-6 text-sm text-[#00ff9d] hover:underline"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {feedExibido.map((review) => {
            const notaReal = getNotaReal(review.nota);
            const autorRaw = review.usuario || review.nomeUsuario || review.autor;        
            const nomeExibicao = formatarPrimeiroEUltimoNome(autorRaw, "Anônimo");
            const tempoFormatado = calcularTempoDecorrido(review.createdAt || review.dataCriacao || review.data);
            
            const inicial = nomeExibicao.charAt(0).toUpperCase();
            const matricula = review.matricula || autorRaw?.matricula || review.idUsuario;   
            const recomenda = review.recomenda !== undefined ? review.recomenda : notaReal >= 3;

            return (
              <div key={review.idUnico} className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors shadow-lg">
                
                <div className="bg-zinc-900/50 p-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    {matricula ? (
                      <Link to={`/perfil/${matricula}`} className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-black text-zinc-400 hover:text-[#00ff9d] hover:border-[#00ff9d] transition-all">
                        {inicial}
                      </Link>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-black text-zinc-400">{inicial}</div>
                    )}
                    <div>
                      {matricula ? (
                        <Link to={`/perfil/${matricula}`} className="font-bold text-white hover:text-[#00ff9d] transition-colors text-sm">{nomeExibicao}</Link>
                      ) : (
                        <span className="font-bold text-white text-sm">{nomeExibicao}</span>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                        <Clock className="w-3 h-3" /> {tempoFormatado}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-zinc-600 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
                </div>

                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  {review.jogoVinculado && (
                    <Link to={`/jogo/${review.jogoVinculado.id}`} className="shrink-0 group mx-auto sm:mx-0">
                      <div className="w-32 h-44 rounded-xl overflow-hidden border border-white/5 group-hover:border-[#00ff9d]/50 transition-colors shadow-md">
                        <img 
                          src={review.jogoVinculado.capaUrl} 
                          alt={review.jogoVinculado.titulo} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300"; }}
                        />
                      </div>
                    </Link>
                  )}

                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {review.jogoVinculado && (
                        <Link to={`/jogo/${review.jogoVinculado.id}`} className="font-black text-xl text-white hover:text-[#00ff9d] transition-colors">
                          {review.jogoVinculado.titulo}
                        </Link>
                      )}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${recomenda ? 'bg-[#00ff9d]/10 text-[#00ff9d]' : 'bg-red-500/10 text-red-500'}`}>
                        {recomenda ? <ThumbsUp className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                        {recomenda ? "Recomendado" : "Não Recomendado"}
                      </div>
                      <div className="flex items-center ml-auto">
                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-4 h-4 ${star <= notaReal ? "fill-yellow-400 text-yellow-400" : "text-zinc-800"}`} />)}
                      </div>
                    </div>

                    <p className="text-zinc-300 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5 flex-1">
                      {decodificarTexto(review.texto || review.comentario || "Nenhum comentário deixado.")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {temMaisItens && (
            <button 
              onClick={() => setItensVisiveis(prev => prev + 5)}
              className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-2xl text-sm font-bold text-white transition-colors flex items-center justify-center gap-2 group shadow-lg"
            >
              Carregar mais análises <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}