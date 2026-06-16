import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useGameDetails({ id, biblioteca, wishlist, adicionarNaBiblioteca, adicionarNaWishlist, showToast }) {
  const [game, setGame] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localInLib, setLocalInLib] = useState(false);
  const [localInWish, setLocalInWish] = useState(false);
  const [processandoObter, setProcessandoObter] = useState(false);
  const [processandoWishlist, setProcessandoWishlist] = useState(false);
  const [processandoReview, setProcessandoReview] = useState(false);

  const token = localStorage.getItem("vaporzao_token");

  useEffect(() => {
    if (biblioteca && id) setLocalInLib(biblioteca.some(g => String(g.id) === String(id) || String(g.jogoId) === String(id)));
    if (wishlist && id) setLocalInWish(wishlist.some(g => String(g.id) === String(id) || String(g.jogoId) === String(id)));
  }, [biblioteca, wishlist, id]);

  useEffect(() => {
    if (!id || id === "undefined") return;
    window.scrollTo(0, 0);
    setIsLoading(true);

    Promise.all([
      api.get(`/jogos/${id}`).catch(err => {
        showToast(err.response?.data?.message || "Erro ao carregar dados.", "erro");
        return { data: null };
      }),
      api.get(`/jogos/${id}/imagens`).catch(() => ({ data: [] })),
      api.get(`/jogos/${id}/reviews`).catch(() => ({ data: [] }))
    ]).then(([resJogo, resImagens, resReviews]) => {
      setGame(resJogo.data);
      setGaleria(resImagens.data);
      setReviews(resReviews.data);
      setIsLoading(false);
    });
  }, [id, showToast]);

  const handleObter = async () => {
    if (!token) return showToast("Faça login para adicionar jogos à sua biblioteca.", "aviso");
    if (localInLib) return showToast(`O jogo já está na sua biblioteca!`, "aviso");
    if (processandoObter) return;

    setProcessandoObter(true);
    try {
      await api.post(`/biblioteca/${id}`, {}, { headers: { token } });
      if (adicionarNaBiblioteca) adicionarNaBiblioteca(game);
      showToast(`Jogo adicionado à sua biblioteca!`, "sucesso");
    } catch (err) {
      showToast(err.response?.data?.message || "Erro ao adicionar o jogo.", "erro");
    } finally {
      setProcessandoObter(false);
    }
  };

  const handleWishlist = async () => {
    if (!token) return showToast("Faça login para gerenciar sua lista de desejos.", "aviso");
    if (localInWish) return showToast(`O jogo já está na sua lista de desejos!`, "aviso");
    if (processandoWishlist) return;

    setProcessandoWishlist(true);
    try {
      await api.post(`/wishlist/${id}`, {}, { headers: { token } });
      if (adicionarNaWishlist) adicionarNaWishlist(game);
      showToast(`Jogo adicionado à lista de desejos!`, "sucesso");
    } catch (err) {
      showToast(err.response?.data?.message || "Erro ao adicionar à lista.", "erro");
    } finally {
      setProcessandoWishlist(false);
    }
  };

  const handlePublicarAvaliacao = async (nota, texto, resetForm) => {
    if (!token) return showToast("Autenticação necessária para avaliar.", "aviso");
    if (!texto.trim()) return showToast("Escreva um comentário para publicar.", "aviso");
    if (processandoReview) return;

    setProcessandoReview(true);
    try {
      await api.post(`/jogos/${id}/reviews`, { nota, texto, recomenda: nota >= 3 }, { headers: { token } });
      const res = await api.get(`/jogos/${id}/reviews`);
      setReviews(res.data);
      resetForm();
      showToast("Sua avaliação foi publicada com sucesso!", "sucesso");
    } catch (err) {
      showToast(err.response?.data?.message || "Erro ao publicar avaliação.", "erro");
    } finally {
      setProcessandoReview(false);
    }
  };

  return {
    game, galeria, reviews, isLoading,
    localInLib, localInWish, processandoObter, processandoWishlist, processandoReview,
    handleObter, handleWishlist, handlePublicarAvaliacao
  };
}