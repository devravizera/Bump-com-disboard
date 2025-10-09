import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const GUILD_ID = "1407180840630358067";
const CHANNEL_ID = "1407414286623703193";
const LOGS_ID = "1425560438871167047";
const PERMITIDO_CARGO = "1407183671437426818";

let cicloAtivo = false;
let timeoutNotificacao = null;
let ultimoBump = 0;

function formatarTempo(ms) {
  const totalMin = Math.floor(ms / 60000);
  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;
  return `${horas}h ${minutos}m`;
}

client.once("ready", () => {
  console.log(`<a:positivo:1425530343103922233> ┃ Bot conectado como ${client.user.tag}`);
});

async function enviarMensagemTemporaria(channel, conteudo, tempo = 300000) {
  const msg = await channel.send(conteudo);
  setTimeout(() => msg.delete().catch(() => {}), tempo);
  return msg;
}

async function enviarLog(conteudo) {
  const canalLogs = await client.channels.fetch(LOGS_ID);
  if (canalLogs) canalLogs.send(conteudo).catch(() => {});
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const conteudo = message.content.toLowerCase();
  const membro = message.member;
  if (!membro?.roles.cache.has(PERMITIDO_CARGO)) return;

  // Detecta /bump
  if (conteudo.includes("/bump")) {
    if (!cicloAtivo) return;
    ultimoBump = Date.now();
    clearTimeout(timeoutNotificacao);

    await enviarLog(`<a:engrenagem:1425541312605847772> ┃ Novo /bump detectado por ${message.author}. Próximo em 2h.`);

    timeoutNotificacao = setTimeout(async () => {
      const canal = await client.channels.fetch(CHANNEL_ID);
      if (canal) {
        canal.send(`<a:aviso:1425539392050561115> ┃ Já se passaram 2h desde o último /bump! Hora de usar novamente <@&${PERMITIDO_CARGO}>`);
      }
      enviarLog(`<a:positivo:1425530343103922233> ┃ Notificação de /bump enviada após 2h.`);
    }, 2 * 60 * 60 * 1000); // 2 horas
  }

  // !iniciar
  if (conteudo === "!iniciar") {
    if (cicloAtivo) return enviarMensagemTemporaria(message.channel, "<a:aviso:1425539392050561115> ┃ O ciclo já está ativo.");

    cicloAtivo = true;
    enviarMensagemTemporaria(message.channel, "<a:positivo:1425530343103922233> ┃ Sistema de monitoramento de /bump iniciado. O contador começa quando alguém usar /bump.");
    enviarLog(`<a:positivo:1425530343103922233> ┃ O sistema foi iniciado por ${message.author}.`);
  }

  // !parar
  if (conteudo === "!parar") {
    if (!cicloAtivo) return enviarMensagemTemporaria(message.channel, "<a:aviso:1425539392050561115> ┃ Nenhum ciclo ativo para parar.");

    cicloAtivo = false;
    clearTimeout(timeoutNotificacao);
    enviarMensagemTemporaria(message.channel, "<a:negativo:1425530529750716476> ┃ Sistema de monitoramento de /bump encerrado.");
    enviarLog(`<a:negativo:1425530529750716476> ┃ O sistema foi encerrado por ${message.author}.`);
  }

  // !ajuda
  if (conteudo === "!ajuda" || conteudo === "!help") {
    const ajuda = `
**Comandos disponíveis:**
<a:engrenagem:1425541312605847772> \`!iniciar\` → Inicia o monitoramento do /bump.
<a:negativo:1425530529750716476> \`!parar\` → Interrompe o monitoramento.
<a:aviso:1425539392050561115> \`!ajuda\` → Exibe esta mensagem.
    `;
    enviarMensagemTemporaria(message.channel, ajuda, 300000);
  }
});

client.login(process.env.TOKEN);
