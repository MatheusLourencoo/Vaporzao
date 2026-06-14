import { useState, useEffect } from 'react';
import { api } from "../services/api";

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
      params.append('limite', '100'); 

      if (busca) params.append('busca', busca);
      if (generos && generos.length > 0) {
        generos.forEach(g => params.append('genero', g));
      }

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const resposta = await api.get(url);
      let listaDeJogos = [];

      if (resposta.data && Array.isArray(resposta.data.itens)) {
        listaDeJogos = [...resposta.data.itens]; 
      } 
      else if (Array.isArray(resposta.data)) {
        listaDeJogos = [...resposta.data]; 
      }
      if (ordenarPor === 'preco') {
        listaDeJogos.sort((a, b) => a.preco - b.preco);
      } 
      else if (ordenarPor === 'titulo') {
        listaDeJogos.sort((a, b) => a.titulo.localeCompare(b.titulo));
      } 
      else if (ordenarPor === 'nota') {
        listaDeJogos.sort((a, b) => (b.nota || 0) - (a.nota || 0));
      }
      setGames(listaDeJogos); 
    } catch (erro) {
      console.error("Erro Crítico no Hook useGames:", erro);
      setGames([]); 
    } finally {
      setCarregando(false);
    }
  };

  return { games, carregando };
}