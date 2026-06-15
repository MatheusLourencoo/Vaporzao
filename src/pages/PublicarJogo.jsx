import { useState, useEffect } from "react";
import { LayoutGrid, Plus, UploadCloud } from "lucide-react";
import { api } from "../services/api";
import { ModalExclusao } from "../components/modals/ModalExclusao";
import { FormularioJogo } from "../components/publicarJogo/FormularioJogo";
import { ListaMeusJogos } from "../components/publicarJogo/ListaMeusJogos";

export default function PublicarJogo({ isLoggedIn, onRequestLogin, showToast }) {
  const [activeTab, setActiveTab] = useState("publicar");
  const [meusJogos, setMeusJogos] = useState([]);
  const [carregandoMeusJogos, setCarregandoMeusJogos] = useState(false);
  const [listaGeneros, setListaGeneros] = useState([]);
  const [dadosEdicao, setDadosEdicao] = useState(null);
  const [jogoParaDeletar, setJogoParaDeletar] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) onRequestLogin();
    api.get('/generos').then(res => setListaGeneros(res.data)).catch(() => {});
  }, [isLoggedIn, onRequestLogin]);

  useEffect(() => {
    const token = localStorage.getItem("vaporzao_token");
    if (activeTab === "meus-jogos" && token && meusJogos.length === 0) {
      carregarMeusJogos();
    }
  }, [activeTab]);

  const carregarMeusJogos = async () => {
    setCarregandoMeusJogos(true);
    const token = localStorage.getItem("vaporzao_token");
    
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
    const token = localStorage.getItem("vaporzao_token");
    
    try {
      if (id) await api.delete(`/jogos/${id}`, { headers: { token } });
      if (showToast) showToast("Jogo removido com sucesso!", "sucesso");
    } catch (err) {
      if (showToast) showToast("Registro removido da interface.", "sucesso");
    } finally {
      setMeusJogos(prev => prev.filter(j => j.id !== id && j.jogoId !== id));
      setJogoParaDeletar(null);
    }
  };

  const handleEditarClick = async (jogoResumo) => {
    const id = jogoResumo.id || jogoResumo.jogoId;
    
    try {
      const resJogo = await api.get(`/jogos/${id}`);
      const jogoCompleto = resJogo.data;
      const dataFormatada = jogoCompleto.lancamento ? jogoCompleto.lancamento.split('T')[0] : "";
      
      const generosDoJogo = jogoCompleto.generos 
        ? jogoCompleto.generos.map(g => typeof g === 'object' ? g.nome : g) 
        : [];

      let imagens = [];
      let g1 = "", g2 = "", g3 = "", g4 = "", vUrl = "";
      
      try {
        const resImagens = await api.get(`/jogos/${id}/imagens`);
        imagens = resImagens.data || [];
        
        // LÓGICA NOVA: Separa vídeos de fotos para não bagunçar os inputs!
        const isVideo = (url) => url && (url.includes("tiktok.com") || url.includes("youtube.com") || url.includes("youtu.be"));
        const videos = imagens.filter(img => isVideo(img.url));
        const fotos = imagens.filter(img => !isVideo(img.url));

        g1 = fotos[0]?.url || "";
        g2 = fotos[1]?.url || "";
        g3 = fotos[2]?.url || "";
        g4 = fotos[3]?.url || "";
        vUrl = videos[0]?.url || ""; // O vídeo sempre cai no input de vídeo agora
      } catch (err) {}
      
      setDadosEdicao({
        id, titulo: jogoCompleto.titulo || "", descricao: jogoCompleto.descricao || "",
        desenvolvedora: jogoCompleto.desenvolvedora || "", preco: jogoCompleto.preco !== undefined ? jogoCompleto.preco.toString() : "",
        lancamento: dataFormatada, capaUrl: jogoCompleto.capaUrl || "", generosSelecionados: generosDoJogo,
        imagensOriginais: imagens, galeria1: g1, galeria2: g2, galeria3: g3, galeria4: g4, videoUrl: vUrl,
        estadoOriginal: JSON.stringify({
          titulo: (jogoCompleto.titulo || "").trim(), descricao: (jogoCompleto.descricao || "").trim(),
          preco: jogoCompleto.preco !== undefined ? Number(jogoCompleto.preco) : 0,
          desenvolvedora: (jogoCompleto.desenvolvedora || "").trim(), lancamento: dataFormatada,
          capaUrl: (jogoCompleto.capaUrl || "").trim(), generosSelecionados: [...generosDoJogo].sort(),
          galeria1: g1.trim(), galeria2: g2.trim(), galeria3: g3.trim(),
          galeria4: g4.trim(), videoUrl: vUrl.trim()
        })
      });

      setActiveTab("publicar");
    } catch (error) {
      if (showToast) showToast("Erro ao carregar dados completos do jogo.", "erro");
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 font-sans pb-24">
      
      <div className="bg-[#18181c] border-b border-white/5 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <UploadCloud className="w-8 h-8 text-[#00ff9d]" />
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Vaporzão Works</h1>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl">
           Sua visão, nossa vitrine. Tenha total liberdade para publicar seus projetos, ajustar detalhes da sua vitrine e manter sua comunidade sempre por dentro das novidades.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        
        <div className="flex gap-8 border-b border-white/10 mb-8">
          <button
            onClick={() => { setDadosEdicao(null); setActiveTab("publicar"); }}
            className={`pb-4 text-sm uppercase tracking-wider font-bold transition-all relative ${
              activeTab === "publicar" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> {dadosEdicao ? "Configurações do Jogo" : "Hospedar Novo Jogo"}
            </span>
            {activeTab === "publicar" && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#00ff9d]" />}
          </button>
          
          <button
            onClick={() => { setDadosEdicao(null); setActiveTab("meus-jogos"); }}
            className={`pb-4 text-sm uppercase tracking-wider font-bold transition-all relative ${
              activeTab === "meus-jogos" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> Meu Catálogo
            </span>
            {activeTab === "meus-jogos" && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#00ff9d]" />}
          </button>
        </div>

        <div className="animate-in fade-in duration-500">
          {activeTab === "publicar" ? (
            <FormularioJogo
              listaGeneros={listaGeneros}
              dadosEdicao={dadosEdicao}
              showToast={showToast}
              onCancelar={() => setDadosEdicao(null)}
              onSucesso={() => {
                setDadosEdicao(null);
                carregarMeusJogos();
                setActiveTab("meus-jogos");
              }}
            />
          ) : (
            <ListaMeusJogos
              meusJogos={meusJogos}
              carregandoMeusJogos={carregandoMeusJogos}
              onEditar={handleEditarClick}
              onDeletar={(jogo) => setJogoParaDeletar(jogo)}
            />
          )}
        </div>
      </div>

      <ModalExclusao
        jogo={jogoParaDeletar}
        onConfirmar={handleDeletar}
        onCancelar={() => setJogoParaDeletar(null)}
      />
    </div>
  );
}