import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const GUILD_ID = "1407180840630358067";
const PERMITIDO_CARGO = "1407183671437426818";
const USER_NOTIFICAR = "<@1326640990014144534>";

let contadorAtivo = false;
let mensagemProgresso = null;
let tempoInicio = null;
let tempoTotal = 2 * 60 * 60 * 1000;
let intervaloEdicao = null;
let notificado = false;

client.once("ready", () => {
  console.clear();
  console.log(`[${new Date().toLocaleTimeString()}] ✅ Bot conectado como ${client.user.tag}`);
});

async function enviarMensagemTemporaria(channel, conteudo, tempo = 5000) {
  const msg = await channel.send(conteudo);
  setTimeout(() => msg.delete().catch(() => {}), tempo);
  return msg;
}

// Gera barra de progresso
function gerarBarra(progresso) {
  const totalBlocos = 20;
  const preenchido = Math.round(progresso * totalBlocos);
  const vazio = totalBlocos - preenchido;

  const barraPreenchida = "🟩".repeat(preenchido);
  const barraVazia = "⬛".repeat(vazio);

  return barraPreenchida + barraVazia;
}

async function iniciarContador(channel) {
  if (contadorAtivo) return;
  contadorAtivo = true;
  tempoInicio = Date.now();
  notificado = false;

  mensagemProgresso = await channel.send(
    `<a:positivo:1425530343103922233> ┃ Contagem de 2h iniciada!\n\`\`\`\n${gerarBarra(0)} 0%\nTempo decorrido: 0 min / 120 min\n\`\`\``
  );

  intervaloEdicao = setInterval(async () => {
    const decorrido = Date.now() - tempoInicio;
    const progresso = Math.min(decorrido / tempoTotal, 1);
    const barra = gerarBarra(progresso);
    const minutosDecorridos = (decorrido / 60000).toFixed(1);

    if (mensagemProgresso) {
      await mensagemProgresso.edit(
        `<a:engrenagem:1425541312605847772> ┃ Contagem de 2h em andamento\n\`\`\`\n${barra} ${Math.round(
          progresso * 100
        )}%\nTempo decorrido: ${minutosDecorridos} min / 120 min\n\`\`\``
      );
    }

    if (progresso >= 1) {
      clearInterval(intervaloEdicao);
      contadorAtivo = false;

      if (mensagemProgresso) {
        await mensagemProgresso.delete().catch(() => {});
        mensagemProgresso = null;
      }

      if (!notificado) {
        await channel.send(
          `${USER_NOTIFICAR} <a:aviso:1425539392050561115> ┃ 2 horas completas! Use /bump novamente.`
        );
        notificado = true;
        console.log(`[${new Date().toLocaleTimeString()}] ✅ Contagem de 2h finalizada.`);
      }
    }
  }, 1000); // atualiza a cada 1s
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.guild?.id !== GUILD_ID) return;

  const conteudo = message.content.toLowerCase();
  const membro = message.member;
  if (!membro.roles.cache.has(PERMITIDO_CARGO)) return;

  if (["!parar", "!ajuda", "!help", "!bump"].includes(conteudo)) {
    message.delete().catch(() => {});
  }

  if (conteudo === "!parar") {
    clearInterval(intervaloEdicao);
    contadorAtivo = false;

    if (mensagemProgresso) {
      await mensagemProgresso.delete().catch(() => {});
      mensagemProgresso = null;
    }

    enviarMensagemTemporaria(
      message.channel,
      "<a:negativo:1425530529750716476> ┃ Contagem interrompida.",
      5000
    );
    console.log(`[${new Date().toLocaleTimeString()}] 🔴 Contagem interrompida.`);
  }

  if (conteudo === "!ajuda" || conteudo === "!help") {
    const ajuda = `
Comandos disponíveis:

\`!parar\` → Interrompe a contagem ativa.
\`!bump\` → Inicia contagem de 2h diretamente.
\`!ajuda\` ou \`!help\` → Exibe esta mensagem.
    `;
    enviarMensagemTemporaria(message.channel, ajuda, 20000);
  }

  if (conteudo === "!bump") {
    if (contadorAtivo)
      return enviarMensagemTemporaria(
        message.channel,
        "<a:aviso:1425539392050561115> ┃ Contagem já está ativa.",
        5000
      );

    iniciarContador(message.channel);
  }
});

client.login(process.env.TOKEN);
