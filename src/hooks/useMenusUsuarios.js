import { useState } from "react";

export function useMenuUsuario(isLoggedIn, setShowLogin, showToast) {
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

  return { 
    biblioteca, 
    wishlist, 
    adicionarNaBiblioteca, 
    removerDaBiblioteca, 
    adicionarNaWishlist, 
    removerDaWishlist 
  };
}