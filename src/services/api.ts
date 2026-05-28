// ============================================================
// Cliente de API do Vaporzão
// Autenticação: header  token: <jwt>  (não Bearer)
//
// Como usar:
//   1. Defina BASE_URL com a URL base da sua API
//   2. Descomente as implementações reais abaixo nos hooks
// ============================================================

import type { Game, Review, Achievement, AuthCredentials, User, LibraryEntry, CreateGamePayload } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getToken(): string | null {
  return localStorage.getItem("vaporzao_token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { token } : {})
    },
    ...options
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Erro ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ───────────────────────────────────────────────────

/** Login — retorna JWT e salva no localStorage. */
export async function login(credentials: AuthCredentials): Promise<User> {
  const data = await request<{ token: string; usuario: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
  localStorage.setItem("vaporzao_token", data.token);
  return data.usuario;
}

/** Primeiro acesso — define senha e retorna JWT. */
export async function primeiroAcesso(credentials: AuthCredentials): Promise<User> {
  const data = await request<{ token: string; usuario: User }>("/auth/primeiro-acesso", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
  localStorage.setItem("vaporzao_token", data.token);
  return data.usuario;
}

/** Retorna dados do usuário autenticado. */
export async function getMe(): Promise<User> {
  return request<User>("/auth/me");
}

/** Remove token (logout local). */
export function logout(): void {
  localStorage.removeItem("vaporzao_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ── Jogos ──────────────────────────────────────────────────

/** Lista jogos com filtros opcionais. */
export async function getGames(params?: {
  busca?: string;
  genero?: string;
  ordenar?: string;
  direcao?: "asc" | "desc";
  pagina?: number;
  limite?: number;
}): Promise<Game[]> {
  const qs = new URLSearchParams();
  if (params?.busca) qs.set("busca", params.busca);
  if (params?.genero) qs.set("genero", params.genero);
  if (params?.ordenar) qs.set("ordenar", params.ordenar);
  if (params?.direcao) qs.set("direcao", params.direcao);
  if (params?.pagina) qs.set("pagina", String(params.pagina));
  if (params?.limite) qs.set("limite", String(params.limite));
  return request<Game[]>(`/jogos?${qs.toString()}`);
}

/** Destaques da home (recentes, top, populares). */
export async function getHighlights(): Promise<Game[]> {
  return request<Game[]>("/jogos/destaques");
}

/** Detalhe completo de um jogo. */
export async function getGameById(id: number): Promise<Game> {
  return request<Game>(`/jogos/${id}`);
}

/**
 * Cria um novo jogo. Requer autenticação.
 * Máximo de 3 jogos por aluno.
 * generoIds: IDs numéricos dos gêneros (veja GENERO_IDS em mockData.ts)
 */
export async function createGame(payload: CreateGamePayload): Promise<Game> {
  return request<Game>("/jogos", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/** Remove um jogo (autor ou admin). */
export async function deleteGame(id: number): Promise<void> {
  return request<void>(`/jogos/${id}`, { method: "DELETE" });
}

// ── Conquistas ─────────────────────────────────────────────

export async function getAchievements(gameId: number): Promise<Achievement[]> {
  return request<Achievement[]>(`/jogos/${gameId}/conquistas`);
}

// ── Reviews ────────────────────────────────────────────────

export async function getReviews(gameId: number): Promise<Review[]> {
  return request<Review[]>(`/jogos/${gameId}/reviews`);
}

export async function postReview(
  gameId: number,
  review: { nota: number; texto: string; recomenda: boolean }
): Promise<Review> {
  return request<Review>(`/jogos/${gameId}/reviews`, {
    method: "POST",
    body: JSON.stringify(review)
  });
}

// ── Biblioteca ─────────────────────────────────────────────

export async function getLibrary(): Promise<LibraryEntry[]> {
  return request<LibraryEntry[]>("/biblioteca/me");
}

export async function addToLibrary(jogoId: number): Promise<void> {
  return request<void>(`/biblioteca/${jogoId}`, { method: "POST" });
}

// ── Wishlist ───────────────────────────────────────────────

export async function getWishlist(): Promise<Game[]> {
  return request<Game[]>("/wishlist/me");
}

export async function addToWishlist(jogoId: number): Promise<void> {
  return request<void>(`/wishlist/${jogoId}`, { method: "POST" });
}

export async function removeFromWishlist(jogoId: number): Promise<void> {
  return request<void>(`/wishlist/${jogoId}`, { method: "DELETE" });
}
