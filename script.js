/* ==========================
   SPLASH → LOGIN
========================== */
window.onload = () => {
  setTimeout(() => {
    document.getElementById("splash").classList.add("hidden");
    document.getElementById("login-page").classList.remove("hidden");
  }, 1800);
};

/* ==========================
   LOGIN
========================== */
function login() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();

  if (user === "admin" && pass === "1234") {

    localStorage.setItem("logado", "true");

    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    carregar();
  } else {
    alert("Usuário e senha inválidos!");
  }
}

function logout() {
  localStorage.removeItem("logado");
  location.reload();
}

/* ==========================
   NAVEGAÇÃO
========================== */
function mostrarPagina(id) {
  document.querySelectorAll("main section").forEach(sec => {
    sec.classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  const linkId = "link" + id.charAt(0).toUpperCase() + id.slice(1);
  const link = document.getElementById(linkId);
  if (link) link.classList.add("active");
}

/* ==========================
   DADOS
========================== */
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

/* ==========================
   CLIENTES
========================== */
function addCliente() {

  const cliente = {
    id: Date.now(),
    nome: document.getElementById("nomeCliente").value,
    tel: document.getElementById("telefoneCliente").value,
    bairro: document.getElementById("bairroCliente").value
  };

  clientes.push(cliente);
  localStorage.setItem("clientes", JSON.stringify(clientes));

  atualizarClientes();
  atualizarSelects();
  atualizarDashboard();
}

function atualizarClientes() {
  const t = document.getElementById("tabelaClientes");

  t.innerHTML = clientes.map(c => `
      <tr>
        <td>${c.nome}</td>
        <td>${c.tel}</td>
        <td>${c.bairro}</td>
        <td><button class="btn-delete" onclick="delCliente(${c.id})">🗑</button></td>
      </tr>
  `).join("");
}

function delCliente(id) {
  clientes = clientes.filter(c => c.id !== id);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  atualizarClientes();
  atualizarDashboard();
}

/* ==========================
   ESTOQUE
========================== */
function addProduto() {
  const p = {
    id: Date.now(),
    nome: document.getElementById("nomeProduto").value,
    qtd: Number(document.getElementById("quantidadeProduto").value),
    preco: Number(document.getElementById("precoProduto").value)
  };

  estoque.push(p);
  localStorage.setItem("estoque", JSON.stringify(estoque));

  atualizarEstoque();
  atualizarSelects();
  atualizarDashboard();
}

function atualizarEstoque() {
  const t = document.getElementById("tabelaEstoque");

  t.innerHTML = estoque.map(p => `
      <tr>
        <td>${p.nome}</td>
        <td>${p.qtd}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td><button class="btn-delete" onclick="delProduto(${p.id})">🗑</button></td>
      </tr>
  `).join("");
}

function delProduto(id) {
  estoque = estoque.filter(p => p.id !== id);
  localStorage.setItem("estoque", JSON.stringify(estoque));
  atualizarEstoque();
  atualizarDashboard();
}

/* ==========================
   VENDAS
========================== */
function fazerVenda() {
  const cliente = document.getElementById("clienteVenda").value;
  const produto = document.getElementById("produtoVenda").value;
  const qtd = Number(document.getElementById("qtdVenda").value);

  const prod = estoque.find(p => p.nome === produto);

  if (!prod) return alert("Produto inválido!");
  if (prod.qtd < qtd) return alert("Estoque insuficiente!");

  prod.qtd -= qtd;

  vendas.push({
    id: Date.now(),
    cliente,
    produto,
    qtd,
    total: qtd * prod.preco
  });

  localStorage.setItem("vendas", JSON.stringify(vendas));
  localStorage.setItem("estoque", JSON.stringify(estoque));

  atualizarVendas();
  atualizarEstoque();
  atualizarDashboard();
}

function atualizarVendas() {
  const t = document.getElementById("tabelaVendas");

  t.innerHTML = vendas.map(v => `
      <tr>
        <td>${v.cliente}</td>
        <td>${v.produto}</td>
        <td>${v.qtd}</td>
        <td>R$ ${v.total.toFixed(2)}</td>
      </tr>
  `).join("");
}

/* ==========================
   DASHBOARD
========================== */
function atualizarDashboard() {
  document.getElementById("totalClientes").textContent = clientes.length;
  document.getElementById("totalProdutos").textContent = estoque.reduce((a, b) => a + b.qtd, 0);
  document.getElementById("totalVendas").textContent = vendas.length;
}

/* ==========================
   SELECTS
========================== */
function atualizarSelects() {
  const c = document.getElementById("clienteVenda");
  const p = document.getElementById("produtoVenda");

  c.innerHTML = clientes.map(x => `<option>${x.nome}</option>`).join("");
  p.innerHTML = estoque.map(x => `<option>${x.nome}</option>`).join("");
}

/* ==========================
   CARREGAMENTO
========================== */
function carregar() {
  atualizarClientes();
  atualizarEstoque();
  atualizarVendas();
  atualizarSelects();
  atualizarDashboard();
}

/* ==========================
   AUTO LOGIN (Corrigido)
========================== */
if (localStorage.getItem("logado") === "true") {
  document.getElementById("splash").classList.add("hidden");
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  carregar();
}
