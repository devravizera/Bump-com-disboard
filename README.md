# 🤖 Bot de Monitoramento de /bump — Discord.js

Este bot foi desenvolvido para **automatizar e monitorar o uso do comando `/bump`** em um servidor do Discord.  
Ele envia notificações automáticas a cada 2 horas, registra logs e permite iniciar ou parar o monitoramento via comandos simples.

---

## ⚙️ Funcionalidades

- 🔁 **Monitoramento automático do `/bump`**
  - Detecta quando alguém usa o comando `/bump`
  - Aguarda 2 horas e notifica o cargo específico para realizar um novo bump

- 🧠 **Sistema de logs**
  - Envia logs detalhados para um canal definido

- 🧹 **Mensagens temporárias**
  - As respostas de aviso são apagadas automaticamente após 5 minutos

- 🔒 **Permissões**
  - Apenas membros com um cargo específico podem ativar os comandos

---

## 🧩 Comandos disponíveis

| Comando | Função |
|----------|--------|
| `!iniciar` | Inicia o monitoramento do `/bump` |
| `!parar` | Interrompe o monitoramento |
| `!ajuda` ou `!help` | Mostra todos os comandos disponíveis |

---

## 📦 Requisitos

- Node.js 16 ou superior  
- Dependências:
  ```bash
  npm install discord.js dotenv

---

🗝️ *Variáveis de ambiente (.env)*

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

TOKEN=seu_token_aqui

---

🔧 *Configurações*

Altere as IDs no código conforme seu servidor:

GUILD_ID ➜ ID do servidor
CHANNEL_ID ➜ Canal onde o bump é feito
LOGS_ID	Canal ➜ de logs
PERMITIDO_CARGO ➜ Cargo autorizado a usar os comandos

---

🚀 *Como iniciar*

**Localmente:**

node index.js

**Hospedagem:**

[Squarecloud](https://squarecloud.app)

---

🧾 *Licença*

Este projeto é de uso livre para diversão e aprendizado pessoal, podendo ser adaptado conforme suas necessidades, sem fins lucrativos.