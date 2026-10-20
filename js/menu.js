/* ==========================================================================
   LÓGICA DEL MENÚ RETRO ARCADE - EXPOAPRENDIZAJE
   JavaScript Puro (Sin librerías ni frameworks, Sin emojis)
   ========================================================================== */

/* ==========================================================================
   CONSTANTES DE CONFIGURACIÓN Y LISTA DE JUEGOS
   ========================================================================== */
const CONFIG_MENU = {
  NOMBRE_FERIA: 'EXPOAPRENDIZAJE',
  TITULO_PRINCIPAL: 'RETRO ARCADE',
  SUBTITULO_PRINCIPAL: 'SELECCIONA UN JUEGO PARA EMPEZAR A COMPETIR',
  CREDITOS: 'INSERT COIN / CRÉDITOS: 99'
};

/**
 * LISTA COMPLETA DE JUEGOS ARCADE
 * 12 Juegos independientes: 7 de 1 Jugador y 5 de 2 Jugadores (1 vs 1).
 * Todos los iconos son SVG pixel-art puros sin emojis.
 */
const LISTA_JUEGOS = [
  // ==========================================
  // JUEGOS 1 JUGADOR
  // ==========================================
  {
    id: 'puzzle',
    nombre: 'PUZZLE DESLIZANTE',
    categoria: '1p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="18" height="18" rx="2" fill="#121029" stroke="#ff007f" stroke-width="2.5"/>
      <text x="13" y="17" fill="#ffe600" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">1</text>
      <rect x="26" y="4" width="18" height="18" rx="2" fill="#121029" stroke="#ff007f" stroke-width="2.5"/>
      <text x="35" y="17" fill="#ffe600" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">2</text>
      <rect x="4" y="26" width="18" height="18" rx="2" fill="#121029" stroke="#ff007f" stroke-width="2.5"/>
      <text x="13" y="39" fill="#ffe600" font-size="11" font-family="monospace" font-weight="bold" text-anchor="middle">3</text>
      <rect x="26" y="26" width="18" height="18" rx="2" fill="transparent" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="3 3"/>
    </svg>`,
    descripcion: 'DESLIZA LAS FICHAS 3X3 PARA ORDENAR LOS NÚMEROS EN EL MENOR TIEMPO.',
    jugadores: '1 JUGADOR',
    ruta: 'juegos/puzzle.html',
    disponible: true
  },
  {
    id: 'pong',
    nombre: 'PONG RETRO',
    categoria: '1p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="4" y="10" width="5" height="26" rx="2" fill="#00f0ff"/>
      <rect x="39" y="18" width="5" height="26" rx="2" fill="#ff007f"/>
      <rect x="21" y="22" width="6" height="6" rx="1" fill="#ffe600"/>
      <line x1="24" y1="4" x2="24" y2="44" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="3 3"/>
    </svg>`,
    descripcion: 'EL DUELO CLÁSICO DE PALETAS CONTRA LA COMPUTADORA A 5 PUNTOS.',
    jugadores: '1 JUGADOR',
    ruta: 'juegos/pong.html',
    disponible: true
  },
  {
    id: 'esquiva',
    nombre: 'ESQUIVA OBSTÁCULOS',
    categoria: '1p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="18" y="8" width="20" height="16" fill="#39ff14"/>
      <rect x="32" y="12" width="3" height="3" fill="#000"/>
      <rect x="10" y="18" width="18" height="16" fill="#39ff14"/>
      <rect x="14" y="34" width="4" height="8" fill="#39ff14"/>
      <rect x="22" y="34" width="4" height="8" fill="#39ff14"/>
      <line x1="2" y1="42" x2="46" y2="42" stroke="#39ff14" stroke-width="2"/>
    </svg>`,
    descripcion: 'SALTA Y ESQUIVA PELIGROS EN UNA CARRERA INFINITA A TODA VELOCIDAD.',
    jugadores: '1 JUGADOR',
    ruta: 'juegos/esquiva.html',
    disponible: true
  },
  {
    id: 'snake',
    nombre: 'CULEBRITA (SNAKE)',
    categoria: '1p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="20" width="8" height="8" rx="1" fill="#ffe600"/>
      <rect x="18" y="20" width="8" height="8" rx="1" fill="#39ff14"/>
      <rect x="28" y="20" width="8" height="8" rx="1" fill="#39ff14"/>
      <rect x="28" y="10" width="8" height="8" rx="1" fill="#39ff14"/>
      <rect x="38" y="10" width="7" height="7" rx="1" fill="#ff0055"/>
    </svg>`,
    descripcion: 'COME MANZANAS Y CRECE SIN CHOCAR CON MUROS NI CON TU PROPIO CUERPO.',
    jugadores: '1 JUGADOR',
    ruta: 'juegos/snake.html',
    disponible: true
  },
  {
    id: 'atrapa',
    nombre: 'ATRAPA OBJETOS',
    categoria: '1p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="22" width="36" height="20" rx="3" fill="#241a02" stroke="#ffe600" stroke-width="2.5"/>
      <path d="M12 22 C12 12, 36 12, 36 22" stroke="#ffe600" stroke-width="2.5" fill="none"/>
      <circle cx="16" cy="12" r="5" fill="#ff1744"/>
      <polygon points="32,8 34,13 39,13 35,16 37,21 32,18 27,21 29,16 25,13 30,13" fill="#ffe600"/>
    </svg>`,
    descripcion: 'MUEVE LA CANASTA PARA RECOGER FRUTAS VIVAS (+10) Y EVITAR BOMBAS.',
    jugadores: '1 JUGADOR',
    ruta: 'juegos/atrapa.html',
    disponible: true
  },
  {
    id: 'memoria',
    nombre: 'MEMORIA DE PAREJAS',
    categoria: '1p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="10" width="16" height="26" rx="2" fill="#15112e" stroke="#ff007f" stroke-width="2"/>
      <polygon points="14,18 17,24 11,24" fill="#ffe600"/>
      <rect x="26" y="12" width="16" height="26" rx="2" fill="#091a29" stroke="#00f0ff" stroke-width="2"/>
      <circle cx="34" cy="25" r="4" fill="#39ff14"/>
    </svg>`,
    descripcion: 'VOLTEA CARTAS Y ENCUENTRA LAS 8 PAREJAS EN EL MENOR TIEMPO POSIBLE.',
    jugadores: '1 JUGADOR',
    ruta: 'juegos/memoria.html',
    disponible: true
  },
  {
    id: 'laberinto',
    nombre: 'LABERINTO RETRO',
    categoria: '1p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" stroke="#00f0ff" stroke-width="3" fill="#08071a"/>
      <line x1="14" y1="4" x2="14" y2="28" stroke="#00f0ff" stroke-width="3"/>
      <line x1="14" y1="28" x2="34" y2="28" stroke="#00f0ff" stroke-width="3"/>
      <line x1="28" y1="14" x2="44" y2="14" stroke="#00f0ff" stroke-width="3"/>
      <circle cx="9" cy="9" r="3.5" fill="#ffe600"/>
      <rect x="38" y="38" width="5" height="5" fill="#39ff14"/>
    </svg>`,
    descripcion: 'RECORRE EL LABERINTO CONTRARRELOJ HASTA LA META Y SUPERA NIVELES.',
    jugadores: '1 JUGADOR',
    ruta: 'juegos/laberinto.html',
    disponible: true
  },

  // ==========================================
  // JUEGOS 2 JUGADORES (DUELOS 1 VS 1)
  // ==========================================
  {
    id: 'clics',
    nombre: 'CARRERA DE CLICS',
    categoria: '2p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <polygon points="26,4 12,24 24,24 22,44 36,22 24,22" fill="#ffe600" stroke="#fff" stroke-width="1.5"/>
    </svg>`,
    descripcion: 'DUELO 1 VS 1 A MÁXIMA VELOCIDAD CON TECLAS [A] Y [L] O TOQUES.',
    jugadores: '2 JUGADORES',
    ruta: 'juegos/clics.html',
    disponible: true
  },
  {
    id: 'airhockey',
    nombre: 'AIR HOCKEY 2P',
    categoria: '2p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="4" y="8" width="40" height="32" rx="3" stroke="#00f0ff" stroke-width="2.5" fill="#060515"/>
      <line x1="24" y1="8" x2="24" y2="40" stroke="#ffe600" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="12" cy="24" r="5" fill="#00f0ff"/>
      <circle cx="36" cy="24" r="5" fill="#ff007f"/>
      <circle cx="24" cy="24" r="3" fill="#ffe600"/>
    </svg>`,
    descripcion: 'MESA EN TIEMPO REAL. J1: [WASD] (AZUL) VS J2: [FLECHAS] (ROSA) A 7 GOLES.',
    jugadores: '2 JUGADORES',
    ruta: 'juegos/airhockey.html',
    disponible: true
  },
  {
    id: 'autos',
    nombre: 'CARRERA DE AUTOS',
    categoria: '2p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="10" width="12" height="28" rx="2" fill="#00f0ff" stroke="#fff" stroke-width="1.5"/>
      <rect x="28" y="10" width="12" height="28" rx="2" fill="#ff007f" stroke="#fff" stroke-width="1.5"/>
      <line x1="24" y1="4" x2="24" y2="44" stroke="#ffe600" stroke-width="2" stroke-dasharray="3 3"/>
    </svg>`,
    descripcion: 'PANTALLA DIVIDIDA Y 3 CARRILES. ESQUIVA Y RECORRE 1000M PRIMERO.',
    jugadores: '2 JUGADORES',
    ruta: 'juegos/autos.html',
    disponible: true
  },
  {
    id: 'tanques',
    nombre: 'DUELO DE TANQUES',
    categoria: '2p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <rect x="10" y="16" width="28" height="18" rx="3" fill="#00f0ff" stroke="#fff" stroke-width="1.5"/>
      <line x1="38" y1="25" x2="46" y2="25" stroke="#ffe600" stroke-width="3"/>
      <rect x="6" y="12" width="5" height="26" rx="1" fill="#333"/>
      <rect x="37" y="12" width="5" height="26" rx="1" fill="#333"/>
      <circle cx="24" cy="25" r="5" fill="#081424"/>
    </svg>`,
    descripcion: 'COMBATE EN ARENA CON REBOTE DE BALAS. J1: [WASD] Y J2: [FLECHAS].',
    jugadores: '2 JUGADORES',
    ruta: 'juegos/tanques.html',
    disponible: true
  },
  {
    id: 'sumo',
    nombre: 'DUELO SUMO 2P',
    categoria: '2p',
    iconoSVG: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="#ffe600" stroke-width="3" fill="#0d0b21"/>
      <circle cx="16" cy="24" r="7" fill="#00f0ff"/>
      <circle cx="32" cy="24" r="7" fill="#ff007f"/>
    </svg>`,
    descripcion: 'EMPUJA AL RIVAL FUERA DEL RING CIRCULAR CON FÍSICA DE INERCIA.',
    jugadores: '2 JUGADORES',
    ruta: 'juegos/sumo.html',
    disponible: true
  }
];

/* ==========================================================================
   INICIALIZACIÓN DEL MENÚ
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const pantallaInicio = document.getElementById('pantalla-inicio');
  const pantallaSeleccion = document.getElementById('pantalla-seleccion');
  const btnStart = document.getElementById('btn-press-start');
  const btnVolver = document.getElementById('btn-volver-inicio');
  const contenedorJuegos = document.getElementById('contenedor-juegos');
  const btnFullscreen = document.getElementById('btn-toggle-fullscreen');

  // Insertar textos configurables
  const labelFeria = document.getElementById('label-feria');
  const labelTitulo = document.getElementById('label-titulo');
  const labelSubtitulo = document.getElementById('label-subtitulo');
  const labelCreditos = document.getElementById('label-creditos');

  if (labelFeria) labelFeria.textContent = `[ ${CONFIG_MENU.NOMBRE_FERIA} ]`;
  if (labelTitulo) labelTitulo.textContent = CONFIG_MENU.TITULO_PRINCIPAL;
  if (labelSubtitulo) labelSubtitulo.textContent = CONFIG_MENU.SUBTITULO_PRINCIPAL;
  if (labelCreditos) labelCreditos.textContent = CONFIG_MENU.CREDITOS;

  // Renderizar tarjetas de juegos organizadas por secciones
  renderizarTarjetasPorSeccion();

  // Función para mostrar directamente la pantalla con los juegos
  function mostrarSeleccionDirecta() {
    pantallaInicio.classList.remove('activa');
    pantallaInicio.classList.add('oculta');
    pantallaSeleccion.classList.remove('oculta');
    pantallaSeleccion.classList.add('activa');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // Si la URL contiene hash (#seleccion o #juegos) o parámetro, saltar directamente a la lista de juegos
  if (window.location.hash === '#seleccion' || window.location.hash === '#juegos' || window.location.search.includes('juegos')) {
    mostrarSeleccionDirecta();
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#seleccion' || window.location.hash === '#juegos') {
      mostrarSeleccionDirecta();
    }
  });

  // Transición: Inicio -> Selección
  btnStart.addEventListener('click', () => {
    if (typeof sonidos !== 'undefined') sonidos.punto();
    pantallaInicio.classList.remove('activa');
    pantallaInicio.classList.add('oculta');

    pantallaSeleccion.classList.remove('oculta');
    pantallaSeleccion.classList.add('activa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Transición: Selección -> Inicio
  btnVolver.addEventListener('click', () => {
    if (typeof sonidos !== 'undefined') sonidos.bip();
    pantallaSeleccion.classList.remove('activa');
    pantallaSeleccion.classList.add('oculta');

    pantallaInicio.classList.remove('oculta');
    pantallaInicio.classList.add('activa');
  });

  // Pantalla Completa
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (typeof sonidos !== 'undefined') sonidos.click();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });
  }

  // Prevenir gestos de pinza multitáctil que desajusten el viewport
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  /**
   * Genera una tarjeta HTML de juego
   */
  function crearElementoTarjeta(juego) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'game-card';
    tarjeta.setAttribute('data-id', juego.id);

    tarjeta.innerHTML = `
      <div class="card-top">
        <div class="card-icon-wrap">${juego.iconoSVG}</div>
        <div class="card-badges">
          <span class="badge-players">${juego.jugadores}</span>
          <span class="badge-status disponible">LISTO</span>
        </div>
      </div>
      <div class="card-body">
        <h2 class="card-title">${juego.nombre}</h2>
        <p class="card-desc">${juego.descripcion}</p>
      </div>
      <div class="card-footer">
        <span>&gt; JUGAR AHORA</span>
        <span>&gt;</span>
      </div>
    `;

    // Navegación con transición retro
    tarjeta.addEventListener('click', () => {
      if (typeof transicion !== 'undefined') {
        transicion.irA(juego.ruta);
      } else {
        window.location.href = juego.ruta;
      }
    });

    return tarjeta;
  }

  /**
   * Genera las tarjetas dinámicas con estilo arcade organizadas en 2 secciones:
   * 1 JUGADOR y 2 JUGADORES
   */
  function renderizarTarjetasPorSeccion() {
    if (!contenedorJuegos) return;
    contenedorJuegos.innerHTML = '';

    const juegos1P = LISTA_JUEGOS.filter(j => j.categoria === '1p');
    const juegos2P = LISTA_JUEGOS.filter(j => j.categoria === '2p');

    // 1. Sección 1 Jugador
    const div1P = document.createElement('div');
    div1P.style.gridColumn = '1 / -1';
    div1P.innerHTML = `<h3 class="section-divider">[ MODO 1 JUGADOR - SOLITARIO ]</h3>`;
    contenedorJuegos.appendChild(div1P);

    juegos1P.forEach(juego => {
      contenedorJuegos.appendChild(crearElementoTarjeta(juego));
    });

    // 2. Sección 2 Jugadores
    const div2P = document.createElement('div');
    div2P.style.gridColumn = '1 / -1';
    div2P.innerHTML = `<h3 class="section-divider" style="border-left-color: var(--neon-magenta); color: var(--neon-magenta);">[ MODO 2 JUGADORES - DUELO 1 VS 1 ]</h3>`;
    contenedorJuegos.appendChild(div2P);

    juegos2P.forEach(juego => {
      contenedorJuegos.appendChild(crearElementoTarjeta(juego));
    });
  }
});
