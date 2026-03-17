let empresas = [];
let categoriaAtual = 'Todas';
let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];

const listaPrincipal = document.getElementById('listaPrincipal');
const inputBusca = document.getElementById('inputBusca');

async function carregar() {
    try {
        const res = await fetch('dados.json');
        const dadosBrutos = await res.json();
        // Ordem Alfabética
        empresas = dadosBrutos.sort((a, b) => a.nome.localeCompare(b.nome));
        renderizar(empresas);
    } catch (err) {
        console.error(err);
        listaPrincipal.innerHTML = "<p>Erro ao carregar dados.</p>";
    }
}

function renderizar(dados) {
    if (!listaPrincipal) return;
    listaPrincipal.innerHTML = dados.map(emp => {
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

function filtrarPorCategoria(cat) {
    categoriaAtual = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(cat) || (cat === 'Todas' && btn.innerText === 'Todas'));
    });
    
    // Scroll suave apenas se estiver no mobile
    if(window.innerWidth < 600) {
        event.target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    
    filtrar();
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

function toggleFavorito(event, id) {
    event.stopPropagation();
    const index = favoritos.indexOf(id);
    index > -1 ? favoritos.splice(index, 1) : favoritos.push(id);
    localStorage.setItem('cda_favoritos', JSON.stringify(favoritos));
    categoriaAtual === 'Favoritos' ? mostrarFavoritos() : filtrar();
}

function mostrarFavoritos() {
    categoriaAtual = 'Favoritos';
    renderizar(empresas.filter(e => favoritos.includes(e.id)));
}

function abrirModal(id) {
    const e = empresas.find(item => item.id == id);
    if (!e) return;
    const botaoSite = e.site ? `<a href="${e.site}" target="_blank" class="link-site">Visitar Website</a>` : '';
    document.getElementById('conteudoEmpresa').innerHTML = `
        <img src="${e.logo}" class="logo-modal" style="width:100px" onerror="this.src='https://img.icons8.com/fluency/150/group-of-companies.png'">
        <h2>${e.nome}</h2>
        <div style="text-align: left; margin-top:15px;">
            <p><strong>📍 Endereço:</strong> ${e.endereco}</p>let empresas = [];
            let categoriaAtual = 'Todas';
            let favoritos = JSON.parse(localStorage.getItem('cda_favoritos')) || [];
            
            async function carregar() {
                try {
                    const res = await fetch('dados.json');
                    const dados = await res.json();
                    empresas = dados.sort((a, b) => a.nome.localeCompare(b.nome));
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
                            <div onclick="abrirModal('${emp.id}')" style="cursor:pointer">
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
                // Fecha o menu lateral se estiver no mobile
                if (document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
                
                // Atualiza botões ativos (PC e Mobile)
                document.querySelectorAll('.tab-btn, .menu-btn').forEach(btn => {
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
            
            function mostrarFavoritos() {
                categoriaAtual = 'Favoritos';
                if (document.getElementById('sideMenu').classList.contains('active')) toggleMenu();
                renderizar(empresas.filter(e => favoritos.includes(e.id)));
            }
            
            function abrirModal(id) {
                const e = empresas.find(i => i.id == id);
                const botaoSite = e.site ? `<a href="${e.site}" target="_blank" class="link-site">Visitar Website</a>` : '';
                document.getElementById('conteudoEmpresa').innerHTML = `
                    <img src="${e.logo}" style="width:80px; margin-bottom:15px;">
                    <h2>${e.nome}</h2>
                    <div style="text-align:left; margin-top:15px; font-size:14px;">
                        <p>📍 ${e.endereco}</p>
                        <p>📞 ${e.telefone}</p>
                        <p>📝 ${e.descricao}</p>
                    </div>
                    <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">WhatsApp</a>
                    ${botaoSite}
                `;
                document.getElementById('modalDetalhes').style.display = 'flex';
            }
            
            function fecharModal() { document.getElementById('modalDetalhes').style.display = 'none'; }
            window.onclick = (e) => { if (e.target.id == 'modalDetalhes') fecharModal(); };
            
            carregar();
            <p><strong>📝 Sobre:</strong> ${e.descricao}</p>
            <p><strong>📞 Contato:</strong> ${e.telefone}</p>
        </div>
        <a href="https://wa.me/55${e.whatsapp.replace(/\D/g,'')}" target="_blank" class="link-whatsapp">Falar no WhatsApp</a>
        ${botaoSite}
    `;
    document.getElementById('modalDetalhes').style.display = 'flex';
}

function fecharModal() { document.getElementById('modalDetalhes').style.display = 'none'; }
window.onclick = (e) => { if (e.target.id == 'modalDetalhes') fecharModal(); };
carregar();