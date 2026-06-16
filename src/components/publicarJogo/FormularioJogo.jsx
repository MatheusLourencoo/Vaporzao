import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { X, Image as ImageIcon, Info, Tag, MonitorPlay } from "lucide-react";

const InputGaleria = ({ valor, setValor, placeholder }) => (
  <div className="relative group">
    <input 
      type="url" 
      value={valor} 
      onChange={e => setValor(e.target.value)} 
      placeholder={placeholder} 
      className="w-full p-4 pr-10 bg-[#202020] rounded-lg border border-transparent outline-none focus:border-[#00ff9d] focus:bg-[#2a2a2a] hover:bg-[#2a2a2a] transition-all text-white placeholder:text-zinc-600" 
    />
    {valor && (
      <button 
        type="button" 
        onClick={() => setValor("")} 
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-white rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" 
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

export function FormularioJogo({ listaGeneros, dadosEdicao, onSucesso, onCancelar, showToast }) {
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
  const [imagensOriginais, setImagensOriginais] = useState([]);
  const [estadoOriginal, setEstadoOriginal] = useState("");
  const [salvando, setSalvando] = useState(false);

  const jogoEmEdicao = dadosEdicao ? dadosEdicao.id : null;

  useEffect(() => {
    if (dadosEdicao) {
      setTitulo(dadosEdicao.titulo || "");
      setDescricao(dadosEdicao.descricao || "");
      setDesenvolvedora(dadosEdicao.desenvolvedora || "");
      setPreco(dadosEdicao.preco !== undefined ? dadosEdicao.preco.toString() : "");
      setLancamento(dadosEdicao.lancamento || "");
      setCapaUrl(dadosEdicao.capaUrl || "");
      setGenerosSelecionados(dadosEdicao.generosSelecionados || []);
      setGaleria1(dadosEdicao.galeria1 || "");
      setGaleria2(dadosEdicao.galeria2 || "");
      setGaleria3(dadosEdicao.galeria3 || "");
      setGaleria4(dadosEdicao.galeria4 || "");
      setVideoUrl(dadosEdicao.videoUrl || "");
      setImagensOriginais(dadosEdicao.imagensOriginais || []);
      setEstadoOriginal(dadosEdicao.estadoOriginal || "");
    } else {
      limparFormularioInterno();
    }
  }, [dadosEdicao]);

  const limparFormularioInterno = () => {
    setTitulo(""); setDescricao(""); setPreco(""); setDesenvolvedora("");
    setLancamento(""); setCapaUrl(""); setGenerosSelecionados([]);
    setGaleria1(""); setGaleria2(""); setGaleria3(""); setGaleria4("");
    setVideoUrl(""); setImagensOriginais([]); setEstadoOriginal("");
    setSalvando(false);
  };

  const formAtualObj = {
    titulo: titulo.trim(), descricao: descricao.trim(), preco: Number(preco) || 0,
    desenvolvedora: desenvolvedora.trim(), lancamento, capaUrl: capaUrl.trim(),
    generosSelecionados: [...generosSelecionados].sort(),
    galeria1: galeria1.trim(), galeria2: galeria2.trim(), galeria3: galeria3.trim(),
    galeria4: galeria4.trim(), videoUrl: videoUrl.trim()
  };

  const hasChanges = !jogoEmEdicao || JSON.stringify(formAtualObj) !== estadoOriginal;

  const toggleGenero = (nomeGenero) => {
    setGenerosSelecionados(prev => prev.includes(nomeGenero) ? prev.filter(g => g !== nomeGenero) : [...prev, nomeGenero]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !desenvolvedora.trim() || !descricao.trim() || !capaUrl.trim() || preco === "" || !lancamento) {
      if (showToast) showToast("Preencha todos os campos obrigatórios (incluindo a capa do projeto).", "aviso");
      return;
    }

    if (generosSelecionados.length === 0) {
      if (showToast) showToast("Selecione pelo menos uma tag de categoria para o projeto.", "aviso");
      return;
    }

    if (!hasChanges) return;
    setSalvando(true);
    
    const token = localStorage.getItem("vaporzao_token");

    try {
      const payload = {
        titulo: titulo.trim(), descricao: descricao.trim(), preco: Number(preco),
        desenvolvedora: desenvolvedora.trim(),
        lancamento: lancamento ? new Date(lancamento).toISOString() : new Date().toISOString(),
        capaUrl: capaUrl.trim(),
        generoIds: generosSelecionados.map(nome => {
          const gen = listaGeneros.find(g => g.nome === nome);
          return gen ? gen.id : nome;
        }).filter(id => id)
      };

      let jogoId = jogoEmEdicao;

      if (jogoEmEdicao) {
        await api.put(`/jogos/${jogoEmEdicao}`, payload, { headers: { token } });
      } else {
        const resJogo = await api.post('/jogos', payload, { headers: { token } });
        jogoId = resJogo.data.id;
      }

      const urlsAtuaisDaTela = [galeria1, galeria2, galeria3, galeria4, videoUrl]
        .map(u => u.trim())
        .filter(u => u !== "");

      // 1. LÓGICA DE EXCLUSÃO (Com tratamento anti-duplicação e fallback de rota)
      if (jogoEmEdicao) {
        const imagensParaDeletar = imagensOriginais.filter(img => !urlsAtuaisDaTela.includes(img.url.trim()));
        
        for (const img of imagensParaDeletar) {
          try { 
            // Tentativa 1: Rota aninhada
            await api.delete(`/jogos/${jogoId}/imagens/${img.id}`, { headers: { token } }); 
          } catch(err) {
            // Se der erro 404/405, tenta a rota direta
            if (err.response?.status === 404 || err.response?.status === 405) {
              try {
                // Tentativa 2: Rota direta
                await api.delete(`/imagens/${img.id}`, { headers: { token } });
              } catch (errFallback) {
                console.error("Backend recusou exclusão nas duas rotas:", errFallback);
                if (showToast) showToast("Aviso: A API bloqueou a exclusão. O backend precisa de revisão na rota de DELETE.", "aviso");
              }
            } else {
              console.error("Erro desconhecido ao deletar mídia:", err);
            }
          }
        }
      }

      // 2. Adicionar apenas o que é estritamente novo
      const urlsOriginais = imagensOriginais.map(img => img.url.trim());
      const urlsParaAdicionar = urlsAtuaisDaTela.filter(url => !urlsOriginais.includes(url));

      if (urlsParaAdicionar.length > 0) {
        for (let i = 0; i < urlsParaAdicionar.length; i++) {
          const url = urlsParaAdicionar[i];
          const isVideo = url.includes("tiktok.com") || url.includes("youtube.com") || url.includes("youtu.be");
          
          try {
            await api.post(`/jogos/${jogoId}/imagens`, {
              url: url, 
              legenda: isVideo ? "Video" : `Screenshot`,
              ordem: jogoEmEdicao ? imagensOriginais.length + i : i
            }, { headers: { token } });
          } catch(err) {
            console.error("Erro ao adicionar mídia:", err);
          }
        }
      }

      if (showToast) showToast(jogoEmEdicao ? "Cadastro atualizado com sucesso!" : "Projeto hospedado com sucesso!", "sucesso");
      limparFormularioInterno();
      onSucesso();

    } catch (error) {
      if (showToast) showToast(jogoEmEdicao ? "Erro ao atualizar dados." : "Erro ao hospedar o projeto.", "erro");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10">
      
      {jogoEmEdicao && (
        <div className="bg-[#18181c] border-l-4 border-[#00ff9d] p-6 rounded-r-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[#00ff9d] font-bold text-sm tracking-wide uppercase mb-1">Modo de Edição</p>
            <h2 className="text-white text-2xl font-black">{titulo || "Carregando..."}</h2>
          </div>
          <button type="button" onClick={() => { limparFormularioInterno(); onCancelar(); }} className="px-6 py-3 bg-[#2a2a2a] hover:bg-[#333] text-white font-bold rounded-lg transition-colors">
            Descartar Edição
          </button>
        </div>
      )}

      <div className="bg-[#18181c] rounded-2xl p-8 border border-white/5">
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
          <Info className="w-5 h-5 text-zinc-400" />
          <h2 className="text-xl font-bold text-white">Detalhes do Produto</h2>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-zinc-300">Nome do Projeto *</label>
              <input required value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full p-4 bg-[#202020] rounded-lg border border-transparent outline-none focus:border-[#00ff9d] focus:bg-[#2a2a2a] hover:bg-[#2a2a2a] transition-all text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-zinc-300">Estúdio / Desenvolvedora *</label>
              <input required value={desenvolvedora} onChange={e => setDesenvolvedora(e.target.value)} className="w-full p-4 bg-[#202020] rounded-lg border border-transparent outline-none focus:border-[#00ff9d] focus:bg-[#2a2a2a] hover:bg-[#2a2a2a] transition-all text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-zinc-300">Descrição Geral *</label>
            <textarea required rows="5" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full p-4 bg-[#202020] rounded-lg border border-transparent outline-none focus:border-[#00ff9d] focus:bg-[#2a2a2a] hover:bg-[#2a2a2a] transition-all text-white resize-y" />
          </div>
        </div>
      </div>

      <div className="bg-[#18181c] rounded-2xl p-8 border border-white/5">
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
          <ImageIcon className="w-5 h-5 text-zinc-400" />
          <h2 className="text-xl font-bold text-white">Identidade Visual</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-zinc-300">Imagem de Capa (Proporção Vertical) *</label>
            <InputGaleria valor={capaUrl} setValor={setCapaUrl} placeholder="Insira a URL da imagem principal da vitrine..." />
          </div>

          <div className="pt-4 border-t border-white/5">
            <label className="block text-sm font-bold mb-4 text-zinc-300">Capturas de Tela e Vídeo de Demonstração (Links Externos)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGaleria valor={galeria1} setValor={setGaleria1} placeholder="URL para a 1ª Captura de Tela" />
              <InputGaleria valor={galeria2} setValor={setGaleria2} placeholder="URL para a 2ª Captura de Tela" />
              <InputGaleria valor={galeria3} setValor={setGaleria3} placeholder="URL para a 3ª Captura de Tela" />
              <InputGaleria valor={galeria4} setValor={setGaleria4} placeholder="URL para a 4ª Captura de Tela" />
              <div className="md:col-span-2">
                <InputGaleria valor={videoUrl} setValor={setVideoUrl} placeholder="URL do Trailer de Lançamento" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#18181c] rounded-2xl p-8 border border-white/5">
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
          <MonitorPlay className="w-5 h-5 text-zinc-400" />
          <h2 className="text-xl font-bold text-white">Modelo de Negócio e Distribuição</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-bold mb-2 text-zinc-300">Preço de Venda (R$) *</label>
            <input required type="number" step="0.01" min="0" value={preco} onChange={e => setPreco(e.target.value)} className="w-full p-4 bg-[#202020] rounded-lg border border-transparent outline-none focus:border-[#00ff9d] focus:bg-[#2a2a2a] hover:bg-[#2a2a2a] transition-all text-white font-mono text-lg" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-zinc-300">Data Oficial de Lançamento *</label>
            <input required type="date" value={lancamento} onChange={e => setLancamento(e.target.value)} className="w-full p-4 bg-[#202020] rounded-lg border border-transparent outline-none focus:border-[#00ff9d] focus:bg-[#2a2a2a] hover:bg-[#2a2a2a] transition-all text-white [color-scheme:dark]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-4 text-zinc-300 flex items-center gap-2"><Tag className="w-4 h-4"/> Categorias do Projeto *</label>
          <div className="flex flex-wrap gap-3">
            {listaGeneros.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenero(g.nome)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                  generosSelecionados.includes(g.nome) 
                    ? "bg-[#00ff9d] text-black border-[#00ff9d]" 
                    : "bg-[#202020] text-zinc-400 border-transparent hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                {g.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={salvando || (jogoEmEdicao && !hasChanges)} 
          className={`px-10 py-4 rounded-xl font-black text-lg transition-all uppercase tracking-wide ${ 
            salvando 
              ? "bg-[#00ff9d] text-black opacity-70 cursor-wait" 
              : jogoEmEdicao && !hasChanges 
              ? "bg-[#2a2a2a] text-zinc-500 cursor-not-allowed" 
              : "bg-[#00ff9d] text-black hover:bg-[#00e08a] hover:scale-[1.02] shadow-xl shadow-[#00ff9d]/20" 
          }`}
        >
          {salvando ? "Enviando Build..." : jogoEmEdicao ? (!hasChanges ? "Sem Alterações" : "Salvar Configurações") : "Hospedar Jogo"}
        </button>
      </div>
    </form>
  );
}