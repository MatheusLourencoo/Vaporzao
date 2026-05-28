// ============================================================
// Hook de dados: useGames
//
// Atualmente retorna dados mock diretamente.
// Para conectar à API real:
//   1. Descomente o bloco "MODO API"
//   2. Comente ou remova o bloco "MODO MOCK"
// ============================================================

import { useState, useEffect, useMemo } from "react";
import type { Game, SortOption } from "../types";
import { MOCK_GAMES } from "../data/mockData";
// import { getGames } from "../services/api";   // ← descomente ao integrar API

interface UseGamesOptions {
  generos?: string[];
  ordenarPor?: SortOption;
  busca?: string;
}

interface UseGamesResult {
  games: Game[];
  loading: boolean;
  error: string | null;
}

export function useGames({ generos = [], ordenarPor = "popularidade", busca = "" }: UseGamesOptions = {}): UseGamesResult {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // ── MODO MOCK ──────────────────────────────────────────
    // Simula filtros e ordenação localmente sobre os dados mock
    let result = [...MOCK_GAMES];

    if (generos.length > 0) {
      result = result.filter((g) => g.generos.some((genre) => generos.includes(genre)));
    }

    if (busca) {
      result = result.filter((g) => g.titulo.toLowerCase().includes(busca.toLowerCase()));
    }

    if (ordenarPor === "preco") result.sort((a, b) => a.preco - b.preco);
    else if (ordenarPor === "titulo") result.sort((a, b) => a.titulo.localeCompare(b.titulo));
    else if (ordenarPor === "nota") result.sort((a, b) => b.nota - a.nota);
    else if (ordenarPor === "popularidade") result.sort((a, b) => b.avaliacoes - a.avaliacoes);

    setGames(result);
    setLoading(false);
    // ── FIM MODO MOCK ──────────────────────────────────────

    // ── MODO API (descomente abaixo e remova o bloco acima) ──
    // getGames({ generos, ordenarPor, busca })
    //   .then(setGames)
    //   .catch((err) => setError(err.message))
    //   .finally(() => setLoading(false));
    // ── FIM MODO API ───────────────────────────────────────
  }, [generos.join(","), ordenarPor, busca]);

  return { games, loading, error };
}
