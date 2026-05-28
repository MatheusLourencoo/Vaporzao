import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useGames({ generos = [], ordenarPor = "popularidade", busca = "" } = {}) {
  const [games, setGames] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    buscarJogos();
  }, [busca, generos.join(','), ordenarPor]);

  const buscarJogos = async () => {
    setCarregando(true);
    try {
      let url = '/jogos';
      const params = new URLSearchParams();

      if (busca) params.append('busca', busca);
      
      if (generos && generos.length > 0) {
        generos.forEach(g => params.append('genero', g));
      }

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const resposta = await api.get(url);
      
      // --- O GOLPE FINAL: Pegando direto da gaveta "itens" ---
      let listaDeJogos = [];
      
      // Verifica se a API mandou aquele pacote com paginação que vimos no console
      if (resposta.data && Array.isArray(resposta.data.itens)) {
        listaDeJogos = [...resposta.data.itens]; 
      } 
      // Caso de fallback se a API mudar de ideia e mandar a lista direta depois
      else if (Array.isArray(resposta.data)) {
        listaDeJogos = [...resposta.data]; 
      }

      // Ordenação no Frontend
      if (ordenarPor === 'preco') {
        listaDeJogos.sort((a, b) => a.preco - b.preco);
      } else if (ordenarPor === 'titulo') {
        listaDeJogos.sort((a, b) => a.titulo.localeCompare(b.titulo));
      } else if (ordenarPor === 'nota') {
        listaDeJogos.sort((a, b) => (b.nota || 0) - (a.nota || 0));
      }

      setGames(listaDeJogos); 
    } catch (erro) {
      console.error("Erro ao carregar a loja:", erro);
      setGames([]); 
    } finally {
      setCarregando(false);
    }
  };

  return { games, carregando };
}