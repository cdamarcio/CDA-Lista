/* --- ESTADO DO APP --- */
let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

const listaPrincipal = document.getElementById('listaPrincipal');
const inputBusca = document.getElementById('inputBusca');

/* --- CARREGAMENTO --- */
async function carregar() {
    try {
        const res = await fetch('dados.json');
        if (!res.ok) throw new Error("Erro ao carregar dados.json");
        empresas = await res.json();
        renderizar(empresas);
    } catch (err) {
        console.error(err);
        listaPrincipal.innerHTML = "<p style='text-align:center;'>Erro ao carregar os dados.</p>";
    }
}

/* --- RENDERIZAÇÃO --- */
function renderizar(dados) {
    if (!listaPrincipal) return;
    
    if (dados.length === 0) {
        listaPrincipal.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding:40px;'>Nenhum resultado encontrado.</p>";
        return;
    }

    listaPrincipal.innerHTML = dados.map(emp => {
        const isFav = favoritos.includes(emp.id);
        const logoPadrao = "https://img.icons8.com/fluency/150/group-of-companies.png";
        
        return `
            <div class="card" style="animation: fadeInSuave 0.5s ease forwards;">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')">
                    ${isFav ? '★' : '☆'}
                </button>
                <div onclick="abrirModal('${emp.id}')" style="cursor:pointer">
                    <img src="${emp.logo || logoPadrao}" class="logo-card" onerror="this.src='${logoPadrao}'">
                    <h3>${emp.nome}</h3>
                    <p><strong>${emp.categoria}</strong></p>
                </div>
            </div>
        `;
    }).join('');
}

/* --- FILTROS --- */
function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const texto = btn.innerText.replace('⭐ ', '');
        btn.classList.toggle('active', texto.includes(cat) || (cat === 'Todas' && texto === 'Todas'));
    });
    filtrar();
}

function mostrarFavoritos() {
    categoriaAtual = 'Favoritos';
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes('Favoritos'));
    });
    const filtrados = empresas.filter(e => favoritos.includes(e.id));
    renderizar(filtrados);
}

function filtrar() {
    const termo = inputBusca.value.toLowerCase();
    const filtrados = empresas.filter(e => {
        const matchCat = (categoriaAtual === 'Todas' || e.categoria === categoriaAtual);
        const matchBusca = e.nome.toLowerCase().includes(termo);
        return matchCat && matchBusca;
    });
    renderizar(filtrados);
}

/* --- FAVORITOS --- */
function toggleFavorito(event, id) {
    event.stopPropagation();
    const index = favoritos.indexOf(id);
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(id);
    }
    localStorage.setItem('cda_favoritos', JSON.stringify(favoritos));
    
    if (categoriaAtual === 'Favoritos') {
        mostrarFavoritos();
    } else {
        filtrar();
    }
}

/* --- MODAL --- */
function abrirModal(id) {
    const e = empresas.find(item => item.id == id);
    if (!e) return;
    
    const logoPadrao = "https://img.icons8.com/fluency/150/group-of-companies.png";

    document.getElementById('conteudoEmpresa').innerHTML = `
        <img src="${e.logo || logoPadrao}" class="logo-modal" onerror="this.src='${logoPadrao}'">
        <h2>${e.nome}</h2>
        <div style="text-align: left; margin-top:15px;">
            <p><strong>📍 Endereço:</strong> ${e.endereco || 'Conceição do Araguaia - PA'}</p>
            <p><strong>📝 Sobre:</strong> ${e.descricao || 'Empresa local.'}</p>
            <p><strong>📞 Contato:</strong> ${e.telefone || '(94) 99250-0073'}</p>
        </div>
        <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">
            Falar no WhatsApp
        </a>
    `;
    document.getElementById('modalDetalhes').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
    document.body.style.overflow = 'auto';
}

/* --- FECHAR AO CLICAR FORA --- */
window.onclick = (e) => {
    const modal = document.getElementById('modalDetalhes');
    if (e.target == modal) fecharModal();
};

carregar();