import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Trash2 } from "lucide-react";

export default function PublicarJogo({ isLoggedIn, onRequestLogin, showToast }) {
  const [activeTab, setActiveTab] = useState("publicar");
  const [meusJogos, setMeusJogos] = useState([]);
  const [carregandoMeusJogos, setCarregandoMeusJogos] = useState(false);
  const [listaGeneros, setListaGeneros] = useState([]);
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
      setMeusJogos(resUser.data.jogos || []);
    } catch (error) {
      if (showToast) showToast("Erro ao carregar seus jogos", "erro");
    } finally {
      setCarregandoMeusJogos(false);
    }
  };

  const handleDeletar = async (id) => {
    try {
      await api.delete(`/jogos/${id}`, { headers: { token } });
      if (showToast) showToast("Jogo removido com sucesso!", "sucesso");
      carregarMeusJogos();
    } catch (err) {
      if (showToast) showToast("Erro ao remover o jogo.", "erro");
    }
  };

  const toggleGenero = (id) => {
    setGenerosSelecionados(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
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
        generoIds: generosSelecionados
      };

      const resJogo = await api.post('/jogos', payload, { headers: { token } });
      const jogoId = resJogo.data.id;

      const fotosExtras = [galeria1, galeria2, galeria3].filter(url => url.trim() !== "");

      for (let i = 0; i < fotosExtras.length; i++) {
        await api.post(`/jogos/${jogoId}/imagens`, {
          url: fotosExtras[i],
          legenda: `Screenshot ${i + 1}`,
          ordem: i
        }, { headers: { token } });
      }

      if (showToast) showToast("Jogo e galeria publicados com sucesso!", "sucesso");
      
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
      
      setActiveTab("meus-jogos");

    } catch (error) {
      if (showToast) showToast("Erro ao publicar o jogo.", "erro");
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-4 border-b border-white/10 mb-8 pb-4">
        <button 
          onClick={() => setActiveTab("publicar")}
          className={`text-lg font-bold transition-colors ${activeTab === "publicar" ? "text-primary" : "text-muted-foreground hover:text-white"}`}
        >
          Publicar Novo Jogo
        </button>
        <button 
          onClick={() => setActiveTab("meus-jogos")}
          className={`text-lg font-bold transition-colors ${activeTab === "meus-jogos" ? "text-primary" : "text-muted-foreground hover:text-white"}`}
        >
          Meus Jogos
        </button>
      </div>

      {activeTab === "publicar" && (
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-white/5 space-y-6">
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
            <textarea required rows="4" value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full p-3 bg-input rounded outline-none focus:ring-2 focus:ring-primary" />
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
                  <input type="checkbox" checked={generosSelecionados.includes(g.id)} onChange={() => toggleGenero(g.id)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                  <span className="text-sm">{g.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-[#00ff9d] text-black font-black py-4 rounded-lg hover:bg-[#00e08a] transition-all mt-8">
            Publicar Jogo
          </button>
        </form>
      )}

      {activeTab === "meus-jogos" && (
        <div className="bg-card p-8 rounded-2xl border border-white/5 min-h-[400px]">
          {carregandoMeusJogos ? (
            <div className="text-center text-muted-foreground py-10">Carregando seus jogos...</div>
          ) : meusJogos.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">Você ainda não publicou nenhum jogo.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {meusJogos.map(jogo => (
                <div key={jogo.id} className="flex items-center justify-between bg-background p-4 rounded-lg border border-white/5">
                  <div className="flex items-center gap-4">
                    <img src={jogo.capaUrl} alt={jogo.titulo} className="w-16 h-16 object-cover rounded" onError={e => e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"} />
                    <div>
                      <h4 className="font-bold text-lg">{jogo.titulo}</h4>
                      <p className="text-sm text-muted-foreground">R$ {jogo.preco.toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeletar(jogo.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}