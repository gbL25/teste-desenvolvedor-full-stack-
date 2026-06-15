# Painel Jurídico - Prova Técnica Full Stack

Este projeto é uma aplicação web full stack desenvolvida como parte de uma prova técnica. Ele consiste em um painel interno para um escritório de advocacia visualizar, pesquisar e analisar dados de agendamentos e atendimentos jurídicos.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:
- `backend/`: API REST desenvolvida em Node.js com Express.
- `frontend/`: Interface de usuário desenvolvida em React com Vite.

## 1. Instruções para o Back-end

O back-end serve os dados a partir de um arquivo JSON e fornece endpoints para filtros, paginação, métricas e exportação.

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação e Execução
1. Abra um terminal e navegue até a pasta do back-end:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
   *(Para modo de desenvolvimento com hot-reload, use `npm run dev`)*
4. O servidor estará rodando em `http://localhost:3001`.

## 2. Instruções para o Front-end

O front-end consome a API REST e apresenta um dashboard com métricas (KPIs e gráficos) e uma tabela de agendamentos com filtros avançados e exportação de dados.

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação e Execução
1. Abra um novo terminal e navegue até a pasta do front-end:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm run dev
   ```
4. A aplicação estará disponível no endereço indicado no terminal (geralmente `http://localhost:5173`).

## 3. Dependências Utilizadas

### Back-end
- **express**: Framework minimalista para criação da API REST, facilitando o roteamento e tratamento de requisições.
- **cors**: Middleware essencial para permitir que o front-end (rodando em outra porta) faça requisições para a API.
- **nodemon** (dev): Ferramenta que reinicia automaticamente o servidor durante o desenvolvimento quando arquivos são alterados.

### Front-end
- **react** / **react-dom**: Biblioteca principal para construção da interface de usuário baseada em componentes.
- **vite**: Ferramenta de build super rápida que substitui o Create React App, oferecendo uma experiência de desenvolvimento muito superior.
- **axios**: Cliente HTTP baseado em Promises, escolhido por sua sintaxe limpa, interceptadores e tratamento automático de JSON, sendo superior ao fetch nativo.
- **recharts**: Biblioteca de gráficos construída especificamente para React. Foi escolhida por ser declarativa, responsiva e ter excelente documentação.
- **jspdf**: Biblioteca robusta para geração de arquivos PDF diretamente no navegador.
- **jspdf-autotable**: Plugin para o jsPDF que facilita imensamente a criação de tabelas bem formatadas em documentos PDF.
- **react-icons**: Coleção de ícones populares (como Feather Icons) como componentes React, facilitando a estilização e garantindo consistência visual.

## 4. Descrição das Decisões Técnicas

1. **Arquitetura e Organização**: O back-end foi estruturado seguindo o padrão MVC (Model-View-Controller) simplificado, com pastas para `routes`, `controllers` e `data`. O front-end foi dividido em componentes funcionais focados e reutilizáveis (`Dashboard`, `DataTable`, `Charts`, etc.).
2. **Tratamento de Dados**: Os dados do Excel original não continham todos os campos exigidos pela especificação (como "Receita", "Área Jurídica" e diversidade de "Status"). Por isso, um script Python foi criado para enriquecer e transformar os dados de forma realista, gerando o arquivo `atendimentos.json` com 500 registros completos.
3. **Paginação no Back-end**: A paginação foi implementada no lado do servidor para garantir escalabilidade. A API retorna os dados da página atual junto com metadados de paginação (total de registros, total de páginas).
4. **Filtros Flexíveis**: A API permite combinar múltiplos filtros (busca textual, status, área jurídica). A busca textual verifica simultaneamente os campos cliente, advogado e área jurídica, melhorando a experiência do usuário.
5. **Dashboard Dinâmico**: O dashboard calcula as métricas em tempo real com base no arquivo JSON. O back-end processa esses cálculos e entrega os dados já formatados para os gráficos, reduzindo a carga de processamento no navegador.
6. **Exportação Otimizada**: Foi criado um endpoint específico (`/api/atendimentos/exportar`) que retorna todos os dados que correspondem aos filtros atuais, mas sem paginação. Isso garante que a exportação (CSV ou PDF) contenha todos os resultados da pesquisa, não apenas os da página atual.

## 5. Limitações Conhecidas e Melhorias Futuras

### Limitações
- **Banco de Dados Mock**: O uso de um arquivo JSON como banco de dados significa que alterações (se fossem implementadas) não persistiriam de forma robusta em cenários de concorrência.
- **Segurança Básica**: A aplicação não possui autenticação ou autorização, assumindo que rodará em uma intranet segura.

### Melhorias Futuras
- **Migração para Banco de Dados Relacional**: Substituir o JSON por PostgreSQL ou PostgreSQL para melhor integridade, consultas complexas e concorrência.
- **Implementação de ORM/Query Builder**: Adicionar Prisma ou Sequelize no back-end para gerenciar o banco de dados.
- **Testes Automatizados**: Implementar testes unitários com Jest no back-end e React Testing Library no front-end.
- **Autenticação**: Adicionar JWT (JSON Web Tokens) para controle de acesso ao painel.
- **Estado Global**: Se a aplicação crescer, implementar Redux ou Zustand para gerenciamento de estado complexo, embora o estado local atual seja suficiente para o escopo do projeto.
