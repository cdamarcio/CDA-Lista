/* --- RENDERIZAÇÃO DOS CARDS (COM CORREÇÃO DE LOGO) --- */
function renderizar(dados) {
    if (!listaPrincipal) return;
    
    listaPrincipal.style.opacity = '0';
    
    setTimeout(() => {
        if (!dados || dados.length === 0) {
            listaPrincipal.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding:40px;'>Nenhuma empresa encontrada.</p>";
        } else {
            listaPrincipal.innerHTML = dados.map(emp => {
                const isFav = favoritos.includes(emp.id);
                
                // CORREÇÃO: Define uma imagem padrão caso o campo logo esteja vazio ou falte
                const logoFinal = (emp.logo && emp.logo.trim() !== "") ? emp.logo : "https://via.placeholder.com/150?text=CDA+Lista";

                return `
                <div class="card" style="animation: fadeInSuave 0.5s ease forwards;">
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorito(event, '${emp.id}')" title="Favoritar">
                        ${isFav ? '★' : '☆'}
                    </button>
                    <div onclick="abrirModal('${emp.id}')">
                        <img src="${logoFinal}" class="logo-card" onerror="this.src='https://via.placeholder.com/150?text=CDA+Lista'">
                        <h3>${emp.nome}</h3>
                        <p><strong>${emp.categoria}</strong></p>
                    </div>
                </div>
            `}).join('');
        }
        listaPrincipal.style.opacity = '1';
    }, 150);
}