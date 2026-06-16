import { useState, useEffect, useMemo } from "react";
import { api } from "../services/api";
import { formatarNomeTitleCase } from "../utils/formatacao";

export function useUserProfile(matricula) {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const buscarPerfil = async () => {
      setLoading(true);
      setErro(false);
      
      try {
        const res = await api.get(`/usuarios/${matricula}`);
        setPerfil(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setErro(true);
      } finally {
        setLoading(false);
      }
    };

    buscarPerfil();
  }, [matricula]);

  const dadosUsuario = useMemo(() => {
    if (!perfil) {
      return {
        perfilValido: false,
        nomeExibicao: "Membro Desconhecido",
        inicial: "?",
        jogosCriados: [],
        reviews: []
      };
    }

    const userData = perfil.usuario || perfil.data || perfil.user || perfil;
    const nomeFormatado = formatarNomeTitleCase(userData.nome || userData.nomeUsuario || matricula);

    return {
      perfilValido: true,
      nomeExibicao: nomeFormatado,
      inicial: nomeFormatado.charAt(0).toUpperCase(),
      jogosCriados: userData.jogos || userData.Jogos || userData.jogosCriados || userData.jogosPublicados || userData.games || [],
      reviews: userData.reviews || userData.Reviews || userData.avaliacoes || userData.Avaliacoes || userData.comentarios || []
    };
  }, [perfil, matricula]);

  return {
    loading,
    erro,
    ...dadosUsuario 
  };
}