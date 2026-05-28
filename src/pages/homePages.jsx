// src/pages/HomePage.jsx
import React from 'react';
import { useGames } from '../hooks/useGames';
// Importe o seu componente GameCard (ajuste o caminho se precisar)
import GameCard from '../components/GameCard'; 

export default function HomePage() {
  // Chamamos o nosso Hook para pegar os dados mágicos
  const { jogos, carregando } = useGames();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Destaques do Vaporzão</h1>
      
      {/* Mostra um aviso enquanto a internet busca os dados */}
      {carregando && <p>Carregando o catálogo de jogos...</p>}

      {/* Grid para listar os jogos lado a lado */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* O .map() vai repetir o seu GameCard para cada jogo que vier da API */}
        {jogos.map((jogo) => (
          <GameCard 
            key={jogo.id}
            titulo={jogo.titulo}
            preco={jogo.preco}
            // A API também deve retornar coisas como desenvolvedora, lancamento, etc.
            // Passe para o card as propriedades que você estilizou no Figma
          />
        ))}

      </div>
    </div>
  );
}