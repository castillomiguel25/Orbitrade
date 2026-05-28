'use client';
import GalaxianCanvas from './GalaxianCanvas';
import { useGalaxian } from './useGalaxian';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

type Bullet = {
  x: number;
  y: number;
  w: number;
  h: number;
  dy: number;
  dx?: number;
  from: 'player' | 'enemy';
  color?: string;
};

type PowerUpType = 'triple' | 'fire';
type PowerUpItem = {
  x: number;
  y: number;
  w: number;
  h: number;
  dy: number;
  type: PowerUpType;
};

type Enemy = {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  baseX: number;
  baseY: number;
  phase: number;
};

export default function GalaxianGame() {
  const intl = useIntl();
  // Estados de vista
  const [viewState, setViewState] = useState<'loading' | 'menu' | 'playing' | 'buy_plan'>('loading');
  const [maxLevel, setMaxLevel] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [hasPurchasedPlan, setHasPurchasedPlan] = useState(false);
  const hasPurchasedPlanRef = useRef(false);
  
  // Refs para evitar problemas de closure en el loop del juego
  const maxLevelRef = useRef(0);
  const maxScoreRef = useRef(0);

  // Cargar progreso desde la Base de Datos (o LocalStorage como fallback)
  useEffect(() => {
    // Verificar si tiene plan comprado
    fetch('/api/deposits')
      .then(res => res.json())
      .then(data => {
        const deposits = data.deposits || [];
        const hasPlan = deposits.length > 0;
        setHasPurchasedPlan(hasPlan);
        hasPurchasedPlanRef.current = hasPlan;
      })
      .catch(() => {
        // En caso de error, asumimos false por seguridad
        setHasPurchasedPlan(false);
        hasPurchasedPlanRef.current = false;
      });

    // Intentar cargar de la API (Base de Datos)
    fetch('/api/galaxian/stats')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('No auth or error');
      })
      .then((data) => {
        if (data.max_level) {
           setMaxLevel(data.max_level);
           maxLevelRef.current = data.max_level;
           // También guardar en local como respaldo
           localStorage.setItem('galaxian_max_level', data.max_level.toString());
        }
        if (data.max_score) {
           setMaxScore(data.max_score);
           maxScoreRef.current = data.max_score;
           localStorage.setItem('galaxian_max_score', data.max_score.toString());
        }
      })
      .catch(() => {
        // Fallback a LocalStorage si no hay conexión o usuario
        const storedLevel = localStorage.getItem('galaxian_max_level');
        if (storedLevel) {
           const l = parseInt(storedLevel);
           setMaxLevel(l);
           maxLevelRef.current = l;
        }
        const storedScore = localStorage.getItem('galaxian_max_score');
        if (storedScore) {
           const s = parseInt(storedScore);
           setMaxScore(s);
           maxScoreRef.current = s;
        }
      });
  }, []);

  // Función para guardar progreso
  const saveProgress = (level: number, score: number) => {
    // Guardar en BD (la API maneja el "max", enviamos el actual)
    fetch('/api/galaxian/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, score }),
    }).catch(console.error);
    
    // Guardar en LocalStorage y State si es récord
    if (level > maxLevelRef.current) {
       maxLevelRef.current = level;
       setMaxLevel(level);
       localStorage.setItem('galaxian_max_level', level.toString());
    }
    if (score > maxScoreRef.current) {
       maxScoreRef.current = score;
       setMaxScore(score);
       localStorage.setItem('galaxian_max_score', score.toString());
    }
  };
  const [playerSpeed, setPlayerSpeed] = useState(4);
  const [enemyCount, setEnemyCount] = useState(25); // Lote de 25
  const [enemySpeed, setEnemySpeed] = useState(1.5);
  const { canvasRef, width, height, handlePointerDown, handlePointerMove, handlePointerUp } = useGalaxian();

  // Estado del juego
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // Refs para lógica del juego y render consistente
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const gameOverRef = useRef(false);
  const endMessageRef = useRef('');

  // Control de oleadas (lotes)
  const batchesSpawnedRef = useRef(0); // Cuántos lotes de 25 han salido en este nivel
  const warningRef = useRef(false); // "PELIGRO PELIGRO"
  const bossActiveRef = useRef(false);
  const bossRef = useRef({ x: 0, y: -200, w: 120, h: 120, hp: 40, maxHp: 40, direction: 1 });
  const bossBulletsRef = useRef<{ x: number, y: number, w: number, h: number, dy: number }[]>([]);

  const rafRef = useRef<number | null>(null);

  // Imágenes
  const playerImgRef = useRef<HTMLImageElement | null>(null);
  const enemyImgRef = useRef<HTMLImageElement | null>(null);

  // Entidades - Nave más grande (64x64)
  const playerRef = useRef({ x: 300, y: 520, w: 64, h: 64, cooldown: 0 });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const powerUpsRef = useRef<PowerUpItem[]>([]); // Power-ups cayendo
  const activePowerUpRef = useRef<{ type: PowerUpType | 'none'; endTime: number }>({ type: 'none', endTime: 0 });
  
  const keysRef = useRef<Record<string, boolean>>({});
  const lastEnemyShotRef = useRef<number>(0);
  const draggingRef = useRef(false);

  // Simular carga
  useEffect(() => {
    // Cargar datos guardados
    const savedLevel = localStorage.getItem('galaxian_max_level');
    if (savedLevel) setMaxLevel(parseInt(savedLevel, 10));

    const savedScore = localStorage.getItem('galaxian_max_score');
    if (savedScore) setMaxScore(parseInt(savedScore, 10));

    const timer = setTimeout(() => {
      setViewState('menu');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Inicializar imágenes
  useEffect(() => {
    const playerImg = new Image();
    playerImg.src = '/plans/avion_one.png';
    playerImgRef.current = playerImg;

    const enemyImg = new Image();
    enemyImg.src = '/plans/enemies.png';
    enemyImgRef.current = enemyImg;
  }, []);

  // Controles táctiles: mover bajo el dedo (solo eje X para precisión móvil)
  const movePlayerTo = (clientX: number) => {
    if (viewState !== 'playing' || gameOverRef.current) return;
    const canvas = canvasRef.current;
    const player = playerRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const halfW = player.w / 2;
    player.x = Math.max(0, Math.min(x - halfW, width - player.w));
  };
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (viewState !== 'playing') return;
    draggingRef.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    movePlayerTo(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    movePlayerTo(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  // Listeners de teclado
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ') e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Reiniciar juego / enemigos cuando cambian configuraciones
  useEffect(() => {
    if (viewState === 'playing') {
      resetGame(false);
    }
  }, [enemyCount]);

  function startGame() {
    resetGame(true);
    setViewState('playing');
  }

  function resetGame(full = true) {
    if (full) {
      setScore(0);
      setLives(3);
      setLevel(1);
      setGameOver(false);
      scoreRef.current = 0;
      livesRef.current = 3;
      levelRef.current = 1;
      gameOverRef.current = false;
      endMessageRef.current = '';
      playerRef.current = { x: width / 2 - 30, y: height - 60, w: 64, h: 64, cooldown: 0 };
      bulletsRef.current = [];
      powerUpsRef.current = [];
      activePowerUpRef.current = { type: 'none', endTime: 0 };
      batchesSpawnedRef.current = 0;
      bossActiveRef.current = false;
      warningRef.current = false;
      bossBulletsRef.current = [];
    }
    // Iniciar primer lote
    batchesSpawnedRef.current = 1;
    bossActiveRef.current = false;
    warningRef.current = false;
    spawnEnemies(25); // Siempre 25 por lote
  }

  function spawnBoss() {
    bossActiveRef.current = true;
    // Dificultad escalable: 40 base + 20 por cada nivel extra
    const hp = 40 + (levelRef.current - 1) * 20;
    bossRef.current = { 
      x: width / 2 - 60, 
      y: -150, 
      w: 120, 
      h: 120, 
      hp: hp, 
      maxHp: hp, 
      direction: 1 
    };
  }

  function spawnEnemies(count: number) {
    const cols = Math.min(8, Math.ceil(Math.sqrt(count)));
    const rows = Math.ceil(count / cols);
    const startX = 60;
    const startY = 60;
    const gapX = 60;
    const gapY = 50;

    const enemies: Enemy[] = [];
    let added = 0;
    for (let r = 0; r < rows && added < count; r++) {
      for (let c = 0; c < cols && added < count; c++) {
        const x = startX + c * gapX;
        const y = startY + r * gapY;
        enemies.push({
          x,
          y,
          w: 36,
          h: 36,
          alive: true,
          baseX: x,
          baseY: y,
          phase: Math.random() * Math.PI * 2,
        });
        added++;
      }
    }
    enemiesRef.current = enemies;
  }

  function shoot(from: 'player' | 'enemy', x: number, y: number) {
    const speed = from === 'player' ? -6 : 3.6;
    
    if (from === 'player') {
       const powerUp = activePowerUpRef.current;
       const isActive = performance.now() < powerUp.endTime;
       
       if (isActive && powerUp.type === 'triple') {
          // 3 disparos (Triple)
          bulletsRef.current.push({ x: x - 10, y, w: 4, h: 10, dy: speed, dx: -1.5, from, color: '#0af' });
          bulletsRef.current.push({ x: x, y, w: 4, h: 10, dy: speed, dx: 0, from, color: '#0af' });
          bulletsRef.current.push({ x: x + 10, y, w: 4, h: 10, dy: speed, dx: 1.5, from, color: '#0af' });
       } else if (isActive && powerUp.type === 'fire') {
          // 5 disparos (Fuego)
          bulletsRef.current.push({ x: x, y, w: 6, h: 12, dy: speed, dx: -3, from, color: '#f20' });
          bulletsRef.current.push({ x: x, y, w: 6, h: 12, dy: speed, dx: -1.5, from, color: '#f50' });
          bulletsRef.current.push({ x: x, y, w: 6, h: 12, dy: speed, dx: 0, from, color: '#f80' });
          bulletsRef.current.push({ x: x, y, w: 6, h: 12, dy: speed, dx: 1.5, from, color: '#f50' });
          bulletsRef.current.push({ x: x, y, w: 6, h: 12, dy: speed, dx: 3, from, color: '#f20' });
       } else {
          // Normal
          bulletsRef.current.push({ x, y, w: 4, h: 10, dy: speed, from });
       }
    } else {
       bulletsRef.current.push({ x, y, w: 4, h: 10, dy: speed, from });
    }
  }

  function rectsIntersect(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
    return (
      a.x <= b.x + b.w &&
      a.x + a.w >= b.x &&
      a.y <= b.y + b.h &&
      a.y + a.h >= b.y
    );
  }

  // Bucle principal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      update(dt);
      draw(ctx);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playerSpeed, enemySpeed, viewState]);

  function update(dt: number) {
    // Lógica para el Menú (Demo Mode)
    if (viewState === 'menu') {
      const player = playerRef.current;
      // Centrar jugador
      player.x = width / 2 - player.w / 2;
      player.y = height / 2;
      
      // Auto-disparo decorativo
      player.cooldown = Math.max(0, player.cooldown - dt);
      if (player.cooldown <= 0) {
        shoot('player', player.x + player.w / 2 - 2, player.y);
        player.cooldown = 150;
      }
      
      // Mover balas
      bulletsRef.current.forEach((b) => { b.y += b.dy; });
      bulletsRef.current = bulletsRef.current.filter((b) => b.y > -20 && b.y < height + 20);
      return;
    }

    if (viewState !== 'playing' || gameOverRef.current) return;

    const player = playerRef.current;

    // Movimiento del jugador
    if (keysRef.current['arrowleft'] || keysRef.current['a']) {
      player.x -= playerSpeed;
    }
    if (keysRef.current['arrowright'] || keysRef.current['d']) {
      player.x += playerSpeed;
    }
    if (keysRef.current['arrowup'] || keysRef.current['w']) {
      player.y -= playerSpeed;
    }
    if (keysRef.current['arrowdown'] || keysRef.current['s']) {
      player.y += playerSpeed;
    }
    // Límites
    player.x = Math.max(0, Math.min(width - player.w, player.x));
    player.y = Math.max(height * 0.4, Math.min(height - player.h, player.y)); // zona inferior

    // Disparo jugador: auto-fire continuo con cooldown
    player.cooldown = Math.max(0, player.cooldown - dt);
    if (player.cooldown <= 0) {
      shoot('player', player.x + player.w / 2 - 2, player.y);
      player.cooldown = 160; // ms (más rápido para auto-fire)
    }

    // Movimiento enemigos en formación
    const time = performance.now() / 1000;
    enemiesRef.current.forEach((e) => {
      if (!e.alive) return;
      e.x = e.baseX + Math.sin(time * 2 + e.phase) * 20;
      e.y = e.baseY + Math.cos(time * 1.5 + e.phase) * 6 + time * (enemySpeed * 0.02); // avance lento hacia abajo

      // Si un enemigo alcanza el fondo, el jugador pierde una vida
      if (e.y + e.h >= height - 4) {
        e.alive = false;
        const nv = livesRef.current - 1;
        livesRef.current = nv;
        setLives(nv);
        if (nv <= 0) {
          gameOverRef.current = true;
          setGameOver(true);
          endMessageRef.current = intl.formatMessage({ id: 'games.galaxian.gameOver' });
          saveProgress(levelRef.current, scoreRef.current);
        }
      }
    });

    // Disparos enemigos aleatorios
    const enemyShotInterval = 600; // ms
    if (performance.now() - lastEnemyShotRef.current > enemyShotInterval) {
      const alive = enemiesRef.current.filter((e) => e.alive);
      if (alive.length > 0) {
        const shooter = alive[Math.floor(Math.random() * alive.length)];
        shoot('enemy', shooter.x + shooter.w / 2 - 2, shooter.y + shooter.h);
      }
      lastEnemyShotRef.current = performance.now();
    }

    // Actualizar balas (ahora con dx)
    bulletsRef.current.forEach((b) => {
      b.y += b.dy;
      if (b.dx) b.x += b.dx;
    });
    // Remover balas fuera de pantalla
    bulletsRef.current = bulletsRef.current.filter((b) => b.y > -20 && b.y < height + 20 && b.x > -20 && b.x < width + 20);

    // Actualizar Power-Ups
    powerUpsRef.current.forEach((p) => {
      p.y += p.dy;
    });
    // Remover power-ups fuera
    powerUpsRef.current = powerUpsRef.current.filter((p) => p.y < height + 50);

    // Colisión Jugador con Power-Ups
    for (let i = 0; i < powerUpsRef.current.length; i++) {
      const p = powerUpsRef.current[i];
      if (rectsIntersect(player, p)) {
        // Activar poder por 5 segundos
        activePowerUpRef.current = { type: p.type, endTime: performance.now() + 5000 };
        powerUpsRef.current.splice(i, 1);
        i--;
      }
    }

    // Colisiones: balas del jugador con enemigos
    for (const b of bulletsRef.current) {
      if (b.from === 'player') {
        for (const e of enemiesRef.current) {
          if (e.alive && rectsIntersect(b, e)) {
            e.alive = false;
            b.y = -9999;
            const newScore = scoreRef.current + 10;
            scoreRef.current = newScore;
            setScore(newScore);
            
            // Probabilidad de soltar Power-Up (4% aprox 1 por lote de 25)
            if (Math.random() < 0.04) {
              const type = Math.random() < 0.5 ? 'triple' : 'fire';
              powerUpsRef.current.push({ x: e.x, y: e.y, w: 24, h: 24, type, dy: 2 });
            }
            break;
          }
        }
      }
    }
    bulletsRef.current = bulletsRef.current.filter((b) => b.y !== -9999);

    // Colisiones: balas enemigas con jugador (eliminar inmediatamente)
    for (let i = 0; i < bulletsRef.current.length; i++) {
      const b = bulletsRef.current[i];
      if (b.from === 'enemy' && rectsIntersect(b, player)) {
        bulletsRef.current.splice(i, 1);
        i--;
        const nv = livesRef.current - 1;
        livesRef.current = nv;
        setLives(nv);
        if (nv <= 0) {
          gameOverRef.current = true;
          setGameOver(true);
          endMessageRef.current = intl.formatMessage({ id: 'games.galaxian.gameOver' });
          saveProgress(levelRef.current, scoreRef.current);
        }
      }
    }

  // Nivel completado (todos los enemigos eliminados)
    if (!enemiesRef.current.some((e) => e.alive) && !bossActiveRef.current && !warningRef.current) {
       // ¿Quedan lotes por salir en este nivel? (total 4 lotes de 25 = 100 enemigos)
       if (batchesSpawnedRef.current < 4) {
         batchesSpawnedRef.current++;
         // Pequeña pausa o spawn inmediato
         spawnEnemies(25);
       } else {
         // Aparecer JEFE FINAL con ADVERTENCIA
         warningRef.current = true;
         setTimeout(() => {
           warningRef.current = false;
           spawnBoss();
         }, 3000); // 3 segundos de advertencia
       }
    }
    
    // Lógica del JEFE
    if (bossActiveRef.current) {
       const boss = bossRef.current;
       // Entrada suave
       if (boss.y < 50) boss.y += 2;
       
       // Movimiento lateral
       boss.x += 2 * boss.direction;
       if (boss.x <= 0 || boss.x + boss.w >= width) {
          boss.direction *= -1;
       }
       
       // Disparos del Jefe
       if (Math.random() < 0.05) { // Probabilidad de disparo
          bossBulletsRef.current.push({ 
            x: boss.x + boss.w / 2 - 5, 
            y: boss.y + boss.h, 
            w: 10, 
            h: 20, 
            dy: 5 
          });
       }
       
       // Mover balas del jefe
       bossBulletsRef.current.forEach(b => b.y += b.dy);
       bossBulletsRef.current = bossBulletsRef.current.filter(b => b.y < height + 50);
       
       // Colisión balas jugador con jefe
       for (const b of bulletsRef.current) {
          if (b.from === 'player' && rectsIntersect(b, boss)) {
             b.y = -9999; // destruir bala
             boss.hp--;
             // Feedback visual o sonoro podría ir aquí
             if (boss.hp <= 0) {
                // JEFE DERROTADO
                bossActiveRef.current = false;
                bossBulletsRef.current = [];

                // Verificar si tiene plan comprado al terminar nivel 1
                if (levelRef.current === 1 && !hasPurchasedPlanRef.current) {
                  setViewState('buy_plan');
                  return;
                }
                
                const nextLevel = levelRef.current + 1;
                levelRef.current = nextLevel;
                setLevel(nextLevel);
                
                // Bonus por matar al jefe
                const newScore = scoreRef.current + 1000;
                scoreRef.current = newScore;
                setScore(newScore);

                saveProgress(nextLevel, newScore);
                
                // Reiniciar para siguiente nivel
                batchesSpawnedRef.current = 1;
                spawnEnemies(25);
                bulletsRef.current = [];
             }
          }
       }
       
       // Colisión balas jefe con jugador
       for (const b of bossBulletsRef.current) {
          if (rectsIntersect(b, playerRef.current)) {
             b.y = 9999;
             const nv = livesRef.current - 1;
             livesRef.current = nv;
             setLives(nv);
             if (nv <= 0) {
                gameOverRef.current = true;
                setGameOver(true);
                endMessageRef.current = intl.formatMessage({ id: 'games.galaxian.gameOver' });
                saveProgress(levelRef.current, scoreRef.current);
             }
          }
       }
    }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    // Fondo espacial con parallax de avance (sensación de volar hacia adelante)
    ctx.fillStyle = '#000012';
    ctx.fillRect(0, 0, width, height);
    const t = performance.now();
    const scrollFast = (t / 18) % height;
    const scrollSlow = (t / 45) % height;
    // Capa lenta (estrellas pequeñas)
    for (let i = 0; i < 100; i++) {
      const x = (i * 37 + 97) % width;
      const y = (i * 23 + height - scrollSlow) % height;
      ctx.fillStyle = i % 9 === 0 ? '#6cf' : '#cfd9ff';
      ctx.fillRect(x, y, 1, 1);
    }
    // Capa rápida (estrellas grandes)
    for (let i = 0; i < 60; i++) {
      const x = (i * 61 + 149) % width;
      const y = (i * 41 + height - scrollFast) % height;
      ctx.fillStyle = i % 7 === 0 ? '#9df' : '#fff';
      ctx.fillRect(x, y, 2, 2);
    }
    // Líneas de velocidad ocasionales
    ctx.strokeStyle = 'rgba(180,200,255,0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const x = ((i * 43 + (t / 6)) % width);
      ctx.beginPath();
      ctx.moveTo(x, (height - scrollFast + i * 10) % height);
      ctx.lineTo(x, ((height - scrollFast + i * 10) % height) - 12);
      ctx.stroke();
    }

    // Dibujar jugador
    const p = playerRef.current;
    if (playerImgRef.current && playerImgRef.current.complete) {
      ctx.drawImage(playerImgRef.current, p.x, p.y, p.w, p.h);
    } else {
      ctx.fillStyle = '#4af';
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }

    // En el menú solo dibujamos jugador y balas (demo)
    if (viewState === 'menu') {
       bulletsRef.current.forEach((b) => {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(b.x, b.y, b.w, b.h);
       });
       return;
    }

    // Dibujar enemigos
    enemiesRef.current.forEach((e) => {
      if (!e.alive) return;
      if (enemyImgRef.current && enemyImgRef.current.complete) {
        ctx.drawImage(enemyImgRef.current, e.x, e.y, e.w, e.h);
      } else {
        ctx.fillStyle = '#f44';
        ctx.fillRect(e.x, e.y, e.w, e.h);
      }
    });

    // Dibujar JEFE
    if (bossActiveRef.current) {
      const boss = bossRef.current;
      // Dibujar imagen (usamos la misma del enemigo pero grande)
      if (enemyImgRef.current && enemyImgRef.current.complete) {
        ctx.drawImage(enemyImgRef.current, boss.x, boss.y, boss.w, boss.h);
      } else {
        ctx.fillStyle = '#f00';
        ctx.fillRect(boss.x, boss.y, boss.w, boss.h);
      }
      
      // Barra de vida del Jefe
      const hpPercent = boss.hp / boss.maxHp;
      ctx.fillStyle = '#500';
      ctx.fillRect(boss.x, boss.y - 15, boss.w, 10); // fondo rojo oscuro
      ctx.fillStyle = '#f00';
      ctx.fillRect(boss.x, boss.y - 15, boss.w * hpPercent, 10); // barra actual
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(boss.x, boss.y - 15, boss.w, 10); // borde
      
      // Balas del Jefe
      bossBulletsRef.current.forEach(b => {
         ctx.fillStyle = '#f80';
         ctx.fillRect(b.x, b.y, b.w, b.h);
      });
    }

    // Advertencia de JEFE
    if (warningRef.current) {
       const t = performance.now();
       if (Math.floor(t / 200) % 2 === 0) { // Parpadeo
          const warningText = intl.formatMessage({ id: 'games.galaxian.warning' });
          ctx.fillStyle = '#f00';
          ctx.font = 'bold 48px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(warningText, width / 2, height / 2 - 20);
          ctx.fillText(warningText, width / 2, height / 2 + 30);
          ctx.fillText(warningText, width / 2, height / 2 + 80);
          ctx.textAlign = 'left'; // restaurar
       }
    }

    // Dibujar Power-Ups
    powerUpsRef.current.forEach((p) => {
      ctx.save();
      if (p.type === 'triple') {
        ctx.fillStyle = '#0af'; // Azul cian
        ctx.shadowColor = '#0af';
        ctx.shadowBlur = 10;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('3', p.x + 6, p.y + 18);
      } else {
        ctx.fillStyle = '#f50'; // Naranja fuego
        ctx.shadowColor = '#f50';
        ctx.shadowBlur = 10;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('F', p.x + 6, p.y + 18);
      }
      ctx.restore();
    });

    // Dibujar balas
    bulletsRef.current.forEach((b) => {
      ctx.fillStyle = b.color || (b.from === 'player' ? '#0f0' : '#ff0');
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`${intl.formatMessage({ id: 'games.galaxian.level' })}: ${levelRef.current}`, 10, 18);
    ctx.fillText(`${intl.formatMessage({ id: 'games.galaxian.score' })}: ${scoreRef.current}`, 10, 36);
    ctx.fillText(`${intl.formatMessage({ id: 'games.galaxian.lives' })}: ${livesRef.current}`, 10, 54);

    if (gameOverRef.current) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff';
      ctx.font = '24px monospace';
      ctx.fillText(endMessageRef.current || intl.formatMessage({ id: 'games.galaxian.gameOver' }), width / 2 - 100, height / 2);
      ctx.font = '14px monospace';
      ctx.fillText(intl.formatMessage({ id: 'games.galaxian.gameOverInstructions' }), width / 2 - 140, height / 2 + 30);
    }
  }


  if (viewState === 'loading') {
    return (
      <div style={{ width, height, position: 'relative', overflow: 'hidden', background: '#000' }}>
         <img
           src="/loading_space.png"
           alt={intl.formatMessage({ id: 'games.galaxian.loading' })}
           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
         />
         <div style={{
            position: 'absolute', bottom: 20, width: '100%', textAlign: 'center',
            color: '#fff', fontSize: 18, fontFamily: 'monospace', textShadow: '0 0 4px #000'
         }}>
           {intl.formatMessage({ id: 'games.galaxian.loading' })}
         </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width, height }}>
      <GalaxianCanvas
        canvasRef={canvasRef}
        width={width}
        height={height}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      
      {viewState === 'menu' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)', pointerEvents: 'none' // dejar ver el canvas
        }}>
          {/* Título */}
          <h1
            className='z-10'
            style={{
            color: '#fff', fontSize: 48, fontFamily: 'monospace', marginBottom: 10,
            textShadow: '0 0 20px #0af, 0 0 10px #fff', letterSpacing: 6
          }}>
            {intl.formatMessage({ id: 'games.galaxian.title' })}
          </h1>
          <p style={{ color: '#4af', fontSize: 16, fontFamily: 'monospace', marginBottom: 60, textShadow: '0 0 5px #0af' }}>
             {intl.formatMessage({ id: 'games.galaxian.subtitle' })}
          </p>

          {/* Cuadro de estadísticas en la esquina */}
          <div style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(0, 10, 30, 0.9)', padding: '15px', borderRadius: 12,
            border: '2px solid #4af', textAlign: 'center', pointerEvents: 'auto',
            boxShadow: '0 0 15px rgba(0, 100, 255, 0.5)'
          }}>
            <div style={{ marginBottom: 10 }}>
              <p style={{ color: '#ccc', fontSize: 10, marginBottom: 1, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                {intl.formatMessage({ id: 'games.galaxian.maxLevel' })}
              </p>
              <p style={{ color: '#ffcc00', fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace', margin: 0 }}>
                {maxLevel}
              </p>
            </div>
            <div>
              <p style={{ color: '#ccc', fontSize: 10, marginBottom: 1, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                {intl.formatMessage({ id: 'games.galaxian.highScore' })}
              </p>
              <p style={{ color: '#0f0', fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace', margin: 0 }}>
                {maxScore}
              </p>
            </div>
          </div>

          <button
            onClick={startGame}
            className='mt-20'
            style={{
              pointerEvents: 'auto',
              background: 'linear-gradient(to bottom, #4af, #0077cc)',
              border: '2px solid #fff', borderRadius: 50,
              padding: '16px 60px', color: '#fff', fontSize: 24, fontWeight: 'bold',
              cursor: 'pointer', boxShadow: '0 0 20px #0077cc, inset 0 0 10px rgba(255,255,255,0.3)',
              fontFamily: 'monospace', textTransform: 'uppercase',
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {intl.formatMessage({ id: 'games.galaxian.play' })}
          </button>
        </div>
      )}

      {viewState === 'buy_plan' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)', pointerEvents: 'auto', zIndex: 50
        }}>
          <div style={{
            width: 80, height: 80, marginBottom: 20,
            border: '4px solid #f00', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px #f00'
          }}>
            <span style={{ color: '#f00', fontSize: 40, fontWeight: 'bold' }}>!</span>
          </div>
          <h2 style={{
            color: '#f00', fontSize: 28, fontFamily: 'monospace', marginBottom: 15,
            textAlign: 'center', textShadow: '0 0 10px #f00'
          }}>
            {intl.formatMessage({ id: 'games.galaxian.restrictedAccess.title' })}
          </h2>
          <p style={{
            color: '#e2e8f0', fontSize: 16, fontFamily: 'monospace', marginBottom: 30,
            textAlign: 'center', maxWidth: '80%', lineHeight: 1.6
          }}>
            {intl.formatMessage({ id: 'games.galaxian.restrictedAccess.message1' })}
            <br/>
            <span style={{ color: '#0af' }}>{intl.formatMessage({ id: 'games.galaxian.restrictedAccess.message2' })}</span>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '80%' }}>
            <button
              onClick={() => {
                // Intentar hacer scroll a los planes
                const plans = document.getElementById('galaxian-plans');
                if (plans) {
                  plans.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Fallback: scroll al fondo de la página
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
              }}
              style={{
                background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                border: 'none', borderRadius: 8,
                padding: '14px', color: '#fff', fontSize: 16, fontWeight: 'bold',
                cursor: 'pointer', boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
                fontFamily: 'monospace', textTransform: 'uppercase', width: '100%'
              }}
            >
              {intl.formatMessage({ id: 'games.galaxian.restrictedAccess.viewShips' })}
            </button>
            <button
               onClick={() => setViewState('menu')}
               style={{
                 background: 'transparent',
                 border: '1px solid #475569', borderRadius: 8,
                 padding: '12px', color: '#94a3b8', fontSize: 14,
                 cursor: 'pointer', fontFamily: 'monospace', width: '100%'
               }}
            >
              {intl.formatMessage({ id: 'games.galaxian.restrictedAccess.backToMenu' })}
            </button>
          </div>
        </div>
      )}

      {gameOverRef.current && (
         <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none'
         }}>
            <div style={{ marginTop: 80, pointerEvents: 'auto' }}>
                <button
                    onClick={() => startGame()}
                    style={{
                    background: '#f44',
                    border: 'none', borderRadius: 8,
                    padding: '10px 24px', color: '#fff', fontSize: 16, fontWeight: 'bold',
                    cursor: 'pointer', boxShadow: '0 0 10px #f00',
                    fontFamily: 'monospace'
                    }}
                >
                    {intl.formatMessage({ id: 'games.galaxian.restart' })}
                </button>
                <button
                    onClick={() => setViewState('menu')}
                    style={{
                    marginLeft: 10,
                    background: '#444',
                    border: 'none', borderRadius: 8,
                    padding: '10px 24px', color: '#fff', fontSize: 16, fontWeight: 'bold',
                    cursor: 'pointer', boxShadow: '0 0 10px #000',
                    fontFamily: 'monospace'
                    }}
                >
                    {intl.formatMessage({ id: 'games.galaxian.menu' })}
                </button>
            </div>
         </div>
      )}
    </div>
  );
}
