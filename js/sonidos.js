/* ==========================================================================
   SISTEMA DE SONIDO RETRO ARCADE 8-BITS (Web Audio API pura)
   expoaprendizaje - Sonidos sintetizados sin archivos externos
   ========================================================================== */

class ArcadeAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.iosUnlocked = false;

    // Leer preferencia de silencio de localStorage (por defecto activo, no silenciado)
    const savedMute = localStorage.getItem('arcade_mute');
    this.silenciado = savedMute === 'true';

    // Vincular métodos
    this.desbloquear = this.desbloquear.bind(this);
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.silenciado ? 0 : 1, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        } catch (_) {}
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.reproducirBufferSilencioIOS();
  }

  // Reproduce un buffer vacío microscópico para desbloquear la Web Audio API en Safari / iOS
  reproducirBufferSilencioIOS() {
    if (!this.ctx || this.iosUnlocked) return;
    try {
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);
      this.iosUnlocked = true;
    } catch (_) {}
  }

  // Desbloqueo pasivo tras cualquier interacción del usuario
  desbloquear() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Alterna silencio global y actualiza botones en la página
  toggleSilencio() {
    this.silenciado = !this.silenciado;
    localStorage.setItem('arcade_mute', this.silenciado);

    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.silenciado ? 0 : 1, this.ctx.currentTime);
      } catch (_) {}
    }

    this.actualizarBotonSilencio();
    if (!this.silenciado) {
      this.bip();
    }
    return this.silenciado;
  }

  actualizarBotonSilencio() {
    const botones = document.querySelectorAll('#btn-toggle-sonido, .btn-sonido-arcade');
    botones.forEach(btn => {
      btn.innerHTML = this.silenciado
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      btn.title = this.silenciado ? 'ACTIVAR SONIDO' : 'SILENCIAR SONIDO';
      btn.setAttribute('aria-label', this.silenciado ? 'Activar sonido' : 'Silenciar sonido');
      btn.classList.toggle('silenciado', this.silenciado);
    });
  }

  // Tono 8-bit general conectado al masterGain
  _tone(freq, type = 'square', duration = 0.1, volume = 0.25, freqEnd = null) {
    if (this.silenciado) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;

      const t = this.ctx.currentTime;
      osc.frequency.setValueAtTime(freq, t);
      if (freqEnd !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t + duration);
      }

      gain.gain.setValueAtTime(volume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + duration);
    } catch (_) {
      // AudioContext bloqueado temporalmente por política del navegador
    }
  }

  // 1. Bip de navegación o menú
  bip() {
    this._tone(440, 'square', 0.06, 0.2);
  }

  // 2. Clic de botón arcade
  click() {
    this._tone(680, 'square', 0.05, 0.22);
  }

  // 3. Sonido de Moneda / Punto / Acierto (+10)
  punto() {
    if (this.silenciado) return;
    this.init();
    this._tone(987.77, 'square', 0.08, 0.22); // B5
    setTimeout(() => {
      this._tone(1318.51, 'square', 0.14, 0.25); // E6
    }, 70);
  }

  // 4. Salto de personaje
  salto() {
    this._tone(220, 'square', 0.16, 0.22, 660);
  }

  // 5. Choque / Daño / Impacto
  golpe() {
    this._tone(160, 'sawtooth', 0.18, 0.3, 40);
  }

  // 6. Game Over (Escala descendente melancólica 8-bit)
  gameOver() {
    if (this.silenciado) return;
    this.init();
    const notas = [392, 349.23, 311.13, 261.63]; // G4, F4, D#4, C4
    notas.forEach((freq, i) => {
      setTimeout(() => {
        this._tone(freq, 'sawtooth', 0.2, 0.25);
      }, i * 160);
    });
  }

  // 7. Melodía triunfal de Victoria
  victoria() {
    if (this.silenciado) return;
    this.init();
    const notas = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 659.25, d: 0.1 },  // E5
      { f: 783.99, d: 0.1 },  // G5
      { f: 1046.50, d: 0.26 } // C6
    ];
    let time = 0;
    notas.forEach(n => {
      setTimeout(() => {
        this._tone(n.f, 'square', n.d, 0.25);
      }, time);
      time += 130;
    });
  }

  // 8. Cuenta regresiva 3, 2, 1
  beepCuenta() {
    this._tone(440, 'square', 0.1, 0.25);
  }

  // 9. ¡YA! / ¡READY!
  beepGo() {
    this._tone(880, 'square', 0.28, 0.35);
  }

  // 10. Movimiento de pieza (Puzzle / Snake)
  mover() {
    this._tone(320, 'triangle', 0.04, 0.18);
  }
}

// Instancia global compartida
const sonidos = new ArcadeAudio();

// Desbloquear audio en el primer gesto del usuario en la página
const gestosDesbloqueo = ['pointerdown', 'touchend', 'click', 'keydown'];
function activarAudioEnGesto() {
  sonidos.desbloquear();
  if (sonidos.ctx && sonidos.ctx.state === 'running') {
    gestosDesbloqueo.forEach(evt => window.removeEventListener(evt, activarAudioEnGesto));
  }
}
gestosDesbloqueo.forEach(evt => {
  window.addEventListener(evt, activarAudioEnGesto, { passive: true });
});

// Reanudar audio al volver a la pestaña o al cambiar orientación
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && sonidos.ctx && sonidos.ctx.state === 'suspended') {
    sonidos.ctx.resume().catch(() => {});
  }
});
window.addEventListener('orientationchange', () => {
  if (sonidos.ctx && sonidos.ctx.state === 'suspended') {
    sonidos.ctx.resume().catch(() => {});
  }
});

// Auto-conectar botón de sonido al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  sonidos.actualizarBotonSilencio();
  const botones = document.querySelectorAll('#btn-toggle-sonido, .btn-sonido-arcade');
  botones.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sonidos.toggleSilencio();
    });
  });
});
