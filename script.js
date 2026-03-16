/* --- CONFIGURAÇÕES INICIAIS --- */
let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

// Seletores do DOM
const listaPrincipal = document.getElementById('listaPrincipal');
const modal = document.getElementById('modalDetalhes');
const conteudoModal = document.getElementById('conteudoEmpresa');
const btnFechar = document.getElementById('btnFechar');
const inputBusca = document.getElementById('inputBusca');

/* --- 1. CARREGAMENTO DE DADOS --- */
async function carregar() {
    try {
        const res = await fetch('dados.json');
        if (!res.ok) throw new Error("Erro ao carregar dados.json");
        empresas = await res.json();
        renderizar(empresas);
    } catch (err) {
        console.error("Erro:", err);
        listaPrincipal.innerHTML = "<p style='text-align:center; padding:20px;'>Erro ao carregar o guia. Verifique sua conexão.</p>";
    }
}

/* --- 2. RENDERIZAÇÃO DOS CARDS --- */
function renderizar(dados) {
    if (!listaPrincipal) return;
    
    // Efeito de transição suave
    listaPrincipal.style.opacity = '0';
    
    setTimeout(() => {
        if (!dados || dados.length === 0) {
            listaPrincipal.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding:40px;'>Nenhuma empresa encontrada.</p>";
        } else {
            listaPrincipal.innerHTML = dados.map(emp => {
                const isFav = favoritos.includes(emp.id);
                return `
                <div class="card" style="animation: fadeInSuave 0.5s ease forwards;">
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')" title="Favoritar">
                        ${isFav ? '★' : '☆'}
                    </button>
                    <div onclick="abrirModal('${emp.id}')">
                        <img src="${emp.logo}" class="logo-card" onerror="this.src='https://via.placeholder.com/80?text=LOGO'">
                        <h3>${emp.nome}</h3>
                        <p><strong>${emp.categoria}</strong></p>
                    </div>
                </div>
            `}).join('');
        }
        listaPrincipal.style.opacity = '1';
    }, 150);
}

/* --- 3. SISTEMA DE FAVORITOS --- */
function toggleFavorito(event, id) {
    event.stopPropagation(); // Não abre o modal ao clicar na estrela
    const index = favoritos.indexOf(id);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(id);
    }
    
    localStorage.setItem('cda_favoritos', JSON.stringify(favoritos));
    
    // Atualiza a tela mantendo o filtro atual
    if (categoriaAtual === 'Favoritos') {
        mostrarFavoritos();
    } else {
        filtrar();
    }
}

function mostrarFavoritos() {
    categoriaAtual = 'Favoritos';
    atualizarBotoesAtivos('⭐ Favoritos');
    const filtrados = empresas.filter(e => favoritos.includes(e.id));
    renderizar(filtrados);
}

/* --- 4. SISTEMA DE FILTROS (ABAS E BUSCA) --- */
function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    
    // Mapeamento de texto dos botões para garantir o destaque correto
    const labels = {
        'Todas': 'Todas',
        'Oficina': 'Oficinas',
        'Marketing': 'Marketing',
        'Engenharia': 'Engenharia',
        'TI': 'TI/Informática',
        'Restaurante': 'Restaurantes',
        'Hotel': 'Hotéis'
    };

    atualizarBotoesAtivos(labels[cat]);
    filtrar();
}

function filtrar() {
    const termo = inputBusca.value.toLowerCase();
    
    const filtrados = empresas.filter(e => {
        const matchesCategory = (categoriaAtual === 'Todas' || e.categoria === categoriaAtual);
        const matchesSearch = e.nome.toLowerCase().includes(termo) || 
                              e.categoria.toLowerCase().includes(termo);
        
        // Se estiver na aba de favoritos, filtra apenas entre os favoritos
        if (categoriaAtual === 'Favoritos') {
            return favoritos.includes(e.id) && matchesSearch;
        }
        
        return matchesCategory && matchesSearch;
    });

    renderizar(filtrados);
}

function atualizarBotoesAtivos(textoBotao) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === textoBotao);
    });
}

/* --- 5. MODAL DE DETALHES --- */
function abrirModal(id) {
    const e = empresas.find(item => item.id == id);
    if (!e) return;

    conteudoModal.innerHTML = `
        <img src="${e.logo}" class="logo-modal" onerror="this.src='https://via.placeholder.com/120?text=LOGO'">
        <h2 style="color: #1e40af; margin-bottom: 15px;">${e.nome}</h2>
        <div style="text-align: left; font-size: 0.95rem;">
            <p><strong>📍 Endereço:</strong> ${e.endereco || 'Conceição do Araguaia - PA'}</p>
            <p style="margin: 10px 0;"><strong>📝 Sobre:</strong> ${e.descricao || 'Atendimento de qualidade em CDA.'}</p>
            <p><strong>📞 Contato:</strong> ${e.telefone || '(94) 99250-0073'}</p>
        </div>
        <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">
            Falar no WhatsApp
        </a>
    `;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
}

function fecharModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Destrava o scroll
}

/* --- EVENTOS --- */
if(btnFechar) btnFechar.onclick = fecharModal;
window.onclick = (e) => { if (e.target == modal) fecharModal(); };

// Iniciar app
carregar();