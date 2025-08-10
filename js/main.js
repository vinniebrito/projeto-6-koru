// Função para alternar entre temas claro e escuro - Willian
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Função para exibir a resposta da IA - Christiane Gomes
function mostrarResposta() {
  const respostaSection = document.getElementById("respostaSection");
  // Torna visível a seção de resposta
  respostaSection.style.display = "block";
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

  // Salva a API Key no localStorage - Vinnie
  localStorage.setItem("apiKey", apiKey);

  // Validação - Michelle
  let valido = true;

  if (apiKey === "") {
    erroApiKey.textContent = "Por favor, insira sua API Key.";
    erroApiKey.style.display = "block";
    document.getElementById("apiKey").classList.add("input-erro");
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
    } else {
      // aqui é onde consome a resposta da IA e exibe na tela
      // exemplo: respostaTexto.textContent = dados.(caminho da resposta), pode verificar o objeto com um console.log(dados) para ver o caminho correto. é bom usar '?' para evitar erros de sintaxe, assim se a resposta não existir (for null, undefined, etc), não quebra o código. por exemplo: dados.candidates?. e assim vai
    }
  } catch (e) {
    respostaTexto.textContent =
      "Não foi possível se conectar à IA no momento. Por favor, verifique sua conexão ou tente novamente mais tarde.";
  } finally {
    // Finaliza loading e reabilita botão - Michelle
    loading.style.display = "none";
    botao.disabled = false;
    botao.textContent = "Perguntar";
  }
}
