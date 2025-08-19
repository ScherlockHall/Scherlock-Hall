// Elementos
const quoteText = document.getElementById("text");
const quoteAuthor = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const tweetQuote = document.getElementById("tweet-quote");

// Banco de citações
const quotes = [
  {
    text: "A vida é o que acontece enquanto você está ocupado fazendo outros planos.",
    author: "John Lennon"
  },
  {
    text: "O maior prazer na vida é fazer o que as pessoas dizem que você não pode fazer.",
    author: "Walter Bagehot"
  },
  {
    text: "Seja a mudança que você deseja ver no mundo.",
    author: "Mahatma Gandhi"
  },
  {
    text: "O sucesso é ir de fracasso em fracasso sem perder entusiasmo.",
    author: "Winston Churchill"
  },
  {
    text: "A imaginação é mais importante que o conhecimento.",
    author: "Albert Einstein"
  },
  {
    text: "Não existe caminho para a felicidade. A felicidade é o caminho.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Você perde todas as chances que não toma.",
    author: "Michael Jordan"
  },
  {
    text: "Acredite em si mesmo e tudo será possível.",
    author: "Chiang Kai-shek"
  },
  {
    text: "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "A melhor maneira de prever o futuro é criá-lo.",
    author: "Peter Drucker"
  }
];

// Função para gerar citação aleatória
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Função para atualizar a citação
function setNewQuote() {
  const { text, author } = getRandomQuote();
  quoteText.textContent = text;
  quoteAuthor.textContent = author;

  // Atualizar link do Twitter
  const tweetText = `"${text}" — ${author}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  tweetQuote.href = tweetUrl;
}

// Evento de clique
newQuoteBtn.addEventListener("click", setNewQuote);

// Gerar citação ao carregar
window.onload = setNewQuote;