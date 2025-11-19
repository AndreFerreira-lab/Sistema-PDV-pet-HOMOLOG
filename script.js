/* ====== SPLASH ====== */
window.onload = () => {
  setTimeout(() => {
    document.getElementById("splash").classList.add("hidden");
    document.getElementById("login-page").classList.remove("hidden");
  }, 1800);
};

/* ====== LOGIN ====== */
function login() {
  const u = usuario.value.trim();
  const s = senha.value.trim();

  if (u === "admin" && s === "1234") {
    localStorage.setItem("logado", "true");
    login-page.classList.add("hidden");
    app.classList.remove("hidden");
    carregar();
  } else {
    alert("Usuário e senha inválidos!");
  }
}

function logout() {
  localStorage.removeItem("logado");
  location.reload();
}

/* ====== NAVEGAÇÃO ====== */
function mostrarPagina(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  document.getElementById("link" + id.charAt(0).toUpperCase() + id.slice(1)).classList.add("active");
}

/* ====== DADOS ====== */
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

/* ====== CLIENTES ====== */
function addCliente() {
  const c = {
    id: Date.now(),
    nome: nomeCliente.value,
    tel: telefoneCliente.value,
    bairro: bairroCliente.value
  };

  clientes.push(c);
  localStorage.setItem("clientes", JSON.stringify(clientes));

  atualizarClientes();
  atualizarSelects();
  atualizarDashboard();
}

function atualizarClientes() {
  tabelaClientes.innerHTML = clientes.map(c => `
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

/* ====== ESTOQUE ====== */
function addProduto() {
  estoque.push({
    id: Date.now(),
    nome: nomeProduto.value,
    qtd: Number(quantidadeProduto.value),
    preco: Number(precoProduto.value)
  });

  localStorage.setItem("estoque", JSON.stringify(estoque));
  atualizarEstoque();
  atualizarSelects();
  atualizarDashboard();
}

function atualizarEstoque() {
  tabelaEstoque.innerHTML = estoque.map(p => `
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

/* ====== VENDAS ====== */
function fazerVenda() {
  const cliente = clienteVenda.value;
  const produto = produtoVenda.value;
  const qtd = Number(qtdVenda.value);

  const prod = estoque.find(p => p.nome === produto);
  if (!prod) return alert("Produto inválido");
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
  tabelaVendas.innerHTML = vendas.map(v => `
    <tr>
      <td>${v.cliente}</td>
      <td>${v.produto}</td>
      <td>${v.qtd}</td>
      <td>R$ ${v.total.toFixed(2)}</td>
    </tr>
  `).join("");
}

/* ====== DASHBOARD ====== */
function atualizarDashboard() {
  totalClientes.textContent = clientes.length;
  totalProdutos.textContent = estoque.reduce((t, p) => t + p.qtd, 0);
  totalVendas.textContent = vendas.length;
}

/* ====== SELECTS ====== */
function atualizarSelects() {
  clienteVenda.innerHTML = clientes.map(c => `<option>${c.nome}</option>`).join("");
  produtoVenda.innerHTML = estoque.map(p => `<option>${p.nome}</option>`).join("");
}

/* ====== CARREGAR ====== */
function carregar() {
  atualizarClientes();
  atualizarEstoque();
  atualizarVendas();
  atualizarSelects();
  atualizarDashboard();
}

/* ===== AUTO LOGIN ===== */
if (localStorage.getItem("logado") === "true") {
  splash.classList.add("hidden");
  login-page.classList.add("hidden");
  app.classList.remove("hidden");
  carregar();
}
