import { useState, useEffect } from "react";
import { useGames } from "./hooks/useGames";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Biblioteca } from "./pages/Biblioteca";
import { Wishlist } from "./pages/Wishlist";
import { LoginModal } from "./components/LoginModal";
import PublicarJogo from './components/PublicarJogo';
import { GameDetails } from "./pages/GameDetails";
import { api } from "./services/api";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Routes, Route } from "react-router-dom";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState("popularidade");
  const [searchQuery, setSearchQuery] = useState("");
  const [listaGeneros, setListaGeneros] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (mensagem, tipo = "sucesso") => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const [biblioteca, setBiblioteca] = useState(() => JSON.parse(localStorage.getItem("vaporzao_biblioteca") || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("vaporzao_wishlist") || "[]"));

  const adicionarNaBiblioteca = (jogo) => {
    if (!isLoggedIn) { showToast("Inicie sessão!", "aviso"); setShowLogin(true); return; }
    if (biblioteca.some((item) => item.id === jogo.id)) { showToast("Já está na biblioteca!", "erro"); return; }
    const nova = [...biblioteca, jogo];
    setBiblioteca(nova);
    localStorage.setItem("vaporzao_biblioteca", JSON.stringify(nova));
    showToast(`${jogo.titulo} adicionado!`, "sucesso");
  };

  const removerDaBiblioteca = (id) => {
    const nova = biblioteca.filter((g) => g.id !== id);
    setBiblioteca(nova);
    localStorage.setItem("vaporzao_biblioteca", JSON.stringify(nova));
    showToast("Removido da biblioteca!", "sucesso");
  };

  const adicionarNaWishlist = (jogo) => {
    if (!isLoggedIn) { showToast("Inicie sessão!", "aviso"); setShowLogin(true); return; }
    if (wishlist.some((item) => item.id === jogo.id)) { showToast("Já está na wishlist!", "erro"); return; }
    const nova = [...wishlist, jogo];
    setWishlist(nova);
    localStorage.setItem("vaporzao_wishlist", JSON.stringify(nova));
    showToast(`${jogo.titulo} adicionado à wishlist!`, "sucesso");
  };

  const removerDaWishlist = (id) => {
    const nova = wishlist.filter((g) => g.id !== id);
    setWishlist(nova);
    localStorage.setItem("vaporzao_wishlist", JSON.stringify(nova));
    showToast("Removido da wishlist!", "sucesso");
  };

  useEffect(() => {
    api.get('/generos').then((r) => setListaGeneros(r.data)).catch(console.error);
    if (localStorage.getItem("vaporzao_token")) setIsLoggedIn(true);
  }, []);

  const toggleGenero = (g) => setSelectedGeneros(prev => prev.includes(g) ? prev.filter(i => i !== g) : [...prev, g]);
  const { games: filteredGames = [], carregando } = useGames({ generos: selectedGeneros, ordenarPor, busca: searchQuery });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setShowLogin={setShowLogin}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <Routes>
          <Route path="/" element={
            <Home 
              filteredGames={filteredGames} carregando={carregando}
              listaGeneros={listaGeneros} selectedGeneros={selectedGeneros} toggleGenero={toggleGenero}
              adicionarNaBiblioteca={adicionarNaBiblioteca} adicionarNaWishlist={adicionarNaWishlist}
            />
          } />
          <Route path="/biblioteca" element={
            <Biblioteca biblioteca={biblioteca} removerDaBiblioteca={removerDaBiblioteca} />
          } />
          <Route path="/wishlist" element={
            <Wishlist wishlist={wishlist} removerDaWishlist={removerDaWishlist} />
          } />
          <Route path="/publicar" element={<PublicarJogo isLoggedIn={isLoggedIn} onRequestLogin={() => setShowLogin(true)} />} />
          <Route path="/jogo/:id" element={
            <GameDetails 
              adicionarNaBiblioteca={adicionarNaBiblioteca} 
              adicionarNaWishlist={adicionarNaWishlist}
              showToast={showToast} 
            />
          } />
        </Routes>
      </main>

      <Footer />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={() => { setIsLoggedIn(true); setShowLogin(false); }} />}
      
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl border shadow-2xl ${toast.tipo === "sucesso" ? "bg-card border-green-500 text-green-500" : toast.tipo === "erro" ? "bg-card border-red-500 text-red-500" : "bg-card border-yellow-500 text-yellow-500"}`}>
            {toast.tipo === "sucesso" && <CheckCircle className="w-5 h-5" />}
            {toast.tipo === "erro" && <AlertCircle className="w-5 h-5" />}
            {toast.tipo === "aviso" && <Info className="w-5 h-5" />}
            <span className="font-bold">{toast.mensagem}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}