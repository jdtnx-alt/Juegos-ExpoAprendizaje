/* ==========================================================================
   LÓGICA ADAPTATIVA MÓVIL Y CONTROLES TÁCTILES RETRO ARCADE
   expoaprendizaje - JavaScript Puro (Sin librerías, Sin emojis)
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // 1. GESTOR DE ORIENTACIÓN: AVISO "GIRA EL CELULAR"
  // ==========================================================================
  class OrientationGuard {
    constructor(modoRequerido = 'any') {
      this.modo = modoRequerido; // 'landscape', 'portrait', o 'any'
      this.overlay = null;
      if (this.modo !== 'any') {
        this.crearOverlay();
        this.verificar();
        window.addEventListener('resize', () => this.verificar());
        window.addEventListener('orientationchange', () => this.verificar());
        if (screen.orientation) {
          screen.orientation.addEventListener('change', () => this.verificar());
        }
      }
    }

    crearOverlay() {
      if (document.getElementById('arcade-rotate-prompt')) return;

      const div = document.createElement('div');
      div.id = 'arcade-rotate-prompt';
      div.className = 'arcade-rotate-prompt';
      div.setAttribute('aria-hidden', 'true');

      // Gráfico vectorial retro pixel-art de celular girando (Sin emojis)
      div.innerHTML = `
        <div class="rotate-card">
          <div class="rotate-icon-wrap">
            <svg class="rotate-svg" width="68" height="68" viewBox="0 0 64 64" fill="none">
              <!-- Marco del celular -->
              <rect x="20" y="10" width="24" height="44" rx="4" stroke="#00f0ff" stroke-width="3" fill="#09081a"/>
              <line x1="28" y1="14" x2="36" y2="14" stroke="#00f0ff" stroke-width="2"/>
              <circle cx="32" cy="48" r="2" fill="#ffe600"/>
              <!-- Flechas de rotación -->
              <path d="M12 28 C12 18, 20 12, 30 10" stroke="#ff007f" stroke-width="3" stroke-linecap="round" fill="none"/>
              <polygon points="32,6 34,14 26,12" fill="#ff007f"/>
              <path d="M52 36 C52 46, 44 52, 34 54" stroke="#ff007f" stroke-width="3" stroke-linecap="round" fill="none"/>
              <polygon points="32,58 30,50 38,52" fill="#ff007f"/>
            </svg>
          </div>
          <h2 class="rotate-title blink-text">GIRA EL CELULAR</h2>
          <p class="rotate-sub" id="rotate-instructions">
            ${this.modo === 'landscape' ? 'PON EL DISPOSITIVO EN HORIZONTAL PARA JUGAR' : 'PON EL DISPOSITIVO EN VERTICAL PARA JUGAR'}
          </p>
        </div>
      `;

      document.body.appendChild(div);
      this.overlay = div;
    }

    verificar() {
      if (!this.overlay || this.modo === 'any') return;

      const esTactil = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      if (!esTactil) {
        this.overlay.classList.remove('activo');
        return;
      }

      const ancho = window.innerWidth;
      const alto = window.innerHeight;
      const esHorizontal = ancho > alto;

      if (this.modo === 'landscape') {
        if (!esHorizontal) {
          this.overlay.classList.add('activo');
        } else {
          this.overlay.classList.remove('activo');
        }
      } else if (this.modo === 'portrait') {
        if (esHorizontal) {
          this.overlay.classList.add('activo');
        } else {
          this.overlay.classList.remove('activo');
        }
      }
    }
  }

  // ==========================================================================
  // 2. JOYSTICK VIRTUAL MULTITÁCTIL
  // ==========================================================================
  class VirtualJoystick {
    constructor(contenedor, opciones = {}) {
      // En computadores con mouse jamás se inicializan joysticks táctiles
      if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        return;
      }

      this.contenedor = typeof contenedor === 'string' ? document.querySelector(contenedor) : contenedor;
      this.color = opciones.color || '#00f0ff'; // 'cyan' o 'magenta'
      this.radioBase = opciones.radioBase || 55;
      this.radioKnob = opciones.radioKnob || 24;
      this.onMove = opciones.onMove || (() => {});
      this.onEnd = opciones.onEnd || (() => {});

      this.pointerId = null;
      this.centro = { x: 0, y: 0 };
      this.vector = { x: 0, y: 0, distance: 0, angle: 0 };

      if (this.contenedor) {
        this.crearDOM();
        this.adjuntarEventos();
      }
    }

    crearDOM() {
      this.wrap = document.createElement('div');
      this.wrap.className = 'arcade-joystick-wrap';
      this.wrap.style.borderColor = this.color;
      this.wrap.style.boxShadow = `0 0 15px ${this.color}88`;

      this.knob = document.createElement('div');
      this.knob.className = 'arcade-joystick-knob';
      this.knob.style.backgroundColor = this.color;
      this.knob.style.boxShadow = `0 0 12px ${this.color}`;

      this.wrap.appendChild(this.knob);
      this.contenedor.appendChild(this.wrap);
    }

    adjuntarEventos() {
      const el = this.wrap;

      el.addEventListener('pointerdown', (e) => {
        if (this.pointerId !== null) return;
        this.pointerId = e.pointerId;
        el.setPointerCapture(e.pointerId);

        const rect = el.getBoundingClientRect();
        this.centro = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        this.actualizarPosicion(e.clientX, e.clientY);
        e.preventDefault();
      });

      el.addEventListener('pointermove', (e) => {
        if (e.pointerId !== this.pointerId) return;
        this.actualizarPosicion(e.clientX, e.clientY);
        e.preventDefault();
      });

      const finalizar = (e) => {
        if (e.pointerId !== this.pointerId) return;
        this.pointerId = null;
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        this.resetear();
        e.preventDefault();
      };

      el.addEventListener('pointerup', finalizar);
      el.addEventListener('pointercancel', finalizar);
    }

    actualizarPosicion(clientX, clientY) {
      const dx = clientX - this.centro.x;
      const dy = clientY - this.centro.y;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const maxDist = this.radioBase - this.radioKnob / 2;
      const clampedDist = Math.min(dist, maxDist);

      const posX = Math.cos(angle) * clampedDist;
      const posY = Math.sin(angle) * clampedDist;

      this.knob.style.transform = `translate(${posX}px, ${posY}px)`;

      const normalDist = clampedDist / maxDist;
      this.vector = {
        x: normalDist > 0.15 ? Math.cos(angle) * normalDist : 0,
        y: normalDist > 0.15 ? Math.sin(angle) * normalDist : 0,
        distance: normalDist,
        angle: angle
      };

      this.onMove(this.vector);
    }

    resetear() {
      this.knob.style.transform = 'translate(0px, 0px)';
      this.vector = { x: 0, y: 0, distance: 0, angle: 0 };
      this.onMove(this.vector);
      this.onEnd();
    }
  }

  // ==========================================================================
  // 3. BOTÓN VIRTUAL TÁCTIL
  // ==========================================================================
  class TouchActionButton {
    constructor(contenedor, opciones = {}) {
      // En computadores con mouse jamás se inicializan botones táctiles
      if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        return;
      }

      this.contenedor = typeof contenedor === 'string' ? document.querySelector(contenedor) : contenedor;
      this.texto = opciones.texto || 'FUEGO';
      this.color = opciones.color || '#00f0ff';
      this.onPress = opciones.onPress || (() => {});
      this.onRelease = opciones.onRelease || (() => {});

      if (this.contenedor) {
        this.crearDOM();
      }
    }

    crearDOM() {
      this.btn = document.createElement('button');
      this.btn.type = 'button';
      this.btn.className = 'arcade-touch-btn';
      this.btn.textContent = this.texto;
      this.btn.style.borderColor = this.color;
      this.btn.style.color = this.color;
      this.btn.style.boxShadow = `0 0 15px ${this.color}66`;

      const presionar = (e) => {
        e.preventDefault();
        this.btn.classList.add('activo');
        this.onPress();
      };

      const soltar = (e) => {
        e.preventDefault();
        this.btn.classList.remove('activo');
        this.onRelease();
      };

      this.btn.addEventListener('pointerdown', presionar);
      this.btn.addEventListener('pointerup', soltar);
      this.btn.addEventListener('pointercancel', soltar);

      this.contenedor.appendChild(this.btn);
    }
  }

  // ==========================================================================
  // 4. PREVENCIÓN GLOBAL DE FALLOS TÁCTILES
  // ==========================================================================
  function sanitizarEventosTactiles() {
    if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    // Evitar zoom por doble toque accidental en iOS y Chrome móvil
    let ultimoToque = 0;
    document.addEventListener('touchend', (e) => {
      const ahora = Date.now();
      if (ahora - ultimoToque <= 300) {
        // Doble toque detectado
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
      ultimoToque = ahora;
    }, { passive: false });

    // Prevenir menú contextual táctil en áreas de juego
    window.addEventListener('contextmenu', (e) => {
      if (e.pointerType === 'touch' || 'ontouchstart' in window) {
        e.preventDefault();
      }
    });
  }

  // Inicializar al cargar
  sanitizarEventosTactiles();

  // Exportar al ámbito global para uso modular
  window.RetroMovil = {
    OrientationGuard: OrientationGuard,
    VirtualJoystick: VirtualJoystick,
    TouchActionButton: TouchActionButton,
    esTactil: () => window.matchMedia('(hover: none) and (pointer: coarse)').matches
  };

})();
