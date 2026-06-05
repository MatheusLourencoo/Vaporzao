import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useMenuUsuario(isLoggedIn, setShowLogin, showToast) {
  const [biblioteca, setBiblioteca] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const getToken = () => localStorage.getItem("vaporzao_token");

  useEffect(() => {
    carregarDados();
  }, [isLoggedIn]);

  async function carregarDados() {
    const token = getToken();

    if (!isLoggedIn || !token) {
      setBiblioteca([]);
      setWishlist([]);
      return;
    }

    try {
      // AJUSTE 1: Header corrigido para o padrão da sua API
      const resBiblioteca = await api.get("/biblioteca/me", {
        headers: { token }
      });

      const resWishlist = await api.get("/wishlist/me", {
        headers: { token }
      });

      // AJUSTE 2: Extrai o jogo, mas mantém as horas jogadas para o CardBiblioteca funcionar!
      const bibliotecaFormatada = (resBiblioteca.data || []).map((item) => {
        if (item.jogo) {
          return {
            ...item.jogo,
            horasJogadas: item.horasJogadas || item["horas Jogadas"] || 0
          };
        }
        return item;
      });

      const wishlistFormatada = (resWishlist.data || []).map((item) => {
        return item.jogo ? { ...item.jogo } : item;
      });

      setBiblioteca(bibliotecaFormatada);
      setWishlist(wishlistFormatada);

    } catch (error) {
      console.log("ERRO AO CARREGAR:", error);
      setBiblioteca([]);
      setWishlist([]);
    }
  }

  async function adicionarNaBiblioteca(jogo) {
    const token = getToken();

    if (!token) {
      showToast("Faça login primeiro.", "aviso");
      setShowLogin(true);
      return;
    }

    const jaExiste = biblioteca.some(
      (g) => String(g.id || g.jogoId) === String(jogo.id)
    );

    if (jaExiste) {
      showToast("Esse jogo já está na biblioteca.", "aviso");
      return;
    }

    try {
      await api.post(
        `/biblioteca/${jogo.id}`,
        {},
        { headers: { token } } // Header corrigido
      );

      await carregarDados();
      showToast(`'${jogo.titulo}' adicionado à biblioteca.`, "sucesso");

    } catch (error) {
      console.log("ERRO AO ADICIONAR:", error);
      showToast("Erro ao adicionar jogo.", "erro");
    }
  }

  async function removerDaBiblioteca(id) {
    const token = getToken();

    try {
      await api.delete(`/biblioteca/${id}`, {
        headers: { token } // Header corrigido
      });

      setBiblioteca((prev) =>
        prev.filter((g) => String(g.id || g.jogoId) !== String(id))
      );

      showToast("Jogo removido da biblioteca.", "sucesso");
    } catch (error) {
      console.log("ERRO AO REMOVER:", error);
      showToast("Erro ao remover jogo.", "erro");
    }
  }

  async function adicionarNaWishlist(jogo) {
    const token = getToken();

    if (!token) {
      showToast("Faça login primeiro.", "aviso");
      setShowLogin(true);
      return;
    }

    const jaExiste = wishlist.some(
      (g) => String(g.id || g.jogoId) === String(jogo.id)
    );

    if (jaExiste) {
      showToast("Esse jogo já está na wishlist.", "aviso");
      return;
    }

    try {
      await api.post(
        `/wishlist/${jogo.id}`,
        {},
        { headers: { token } } // Header corrigido
      );

      await carregarDados();
      showToast(`'${jogo.titulo}' adicionado à wishlist.`, "sucesso");

    } catch (error) {
      console.log("ERRO AO ADICIONAR WISHLIST:", error);
      showToast("Erro ao adicionar jogo.", "erro");
    }
  }

  async function removerDaWishlist(id) {
    const token = getToken();

    try {
      await api.delete(`/wishlist/${id}`, {
        headers: { token } // Header corrigido
      });

      setWishlist((prev) =>
        prev.filter((g) => String(g.id || g.jogoId) !== String(id))
      );

      showToast("Jogo removido da wishlist.", "sucesso");
    } catch (error) {
      console.log("ERRO AO REMOVER WISHLIST:", error);
      showToast("Erro ao remover jogo.", "erro");
    }
  }

  return {
    biblioteca,
    wishlist,
    carregarDados,
    adicionarNaBiblioteca,
    removerDaBiblioteca,
    adicionarNaWishlist,
    removerDaWishlist
  };
}