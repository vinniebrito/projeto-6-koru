// Função para alternar entre temas claro e escuro - Willian
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Função para exibir a resposta da IA - Christiane Gomes
function mostrarResposta() {
  const respostaContainer = document.getElementById("resposta-container");
  // Torna visível a seção de resposta
  respostaContainer.style.display = "block";
}

// Função para contar caracteres - Yasmin
let textarea = document.querySelector("textarea"),
  character_in = document.querySelector("p span");

character_in.innerText = 0;

textarea.onkeyup = function () {
  character_in.innerText = this.value.length;
};

// Função auxiliar para limpar erros de campos - Michelle
function limparErro(idCampo, idErro) {
  const campo = document.getElementById(idCampo);
  const erro = document.getElementById(idErro);

  campo.addEventListener("focus", () => {
    erro.style.display = "none";
    campo.classList.remove("input-erro");
    if (idCampo === "apiKey") {
      const wrapper = document.getElementById("inputWrapper");
      if (wrapper) wrapper.classList.remove("input-erro");
    }
  });
}

limparErro("apiKey", "erroApiKey");
limparErro("perguntaInput", "erroPergunta");

// Salva a API Key no localStorage - Vinnie
window.addEventListener("DOMContentLoaded", () => {
  const apiKeySalva = localStorage.getItem("apiKey");
  if (apiKeySalva) {
    document.getElementById("apiKey").value = apiKeySalva;
  }
});

// Função para converter markdown simples em HTML
function formatarResposta(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // negrito
    .replace(/\n/g, "<br>"); // quebra de linha
}

// Função para enviar pergunta à IA - Vinnie
async function enviarPergunta() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const pergunta = document.getElementById("perguntaInput").value.trim();
  const respostaTexto = document.getElementById("respostaTexto");
  const loading = document.getElementById("loading");
  const botao = document.getElementById("button-pergunta");
  // Validação de formulario - Michelle
  const erroApiKey = document.getElementById("erroApiKey");
  const erroPergunta = document.getElementById("erroPergunta");
  const acoes = document.querySelector(".botao-acoes");

  // Esconde os botões de ações - Vinnie
  acoes.classList.add("hide");

  // Salva a API Key no localStorage - Vinnie
  localStorage.setItem("apiKey", apiKey);

  // Validação - Michelle
  let valido = true;

  if (apiKey === "") {
    erroApiKey.textContent = "Por favor, insira sua API Key.";
    erroApiKey.style.display = "block";
    document.getElementById("inputWrapper").classList.add("input-erro");
    valido = false;
  }

  if (pergunta === "") {
    erroPergunta.textContent = "Digite uma pergunta antes de enviar.";
    erroPergunta.style.display = "block";
    document.getElementById("perguntaInput").classList.add("input-erro");
    valido = false;
  }

  if (!valido) return;
  // Estrutura de loading - Michelle
  // Ativa loading e desabilita botão
  loading.style.display = "flex";
  botao.disabled = true;
  botao.textContent = "Aguarde...";

  // Limpa a resposta anterior - Vinnie
  respostaTexto.textContent = "";
  try {
    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: pergunta,
                },
              ],
            },
          ],
        }),
      }
    );

    const dados = await resposta.json();
    mostrarResposta();

    if (!resposta.ok) {
      switch (dados.error?.code) {
        case 400:
          respostaTexto.textContent =
            "Dados enviados inválidos. Verifique sua API Key e/ou sua pergunta e tente novamente.";
          break;
        case 403:
          respostaTexto.textContent =
            "Você não tem permissão para usar este recurso. Verifique sua conta ou chave de API.";
          break;
        case 429:
          respostaTexto.textContent =
            "Limite de uso da API atingido. Tente novamente mais tarde.";
          break;
        default:
          respostaTexto.textContent =
            "Erro: " + (dados.error?.message || "Erro desconhecido.");
      }
      document
        .getElementById("resposta-container")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      //adiciona a resposta da IA e exibe na tela - bianca
      const resposta = dados.candidates?.[0]?.content?.parts?.[0]?.text;
      respostaTexto.innerHTML = formatarResposta(resposta);
      document
        .getElementById("resposta-container")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (e) {
    respostaTexto.textContent =
      "Não foi possível se conectar à IA no momento. Por favor, verifique sua conexão ou tente novamente mais tarde.";
    document
      .getElementById("resposta-container")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  } finally {
    // Finaliza loading e reabilita botão - Michelle
    loading.style.display = "none";
    botao.disabled = false;
    botao.innerHTML = 'Perguntar <i class="fa-solid fa-paper-plane"></i>';
    acoes.classList.remove("hide");
  }
}

// Função que ao clicar no botão limpar, limpa o campo de pergunta e a resposta - Christiane Gomes
function limparResposta() {
  document.getElementById("perguntaInput").value = "";
  document.getElementById("respostaTexto").innerHTML = "";
  document.getElementById("resposta-container").style.display = "none";
  const modal = document.getElementById("modal");
  if (modal) modal.classList.remove("show");
};

// Função para copiar - Vinnie
function copiarTexto() {
  const resposta = document.getElementById("respostaTexto");
  const texto = resposta.innerText || resposta.textContent;
  if (texto.trim() === "") return;
  navigator.clipboard.writeText(texto).then(() => {
    const botao = document.getElementById("botaoCopiar");
    const textoOriginal = botao.innerHTML;
    botao.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
    setTimeout(() => {
      botao.innerHTML = textoOriginal;
    }, 1000);
  });
}


function abrirModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.classList.add("show");
}

function fecharModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.classList.remove("show");
}