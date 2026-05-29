import { useState, useEffect } from "react";
import { Upload, Lock, Plus, X, Gamepad2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../services/api";

const FORM_INITIAL = {
  titulo: "",
  descricao: "",
  preco: "",
  desenvolvedora: "",
  lancamento: "",
  capaUrl: "",
  generosSelecionados: []
};

export default function PublicarJogo({ isLoggedIn, onRequestLogin }) {
  const [form, setForm] = useState(FORM_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [listaGeneros, setListaGeneros] = useState([]);

  useEffect(() => {
    api.get('/generos')
      .then((resposta) => setListaGeneros(resposta.data))
      .catch((erro) => console.error("Erro ao carregar gêneros no form:", erro));
  }, []);

  function toggleGenero(generoId) {
    setForm((prev) => ({
      ...prev,
      generosSelecionados: prev.generosSelecionados.includes(generoId)
        ? prev.generosSelecionados.filter((id) => id !== generoId)
        : [...prev.generosSelecionados, generoId]
    }));
  }

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.generosSelecionados.length === 0) {
      setErrorMsg("Selecione pelo menos um gênero.");
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setStatus("idle");

    const payload = {
      titulo: form.titulo,
      descricao: form.descricao,
      preco: parseFloat(form.preco.replace(",", ".")),
      desenvolvedora: form.desenvolvedora,
      lancamento: form.lancamento
        ? new Date(form.lancamento).toISOString()
        : new Date().toISOString(),
      capaUrl: form.capaUrl,
      generoIds: form.generosSelecionados
    };

    try {
      await api.post('/jogos', payload);

      setStatus("success");
      setForm(FORM_INITIAL);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Erro ao publicar o jogo.";
      setErrorMsg(msg);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-12 max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Você precisa estar logado para publicar um jogo na plataforma. Faça login com sua matrícula e senha.
          </p>
          <button
            onClick={onRequestLogin}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-5 h-5" />
            Fazer Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Publicar Jogo</h2>
        </div>
        <p className="text-muted-foreground">
          Compartilhe seu jogo com a comunidade Vaporzão.
        </p>
      </div>

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-primary/10 border border-primary/30 text-primary rounded-lg p-4 mb-6"
        >
          <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Jogo publicado com sucesso!</p>
            <p className="text-sm text-primary/80 mt-0.5">Seu jogo já está disponível na loja.</p>
          </div>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 mb-6"
        >
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Erro ao publicar</p>
            <p className="text-sm mt-0.5 opacity-80">{errorMsg}</p>
          </div>
          <button type="button" onClick={() => setStatus("idle")} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Título <span className="text-primary">*</span></label>
            <input required type="text" value={form.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Ex: Counter-Tapa" className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Desenvolvedora <span className="text-primary">*</span></label>
            <input required type="text" value={form.desenvolvedora} onChange={(e) => set("desenvolvedora", e.target.value)} placeholder="Ex: Banana Studios" className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Descrição <span className="text-primary">*</span></label>
          <textarea required value={form.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Descreva o jogo, mecânicas, história..." rows={4} className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">URL da Capa <span className="text-primary">*</span></label>
          <input required type="url" value={form.capaUrl} onChange={(e) => set("capaUrl", e.target.value)} placeholder="https://example.com/capa.jpg" className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          {form.capaUrl && (
            <div className="mt-3 relative aspect-video w-48 rounded-lg overflow-hidden border border-border">
              <img src={form.capaUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Preço (R$) <span className="text-primary">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">R$</span>
              <input required type="number" min="0" step="0.01" value={form.preco} onChange={(e) => set("preco", e.target.value)} placeholder="29.90" className="w-full bg-input border border-border rounded-lg pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Data de Lançamento</label>
            <input type="date" value={form.lancamento} onChange={(e) => set("lancamento", e.target.value)} className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">
            Gêneros <span className="text-primary">*</span> <span className="text-muted-foreground font-normal">(selecione ao menos 1)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {listaGeneros.map((genero) => {
              const selected = form.generosSelecionados.includes(genero.id);
              return (
                <button
                  key={genero.id}
                  type="button"
                  onClick={() => toggleGenero(genero.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-transparent hover:border-primary/40 hover:text-foreground"
                    }`}
                >
                  {selected && <span className="mr-1">✓</span>}
                  {genero.nome}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border" />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground py-3.5 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Publicando...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Publicar Jogo
            </>
          )}
        </button>
      </form>
    </div>
  );
}