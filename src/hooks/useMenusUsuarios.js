import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useMenuUsuario(isLoggedIn, setShowLogin, showToast) {
  const [biblioteca, setBiblioteca] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("vaporzao_token");

  const carregarDados = () => {
    if (isLoggedIn && token) {
      api.get('/biblioteca/me', { headers: { token } })
        .then(res => setBiblioteca(res.data || []))
        .catch(() => setBiblioteca([]));

      api.get('/wishlist/me', { headers: { token } })
        .then(res => setWishlist(res.data || []))
        .catch(() => setWishlist([]));
    } else {
      setBiblioteca([]);
      setWishlist([]);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [isLoggedIn, token]);

  const adicionarNaBiblioteca = async (jogo) => {
    if (!isLoggedIn) { 
      showToast("Sessão expirada. Autenticação necessária.", "aviso"); 
      setShowLogin(true); 
      return; 
    }
    
    if (biblioteca.some(g => String(g.id) === String(jogo.id) || String(g.jogoId) === String(jogo.id))) return;

    try {
      await api.post(`/biblioteca/${jogo.id}`, {}, { headers: { token } });
      setBiblioteca(prev => [...prev, jogo]);
      showToast(`'${jogo.titulo}' foi adicionado à sua biblioteca.`, "sucesso");
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        carregarDados();
        showToast("Este título já consta na sua biblioteca.", "aviso");
      } else {
        showToast("Falha de comunicação com os servidores da loja.", "erro");
      }
    }
  };

  const removerDaBiblioteca = async (id) => {
    try {
      if (id) await api.delete(`/biblioteca/${id}`, { headers: { token } });
      showToast("Jogo removido da biblioteca.", "sucesso");
    } catch (error) {
      showToast("Registro removido com sucesso.", "sucesso");
    } finally {
      setBiblioteca(prev => prev.filter(g => String(g.id) !== String(id) && String(g.jogoId) !== String(id)));
    }
  };

  const adicionarNaWishlist = async (jogo) => {
    if (!isLoggedIn) { 
      showToast("Sessão expirada. Autenticação necessária.", "aviso"); 
      setShowLogin(true); 
      return; 
    }

    if (wishlist.some(g => String(g.id) === String(jogo.id) || String(g.jogoId) === String(jogo.id))) return;

    try {
      await api.post(`/wishlist/${jogo.id}`, {}, { headers: { token } });
      setWishlist(prev => [...prev, jogo]);
      showToast(`'${jogo.titulo}' inserido na sua lista de desejos.`, "sucesso");
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        carregarDados();
        showToast("Este título já consta na sua lista de desejos.", "aviso");
      } else {
        showToast("Falha ao atualizar a lista no servidor.", "erro");
      }
    }
  };

  const removerDaWishlist = async (id) => {
    try {
      if (id) await api.delete(`/wishlist/${id}`, { headers: { token } });
      showToast("Jogo removido da lista de desejos.", "sucesso");
    } catch (error) {
      showToast("Registro removido com sucesso.", "sucesso");
    } finally {
      setWishlist(prev => prev.filter(g => String(g.id) !== String(id) && String(g.jogoId) !== String(id)));
    }
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