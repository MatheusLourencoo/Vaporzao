// ============================================================
// Tipos centrais do Vaporzão
// Atualize aqui conforme a resposta real da sua API
// ============================================================

export interface Screenshot {
  url: string;
}

export interface Achievement {
  titulo: string;
  descricao: string;
  pontos: number;
}

export interface Review {
  usuario: string;
  nota: number;
  texto: string;
  recomenda: boolean;
}

export interface Game {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  desconto?: number;
  desenvolvedora: string;
  capaUrl: string;
  generos: string[];
  nota: number;
  avaliacoes: number;
  screenshots?: string[];
}

export interface User {
  id: number;
  matricula: string;
  nome?: string;
}

export interface AuthCredentials {
  matricula: string;
  senha: string;
}

export interface LibraryEntry {
  game: Game;
  horasJogadas: number;
}

export type ViewType = "home" | "biblioteca" | "wishlist" | "publicar";
export type HighlightTab = "recentes" | "top" | "populares";
export type SortOption = "popularidade" | "lancamento" | "preco" | "titulo" | "nota";

export interface CreateGamePayload {
  titulo: string;
  descricao: string;
  preco: number;
  desenvolvedora: string;
  lancamento: string;
  capaUrl: string;
  generoIds: number[];
}
