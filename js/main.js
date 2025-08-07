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

// Função para enviar pergunta à IA - Vinnie
async function enviarPergunta() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const pergunta = document.getElementById("perguntaInput").value.trim();
  const respostaTexto = document.getElementById("respostaTexto");

  // normalmente a estrutura de loading pode ser adicionada aqui

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
    respostaTexto.textContent =
      "Erro: " + (dados.error?.message || "Erro desconhecido");
    return;
  }

  // aqui é onde consome a resposta da IA e exibe na tela
  // exemplo: respostaTexto.textContent = dados.(caminho da resposta), pode verificar o objeto com um console.log(dados) para ver o caminho correto. é bom usar '?' para evitar erros de sintaxe, assim se a resposta não existir (for null, undefined, etc), não quebra o código. por exemplo: dados.candidates?. e assim vai
}
