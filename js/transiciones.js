/* ==========================================================================
   TRANSICIONES RETRO ARCADE COMPARTIDAS
   expoaprendizaje - Cortinas de píxeles, pantallas de carga y Game Over
   ========================================================================== */

class ArcadeTransitions {
  constructor() {
    this.overlay = null;
    this.crearElementosDOM();
  }

  crearElementosDOM() {
    // Si ya existe en el DOM, no duplicar
    if (document.getElementById('arcade-transition-layer')) return;

    // Crear capas de transición (Cortina pixelada + Pantalla de Carga)
    const container = document.createElement('div');
    container.id = 'arcade-transition-layer';
    container.innerHTML = `
      <!-- Cortina de barrido pixelado -->
      <div id="arcade-curtain" class="arcade-curtain">
        <div class="curtain-stripes">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>

      <!-- Pantalla de Carga 8-bit -->
      <div id="arcade-loader" class="arcade-loader">
        <div class="loader-box">
          <div class="loader-logo">[ RETRO ARCADE ]</div>
          <div class="loader-status">CARGANDO...</div>
          <div class="loader-progress-bar">
            <span id="loader-blocks">□□□□□□□□□□</span>
          </div>
          <div class="loader-ready blink-text" id="loader-ready-text">READY?</div>
        </div>
      </div>

      <!-- Modal Global Game Over -->
      <div id="arcade-gameover-modal" class="arcade-modal">
        <div class="arcade-modal-card glitch-border">
          <h2 class="gameover-title glitch-text" data-text="GAME OVER">GAME OVER</h2>
          <div class="gameover-score-wrap">
            <div class="stat-row">
              <span>PUNTAJE:</span>
              <span id="gameover-score" class="stat-highlight">0</span>
            </div>
            <div class="stat-row" id="gameover-record-row">
              <span>RÉCORD:</span>
              <span id="gameover-record" class="stat-gold">0</span>
            </div>
          </div>
          <div class="arcade-modal-buttons">
            <button type="button" class="btn-arcade btn-arcade-green" id="btn-gameover-retry">
              > REINTENTAR
            </button>
            <button type="button" class="btn-arcade btn-arcade-magenta" id="btn-gameover-menu">
              &lt; VOLVER
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Global Victoria -->
      <div id="arcade-victory-modal" class="arcade-modal">
        <div class="arcade-modal-card glitch-border">
          <div class="victory-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="#ffe600" style="filter: drop-shadow(0 0 10px rgba(255,230,0,0.8));"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>
          </div>
          <h2 class="victory-title" style="color: var(--neon-yellow);">¡VICTORIA!</h2>
          <div class="gameover-score-wrap" id="victory-details">
            <!-- Detalles dinámicos -->
          </div>
          <div class="arcade-modal-buttons">
            <button type="button" class="btn-arcade btn-arcade-green" id="btn-victory-retry">
              > REINTENTAR
            </button>
            <button type="button" class="btn-arcade btn-arcade-magenta" id="btn-victory-menu">
              &lt; VOLVER
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    this.loader = document.getElementById('arcade-loader');
    this.curtain = document.getElementById('arcade-curtain');
    this.modalGameOver = document.getElementById('arcade-gameover-modal');
    this.modalVictory = document.getElementById('arcade-victory-modal');
  }

  // Navegar a otra URL con barrido pixelado arcade
  irA(url) {
    if (typeof sonidos !== 'undefined') sonidos.bip();
    if (!this.curtain) this.crearElementosDOM();

    // Si la URL apunta al menú inicial sin hash, llevar directo a la pantalla con los juegos
    let destino = url;
    if (destino === '../index.html' || destino === 'index.html') {
      destino = destino + '#seleccion';
    }

    this.curtain.classList.add('cerrando');
    setTimeout(() => {
      window.location.href = destino;
    }, 450);
  }

  // Secuencia rápida de pantalla de carga "CARGANDO... -> READY?" (0.7s)
  iniciarCarga(callback) {
    if (!this.loader) this.crearElementosDOM();
    const blocksEl = document.getElementById('loader-blocks');
    const readyEl = document.getElementById('loader-ready-text');

    this.loader.classList.add('activo');
    readyEl.style.display = 'none';

    let progreso = 0;
    const interval = setInterval(() => {
      progreso++;
      let blocksStr = '';
      for (let i = 0; i < 10; i++) {
        blocksStr += i < progreso ? '■' : '□';
      }
      if (blocksEl) blocksEl.textContent = blocksStr;
      if (typeof sonidos !== 'undefined') sonidos.bip();

      if (progreso >= 10) {
        clearInterval(interval);
        readyEl.style.display = 'block';
        if (typeof sonidos !== 'undefined') sonidos.beepGo();

        setTimeout(() => {
          this.loader.classList.remove('activo');
          if (callback) callback();
        }, 550);
      }
    }, 55);
  }

  // Mostrar modal retro de Game Over
  mostrarGameOver({ puntos = 0, record = 0, onReintentar = null, urlMenu = '../index.html#seleccion' }) {
    if (typeof sonidos !== 'undefined') sonidos.gameOver();
    if (!this.modalGameOver) this.crearElementosDOM();

    document.getElementById('gameover-score').textContent = puntos;
    const recordEl = document.getElementById('gameover-record');
    const recordRow = document.getElementById('gameover-record-row');
    if (record !== null && record !== undefined) {
      recordEl.textContent = record;
      recordRow.style.display = 'flex';
    } else {
      recordRow.style.display = 'none';
    }

    const btnRetry = document.getElementById('btn-gameover-retry');
    const btnMenu = document.getElementById('btn-gameover-menu');

    // Clonar para limpiar listeners previos
    const newBtnRetry = btnRetry.cloneNode(true);
    const newBtnMenu = btnMenu.cloneNode(true);
    btnRetry.parentNode.replaceChild(newBtnRetry, btnRetry);
    btnMenu.parentNode.replaceChild(newBtnMenu, btnMenu);

    newBtnRetry.addEventListener('click', () => {
      if (typeof sonidos !== 'undefined') sonidos.click();
      this.modalGameOver.classList.remove('activo');
      if (onReintentar) onReintentar();
    });

    newBtnMenu.addEventListener('click', () => {
      this.irA(urlMenu);
    });

    this.modalGameOver.classList.add('activo');
  }

  // Mostrar modal retro de Victoria
  mostrarVictoria({ titulo = '¡VICTORIA!', lineasInfo = [], onReintentar = null, urlMenu = '../index.html#seleccion' }) {
    if (typeof sonidos !== 'undefined') sonidos.victoria();
    if (!this.modalVictory) this.crearElementosDOM();

    const titleEl = document.querySelector('#arcade-victory-modal .victory-title');
    if (titleEl) titleEl.textContent = titulo;

    const detailsEl = document.getElementById('victory-details');
    detailsEl.innerHTML = '';
    lineasInfo.forEach(linea => {
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `<span>${linea.label}:</span> <span class="stat-highlight">${linea.valor}</span>`;
      detailsEl.appendChild(row);
    });

    const btnRetry = document.getElementById('btn-victory-retry');
    const btnMenu = document.getElementById('btn-victory-menu');

    const newBtnRetry = btnRetry.cloneNode(true);
    const newBtnMenu = btnMenu.cloneNode(true);
    btnRetry.parentNode.replaceChild(newBtnRetry, btnRetry);
    btnMenu.parentNode.replaceChild(newBtnMenu, btnMenu);

    newBtnRetry.addEventListener('click', () => {
      if (typeof sonidos !== 'undefined') sonidos.click();
      this.modalVictory.classList.remove('activo');
      if (onReintentar) onReintentar();
    });

    newBtnMenu.addEventListener('click', () => {
      this.irA(urlMenu);
    });

    this.modalVictory.classList.add('activo');
  }
}

// Instancia global
const transicion = new ArcadeTransitions();

// Abre la pantalla al cargar la página
window.addEventListener('pageshow', () => {
  const curtain = document.getElementById('arcade-curtain');
  if (curtain) {
    curtain.classList.remove('cerrando');
    curtain.classList.add('abriendo');
    setTimeout(() => curtain.classList.remove('abriendo'), 500);
  }
});
