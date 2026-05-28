import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";

export function LoginModal({ onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Integração com a API real:
  // async function handleLogin() {
  //   const user = await login({ matricula, senha });
  //   onLoginSuccess?.();
  // }
  //
  // async function handleRegister() {
  //   const user = await primeiroAcesso({ matricula, senha });
  //   onLoginSuccess?.();
  // }

  // Simulação de login para o protótipo (substitua pelas funções da API acima)
  function handleSimulatedSubmit(e) {
    e.preventDefault();
    if (matricula && senha) {
      localStorage.setItem("vaporzao_token", "mock-token-prototipo");
      onLoginSuccess?.();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg p-8 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Entrar no Vaporzão</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-4 mb-6 border-b border-border">
          {["login", "registro"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-semibold transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "login" ? "Login" : "Primeiro Acesso"}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        <form onSubmit={handleSimulatedSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Matrícula</label>
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Digite sua matrícula"
              className="w-full bg-input border border-border rounded-md p-3 text-foreground"
            />
          </div>

          <div>
            <label className="block mb-2">{activeTab === "registro" ? "Nova Senha" : "Senha"}</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder={activeTab === "registro" ? "Digite sua nova senha" : "Digite sua senha"}
              className="w-full bg-input border border-border rounded-md p-3 text-foreground"
            />
          </div>

          {activeTab === "registro" && (
            <div>
              <label className="block mb-2">Confirmar Senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua senha"
                className="w-full bg-input border border-border rounded-md p-3 text-foreground"
              />
            </div>
          )}

          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-md font-bold transition-all">
            {activeTab === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}