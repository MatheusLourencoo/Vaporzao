import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Pencil, X, Save, Check } from "lucide-react";

const InputGaleria = ({ valor, setValor, placeholder }) => (
  <div className="relative group">
    <input 
      type="url" 
      value={valor} 
      onChange={e => setValor(e.target.value)} 
      placeholder={placeholder} 
      className="w-full p-3 pr-10 bg-[#121212] rounded-lg border border-white/5 outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] text-sm transition-all text-zinc-300 placeholder:text-zinc-600" 
    />
    {valor && (
      <button 
        type="button" 
        onClick={() => setValor("")} 
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" 
      >
        <X className="w-4 h-4" />
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

      const urlsAtuaisDaTela = [galeria1, galeria2, galeria3, galeria4, videoUrl].map(u => u.trim()).filter(u => u !== "");

      if (jogoEmEdicao) {
        const imagensParaDeletar = imagensOriginais.filter(img => !urlsAtuaisDaTela.includes(img.url));
        for (const img of imagensParaDeletar) {
          try { 
            await api.delete(`/jogos/${jogoId}/imagens/${img.id}`, { headers: { token } }); 
          } catch(err) {
            if (showToast) showToast("Falha ao remover imagem antiga.", "aviso");
          }
        }
      }

      const itensGaleria = [
        { url: galeria1.trim(), legenda: "Screenshot 1" },
        { url: galeria2.trim(), legenda: "Screenshot 2" },
        { url: galeria3.trim(), legenda: "Screenshot 3" },
        { url: galeria4.trim(), legenda: "Screenshot 4" },
        { url: videoUrl.trim(), legenda: "Video" }
      ].filter(item => item.url !== "");

      const urlsOriginais = imagensOriginais.map(img => img.url);
      const imagensNovas = jogoEmEdicao 
        ? itensGaleria.filter(item => !urlsOriginais.includes(item.url))
        : itensGaleria;

      if (imagensNovas.length > 0 && jogoId) {
        for (let i = 0; i < imagensNovas.length; i++) {
          try {
            await api.post(`/jogos/${jogoId}/imagens`, {
              url: imagensNovas[i].url, legenda: imagensNovas[i].legenda,
              ordem: jogoEmEdicao ? imagensOriginais.length + i : i
            }, { headers: { token } });
          } catch(err) {
            if (showToast) showToast(`Falha ao salvar a imagem ${i + 1}.`, "aviso");
          }
        }
      }

      if (showToast) showToast(jogoEmEdicao ? "Jogo atualizado com sucesso!" : "Jogo publicado com sucesso!", "sucesso");
      limparFormularioInterno();
      onSucesso();

    } catch (error) {
      if (showToast) showToast(jogoEmEdicao ? "Erro ao atualizar o jogo." : "Erro ao publicar o jogo.", "erro");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-white/5 space-y-6 max-w-4xl mx-auto shadow-2xl">
      {jogoEmEdicao && (
        <div className="relative overflow-hidden bg-[#00ff9d]/5 border border-[#00ff9d]/20 p-6 rounded-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_0_30px_rgba(0,255,157,0.05)]">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff9d]"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#00ff9d]/10 rounded-lg shrink-0">
              <Pencil className="w-6 h-6 text-[#00ff9d]" />
            </div>
            <div>
              <h3 className="text-[#00ff9d] font-bold text-xs uppercase tracking-widest mb-1">Modo de Edição</h3>
              <p className="text-white text-xl font-black">{titulo || "Carregando..."}</p>
            </div>
          </div>
          <button type="button" onClick={() => { limparFormularioInterno(); onCancelar(); }} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-all border border-white/10 shrink-0 flex items-center gap-2">
            <X className="w-4 h-4" /> Cancelar edição
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold mb-2 text-zinc-300">Título *</label>
          <input required value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full p-3 bg-input rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-zinc-300">Desenvolvedora *</label>
          <input required value={desenvolvedora} onChange={e => setDesenvolvedora(e.target.value)} className="w-full p-3 bg-input rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-zinc-300">Descrição *</label>
        <textarea required rows="4" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full p-3 bg-input rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary text-white resize-y min-h-[120px]" />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-zinc-300">URL da Capa Principal *</label>
        <InputGaleria valor={capaUrl} setValor={setCapaUrl} placeholder="https://..." />
      </div>

      <div className="bg-[#151515] p-6 rounded-xl border border-white/5">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Galeria de Mídia (Opcional)</h3>
        <div className="space-y-3">
          <InputGaleria valor={galeria1} setValor={setGaleria1} placeholder="URL da Screenshot 1" />
          <InputGaleria valor={galeria2} setValor={setGaleria2} placeholder="URL da Screenshot 2" />
          <InputGaleria valor={galeria3} setValor={setGaleria3} placeholder="URL da Screenshot 3" />
          <InputGaleria valor={galeria4} setValor={setGaleria4} placeholder="URL da Screenshot 4" />
          <InputGaleria valor={videoUrl} setValor={setVideoUrl} placeholder="URL do Vídeo (Trailer)" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold mb-2 text-zinc-300">Preço (R$) *</label>
          <input required type="number" step="0.01" min="0" value={preco} onChange={e => setPreco(e.target.value)} className="w-full p-3 bg-input rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary text-white" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-zinc-300">Data de Lançamento</label>
          <input required type="date" value={lancamento} onChange={e => setLancamento(e.target.value)} className="w-full p-3 bg-input rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary text-white [color-scheme:dark]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-4 text-zinc-300">Gêneros *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#151515] p-6 rounded-xl border border-white/5">
          {listaGeneros.map(g => (
            <label key={g.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${generosSelecionados.includes(g.nome) ? "bg-[#00ff9d] border-[#00ff9d]" : "bg-transparent border-zinc-600 group-hover:border-[#00ff9d]"}`}>
                {generosSelecionados.includes(g.nome) && <Check className="w-3 h-3 text-black stroke-[4]" />}
              </div>
              <input type="checkbox" checked={generosSelecionados.includes(g.nome)} onChange={() => toggleGenero(g.nome)} className="hidden" />
              <span className={`text-sm font-medium transition-colors ${generosSelecionados.includes(g.nome) ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"}`}>{g.nome}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={salvando || (jogoEmEdicao && !hasChanges)} className={`w-full flex items-center justify-center gap-2 font-black py-4 rounded-xl transition-all mt-8 ${ salvando ? "bg-[#00ff9d] text-black opacity-70 cursor-wait" : jogoEmEdicao && !hasChanges ? "bg-[#2a2a2a] text-zinc-500 cursor-not-allowed border border-white/5" : "bg-[#00ff9d] text-black hover:bg-[#00e08a] shadow-[0_0_15px_rgba(0,255,157,0.15)] hover:shadow-[0_0_25px_rgba(0,255,157,0.3)]" }`}>
        <Save className="w-5 h-5" />
        {salvando ? "Salvando..." : jogoEmEdicao ? (!hasChanges ? "Nenhuma alteração detectada" : "Salvar Alterações") : "Publicar Jogo"}
      </button>
    </form>
  );
}