/* PROJETO: CDA LISTA 
   DESENVOLVEDOR: Márcio Oliveira (RAZGO)
   FUNCIONALIDADE: Grid de 6 colunas, Busca e Janela de Dados (Modal)
*/

// --- 1. BANCO DE DADOS (Exemplo com as informações que você pediu) ---
let empresas = [
    { 
        id: 1, 
        nome: "Hotel Araguaia", 
        categoria: "Hotéis & Pousadas", 
        zap: "(94) 99250-0073", 
        endereco: "Av. Beira Rio, Centro - CDA", 
        site: "www.hotelaraguaia.com.br", 
        img: "img/logo-cda3.jpg" // Use a logo da empresa aqui
    },
    { 
        id: 2, 
        nome: "Restaurante Beira Rio", 
        categoria: "Restaurantes", 
        zap: "(94) 99250-0073", 
        endereco: "Orla de Conceição do Araguaia", 
        site: "", 
        img: "img/logo-cda3.jpg"
    }
];

let tempoRestante = 30;
let intervaloPopup;

// --- 2. INICIALIZAÇÃO ---
window.onload = () => {
    // Ordenar de A a Z por padrão
    const listaOrdenada = [...empresas].sort((a, b) => a.nome.localeCompare(b.nome));
    renderizarGrid(listaOrdenada);
    iniciarContadorPopup();
};

// --- 3. RENDERIZAÇÃO DO GRID (CADASTRO LIMPO) ---
function renderizarGrid(lista) {
    const container = document.getElementById('listaPrincipal');
    if (!container) return;
    container.innerHTML = '';

    lista.forEach(empresa => {
        const card = document.createElement('div');
        card.className = 'card-empresa';
        
        // O CLIQUE NO QUADRO INTEIRO ABRE A JANELA
        card.onclick = () => abrirJanelaDados(empresa.id);
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${empresa.img}" alt="${empresa.nome}" onerror="this.src='img/logo-cda3.jpg'">
            </div>
            <div class="card-info">
                <h3>${empresa.nome}</h3>
                <span class="categoria-label">${empresa.categoria}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 4. JANELA DE DADOS (MODAL) ---
function abrirJanelaDados(id) {
    const empresa = empresas.find(e => e.id === id);
    const modal = document.getElementById('modalDados');
    
    // Preenche a Logo no Topo Centralizada
    document.getElementById('mLogo').src = empresa.img;
    
    // Preenche os Textos
    document.getElementById('mNome').innerText = empresa.nome;
    document.getElementById('mEndereco').innerText = empresa.endereco || "Conceição do Araguaia - PA";
    document.getElementById('mZapText').innerText = empresa.zap;

    // Configura o link do Zap (remove caracteres especiais para o link)
    const numeroLimpo = empresa.zap.replace(/\D/g, '');
    document.getElementById('mZapLink').href = `https://wa.me/55${numeroLimpo}`;

    // Configura o Site (mostra apenas se houver)
    const areaSite = document.getElementById('mSiteArea');
    const linkSite = document.getElementById('mSiteLink');
    if (empresa.site) {
        areaSite.style.display = 'block';
        linkSite.style.display = 'block';
        document.getElementById('mSiteText').innerText = empresa.site;
        linkSite.href = empresa.site.startsWith('http') ? empresa.site : `https://${empresa.site}`;
    } else {
        areaSite.style.display = 'none';
        linkSite.style.display = 'none';
    }

    modal.style.display = 'flex';
}

function fecharJanelaDados() {
    document.getElementById('modalDados').style.display = 'none';
}

// --- 5. BUSCA E FILTROS ---
function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => 
        e.nome.toLowerCase().includes(termo) || 
        e.categoria.toLowerCase().includes(termo)
    );
    renderizarGrid(filtrados);
}

function filtrarPorCategoria(cat) {
    if (cat === 'Todas') {
        renderizarGrid(empresas);
    } else {
        const filtrados = empresas.filter(e => e.categoria === cat);
        renderizarGrid(filtrados);
    }
    toggleMenu(); // Fecha o menu lateral após escolher
}

// --- 6. UTILITÁRIOS (POPUP E MENU) ---
function iniciarContadorPopup() {
    const contador = document.getElementById('contador');
    intervaloPopup = setInterval(() => {
        tempoRestante--;
        if(contador) contador.innerText = tempoRestante;
        if(tempoRestante <= 0) fecharPopup();
    }, 1000);
}

function fecharPopup() {
    document.getElementById('popupAnuncio').style.display = 'none';
    clearInterval(intervaloPopup);
}

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlayMenu');
    if (menu.style.left === '0px') {
        menu.style.left = '-280px';
        overlay.style.display = 'none';
    } else {
        menu.style.left = '0px';
        overlay.style.display = 'block';
    }
}