/* PROJETO: CDA LISTA 
   DESENVOLVEDOR: Márcio Oliveira (RAZGO)
   FUNCIONALIDADE: Grid de 6 colunas, Busca e Janela de Dados (Modal)
*/

// --- BANCO DE DADOS COMPLETO (CDA LISTA) ---
let empresas = [
    // --- SUAS EMPRESAS (RAZGO & GRUPO) ---
    { id: 1, nome: "RAZGO", categoria: "Tecnologia", zap: "94992500073", endereco: "Conceição do Araguaia - PA", site: "razgo.com.br", img: "img/logo-cda3.jpg" },
    { id: 2, nome: "KM Projetos & Engenharia", categoria: "Engenharia", zap: "94992500073", endereco: "Conceição do Araguaia - PA", site: "kmprojetos.com.br", img: "img/logo-cda3.jpg" },
    { id: 3, nome: "MAZZ", categoria: "Educação", zap: "94992500073", endereco: "Conceição do Araguaia - PA", site: "", img: "img/logo-cda3.jpg" },
    { id: 4, nome: "MR Treinamentos", categoria: "Segurança do Trabalho", zap: "94992500073", endereco: "Conceição do Araguaia - PA", site: "", img: "img/logo-cda3.jpg" },

    // --- GASTRONOMIA & LAZER ---
    { id: 5, nome: "Restaurante Zé Piranha", categoria: "Restaurantes", zap: "94999999999", endereco: "Porto das Balsas - Orla", site: "", img: "https://via.placeholder.com/150" },
    { id: 6, nome: "Bateau Mouche Rio Araguaia", categoria: "Praias & Lazer", zap: "94999999999", endereco: "Rio Araguaia", site: "", img: "https://via.placeholder.com/150" },
    { id: 7, nome: "Burgg's Lanches", categoria: "Restaurantes", zap: "94999999999", endereco: "Centro - CDA", site: "", img: "https://via.placeholder.com/150" },
    { id: 8, nome: "Sorveteria Gebon", categoria: "Restaurantes", zap: "94999999999", endereco: "Av. Araguaia", site: "", img: "https://via.placeholder.com/150" },
    { id: 9, nome: "Aiqfome CDA", categoria: "Tecnologia", zap: "94999999999", endereco: "Delivery", site: "aiqfome.com", img: "https://via.placeholder.com/150" },
    { id: 10, nome: "Pizzaria Top 10", categoria: "Restaurantes", zap: "94999999999", endereco: "Centro", site: "", img: "https://via.placeholder.com/150" },

    // --- HOTÉIS & TURISMO ---
    { id: 11, nome: "Hotel Tarumã", categoria: "Hotéis & Pousadas", zap: "94999999999", endereco: "Av. Araguaia", site: "", img: "https://via.placeholder.com/150" },
    { id: 12, nome: "Pousada do Sol", categoria: "Hotéis & Pousadas", zap: "94999999999", endereco: "Próximo à Orla", site: "", img: "https://via.placeholder.com/150" },
    { id: 13, nome: "Hotel Araguaia", categoria: "Hotéis & Pousadas", zap: "94999999999", endereco: "Centro", site: "", img: "https://via.placeholder.com/150" },

    // --- COMÉRCIO VAREJISTA ---
    { id: 14, nome: "Supermercado Econômico", categoria: "Supermercados", zap: "94999999999", endereco: "Av. JK", site: "", img: "https://via.placeholder.com/150" },
    { id: 15, nome: "Lojas Gazin", categoria: "Eletrodomésticos", zap: "94999999999", endereco: "Av. Araguaia", site: "gazin.com.br", img: "https://via.placeholder.com/150" },
    { id: 16, nome: "Eletro Araguaia", categoria: "Eletrodomésticos", zap: "94999999999", endereco: "Centro", site: "", img: "https://via.placeholder.com/150" },
    { id: 17, nome: "Farmácia Preço Baixo", categoria: "Saúde", zap: "94999999999", endereco: "Av. Araguaia", site: "", img: "https://via.placeholder.com/150" },
    { id: 18, nome: "Drogaria Avenida", categoria: "Saúde", zap: "94999999999", endereco: "Centro", site: "", img: "https://via.placeholder.com/150" },

    // --- AGRONEGÓCIO & CONSTRUÇÃO ---
    { id: 19, nome: "Casa do Pecuarista", categoria: "Engenharia", zap: "94999999999", endereco: "Setor Industrial", site: "", img: "https://via.placeholder.com/150" },
    { id: 20, nome: "Araguaia Construções", categoria: "Engenharia", zap: "94999999999", endereco: "Av. JK", site: "", img: "https://via.placeholder.com/150" },
    { id: 21, nome: "Mecânica Araguaia", categoria: "Automotivo", zap: "94999999999", endereco: "Saída para Redenção", site: "", img: "https://via.placeholder.com/150" },

    // --- SERVIÇOS E TRANSPORTE ---
    { id: 22, nome: "JamJoy Transportes", categoria: "Transporte", zap: "94999999999", endereco: "Rodoviária", site: "jamjoy.com.br", img: "https://via.placeholder.com/150" },
    { id: 23, nome: "Sicredi CDA", categoria: "Financeiro", zap: "94999999999", endereco: "Av. Araguaia", site: "sicredi.com.br", img: "https://via.placeholder.com/150" },
    { id: 24, nome: "Equatorial Energia", categoria: "Serviços Públicos", zap: "94999999999", endereco: "Escritório Local", site: "equatorialenergia.com.br", img: "https://via.placeholder.com/150" }
    
    // Continue adicionando conforme o padrão para completar as 50...
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