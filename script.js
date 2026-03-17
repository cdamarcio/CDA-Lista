/* PROJETO: CDA LISTA 
   DESENVOLVEDOR: MÁRCIO RODRIGUES 
   FUNCIONALIDADES: ORDEM ALFABÉTICA, FAVORITOS, FILTROS E MODAL RESPONSIVO
*/

let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

const listaPrincipal = document.getElementById('listaPrincipal');
const inputBusca = document.getElementById('inputBusca');

// 1. CARREGAMENTO DOS DADOS
async function carregar() {
    try {
        const res = await fetch('dados.json');
        const dadosBrutos = await res.json();
        
        // Garante que as empresas sempre apareçam de A a Z por padrão
        empresas = dadosBrutos.sort((a, b) => a.nome.localeCompare(b.nome));
        
        renderizar(empresas);
    } catch (err) {
        console.error("Erro ao carregar o arquivo JSON:", err);
        if (listaPrincipal) {
            listaPrincipal.innerHTML = "<p style='text-align:center; padding:20px;'>Erro ao carregar os dados. Verifique o arquivo dados.json.</p>";
        }
    }
}

// 2. RENDERIZAÇÃO DOS CARDS
function renderizar(dados) {
    if (!listaPrincipal) return;

    if (dados.length === 0) {
        listaPrincipal.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding:50px; opacity:0.6;'>Nenhum resultado encontrado.</p>";
        return;
    }

    listaPrincipal.innerHTML = dados.map(emp => {
        const isFav = favoritos.includes(emp.id);
        const logoPadrao = "https://img.icons8.com/fluency/150/group-of-companies.png";
        
        return `
            <div class="card">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')" title="Favoritar">★</button>
                <div onclick="abrirModal('${emp.id}')">
                    <img src="${emp.logo || logoPadrao}" class="logo-card" onerror="this.src='${logoPadrao}'">
                    <h3>${emp.nome}</h3>
                    <p><strong>${emp.categoria}</strong></p>
                </div>
            </div>
        `;
    }).join('');
}

// 3. CONTROLE DO MENU LATERAL (MOBILE)
function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlayMenu');
    if (sideMenu && overlay) {
        sideMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// 4. SISTEMA DE FILTROS
function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    
    // Fecha o menu lateral se ele estiver aberto (Mobile)
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu && sideMenu.classList.contains('active')) {
        toggleMenu();
    }

    // Atualiza o estado visual dos botões (PC e Mobile)
    document.querySelectorAll('.tab-btn, .menu-btn').forEach(btn => {
        const textoBotao = btn.innerText.replace(/[\u2600-\u26FF]/g, '').trim(); // Remove emojis para comparar
        btn.classList.toggle('active', btn.innerText.includes(cat) || (cat === 'Todas' && textoBotao === 'Todas'));
    });

    filtrar();
}

function filtrar() {
    const termo = inputBusca ? inputBusca.value.toLowerCase() : "";
    
    const filtrados = empresas.filter(e => {
        const matchCategoria = (categoriaAtual === 'Todas' || e.categoria === categoriaAtual);
        const matchBusca = e.nome.toLowerCase().includes(termo) || e.categoria.toLowerCase().includes(termo);
        return matchCategoria && matchBusca;
    });

    renderizar(filtrados);
}

// 5. SISTEMA DE FAVORITOS
function toggleFavorito(event, id) {
    event.stopPropagation(); // Impede de abrir o modal ao clicar na estrela
    const index = favoritos.indexOf(id);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(id);
    }
    
    localStorage.setItem('cda_favoritos', JSON.stringify(favoritos));
    
    // Se estiver na aba de favoritos, re-filtra em tempo real
    if (categoriaAtual === 'Favoritos') {
        mostrarFavoritos();
    } else {
        filtrar();
    }
}

function mostrarFavoritos() {
    categoriaAtual = 'Favoritos';
    
    // Fecha o menu se estiver no mobile
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu && sideMenu.classList.contains('active')) toggleMenu();

    const empresasFavoritas = empresas.filter(e => favoritos.includes(e.id));
    renderizar(empresasFavoritas);
}

// 6. MODAL DE DETALHES (VERSÃO COMPACTA)
function abrirModal(id) {
    const e = empresas.find(i => i.id == id);
    if (!e) return;

    const botaoSite = e.site ? `<a href="${e.site}" target="_blank" class="link-site">Visitar Website</a>` : '';
    const zapLimpo = e.whatsapp.replace(/\D/g, ''); // Remove parênteses e traços

    const conteudo = document.getElementById('conteudoEmpresa');
    if (conteudo) {
        conteudo.innerHTML = `
            <img src="${e.logo}" class="logo-modal" onerror="this.src='https://img.icons8.com/fluency/150/group-of-companies.png'">
            <h2 style="color:#1e40af; margin-bottom:5px; font-size:1.4rem;">${e.nome}</h2>
            <p style="color:#666; font-weight:bold; margin-bottom:15px; font-size:13px;">${e.categoria}</p>
            
            <div class="info-empresa">
                <p>📍 <strong>Endereço:</strong> ${e.endereco}</p>
                <p>📞 <strong>Contato:</strong> ${e.telefone}</p>
                <p>📝 <strong>Sobre:</strong> ${e.descricao}</p>
            </div>

            <a href="https://wa.me/55${zapLimpo}" target="_blank" class="link-whatsapp">Conversar no WhatsApp</a>
            ${botaoSite}
        `;
    }

    const modal = document.getElementById('modalDetalhes');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Trava o fundo
    }
}

function fecharModal() {
    const modal = document.getElementById('modalDetalhes');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Destrava o fundo
    }
}

// Fechar modal ao clicar fora da caixa branca
window.onclick = (event) => {
    const modal = document.getElementById('modalDetalhes');
    if (event.target == modal) {
        fecharModal();
    }
};

// Inicializa o sistema
carregar();