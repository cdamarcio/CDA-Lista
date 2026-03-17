let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

async function carregar() {
    try {
        const res = await fetch('dados.json');
        const dados = await res.json();
        // Ordem alfabética obrigatória
        empresas = dados.sort((a, b) => a.nome.localeCompare(b.nome));
        renderizar(empresas);
    } catch (err) { console.error("Erro ao carregar JSON:", err); }
}

function renderizar(dados) {
    const lista = document.getElementById('listaPrincipal');
    if (!lista) return;
    lista.innerHTML = dados.map(emp => {
        const isFav = favoritos.includes(emp.id);
        return `
            <div class="card">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')">★</button>
                <div onclick="abrirModal('${emp.id}')">
                    <img src="${emp.logo}" class="logo-card" onerror="this.src='https://img.icons8.com/fluency/150/group-of-companies.png'">
                    <h3>${emp.nome}</h3>
                    <p><strong>${emp.categoria}</strong></p>
                </div>
            </div>
        `;
    }).join('');
}

function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('active');
    document.getElementById('overlayMenu').classList.toggle('active');
}

function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    if (document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
    document.querySelectorAll('.tab-btn, .menu-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(cat) || (cat === 'Todas' && btn.innerText === 'Todas'));
    });
    filtrar();
}

function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => {
        const mCat = (categoriaAtual === 'Todas' || e.categoria === categoriaAtual);
        const mBusca = e.nome.toLowerCase().includes(termo) || e.categoria.toLowerCase().includes(termo);
        return mCat && mBusca;
    });
    renderizar(filtrados);
}

function toggleFavorito(event, id) {
    event.stopPropagation();
    const idx = favoritos.indexOf(id);
    idx > -1 ? favoritos.splice(idx, 1) : favoritos.push(id);
    localStorage.setItem('cda_favoritos', JSON.stringify(favoritos));
    renderizar(empresas);
}

function mostrarFavoritos() {
    categoriaAtual = 'Favoritos';
    if (document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
    renderizar(empresas.filter(e => favoritos.includes(e.id)));
}

function abrirModal(id) {
    const e = empresas.find(i => i.id == id);
    if (!e) return;
    
    const botaoSite = e.site ? `<a href="${e.site}" target="_blank" class="link-site">Visitar Website</a>` : '';
    const zapLink = e.whatsapp.replace(/\D/g,'');

    document.getElementById('conteudoEmpresa').innerHTML = `
        <img src="${e.logo}" class="logo-modal" onerror="this.src='https://img.icons8.com/fluency/150/group-of-companies.png'">
        <h2 style="color:#1e40af; margin-bottom:5px;">${e.nome}</h2>
        <p style="color:#666; font-weight:bold; margin-bottom:20px;">${e.categoria}</p>
        
        <div class="info-empresa">
            <p>📍 <strong>Endereço:</strong> ${e.endereco}</p>
            <p>📞 <strong>Contato:</strong> ${e.telefone}</p>
            <p>📝 <strong>Sobre:</strong> ${e.descricao}</p>
        </div>

        <a href="https://wa.me/55${zapLink}" target="_blank" class="link-whatsapp">Conversar no WhatsApp</a>
        ${botaoSite}
    `;
    
    document.getElementById('modalDetalhes').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
}

function fecharModal() { 
    document.getElementById('modalDetalhes').style.display = 'none'; 
    document.body.style.overflow = 'auto'; // Destrava o scroll
}

window.onclick = (e) => { if (e.target.id == 'modalDetalhes') fecharModal(); };

carregar();