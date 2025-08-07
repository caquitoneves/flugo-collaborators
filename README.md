# Flugo Colaboradores

Formulário multi-step para cadastro de colaboradores, com persistência em Firebase e interface Material UI.

## Rodando localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/flugo-collaborators.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Configuração do Firebase

- As credenciais do Firebase estão definidas diretamente no arquivo `src/firebase/config.ts`.

- O Firestore está configurado para armazenar os colaboradores no collection `collaborators`.

- O app valida e previne duplicidade de colaboradores pelo campo e-mail.

## Deploy

O projeto está hospedado em: [link do deploy](https://flugo-collaborators.vercel.app/)

---

## Funcionalidades

- Formulário dividido em etapas para melhor experiência do usuário (multi-step).

- Validação de campos obrigatórios em cada etapa.

- Validação de formato de e-mail.

- Feedback visual em tempo real com mensagens de erro e sucesso.

- Persistência dos dados no Firebase Firestore.

- Evita cadastro duplicado pelo e-mail.

- Interface responsiva e estilizada com Material UI.

---

## Estrutura do projeto

- `src/components` - Componentes React reutilizáveis (Steps, Listagem, Layout).

- `src/firebase` - Configuração do Firebase e funções para CRUD.

- `src/types` - Tipagens TypeScript para Colaboradores e outros.

- `src/pages` - Páginas principais (ex: Home).

---

## Como usar

- Clique em Novo Colaborador para abrir o formulário.

- Preencha as informações básicas (nome, e-mail e status).

- Avance para as informações profissionais (departamento).

- Envie para salvar no Firebase.

- Visualize os colaboradores cadastrados na lista.

---

## Contato
Caio Vinícius Neves Silva
[LinkedIn](https://www.linkedin.com/in/caconeves/) | caco_neves@outlook.com