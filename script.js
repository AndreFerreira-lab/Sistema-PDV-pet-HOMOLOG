/* ================= BANCO DE DADOS LOCAL ================= */
let db = {
  clientes: JSON.parse(localStorage.getItem('clientes')) || [],
  estoque: JSON.parse(localStorage.getItem('estoque')) || [],
  vendas: JSON.parse(localStorage.getItem('vendas')) || []
};

// Estado do Carrinho (Volátil)
let carrinho = [];

function saveDB() {
  localStorage.setItem('clientes', JSON.stringify(db.clientes));
  localStorage.setItem('estoque', JSON.stringify(db.estoque));
  localStorage.setItem('vendas', JSON.stringify(db.vendas));
  updateDashboard();
}

/* ================= NAVEGAÇÃO E INICIALIZAÇÃO ================= */
window.addEventListener("load", () => {
  // Se estiver logado, mostra o app e esconde login
  if (localStorage.getItem('logged') === 'true') {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    renderAll();
  } else {
    // Garante que o login está visível
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  }
});

function login() {
  const u = document.getElementById('usuario').value;
  const s = document.getElementById('senha').value;

  if (u === 'admin' && s === '1234') {
    localStorage.setItem('logged', 'true');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    renderAll();
  } else {
    alert("Usuário ou senha incorretos! (admin / 1234)");
  }
}

function logout() {
  localStorage.removeItem('logged');
  location.reload();
}

function mostrarPagina(pageId) {
  // Esconde todas as seções
  document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));

  // Tenta encontrar a página
  const pagina = document.getElementById(pageId);
  if (pagina) pagina.classList.remove('hidden');

  // Atualiza menu
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  const btn = document.getElementById('btn-' + pageId);
  if (btn) btn.classList.add('active');

  // Ações de inicialização/renderização
  if (pageId === 'vendas') renderSelectsVenda(); // Vendas (PDV & Histórico)
  if (pageId === 'dashboard') updateDashboard();
  if (pageId === 'clientes') renderClientes();
  if (pageId === 'estoque') renderEstoque();
}

function renderAll() {
  renderClientes();
  renderEstoque();
  renderHistoricoVendas();
  updateDashboard();
}

/**
 * Zera todos os dados armazenados no Local Storage.
 */
function clearAllRecords() {
  if (confirm("ATENÇÃO: Você tem certeza que deseja apagar TODOS os dados (Clientes, Estoque e Vendas)? Esta ação é irreversível.")) {
    // Remove do Local Storage
    localStorage.removeItem('clientes');
    localStorage.removeItem('estoque');
    localStorage.removeItem('vendas');

    // Zera o objeto DB em memória
    db.clientes = [];
    db.estoque = [];
    db.vendas = [];

    // Atualiza a interface
    renderAll();
    // Zera o carrinho (embora deva estar vazio)
    carrinho = [];
    renderCarrinho();

    alert("Todos os registros foram apagados com sucesso!");
    mostrarPagina('dashboard'); // Volta para o dashboard
  }
}

/* ================= MÓDULO: CLIENTES ================= */
function addCliente() {
  const nome = document.getElementById('nomeCliente').value;
  if (!nome) return alert("Nome é obrigatório!");

  const novo = {
    id: Date.now(),
    nome: nome,
    tel: document.getElementById('telCliente').value,
    endereco: document.getElementById('enderecoCliente').value,
    numero: document.getElementById('numeroCliente').value,
    cep: document.getElementById('cepCliente').value,
    pagamentoPreferido: document.getElementById('pagamentoPreferidoCliente').value
  };

  db.clientes.push(novo);
  saveDB();

  // Limpa form (mantém o usuário na mesma página)
  document.getElementById('nomeCliente').value = "";
  document.getElementById('telCliente').value = "";
  document.getElementById('enderecoCliente').value = "";
  document.getElementById('numeroCliente').value = "";
  document.getElementById('cepCliente').value = "";
  document.getElementById('pagamentoPreferidoCliente').value = "";

  alert("Cliente salvo!");
  renderClientes(); // Renderiza a tabela atualizada
}

function renderClientes() {
  const tbody = document.getElementById('tabelaClientes');
  if (!tbody) return;

  tbody.innerHTML = db.clientes.map(c => `
        <tr class="border-b border-gray-700 hover:bg-neutral-800">
            <td class="p-3 font-medium text-white">${c.nome}</td>
            <td class="p-3 text-gray-400 whitespace-nowrap">${c.tel || '-'}</td>
            <td class="p-3 text-gray-400 whitespace-nowrap">${c.endereco || ''}${c.numero ? ', Nº ' + c.numero : ''}</td>
            <td class="p-3 text-gray-400 whitespace-nowrap">${c.cep || '-'}</td>
            <td class="p-3 text-amber-400 whitespace-nowrap">${c.pagamentoPreferido || '-'}</td>
            <td class="p-3 text-right">
                <button onclick="deleteCliente(${c.id})" class="text-red-400 hover:text-red-300"><i class="fa fa-trash"></i></button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6" class="p-4 text-center text-gray-500">Nenhum cliente cadastrado.</td></tr>';
}

function deleteCliente(id) {
  if (confirm("Remover cliente?")) {
    db.clientes = db.clientes.filter(c => c.id !== id);
    saveDB();
    renderClientes();
  }
}

/* ================= MÓDULO: ESTOQUE ================= */
function addProduto() {
  const nome = document.getElementById('nomeProduto').value;
  if (!nome) return alert("Nome do produto obrigatório!");

  const novo = {
    id: Date.now(),
    nome: nome,
    qtd: parseInt(document.getElementById('qtdProduto').value) || 0,
    preco: parseFloat(document.getElementById('precoProduto').value) || 0
  };

  db.estoque.push(novo);
  saveDB();

  // Limpa form (mantém o usuário na mesma página)
  document.getElementById('nomeProduto').value = "";
  document.getElementById('qtdProduto').value = "";
  document.getElementById('precoProduto').value = "";

  alert("Produto salvo!");
  renderEstoque(); // Renderiza a tabela atualizada
}

function renderEstoque() {
  const tbody = document.getElementById('tabelaEstoque');
  if (!tbody) return;

  tbody.innerHTML = db.estoque.map(p => `
        <tr class="border-b border-gray-700 hover:bg-neutral-800">
            <td class="p-3 font-medium text-white">${p.nome}</td>
            <td class="p-3 text-center ${p.qtd < 5 ? 'text-red-500 font-bold' : 'text-green-500'}">${p.qtd}</td>
            <td class="p-3 text-right text-amber-400">R$ ${p.preco.toFixed(2)}</td>
            <td class="p-3 text-right">
                <button onclick="deleteProduto(${p.id})" class="text-red-400 hover:text-red-300"><i class="fa fa-trash"></i></button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="4" class="p-4 text-center text-gray-500">Estoque vazio.</td></tr>';
}

function deleteProduto(id) {
  if (confirm("Remover do estoque?")) {
    db.estoque = db.estoque.filter(p => p.id !== id);
    saveDB();
    renderEstoque();
  }
}

/* ================= MÓDULO: VENDAS (PDV & CARRINHO) ================= */
function renderSelectsVenda() {
  const selCli = document.getElementById('selCliente');
  const selProd = document.getElementById('selProduto');

  // Clientes no PDV - Mostra o nome e telefone
  selCli.innerHTML = '<option value="">-- Selecione Cliente --</option>' +
    db.clientes.map(c => `<option value="${c.id}">${c.nome} (${c.tel || 'S/ Telefone'})</option>`).join('');

  selProd.innerHTML = '<option value="">-- Selecione Produto --</option>' +
    db.estoque.filter(p => p.qtd > 0).map(p => `<option value="${p.id}">${p.nome} (R$ ${p.preco.toFixed(2)})</option>`).join('');

  // Assegura que o carrinho e histórico estejam renderizados ao entrar na página Vendas
  renderCarrinho();
  renderHistoricoVendas();
}

function adicionarAoCarrinho() {
  const prodId = document.getElementById('selProduto').value;
  if (!prodId) return;

  const produtoReal = db.estoque.find(p => p.id == prodId);

  // Verifica se já existe no carrinho para somar quantidade
  const itemExistente = carrinho.find(i => i.id == prodId);
  const qtdNoCarrinho = itemExistente ? itemExistente.qtdCarrinho : 0;

  if (qtdNoCarrinho >= produtoReal.qtd) {
    return alert("Estoque insuficiente para adicionar mais deste item!");
  }

  if (itemExistente) {
    itemExistente.qtdCarrinho++;
  } else {
    carrinho.push({
      id: produtoReal.id,
      nome: produtoReal.nome,
      preco: produtoReal.preco,
      qtdCarrinho: 1
    });
  }
  renderCarrinho();
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  renderCarrinho();
}

function renderCarrinho() {
  const lista = document.getElementById('listaCarrinho');
  const displayTotal = document.getElementById('totalCarrinhoDisplay');
  const btn = document.getElementById('btnFinalizar');

  if (carrinho.length === 0) {
    lista.innerHTML = '<div class="text-center text-gray-500 py-8 italic border-2 border-dashed border-gray-700 rounded">Carrinho vazio</div>';
    displayTotal.innerText = "R$ 0.00";
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    return;
  }

  let total = 0;
  lista.innerHTML = carrinho.map((item, idx) => {
    const subtotal = item.preco * item.qtdCarrinho;
    total += subtotal;
    return `
        <div class="flex justify-between items-center bg-neutral-900 p-3 rounded border border-gray-700 animate-fade-in">
            <div>
                <div class="font-bold text-white">${item.nome}</div>
                <div class="text-xs text-gray-400">${item.qtdCarrinho}x R$ ${item.preco.toFixed(2)}</div>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-amber-500 font-bold">R$ ${subtotal.toFixed(2)}</span>
                <button onclick="removerDoCarrinho(${idx})" class="text-red-500 hover:text-red-400"><i class="fa fa-times"></i></button>
            </div>
        </div>
        `;
  }).join('');

  displayTotal.innerText = `R$ ${total.toFixed(2)}`;
  btn.disabled = false;
  btn.classList.remove('opacity-50', 'cursor-not-allowed');
}

function finalizarVenda() {
  const cliId = document.getElementById('selCliente').value;
  if (!cliId) return alert("Selecione um cliente!");

  const cliente = db.clientes.find(c => c.id == cliId);
  const totalVenda = carrinho.reduce((acc, item) => acc + (item.preco * item.qtdCarrinho), 0);

  // Debitar Estoque
  carrinho.forEach(itemCart => {
    const prodEstoque = db.estoque.find(p => p.id == itemCart.id);
    if (prodEstoque) prodEstoque.qtd -= itemCart.qtdCarrinho;
  });

  // Salvar Venda
  db.vendas.push({
    id: Date.now(),
    clienteNome: cliente.nome,
    total: totalVenda,
    itens: [...carrinho], // cópia
    data: new Date().toLocaleString()
  });

  // Reset
  carrinho = [];
  document.getElementById('selCliente').value = "";
  document.getElementById('selProduto').value = "";

  saveDB();
  renderEstoque();
  renderCarrinho();
  renderHistoricoVendas();

  alert("Venda realizada com sucesso! 🎉");
  // Não precisa chamar mostrarPagina, já estamos nela.
}

function renderHistoricoVendas() {
  const tbody = document.getElementById('tabelaHistoricoVendas');
  if (!tbody) return;

  if (!Array.isArray(db.vendas)) {
    console.error("db.vendas não é um array!", db.vendas);
    db.vendas = [];
  }
  console.log("Renderizando histórico. Total vendas:", db.vendas.length);

  // Pega as últimas vendas, inverte a ordem para mostrar a mais recente no topo
  const historico = [...db.vendas].reverse();

  if (historico.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-500">Nenhuma venda registrada. Comece um novo pedido acima!</td></tr>';
    return;
  }

  tbody.innerHTML = historico.map(v => {
    const resumoItens = v.itens.map(i => `${i.qtdCarrinho}x ${i.nome}`).join(', ');
    return `
        <tr onclick="verDetalhesVenda(${v.id})" class="border-b border-gray-700 hover:bg-neutral-700 cursor-pointer transition-colors">
            <td class="p-3">
                <div class="font-bold text-white">${v.clienteNome}</div>
                <div class="text-xs text-gray-500">${v.data}</div>
            </td>
            <td class="p-3 text-gray-300 text-sm">
                <div class="line-clamp-2" title="${resumoItens}">${resumoItens}</div>
            </td>
            <td class="p-3 text-right font-bold text-green-400">R$ ${v.total.toFixed(2)}</td>
        </tr>
    `;
  }).join('');
}

function verDetalhesVenda(id) {
  const venda = db.vendas.find(v => v.id === id);
  const container = document.getElementById('detalhesVendaContent');

  if (!venda || !container) return;

  // Scroll para detalhes (útil em mobile)
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  container.innerHTML = `
    <div class="space-y-4 animate-fade-in">
        <div class="flex justify-between items-start border-b border-gray-700 pb-4">
            <div>
                <h4 class="text-lg font-bold text-white">${venda.clienteNome}</h4>
                <p class="text-sm text-gray-500">${venda.data}</p>
            </div>
            <span class="bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                Concluído
            </span>
        </div>

        <div class="space-y-2">
            <h5 class="text-amber-500 font-semibold text-sm uppercase tracking-wider">Itens do Pedido</h5>
            <div class="bg-neutral-900/50 rounded-lg p-3 space-y-2 max-h-60 overflow-y-auto">
                ${venda.itens.map(item => `
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-300"><span class="text-amber-500 font-bold">${item.qtdCarrinho}x</span> ${item.nome}</span>
                        <span class="text-gray-400">R$ ${(item.preco * item.qtdCarrinho).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="pt-4 border-t border-gray-700 flex justify-between items-center">
            <span class="text-gray-400">Total do Pedido</span>
            <span class="text-2xl font-bold text-green-400">R$ ${venda.total.toFixed(2)}</span>
        </div>
        
        <div class="pt-4">
             <button onclick="imprimirCupom(${venda.id})" class="w-full border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold py-2 rounded transition-colors text-sm">
                <i class="fa fa-print"></i> IMPRIMIR CUPOM
             </button>
        </div>
    </div>
  `;
}

function imprimirCupom(id) {
  const venda = db.vendas.find(v => v.id === id);
  if (!venda) return;

  // Simulação de impressão
  const conteudo = `
    ================================
    PIZZARIA DONA JÔ
    ================================
    Cliente: ${venda.clienteNome}
    Data: ${venda.data}
    --------------------------------
    ${venda.itens.map(i => `${i.qtdCarrinho}x ${i.nome.padEnd(20)} R$ ${(i.preco * i.qtdCarrinho).toFixed(2)}`).join('\n')}
    --------------------------------
    TOTAL: R$ ${venda.total.toFixed(2)}
    ================================
    `;

  console.log(conteudo);
  alert("Cupom enviado para impressão! (Veja o console para visualizar)");
}

/* ================= MÓDULO: DASHBOARD & GRÁFICOS ================= */
let myChart = null;

function updateDashboard() {
  // Cards
  const elClientes = document.getElementById('totalClientes');
  if (elClientes) elClientes.innerText = db.clientes.length;

  const elProd = document.getElementById('totalProdutos');
  if (elProd) elProd.innerText = db.estoque.reduce((acc, p) => acc + p.qtd, 0);

  const elVendas = document.getElementById('totalVendasDisplay');
  if (elVendas) elVendas.innerText = db.vendas.length;

  // Chart.js
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;

  if (typeof Chart === 'undefined') {
    console.warn("Chart.js não carregou.");
    return;
  }

  const ultimasVendas = db.vendas.slice(-10);
  const labels = ultimasVendas.map((_, i) => `Venda ${i + 1}`);
  const data = ultimasVendas.map(v => v.total);

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Valor da Venda (R$)',
        data: data,
        backgroundColor: '#f59e0b',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#333'
          },
          ticks: {
            color: '#9ca3af'
          }
        },
        x: {
          display: false
        }
      }
    }
  });
}

// Expõe as funções para uso no HTML (onclick)
window.login = login;
window.logout = logout;
window.mostrarPagina = mostrarPagina;
window.addCliente = addCliente;
window.deleteCliente = deleteCliente;
window.addProduto = addProduto;
window.deleteProduto = deleteProduto;
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.finalizarVenda = finalizarVenda;
window.renderHistoricoVendas = renderHistoricoVendas;
window.updateDashboard = updateDashboard;
window.clearAllRecords = clearAllRecords;
window.verDetalhesVenda = verDetalhesVenda;
window.imprimirCupom = imprimirCupom;
