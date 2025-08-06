// Funções JavaScript para o Projeto
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Função para exibir a resposta da IA - Christiane Gomes
function mostrarResposta() {
  const respostaSection = document.getElementById("respostaSection");
  // Torna visível a seção de resposta
  respostaSection.style.display = "block";
}

// contador de caraceters

let textarea= document.querySelector('textarea'),
    character_in=document.querySelector('p span');

    character_in.innerText=500
    
    textarea.onkeyup=function(){
        character_in.innerText=this.value.length
    }