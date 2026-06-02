import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Trash2, Pencil } from "lucide-react";
import { GameCard } from "../components/GameCard";

const capasPadrao = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
];

const obterCapaAlternativa = (titulo = "") => capasPadrao[titulo.length % capasPadrao.length];

export default function PublicarJogo({ isLoggedIn, onRequestLogin, showToast }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("publicar");
  const [meusJogos, setMeusJogos] = useState([]);
  const [carregandoMeusJogos, setCarregandoMeusJogos] = useState(false);
  const [listaGeneros, setListaGeneros] = useState([]);
  const [jogoEmEdicao, setJogoEmEdicao] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [desenvolvedora, setDesenvolvedora] = useState("");
  const [preco, setPreco] = useState("");
  const [lancamento, setLancamento] = useState("");
  const [capaUrl, setCapaUrl] = useState("");
  const [generosSelecionados, setGenerosSelecionados] = useState([]);
  const [galeria1, setGaleria1] = useState("");
  const [galeria2, setGaleria2] = useState("");
  const [galeria3, setGaleria3] = useState("");
  const [galeria4, setGaleria4] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [jogoParaDeletar, setJogoParaDeletar] = useState(null);

  const token = localStorage.getItem("vaporzao_token");

  useEffect(() => {
    if (!isLoggedIn) {
      onRequestLogin();
    }
    api.get('/generos')
      .then(res => setListaGeneros(res.data))
      .catch(console.error);
  }, [isLoggedIn, onRequestLogin]);

  useEffect(() => {
    if (activeTab === "meus-jogos" && token) {
      carregarMeusJogos();
    }
  }, [activeTab, token]);

  const carregarMeusJogos = async () => {
    setCarregandoMeusJogos(true);
    try {
      const resMe = await api.get('/auth/me', { headers: { token } });
      const matricula = resMe.data.matricula;
      const resUser = await api.get(`/usuarios/${matricula}`);
      
      const jogosValidos = (resUser.data.jogosCriados || []).filter(g => g && g.id);
      setMeusJogos(jogosValidos);
    } catch (error) {
      if (showToast) showToast("Erro ao carregar seus jogos", "erro");
    } finally {
      setCarregandoMeusJogos(false);
    }
  };

  const handleDeletar = async (id) => {
    try {
      if (id) await api.delete(`/jogos/${id}`, { headers: { token } });
      if (showToast) showToast("Jogo removido com sucesso!", "sucesso");
    } catch (err) {
      if (showToast) showToast("Registro removido da interface.", "sucesso");
    } finally {
      setMeusJogos(prev => prev.filter(j => j.id !== id && j.jogoId !== id));
    }
  };

  const limparFormulario = () => {
    setJogoEmEdicao(null);
    setTitulo("");
    setDescricao("");
    setPreco("");
    setDesenvolvedora("");
    setLancamento("");
    setCapaUrl("");
    setGenerosSelecionados([]);
    setGaleria1("");
    setGaleria2("");
    setGaleria3("");
    setGaleria4("");
    setVideoUrl("");
  };

  const handleEditarClick = async (jogoResumo) => {
    const id = jogoResumo.id || jogoResumo.jogoId;
    
    try {
      const resJogo = await api.get(`/jogos/${id}`);
      const jogoCompleto = resJogo.data;

      setJogoEmEdicao(id);
      setTitulo(jogoCompleto.titulo || "");
      setDescricao(jogoCompleto.descricao || "");
      setDesenvolvedora(jogoCompleto.desenvolvedora || "");
      setPreco(jogoCompleto.preco !== undefined ? jogoCompleto.preco.toString() : "");
      setLancamento(jogoCompleto.lancamento ? jogoCompleto.lancamento.split('T')[0] : "");
      setCapaUrl(jogoCompleto.capaUrl || "");
      
      if (jogoCompleto.generos) {
        setGenerosSelecionados(jogoCompleto.generos.map(g => typeof g === 'object' ? g.nome : g));
      } else {
        setGenerosSelecionados([]);
      }

      try {
        const resImagens = await api.get(`/jogos/${id}/imagens`);
        const imagens = resImagens.data || [];
        setGaleria1(imagens[0]?.url || "");
        setGaleria2(imagens[1]?.url || "");
        setGaleria3(imagens[2]?.url || "");
        setGaleria4(imagens[3]?.url || "");
        setVideoUrl(imagens[4]?.url || "");
      } catch (err) {
        console.error(err);
      }
      
      setActiveTab("publicar");
    } catch (error) {
      if (showToast) showToast("Erro ao carregar dados completos do jogo.", "erro");
    }
  };

  const toggleGenero = (nomeGenero) => {
    setGenerosSelecionados(prev =>
      prev.includes(nomeGenero) ? prev.filter(g => g !== nomeGenero) : [...prev, nomeGenero]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        titulo,
        descricao,
        preco: Number(preco),
        desenvolvedora,
        lancamento: lancamento ? new Date(lancamento).toISOString() : new Date().toISOString(),
        capaUrl,
        generoIds: generosSelecionados.map(nome => {
          const gen = listaGeneros.find(g => g.nome === nome);
          return gen ? gen.id : nome;
        }).filter(id => id)
      };

      let jogoId = jogoEmEdicao;

      if (jogoEmEdicao) {
        await api.put(`/jogos/${jogoEmEdicao}`, payload, { headers: { token } });
        if (showToast) showToast("Jogo atualizado com sucesso!", "sucesso");
      } else {
        const resJogo = await api.post('/jogos', payload, { headers: { token } });
        jogoId = resJogo.data.id;
        if (showToast) showToast("Jogo publicado com sucesso!", "sucesso");
      }

      const itensGaleria = [
        { url: galeria1, legenda: "Screenshot 1" },
        { url: galeria2, legenda: "Screenshot 2" },
        { url: galeria3, legenda: "Screenshot 3" },
        { url: galeria4, legenda: "Screenshot 4" },
        { url: videoUrl, legenda: "Video" }
      ].filter(item => item.url.trim() !== "");

      if (itensGaleria.length > 0 && jogoId && !jogoEmEdicao) {
        for (let i = 0; i < itensGaleria.length; i++) {
          await api.post(`/jogos/${jogoId}/imagens`, {
            url: itensGaleria[i].url,
            legenda: itensGaleria[i].legenda,
            ordem: i
          }, { headers: { token } });
        }
      } else if (itensGaleria.length > 0 && jogoId && jogoEmEdicao) {
        for (let i = 0; i < itensGaleria.length; i++) {
          try {
            await api.post(`/jogos/${jogoId}/imagens`, {
              url: itensGaleria[i].url,
              legenda: itensGaleria[i].legenda,
              ordem: i
            }, { headers: { token } });
          } catch(err) {
            console.error(err);
          }
        }
      }

      limparFormulario();
      carregarMeusJogos();
      setActiveTab("meus-jogos");

    } catch (error) {
      if (showToast) showToast(jogoEmEdicao ? "Erro ao atualizar o jogo." : "Erro ao publicar o jogo.", "erro");
    }
  };

  if (!isLoggedIn) return null;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-4 border-b border-white/10 mb-8 pb-4">
          <button 
            onClick={() => {
              if(!jogoEmEdicao) limparFormulario();
              setActiveTab("publicar");
            }}
            className={`text-lg font-bold transition-all px-3 py-1 rounded ${activeTab === "publicar" ? "text-[#00ff9d] border border-[#00ff9d]" : "text-muted-foreground hover:text-white border border-transparent"}`}
          >
            {jogoEmEdicao ? "Editar Jogo" : "Publicar Novo Jogo"}
          </button>
          <button 
            onClick={() => {
              limparFormulario();
              setActiveTab("meus-jogos");
            }}
            className={`text-lg font-bold transition-all px-3 py-1 rounded ${activeTab === "meus-jogos" ? "text-[#00ff9d] border border-[#00ff9d]" : "text-muted-foreground hover:text-white border border-transparent"}`}
          >
            Meus Jogos
          </button>
        </div>

        {activeTab === "publicar" && (
          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-white/5 space-y-6 max-w-4xl mx-auto">
            
            {jogoEmEdicao && (
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-lg mb-6 flex justify-between items-center">
                <span>Você está editando: <strong>{titulo}</strong></span>
                <button type="button" onClick={limparFormulario} className="text-sm underline hover:text-blue-300">
                  Cancelar edição
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Título *</label>
                <input required value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Desenvolvedora *</label>
                <input required value={desenvolvedora} onChange={e => setDesenvolvedora(e.target.value)} className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Descrição *</label>
              <textarea 
                required 
                rows="4" 
                value={descricao} 
                onChange={e => setDescricao(e.target.value)} 
                className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary resize-y min-h-[120px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-zinc-900/50 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-600" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">URL da Capa Principal *</label>
              <input required type="url" value={capaUrl} onChange={e => setCapaUrl(e.target.value)} placeholder="https://..." className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-white/5">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Galeria de Imagens (Opcional)</h3>
              <div className="space-y-4">
                <input type="url" value={galeria1} onChange={e => setGaleria1(e.target.value)} placeholder="URL da Screenshot 1" className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary text-sm" />
                <input type="url" value={galeria2} onChange={e => setGaleria2(e.target.value)} placeholder="URL da Screenshot 2" className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary text-sm" />
                <input type="url" value={galeria3} onChange={e => setGaleria3(e.target.value)} placeholder="URL da Screenshot 3" className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary text-sm" />
                <input type="url" value={galeria4} onChange={e => setGaleria4(e.target.value)} placeholder="URL da Screenshot 4" className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary text-sm" />
                <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="URL do Vídeo" className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Preço (R$) *</label>
                <input required type="number" step="0.01" min="0" value={preco} onChange={e => setPreco(e.target.value)} className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Data de Lançamento</label>
                <input required type="date" value={lancamento} onChange={e => setLancamento(e.target.value)} className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-4">Gêneros *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {listaGeneros.map(g => (
                  <label key={g.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={generosSelecionados.includes(g.nome)} onChange={() => toggleGenero(g.nome)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                    <span className="text-sm">{g.nome}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-[#00ff9d] text-black font-black py-4 rounded-lg hover:bg-[#00e08a] transition-all mt-8">
              {jogoEmEdicao ? "Salvar Alterações" : "Publicar Jogo"}
            </button>
          </form>
        )}

        {activeTab === "meus-jogos" && (
          <div className="min-h-[400px]">
            {carregandoMeusJogos ? (
              <div className="text-center text-muted-foreground py-10">Carregando seus jogos...</div>
            ) : meusJogos.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 bg-card rounded-2xl border border-white/5">Você ainda não publicou nenhum jogo.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {meusJogos.map(jogo => (
                  <div key={jogo.id} className="relative cursor-pointer group" onClick={() => navigate(`/jogo/${jogo.id}`)}>
                    <GameCard game={jogo} />
                    
                    <div className="absolute top-2 right-2 flex gap-1 bg-black/60 backdrop-blur p-1 rounded-lg">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarClick(jogo);
                        }} 
                        className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-500 rounded transition-colors"
                        title="Editar Jogo"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setJogoParaDeletar(jogo);
                        }} 
                        className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded transition-colors"
                        title="Excluir Jogo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {jogoParaDeletar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border border-white/10 p-6 rounded-xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-2">Excluir Jogo?</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Tem certeza que deseja excluir <strong>"{jogoParaDeletar.titulo || 'Jogo Desconhecido'}"</strong> da loja?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setJogoParaDeletar(null)} 
                className="flex-1 py-2.5 rounded-lg font-semibold text-zinc-300 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  handleDeletar(jogoParaDeletar.id || jogoParaDeletar.jogoId);
                  setJogoParaDeletar(null);
                }} 
                className="flex-1 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg font-semibold transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}