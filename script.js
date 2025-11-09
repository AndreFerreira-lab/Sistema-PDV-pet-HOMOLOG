// ======== LOGIN ========
function login() {
  const user = document.getElementById('user').value;
  const pass = document.getElementById('pass').value;
  if (user === 'admin' && pass === '1234') {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    carregarDados();
  } else {
    alert('Usuário ou senha inválidos! (use admin / 1234)');
  }
}

function logout() {
  document.getElementById('main-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
}

// ======== DADOS ========
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let estoque = JSON.parse(localStorage.getItem('estoque')) || [];
let vendas = JSON.parse(localStorage.getItem('vendas')) || [];

// ======== CLIENTES ========
function addCliente() {
  const nome = document.getElementById('nomeCliente').value;
  const telefone = document.getElementById('telefoneCliente').value;
  if (!nome) return alert('Informe o nome do cliente!');
  clientes.push({ nome, telefone });
  localStorage.setItem('clientes', JSON.stringify(clientes));
  document.getElementById('nomeCliente').value = '';
  document.getElementById('telefoneCliente').value = '';
  atualizarListas();
}

// ======== ESTOQUE ========
function addProduto() {
  const nome = document.getElementById('nomeProduto').value;
  const qtd = parseInt(document.getElementById('quantidadeProduto').value);
  const preco = parseFloat(document.getElementById('precoProduto').value);
  if (!nome || !qtd || !preco) return alert('Preencha todos os campos!');
  estoque.push({ nome, qtd, preco });
  localStorage.setItem('estoque', JSON.stringify(estoque));
  document.getElementById('nomeProduto').value = '';
  document.getElementById('quantidadeProduto').value = '';
  document.getElementById('precoProduto').value = '';
  atualizarListas();
}

// ======== VENDAS ========
function fazerVenda() {
  const cliente = document.getElementById('clienteVenda').value;
  const produto = document.getElementById('produtoVenda').value;
  const qtdVenda = parseInt(document.getElementById('qtdVenda').value);
  const item = estoque.find(p => p.nome === produto);
  if (!item || item.qtd < qtdVenda) return alert('Estoque insuficiente!');
  item.qtd -= qtdVenda;
  const total = item.preco * qtdVenda;
  vendas.push({ cliente, produto, qtdVenda, total });
  localStorage.setItem('estoque', JSON.stringify(estoque));
  localStorage.setItem('vendas', JSON.stringify(vendas));
  atualizarListas();
  alert(`Venda realizada: R$ ${total.toFixed(2)}`);
  document.getElementById('qtdVenda').value = '';
}

// ======== VISUAL ========
function showSection(sec) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sec).classList.add('active');
  document.getElementById('sectionTitle').innerText =
    sec.charAt(0).toUpperCase() + sec.slice(1);
}

// ======== ATUALIZAÇÕES ========
function atualizarListas() {
  const clientesList = document.querySelector('#tabelaClientes tbody');
  clientesList.innerHTML = clientes.map(c => `<tr><td>${c.nome}</td><td>${c.telefone}</td></tr>`).join('');

  const estoqueList = document.querySelector('#tabelaEstoque tbody');
  estoqueList.innerHTML = estoque.map(p => `<tr><td>${p.nome}</td><td>${p.qtd}</td><td>R$ ${p.preco.toFixed(2)}</td></tr>`).join('');

  const vendasList = document.querySelector('#tabelaVendas tbody');
  vendasList.innerHTML = vendas.map(v => `<tr><td>${v.cliente}</td><td>${v.produto}</td><td>${v.qtdVenda}</td><td>R$ ${v.total.toFixed(2)}</td></tr>`).join('');

  const clienteSelect = document.getElementById('clienteVenda');
  const produtoSelect = document.getElementById('produtoVenda');
  clienteSelect.innerHTML = clientes.map(c => `<option>${c.nome}</option>`).join('');
  produtoSelect.innerHTML = estoque.map(p => `<option>${p.nome}</option>`).join('');
}

function carregarDados() {
  atualizarListas();
}
