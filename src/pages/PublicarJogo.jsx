import { useState, useEffect } from "react";
import { api } from "../services/api";
import { ModalExclusao } from "../components/modals/ModalExclusao";
import {FormularioJogo} from "../components/publicarJogo/FormularioJogo"
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
        g1 = imagens[0]?.url || ""; g2 = imagens[1]?.url || "";
        g3 = imagens[2]?.url || ""; g4 = imagens[3]?.url || "";
        vUrl = imagens[4]?.url || "";
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
    <>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-4 border-b border-white/10 mb-8 pb-4">
          <button 
            onClick={() => { setDadosEdicao(null); setActiveTab("publicar"); }}
            className={`text-lg font-bold transition-all px-3 py-1 rounded ${activeTab === "publicar" ? "text-[#00ff9d] border border-[#00ff9d]" : "text-muted-foreground hover:text-white border border-transparent"}`}
          >
            {dadosEdicao ? "Editar Jogo" : "Publicar Novo Jogo"}
          </button>
          <button 
            onClick={() => { setDadosEdicao(null); setActiveTab("meus-jogos"); }}
            className={`text-lg font-bold transition-all px-3 py-1 rounded ${activeTab === "meus-jogos" ? "text-[#00ff9d] border border-[#00ff9d]" : "text-muted-foreground hover:text-white border border-transparent"}`}
          >
            Meus Jogos
          </button>
        </div>

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

      <ModalExclusao 
        jogo={jogoParaDeletar} 
        onConfirmar={handleDeletar} 
        onCancelar={() => setJogoParaDeletar(null)} 
      />
    </>
  );
}