# Flugo Colaboradores

Sistema de gestão de colaboradores e departamentos, com autenticação via Firebase, interface Material UI e persistência em Firestore.

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

- As credenciais do Firebase estão definidas em `src/firebase/config.ts`.
- O Firestore armazena colaboradores no collection `collaborators` e departamentos em `departments`.
- Autenticação via Firebase Authentication (JWT) protege as rotas do sistema.

## Deploy

O projeto está hospedado em: [link do deploy](https://flugo-collaborators.vercel.app/)

---

## Usuário de teste

Para acessar o sistema, utilize o login de teste abaixo:

- **E-mail:** teste@flugo.com.br
- **Senha:** Teste@123

## Funcionalidades

- Autenticação de usuários (login/logout) e proteção de rotas.
- Página customizada de 404 para rotas inexistentes.
- Cadastro, edição, exclusão e listagem de colaboradores.
- Cadastro, edição, exclusão e listagem de departamentos.
- Transferência de colaborador entre departamentos (um colaborador só pode pertencer a um departamento).
- Seleção de gestor responsável (apenas colaboradores com nível "Gestor").
- Exclusão individual e em massa de colaboradores.
- Filtros de busca por nome, e-mail e departamento.
- Validação de campos obrigatórios e feedback visual.
- Interface responsiva e estilizada com Material UI.

---

## Estrutura do projeto

- `src/components` - Componentes React reutilizáveis (Steps, Listagem, Modais, Layout).
- `src/firebase` - Configuração do Firebase e funções para CRUD.
- `src/types` - Tipagens TypeScript para Colaboradores e Departamentos.
- `src/pages` - Páginas principais (Colaboradores, Departamentos, Login, NotFound).
- `src/routes` - Proteção de rotas autenticadas.

---

## Como usar

- Faça login para acessar o sistema.
- Navegue entre colaboradores e departamentos pela sidebar.
- Cadastre, edite ou exclua colaboradores e departamentos.
- Ao cadastrar/editar departamento, selecione o gestor responsável (apenas nível "Gestor").
- Transfira colaboradores entre departamentos sem duplicidade.
- Utilize os filtros para buscar colaboradores ou departamentos.

---

## Contato
Caio Vinícius Neves Silva  
[LinkedIn](https://www.linkedin.com/in/caconeves/) | caco_neves@outlook.com