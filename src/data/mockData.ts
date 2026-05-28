// ============================================================
// Dados mock — substitua pelas chamadas reais da API
// quando estiver pronto para integrar o backend.
// ============================================================

import type { Game, Achievement, Review, LibraryEntry } from "../types";

export const MOCK_GAMES: Game[] = [
  {
    id: 1,
    titulo: "Counter-Tapa",
    descricao: "O melhor FPS tupiniquim do mercado. Batalhas intensas e estratégicas.",
    preco: 29.90,
    precoOriginal: 59.90,
    desconto: 50,
    desenvolvedora: "Banana Studios",
    capaUrl: "https://images.unsplash.com/photo-1778495351325-ca6cd20d21c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    generos: ["Ação", "FPS"],
    nota: 9.2,
    avaliacoes: 1523,
    screenshots: [
      "https://images.unsplash.com/photo-1778495351325-ca6cd20d21c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1567263361507-83f755d9fa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1597523535985-ecae0b9b1d22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
    ]
  },
  {
    id: 2,
    titulo: "Pavor Eterno",
    descricao: "Terror de sobrevivência que vai gelar seu sangue.",
    preco: 49.90,
    desenvolvedora: "Caju Games",
    capaUrl: "https://images.unsplash.com/photo-1567263361507-83f755d9fa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    generos: ["Terror", "Aventura"],
    nota: 8.8,
    avaliacoes: 892
  },
  {
    id: 3,
    titulo: "Velocidade Máxima",
    descricao: "Corrida extrema nas ruas brasileiras.",
    preco: 39.90,
    desenvolvedora: "Guaraná Games",
    capaUrl: "https://images.unsplash.com/photo-1597523535985-ecae0b9b1d22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    generos: ["Corrida", "Ação"],
    nota: 8.5,
    avaliacoes: 1102
  },
  {
    id: 4,
    titulo: "Lendas do Brasil",
    descricao: "RPG de aventura baseado no folclore brasileiro.",
    preco: 44.90,
    desenvolvedora: "Açaí Studios",
    capaUrl: "https://images.unsplash.com/photo-1775193823752-84a3c871f93a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    generos: ["RPG", "Aventura"],
    nota: 9.5,
    avaliacoes: 2341
  },
  {
    id: 5,
    titulo: "Xadrez Brasileirão",
    descricao: "Estratégia ao estilo tupiniquim.",
    preco: 19.90,
    desenvolvedora: "Pão de Queijo Dev",
    capaUrl: "https://images.unsplash.com/photo-1677816155981-919b9a6eeded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    generos: ["Estratégia", "Tabuleiro"],
    nota: 7.9,
    avaliacoes: 445
  },
  {
    id: 6,
    titulo: "Guerreiros do Sertão",
    descricao: "Ação e RPG no nordeste brasileiro.",
    preco: 54.90,
    desenvolvedora: "Cajuína Games",
    capaUrl: "https://images.unsplash.com/flagged/photo-1569517282304-d1e2baf737e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    generos: ["RPG", "Ação"],
    nota: 9.0,
    avaliacoes: 1876
  }
];

export const GENEROS: string[] = [
  "Ação", "Aventura", "FPS", "Terror", "RPG", "Estratégia", "Corrida", "Tabuleiro"
];

// Mapeamento nome → ID para a API (POST /jogos usa generoIds: number[])
// Ajuste os IDs conforme retorno real de GET /generos
export const GENERO_IDS: Record<string, number> = {
  "Ação": 1,
  "Aventura": 2,
  "FPS": 3,
  "Terror": 4,
  "RPG": 5,
  "Estratégia": 6,
  "Corrida": 7,
  "Tabuleiro": 8
};

// Mock de conquistas por jogo (substitua pela API: GET /games/:id/achievements)
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { titulo: "Primeiro Sangue", descricao: "Vença sua primeira partida", pontos: 50 },
  { titulo: "Exterminador", descricao: "Elimine 100 inimigos", pontos: 100 },
  { titulo: "Lenda", descricao: "Alcance o nível máximo", pontos: 200 }
];

// Mock de avaliações (substitua pela API: GET /games/:id/reviews)
export const MOCK_REVIEWS: Review[] = [
  { usuario: "João Silva", nota: 9, texto: "Jogo incrível! Muito divertido.", recomenda: true },
  { usuario: "Maria Santos", nota: 8, texto: "Bom jogo, mas poderia ter mais conteúdo.", recomenda: true },
  { usuario: "Pedro Costa", nota: 10, texto: "Perfeito! Melhor jogo brasileiro!", recomenda: true }
];

// Mock da biblioteca do usuário (substitua pela API: GET /users/:id/library)
export const MOCK_LIBRARY: LibraryEntry[] = MOCK_GAMES.slice(0, 4).map((game) => ({
  game,
  horasJogadas: 42
}));

// Mock da wishlist do usuário (substitua pela API: GET /users/:id/wishlist)
export const MOCK_WISHLIST: Game[] = MOCK_GAMES.slice(0, 3);
