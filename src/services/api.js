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
  const response = await api.post('/auth/login', credenciais);
  return response.data; 
}

export async function primeiroAcesso(credenciais) {
  const response = await api.post('/auth/primeiro-acesso', credenciais);
  return response.data;
}

export async function listarJogos(busca = "", genero = "") {
  let url = '/jogos?';
  if (busca) url += `busca=${busca}&`;
  if (genero) url += `genero=${genero}`;

  const response = await api.get(url);
  return response.data;
}

export async function listarGeneros() {
  const response = await api.get('/generos');
  return response.data;
}