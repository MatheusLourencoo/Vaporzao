import { useState, useEffect } from "react";
import { Header } from "./components/common/header";
import { Footer } from "./components/common/Footer";
import { LoginModal } from "./components/modals/LoginModal";
import { ToastNotification } from "./components/common/ToastNotification";
import { AppRoutes } from "./routes/Routes";
import { useToast } from "./hooks/useToast";
import { useMenuUsuario } from "./hooks/useMenusUsuarios";
import { api } from "./services/api"; 

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("vaporzao_token"));
  const [searchQuery, setSearchQuery] = useState("");
  const { toast, showToast } = useToast();
  const { 
    biblioteca, wishlist, 
    adicionarNaBiblioteca, removerDaBiblioteca, 
    adicionarNaWishlist, removerDaWishlist 
  } = useMenuUsuario(isLoggedIn, setShowLogin, showToast);

  useEffect(() => {
    if (!isLoggedIn) return;

    const verificarToken = async () => {
      const token = localStorage.getItem("vaporzao_token");
      
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        await api.get('/auth/me', { 
          headers: { token } 
        });
      } catch (error) {
        console.error("Token expirou no loop. Deslogando usuário...");
        localStorage.removeItem("vaporzao_token");
        setIsLoggedIn(false);
        showToast("Sua sessão expirou. Por favor, faça login novamente.", "aviso");
      }
    };

    const TEMPO_LOOP = 15 * 60 * 1000; 
    
    const intervalo = setInterval(verificarToken, TEMPO_LOOP);

    return () => clearInterval(intervalo);
  }, [isLoggedIn, showToast]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setShowLogin={setShowLogin}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <AppRoutes 
          searchQuery={searchQuery}
          biblioteca={biblioteca}
          wishlist={wishlist}
          adicionarNaBiblioteca={adicionarNaBiblioteca}
          removerDaBiblioteca={removerDaBiblioteca}
          adicionarNaWishlist={adicionarNaWishlist}
          removerDaWishlist={removerDaWishlist}
          isLoggedIn={isLoggedIn}
          setShowLogin={setShowLogin}
          showToast={showToast}
        />
      </main>

      <Footer />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={() => { setIsLoggedIn(true); setShowLogin(false); }} />}
      <ToastNotification toast={toast} />
    </div>
  );
}