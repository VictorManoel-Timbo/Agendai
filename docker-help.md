# Agendai Frontend - Docker

Este projeto é o frontend do Agendai, pronto para ser executado em Docker em qualquer sistema operacional (Windows, Linux, Mac).

## Pré-requisitos
- [Docker](https://www.docker.com/get-started) instalado (Docker Desktop para Windows/Mac, Docker Engine para Linux)
- Backend rodando na porta 8000 da sua máquina local

## Como rodar

1. **Clone o repositório e acesse a pasta do frontend:**
   ```sh
   git clone <seu-repositorio>
   cd Agendai
   ```

2. **Certifique-se de que o backend está rodando:**
   - O backend deve estar acessível em `http://localhost:8000/api`
   - Teste no navegador ou com curl: `curl http://localhost:8000/api`

3. **Build e execute o container (primeira vez):**
   ```sh
   docker compose up --build
   ```
   - O frontend estará disponível em: **http://localhost**

4. **Após o primeiro build, você pode usar:**
   - Iniciar em modo detached (segundo plano):
     ```sh
     docker compose up -d
     ```
   - Parar o container:
     ```sh
     docker compose down
     ```

## Como funciona

O frontend é servido pelo Nginx na porta 80. As requisições para `/api` são automaticamente proxy-passadas para o backend rodando na porta 8000 da sua máquina.

**Arquitetura:**
- Frontend (Docker/Nginx): http://localhost:80
- Backend (sua máquina): http://localhost:8000/api
- Nginx faz proxy de `/api` → `host.docker.internal:8000/api`

Isso funciona em **Windows, Mac e Linux** graças à configuração `extra_hosts` no docker-compose.yml.

## Desenvolvimento local (sem Docker)

Para rodar em modo desenvolvimento com hot reload:
```sh
npm install
npm run dev
```
Acesse: http://localhost:5173

## Observações

- O arquivo `.env` contém `VITE_BASE_URL=http://localhost:8000/api` para uso local com `npm run dev`.
- No Docker, o nginx.conf faz o proxy automático das requisições `/api` para o backend.
- Se o backend estiver em outra porta, ajuste no `nginx.conf` a linha `proxy_pass`.

## Compatibilidade

✅ Windows (Docker Desktop)  
✅ Mac (Docker Desktop)  
✅ Linux (Docker Engine)

---

Dúvidas? Abra uma issue ou entre em contato com o time de desenvolvimento.
