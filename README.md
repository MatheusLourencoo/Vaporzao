# 🎮 Vaporzão

Plataforma de jogos independentes desenvolvida como projeto acadêmico no curso de **Análise e Desenvolvimento de Sistemas**.

🔗 **Acesse o projeto:** [vaporzao.netlify.app](https://vaporzao.netlify.app/)

---

## 📋 Sobre o Projeto

O Vaporzão é uma aplicação web inspirada em plataformas de distribuição de jogos digitais, permitindo que usuários publiquem, avaliem e gerenciem jogos. O projeto consome uma API REST compartilhada da turma e foi desenvolvido com foco em boas práticas de código, componentização e integração com backend real.

---

## ✨ Funcionalidades

- 🔐 Autenticação com token JWT (login e primeiro acesso)
- 🏠 Home com catálogo completo, filtros por gênero, preço e ordenação
- 🎮 Página de detalhes do jogo com galeria de imagens e trailer
- ⭐ Sistema de avaliações e reviews
- 📚 Biblioteca pessoal com rastreamento de horas jogadas
- 💝 Lista de desejos (Wishlist)
- 🚀 Publicação e edição de jogos pelo próprio usuário
- 👤 Perfil público com jogos publicados e histórico de avaliações
- 🌐 Feed da comunidade com filtros de sentimento e busca

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| React 18 | Biblioteca principal de UI |
| Vite | Bundler e ambiente de desenvolvimento |
| React Router DOM v7 | Roteamento entre páginas |
| Axios | Consumo da API REST com interceptors |
| Tailwind CSS v4 | Estilização utilitária |
| Framer Motion | Animações de interface |
| Lucide React | Ícones |

---

## 🏗️ Arquitetura do Projeto

```
src/
├── components/
│   ├── biblioteca/       # Card da biblioteca com rastreamento de horas
│   ├── common/           # Header, Footer, Banner, Toast
│   ├── comunidade/       # Feed de avaliações e sidebar de destaques
│   ├── game/             # Cards, galeria, sidebar e reviews de jogos
│   ├── home/             # Filtros laterais e seção de catálogo
│   ├── modals/           # Modal de login e confirmação de exclusão
│   ├── profile/          # Header, grid e reviews do perfil
│   └── publicarJogo/     # Formulário e listagem de jogos publicados
├── hooks/                # Custom hooks (useGames, useGameDetails, useToast...)
├── pages/                # Páginas principais da aplicação
├── routes/               # Configuração de rotas
├── services/
│   └── api.js            # Instância Axios centralizada com interceptor de token
├── styles/               # Estilos globais e tema
└── utils/                # Funções utilitárias (formatação, mídia)
```

---

## 🚀 Como Executar Localmente

**Pré-requisitos:** Node.js 18+

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vaporzao.git

# Acesse a pasta
cd vaporzao

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 👨‍💻 Desenvolvedores

| Nome |
|---|
| Matheus de Oliveira Lourenço |
| Pedro Henrique Paiva |
| Paulo Victor Martins |

---

## 📚 Disciplina

**Desenvolvimento Web com Frameworks**
Curso Tecnólogo em Análise e Desenvolvimento de Sistemas — 3º Semestre
