import React from 'react';
import { useGames } from '../hooks/useGames';
import GameCard from '../components/GameCard'; 

export default function HomePage() {
  const { jogos, carregando } = useGames();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Destaques do Vaporzão</h1>
      
      {carregando && <p>Carregando o catálogo de jogos...</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {jogos.map((jogo) => (
          <GameCard 
            key={jogo.id}
            titulo={jogo.titulo}
            preco={jogo.preco}
          />
        ))}

      </div>
    </div>
  );
}