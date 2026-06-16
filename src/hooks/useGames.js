import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useGames({ generos = [], busca = '' } = {}) {
  const [games, setGames] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    buscarJogos();
  }, [busca, generos.join(',')]);

  const buscarJogos = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const resposta = await api.get('/jogos', {
        params: {
          limite: 100,
          ...(busca && { busca }),
          ...(generos.length > 0 && { genero: generos }),
        },
      });

      if (resposta.data && Array.isArray(resposta.data.itens)) {
        setGames(resposta.data.itens);
      } else if (Array.isArray(resposta.data)) {
        setGames(resposta.data);
      } else {
        setGames([]);
      }
    } catch (err) {
      console.error('Erro ao buscar jogos:', err);
      setErro('Não foi possível carregar os jogos. Tente novamente.');
      setGames([]);
    } finally {
      setCarregando(false);
    }
  };

  return { games, carregando, erro };
}