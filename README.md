# Flugo Colaboradores

Formulário multi-step para cadastro de colaboradores, com persistência em Firebase e interface Material UI.

## Rodando localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/flugo-colaboradores.git
   cd flugo-colaboradores
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env.local` (se necessário para suas credenciais do Firebase).

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

5. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Configuração do Firebase

O projeto já está integrado com Firebase Firestore.  
Se quiser rodar com suas próprias credenciais, edite o arquivo `src/services/config.ts` com suas informações do Firebase.

## Deploy

O projeto está hospedado em: [link do deploy](https://seuprojeto.vercel.app)

---

## Validações e Feedback

- Todos os campos são obrigatórios.
- Validações de e-mail e campos vazios.
- Feedback visual para sucesso/erro e campos inválidos.

---