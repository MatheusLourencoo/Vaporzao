import { useState } from "react";
import { X, User, Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { login, primeiroAcesso } from "../services/api"; 

export function LoginModal({ onClose, onLoginSuccess }) {
  const [isRegistro, setIsRegistro] = useState(false); 
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(""); 
    setSucesso("");
    setLoading(true); 

    try {
      if (isRegistro) {
        await primeiroAcesso({ matricula, senha });
        setSucesso("Conta criada com sucesso! Agora você pode fazer o login.");
        setIsRegistro(false); 
        setSenha("");
      } else {
        const data = await login({ matricula, senha });

        if (data.token) {
          localStorage.setItem("vaporzao_token", data.token);
        }
        onLoginSuccess();
      }
    } catch (err) {
      const mensagemErro = err.response?.data?.message || 
        (isRegistro ? "Erro ao criar conta. Matrícula pode já existir." : "Matrícula ou senha incorretos.");
      setErro(mensagemErro);
    } finally {
      setLoading(false); 
    }
  };

  const toggleModo = () => {
    setIsRegistro(!isRegistro);
    setErro("");
    setSucesso("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md relative p-8 shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {isRegistro ? "Criar Conta " : "Entrar"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isRegistro ? "Registre sua matrícula para publicar e comprar jogos." : "Insira suas credenciais para acessar sua conta."}
          </p>
        </div>

        {erro && (
          <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 border border-destructive/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{erro}</p>
          </div>
        )}

        {sucesso && (
          <div className="flex items-center gap-2 bg-primary/10 text-primary text-sm p-3 rounded-lg mb-6 border border-primary/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>{sucesso}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Matrícula</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                required
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Ex: 24-11886"
                className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="password" 
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                minLength={6}
                className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isRegistro ? "Cadastrando..." : "Autenticando..."}
              </>
            ) : (
              isRegistro ? "Cadastrar" : "Entrar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground border-t border-border pt-6">
          {isRegistro ? (
            <>
              Já possui uma conta?{" "}
              <button type="button" onClick={toggleModo} className="text-primary font-bold hover:underline">
                Faça login aqui
              </button>
            </>
          ) : (
            <>
              Ainda não tem conta?{" "}
              <button type="button" onClick={toggleModo} className="text-primary font-bold hover:underline">
                Cadastre-se aqui
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}