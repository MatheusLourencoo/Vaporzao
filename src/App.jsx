import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/LoginModal";
import { ToastNotification } from "./components/ToastNotification";
import { AppRoutes } from "./routes/Routes"; 
import { useToast } from "./hooks/useToast";
import { useMenuUsuario } from "./hooks/useMenusUsuarios";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast, showToast } = useToast();
  const { 
    biblioteca, wishlist, 
    adicionarNaBiblioteca, removerDaBiblioteca, 
    adicionarNaWishlist, removerDaWishlist 
  } = useMenuUsuario(isLoggedIn, setShowLogin, showToast);

  // Verifica login inicial
  useEffect(() => {
    if (localStorage.getItem("vaporzao_token")) setIsLoggedIn(true);
  }, []);

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