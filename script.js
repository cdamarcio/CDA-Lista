/* PROJETO: CDA LISTA 
   DESENVOLVEDOR: Márcio Oliveira (RAZGO)
*/

let empresas = [
    // --- SEU GRUPO ---
    { id: 1, nome: "RAZGO", categoria: "Tecnologia", zap: "94992500073", endereco: "Conceição do Araguaia - PA", site: "razgo.com.br", img: "img/logo-cda3.jpg" },
    { id: 2, nome: "KM Projetos & Engenharia", categoria: "Engenharia", zap: "94992500073", endereco: "Conceição do Araguaia - PA", site: "kmprojetos.com.br", img: "img/logo-cda3.jpg" },
    { id: 3, nome: "MAZZ", categoria: "Educação", zap: "94992500073", endereco: "Conceição do Araguaia - PA", site: "", img: "img/logo-cda3.jpg" },
    { id: 4, nome: "MR Treinamentos", categoria: "Segurança do Trabalho", zap: "94992500073", endereco: "Conceição do Araguaia - PA", site: "", img: "img/logo-cda3.jpg" },

    // --- JURÍDICO (ADICIONADO) ---
    { id: 25, nome: "J. Carlos Advogados", categoria: "Jurídico", zap: "94999999999", endereco: "Conceição do Araguaia - PA", site: "drjosecarlos.adv.br", img: "https://via.placeholder.com/150" },

    // --- DEMAIS EMPRESAS ---
    { id: 5, nome: "Restaurante Zé Piranha", categoria: "Restaurantes", zap: "94999999999", endereco: "Porto das Balsas - Orla", site: "", img: "https://via.placeholder.com/150" },
    { id: 6, nome: "Bateau Mouche Rio Araguaia", categoria: "Praias & Lazer", zap: "94999999999", endereco: "Rio Araguaia", site: "", img: "https://via.placeholder.com/150" },
    { id: 7, nome: "Burgg's Lanches", categoria: "Restaurantes", zap: "94999999999", endereco: "Centro - CDA", site: "", img: "https://via.placeholder.com/150" },
    { id: 8, nome: "Sorveteria Gebon", categoria: "Restaurantes", zap: "94999999999", endereco: "Av. Araguaia", site: "", img: "https://via.placeholder.com/150" },
    { id: 9, nome: "Aiqfome CDA", categoria: "Tecnologia", zap: "94999999999", endereco: "Delivery", site: "aiqfome.com", img: "https://via.placeholder.com/150" },
    { id: 10, nome: "Pizzaria Top 10", categoria: "Restaurantes", zap: "94999999999", endereco: "Centro", site: "", img: "https://via.placeholder.com/150" },
    { id: 11, nome: "Hotel Tarumã", categoria: "Hotéis & Pousadas", zap: "94999999999", endereco: "Av. Araguaia", site: "", img: "https://via.placeholder.com/150" },
    { id: 14, nome: "Supermercado Econômico", categoria: "Supermercados", zap: "94999999999", endereco: "Av. JK", site: "", img: "https://via.placeholder.com/150" },
    { id: 17, nome: "Farmácia Preço Baixo", categoria: "Saúde", zap: "94999999999", endereco: "Av. Araguaia", site: "", img: "https://via.placeholder.com/150" }
];

let tempoRestante = 30;
let intervaloPopup;

window.onload = () => {
    renderizarGrid(empresas.sort((a, b) => a.nome.localeCompare(b.nome)));
    iniciarContadorPopup();
};

function renderizarGrid(lista) {
    const container = document.getElementById('listaPrincipal');
    if (!container) return;
    container.innerHTML = '';

    lista.forEach(empresa => {
        const card = document.createElement('div');
        card.className = 'card-empresa'; // Volta a ser a classe do seu CSS original
        card.onclick = () => abrirJanelaDados(empresa.id);
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${empresa.img}" onerror="this.src='img/logo-cda3.jpg'">
            </div>
            <div class="card-info">
                <h3>${empresa.nome}</h3>
                <span class="categoria-label">${empresa.categoria}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function abrirJanelaDados(id) {
    const empresa = empresas.find(e => e.id === id);
    if (!empresa) return;

    document.getElementById('mLogo').src = empresa.img;
    document.getElementById('mNome').innerText = empresa.nome;
    document.getElementById('mEndereco').innerText = empresa.endereco;
    document.getElementById('mZapText').innerText = empresa.zap;

    const num = empresa.zap.replace(/\D/g, '');
    document.getElementById('mZapLink').href = `https://wa.me/55${num}`;

    const siteArea = document.getElementById('mSiteArea');
    const siteLink = document.getElementById('mSiteLink');
    if (empresa.site) {
        siteArea.style.display = 'block';
        siteLink.href = empresa.site.startsWith('http') ? empresa.site : `https://${empresa.site}`;
        document.getElementById('mSiteText').innerText = empresa.site;
    } else {
        siteArea.style.display = 'none';
    }

    document.getElementById('modalDados').style.display = 'flex';
}

function fecharJanelaDados() {
    document.getElementById('modalDados').style.display = 'none';
}

function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => e.nome.toLowerCase().includes(termo) || e.categoria.toLowerCase().includes(termo));
    renderizarGrid(filtrados);
}

function filtrarPorCategoria(cat) {
    if (cat === 'Todas') renderizarGrid(empresas);
    else renderizarGrid(empresas.filter(e => e.categoria === cat));
    toggleMenu();
}

function iniciarContadorPopup() {
    intervaloPopup = setInterval(() => {
        tempoRestante--;
        document.getElementById('contador').innerText = tempoRestante;
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