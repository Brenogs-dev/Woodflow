# 🪵 Woodflow — Gerenciador de Projetos de Móveis

> Aplicação web desenvolvida como projeto final da disciplina de **DevOps** no Centro Universitário UNIESP — Semestre 2026.1

---

## 📋 Descrição do Projeto

O **Woodflow** é uma aplicação web voltada para marcenarias e pequenas lojas de móveis que desejam organizar e acompanhar seus projetos de produção.

O sistema resolve o problema do controle manual e desorganizado de pedidos de clientes, que frequentemente resulta em atrasos, perda de informações e dificuldade em priorizar a produção.

---

## 🎯 Objetivo da Aplicação

Com o Woodflow, o responsável pela marcenaria pode:

- Cadastrar cada projeto de móvel solicitado por um cliente
- Registrar materiais, prazos e valores
- Acompanhar o status de produção de forma clara e centralizada
- Visualizar o fluxo produtivo em um painel estilo Kanban

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Função |
|---|---|
| **React.js** | Interface do usuário (frontend) |
| **Node.js + Express** | API REST (backend) |
| **MySQL 8** | Banco de dados relacional |
| **Docker + Docker Compose** | Conteinerização e orquestração dos serviços |
| **GitHub + GitFlow** | Versionamento e organização de branches |
| **GitHub Actions** | Pipeline de integração contínua (CI/CD) |
| **SonarCloud** | Análise estática de qualidade de código |
| **JWT** | Autenticação e autorização |
| **Nginx** | Servidor do frontend em produção |

---

## 🚀 Instruções para Execução

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado
- Git instalado

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/Brenogs-dev/woodflow.git
cd woodflow
```

**2. Suba todos os serviços com Docker Compose**
```bash
docker compose up -d
```

**3. Acesse a aplicação**

| Serviço | URL |
|---|---|
| Frontend (React) | http://localhost:3000 |
| Backend (API) | http://localhost:3001 |
| Banco de dados | localhost:3306 |

**4. Login padrão**

```
E-mail: admin@woodflow.com
Senha:  password
```

---

## ⌨️ Comandos Principais

```bash
# Subir todos os containers
docker compose up -d

# Verificar status dos containers
docker compose ps

# Ver logs de todos os serviços
docker compose logs

# Ver logs de um serviço específico
docker compose logs api
docker compose logs web
docker compose logs db

# Parar os containers
docker compose down

# Reconstruir as imagens (após alterações no código)
docker compose build

# Reconstruir e subir
docker compose up -d --build

# Remover containers, volumes e dados do banco
docker compose down -v
```

---

## 📁 Estrutura do Projeto

```
woodflow/
│
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Configuração do banco de dados
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── clientesController.js
│   │   │   ├── projetosController.js
│   │   │   └── materiaisController.js
│   │   ├── middleware/
│   │   │   └── auth.js         # Middleware JWT
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── clientes.js
│   │   │   └── projetos.js
│   │   └── server.js           # Entry point da API
│   ├── init.sql                # Script de criação do banco
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React.js
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js       # Sidebar e estrutura base
│   │   ├── contexts/
│   │   │   └── AuthContext.js  # Contexto de autenticação
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Projetos.js     # CRUD principal
│   │   │   ├── Clientes.js     # CRUD de clientes
│   │   │   └── Kanban.js       # Painel Kanban
│   │   ├── services/
│   │   │   └── api.js          # Configuração Axios
│   │   ├── App.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── nginx.conf              # Configuração Nginx para SPA
│   └── Dockerfile
│
├── docker-compose.yml          # Orquestração dos 3 serviços
├── Jenkinsfile                 # Pipeline CI/CD
├── sonar-project.properties    # Configuração SonarQube
└── README.md
```

---

## ⚙️ Pipeline CI/CD — GitHub Actions

O projeto utiliza **GitHub Actions** para integração contínua. O workflow é disparado automaticamente em pushes e pull requests para as branches `main`, `develop`, `feature/**`, `release/**` e `hotfix/**`.

### Etapas da pipeline

| Etapa | Descrição |
|---|---|
| **Checkout** | Clona o repositório com histórico completo |
| **Build Backend** | Instala dependências Node.js do backend |
| **Build Frontend** | Instala dependências e gera o build de produção do React |
| **SonarCloud Analysis** | Análise estática de qualidade e bugs |
| **Docker Build** | Constrói as imagens Docker dos serviços |
| **Deploy** | Sobe os containers via Docker Compose (apenas na `main`) |

### Secrets necessários no GitHub

Configure os seguintes secrets no repositório (**Settings → Secrets and variables → Actions**):

| Secret | Descrição |
|---|---|
| `SONAR_TOKEN` | Token de autenticação gerado no SonarCloud |
| `SONAR_PROJECT_KEY` | Chave do projeto no SonarCloud (ex: `Brenogs-dev_woodflow`) |
| `SONAR_ORGANIZATION` | Organização no SonarCloud (ex: `brenogs-dev`) |

---

## 🔀 GitFlow — Organização de Branches

Este projeto segue a estratégia **GitFlow**:

| Branch | Descrição |
|---|---|
| `main` | Código estável em produção |
| `develop` | Branch de integração de novas features |
| `feature/nome` | Desenvolvimento de funcionalidades |
| `release/versão` | Preparação de uma nova versão |
| `hotfix/nome` | Correções urgentes em produção |

---

## 🔗 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login do usuário |
| POST | `/api/auth/registrar` | Cadastro de usuário |
| GET | `/api/clientes` | Listar clientes |
| POST | `/api/clientes` | Cadastrar cliente |
| PUT | `/api/clientes/:id` | Atualizar cliente |
| DELETE | `/api/clientes/:id` | Remover cliente |
| GET | `/api/projetos` | Listar projetos (aceita `?status=` e `?cliente_id=`) |
| POST | `/api/projetos` | Cadastrar projeto |
| PUT | `/api/projetos/:id` | Atualizar projeto |
| DELETE | `/api/projetos/:id` | Remover projeto (soft delete) |
| GET | `/api/projetos/:id/materiais` | Listar materiais do projeto |
| POST | `/api/projetos/:id/materiais` | Adicionar material |

---

## 👥 Integrantes da Equipe

| Nome | GitHub |
|---|---|
| Breno Gomes da Silva | [@Brenogs-dev](https://github.com/Brenogs-dev) |
| Elionay da Costa Silva | — |

---

## 🏫 Informações Acadêmicas

- **Instituição:** Centro Universitário UNIESP
- **Curso:** Sistemas para Internet
- **Disciplina:** DevOps
- **Professor:** Jonas Bernadino
- **Período:** 5° — Semestre 2026.1
