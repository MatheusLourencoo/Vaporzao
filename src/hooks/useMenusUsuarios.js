import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useMenuUsuario(isLoggedIn, setShowLogin, showToast) {
  const [biblioteca, setBiblioteca] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    carregarDados();
  }, [isLoggedIn]);

  async function carregarDados() {
    if (!isLoggedIn || !localStorage.getItem("vaporzao_token")) {
      setBiblioteca([]);
      setWishlist([]);
      return;
    }

    try {
      const [resBiblioteca, resWishlist] = await Promise.all([
        api.get("/biblioteca/me"),
        api.get("/wishlist/me"),
      ]);

      const bibliotecaFormatada = (resBiblioteca.data || []).map((item) => {
        if (item.jogo) {
          return {
            ...item.jogo,
            horasJogadas: item.horasJogadas || item["horas Jogadas"] || 0,
          };
        }
        return item;
      });

      const wishlistFormatada = (resWishlist.data || []).map((item) =>
        item.jogo ? { ...item.jogo } : item
      );

      setBiblioteca(bibliotecaFormatada);
      setWishlist(wishlistFormatada);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setBiblioteca([]);
      setWishlist([]);
    }
  }

  async function adicionarNaBiblioteca(jogo) {
    if (!localStorage.getItem("vaporzao_token")) {
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
      await api.post(`/biblioteca/${jogo.id}`, {});
      await carregarDados();
      showToast(`'${jogo.titulo}' adicionado à biblioteca.`, "sucesso");
    } catch (error) {
      console.error("Erro ao adicionar jogo na biblioteca:", error);
      showToast("Erro ao adicionar jogo.", "erro");
    }
  }

  async function removerDaBiblioteca(id) {
    try {
      await api.delete(`/biblioteca/${id}`);
      setBiblioteca((prev) =>
        prev.filter((g) => String(g.id || g.jogoId) !== String(id))
      );
      showToast("Jogo removido da biblioteca.", "sucesso");
    } catch (error) {
      console.error("Erro ao remover jogo da biblioteca:", error);
      showToast("Erro ao remover jogo.", "erro");
    }
  }

  async function adicionarNaWishlist(jogo) {
    if (!localStorage.getItem("vaporzao_token")) {
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
      await api.post(`/wishlist/${jogo.id}`, {});
      await carregarDados();
      showToast(`'${jogo.titulo}' adicionado à wishlist.`, "sucesso");
    } catch (error) {
      console.error("Erro ao adicionar jogo na wishlist:", error);
      showToast("Erro ao adicionar jogo.", "erro");
    }
  }

  async function removerDaWishlist(id) {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist((prev) =>
        prev.filter((g) => String(g.id || g.jogoId) !== String(id))
      );
      showToast("Jogo removido da wishlist.", "sucesso");
    } catch (error) {
      console.error("Erro ao remover jogo da wishlist:", error);
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
    removerDaWishlist,
  };
}