import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://alunos-ads-api-production.up.railway.app',  
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vaporzao_token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export async function login(credenciais) {
  try {
    const response = await api.post('/auth/login', credenciais);
    return response.data; 
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw error; 
  }
}

export async function primeiroAcesso(credenciais) {
  try {
    const response = await api.post('/auth/primeiro-acesso', credenciais);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar acesso:", error);
    throw error;
  }
}

export async function listarJogos(busca = "", genero = "") {
  try {
    const response = await api.get('/jogos', {
      params: {
        ...(busca && { busca }),
        ...(genero && { genero })
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao listar jogos:", error);
    throw error;
  }
}

export async function listarGeneros() {
  try {
    const response = await api.get('/generos');
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar gêneros:", error);
    throw error;
  }
}