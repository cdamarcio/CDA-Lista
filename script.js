let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

async function carregar() {
    try {
        const res = await fetch('dados.json');
        empresas = await res.json();
        renderizar(empresas);
    } catch (err) { console.error(err); }
}

function renderizar(dados) {
    const lista = document.getElementById('listaPrincipal');
    lista.innerHTML = dados.map(emp => {
        const isFav = favoritos.includes(emp.id);
        return `
            <div class="card">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')">★</button>
                <div onclick="abrirModal('${emp.id}')">
                    <img src="${emp.logo || 'https://via.placeholder.com/85'}" class="logo-card">
                    <h3>${emp.nome}</h3>
                    <p><strong>${emp.categoria}</strong></p>
                </div>
            </div>
        `;
    }).join('');
}

function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(cat) || (cat === 'Todas' && btn.innerText === 'Todas'));
    });
    filtrar();
}

function filtrar() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const filtrados = empresas.filter(e => {
        const mCat = (categoriaAtual === 'Todas' || e.categoria === categoriaAtual);
        const mBusca = e.nome.toLowerCase().includes(termo);
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

function abrirModal(id) {
    const e = empresas.find(i => i.id == id);
    if (!e) return;
    const botaoSite = e.site ? `<a href="${e.site}" target="_blank" class="link-site">Visitar Website</a>` : '';
    document.getElementById('conteudoEmpresa').innerHTML = `
        <img src="${e.logo}" class="logo-modal" style="width:100px; margin-bottom:20px;">
        <h2>${e.nome}</h2>
        <div style="text-align: left; margin-top:15px;">
            <p><strong>📍 Endereço:</strong> ${e.endereco}</p>
            <p><strong>📝 Sobre:</strong> ${e.descricao}</p>
            <p><strong>📞 Contato:</strong> ${e.telefone}</p>
        </div>
        <a href="https://wa.me/55${e.whatsapp}" target="_blank" class="link-whatsapp">Falar no WhatsApp</a>
        ${botaoSite}
    `;
    document.getElementById('modalDetalhes').style.display = 'flex';
}

function fecharModal() { document.getElementById('modalDetalhes').style.display = 'none'; }
window.onclick = (e) => { if (e.target.id == 'modalDetalhes') fecharModal(); };
carregar();