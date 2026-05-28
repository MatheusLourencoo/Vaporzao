import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://alunos-ads-api-production.up.railway.app', // URL oficial da turma 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Isso aqui é um "Interceptor". 
// Antes de qualquer requisição sair do seu Frontend para o Backend, ele verifica se tem token no localStorage e anexa no Header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vaporzao_token');
  if (token) {
    // A documentação do professor exige o envio do header com o nome "token"
    config.headers.token = token;
  }
  return config;
});

// --- Funções Auxiliares de Autenticação ---

export async function login(credenciais) {
  // Faz o POST para a rota de login passando matricula e senha [cite: 12, 13]
  const response = await api.post('/auth/login', credenciais);
  return response.data; 
}

export async function primeiroAcesso(credenciais) {
  // Faz o POST para criar um usuário novo passando matricula e senha [cite: 4, 5]
  const response = await api.post('/auth/primeiro-acesso', credenciais);
  return response.data;
}