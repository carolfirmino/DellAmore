document.querySelectorAll('.menu-fixo a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
    document.querySelectorAll('.menu-fixo li').forEach(li => li.classList.remove('active'));
    this.parentElement.classList.add('active');
  });
});

const carrinho = [];
const carrinhoContainer = document.getElementById("carrinho-container");
const iconeCarrinho = document.getElementById("icone-carrinho");

iconeCarrinho.addEventListener("click", () => {
  carrinhoContainer.classList.toggle("aberto");
});

// Salvar no localStorage
function salvarCarrinho() {
  localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
}

// Carregar do localStorage
function carregarCarrinho() {
  const salvo = localStorage.getItem('meuCarrinho');
  if (salvo) {
    const itens = JSON.parse(salvo);
    itens.forEach(item => carrinho.push(item));
    atualizarCarrinho();
  }
}

// Funções principais do carrinho
function adicionarProduto(nome, preco) {
  const existente = carrinho.find(item => item.nome === nome);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }
  atualizarCarrinho();
  salvarCarrinho();
}

function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }
  atualizarCarrinho();
  salvarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("carrinho");
  const totalSpan = document.getElementById("total");
  const contador = document.getElementById("contador-carrinho");

  lista.innerHTML = "";
  let total = 0;
  let totalItens = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");
    const subtotal = item.quantidade * item.preco;
    total += subtotal;
    totalItens += item.quantidade;

li.innerHTML = `
  <span>${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2)}</span>
  <div>
    <button class="btn-menor">−</button>
    <button class="btn-maior">+</button>
  </div>
`;

    // Eventos dos botões
    li.querySelector(".btn-menor").addEventListener("click", () => alterarQuantidade(index, -1));
    li.querySelector(".btn-maior").addEventListener("click", () => alterarQuantidade(index, 1));

    lista.appendChild(li);
  });

  totalSpan.textContent = total.toFixed(2);
  contador.textContent = totalItens;
}

// Seleção de cards (para acompanhamentos)
function selecionarCard(card) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(c => c.classList.remove('selecionado'));
  card.classList.add('selecionado');

  const valor = card.getAttribute('data-valor');
  document.getElementById('acompanhamentoSelecionado').value = valor;
}

function selecionarAcompanhamento(card) {
  const todosCards = document.querySelectorAll('.acompanhamento-card');
  todosCards.forEach(c => c.classList.remove('selecionado'));
  card.classList.add('selecionado');

  const valor = card.getAttribute('data-valor');
  const radio = card.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
}

// Execução ao carregar a página
window.addEventListener("load", () => {
  carregarCarrinho();

  // Marcar acompanhamento inicial
  const inicial = document.querySelector('.acompanhamento-card input:checked');
  if (inicial) {
    inicial.closest('.acompanhamento-card').classList.add('selecionado');
  }
});
