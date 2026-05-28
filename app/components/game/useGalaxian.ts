'use client';

import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

type Bullet = {
  x: number;
  y: number;
  w: number;
  h: number;
  dy: number;
  from: 'player' | 'enemy';
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

export function useGalaxian() {
  const [playerSpeed, setPlayerSpeed] = useState(4);
  const [enemyCount, setEnemyCount] = useState(24);
  const [enemySpeed, setEnemySpeed] = useState(1.5);

  const draggingRef = useRef<boolean>(false);

  // Mueve la nave bajo el dedo (usa propiedades w/h del jugador)
  const movePlayerTo = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    const player = playerRef.current;
    if (!canvas || !player) return;
  
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
  
    const halfW = player.w / 2;
    const clampedX = Math.max(0, Math.min(x - halfW, width - player.w));
    player.x = clampedX;
  }, []);
  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    movePlayerTo(e.clientX);
  }, [movePlayerTo]);

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    movePlayerTo(e.clientX);
  }, [movePlayerTo]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameOverRef = useRef(false);
  const endMessageRef = useRef('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const playerImgRef = useRef<HTMLImageElement | null>(null);
  const enemyImgRef = useRef<HTMLImageElement | null>(null);

  const playerRef = useRef({ x: 300, y: 520, w: 40, h: 40, cooldown: 0 });
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const lastEnemyShotRef = useRef<number>(0);

  const width = 340;
  const height = 560;

  useEffect(() => {
    const playerImg = new Image();
    playerImg.src = '/plans/avion_one.png';
    playerImgRef.current = playerImg;

    const enemyImg = new Image();
    enemyImg.src = '/plans/enemies.png';
    enemyImgRef.current = enemyImg;
  }, []);

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

  

  function resetGame(full = true) {
    if (full) {
      setScore(0);
      setLives(3);
      setGameOver(false);
      scoreRef.current = 0;
      livesRef.current = 3;
      gameOverRef.current = false;
      endMessageRef.current = '';
      playerRef.current = { x: width / 2 - 20, y: height - 40, w: 40, h: 40, cooldown: 0 };
      bulletsRef.current = [];
    }
    spawnEnemies(enemyCount);
  }

  function shoot(from: 'player' | 'enemy', x: number, y: number) {
    const speed = from === 'player' ? -6 : 3.6;
    bulletsRef.current.push({ x, y, w: 4, h: 10, dy: speed, from });
  }

  function rectsIntersect(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
    return (
      a.x <= b.x + b.w &&
      a.x + a.w >= b.x &&
      a.y <= b.y + b.h &&
      a.y + a.h >= b.y
    );
  }

  function update(dt: number) {
    if (gameOverRef.current) return;

    const player = playerRef.current;

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
    player.x = Math.max(0, Math.min(width - player.w, player.x));
    player.y = Math.max(height * 0.4, Math.min(height - player.h, player.y));

    player.cooldown = Math.max(0, player.cooldown - dt);
    if ((keysRef.current[' '] || keysRef.current['space']) && player.cooldown <= 0) {
      shoot('player', player.x + player.w / 2 - 2, player.y);
      player.cooldown = 200;
    }

    const time = performance.now() / 1000;
    enemiesRef.current.forEach((e) => {
      if (!e.alive) return;
      e.x = e.baseX + Math.sin(time * 2 + e.phase) * 20;
      e.y = e.baseY + Math.cos(time * 1.5 + e.phase) * 6 + time * (enemySpeed * 0.02);

      if (e.y + e.h >= height - 4) {
        e.alive = false;
        const nv = livesRef.current - 1;
        livesRef.current = nv;
        setLives(nv);
        if (nv <= 0) {
          gameOverRef.current = true;
          setGameOver(true);
          endMessageRef.current = 'Juego terminado';
        }
      }
    });

    const enemyShotInterval = 600;
    if (performance.now() - lastEnemyShotRef.current > enemyShotInterval) {
      const alive = enemiesRef.current.filter((e) => e.alive);
      if (alive.length > 0) {
        const shooter = alive[Math.floor(Math.random() * alive.length)];
        shoot('enemy', shooter.x + shooter.w / 2 - 2, shooter.y + shooter.h);
      }
      lastEnemyShotRef.current = performance.now();
    }

    bulletsRef.current.forEach((b) => {
      b.y += b.dy;
    });
    bulletsRef.current = bulletsRef.current.filter((b) => b.y > -20 && b.y < height + 20);

    for (const b of bulletsRef.current) {
      if (b.from === 'player') {
        for (const e of enemiesRef.current) {
          if (e.alive && rectsIntersect(b, e)) {
            e.alive = false;
            b.y = -9999;
            const newScore = scoreRef.current + 10;
            scoreRef.current = newScore;
            setScore(newScore);
            break;
          }
        }
      }
    }
    bulletsRef.current = bulletsRef.current.filter((b) => b.y !== -9999);

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
          endMessageRef.current = 'Juego terminado';
        }
      }
    }

    if (!enemiesRef.current.some((e) => e.alive)) {
      gameOverRef.current = true;
      setGameOver(true);
      endMessageRef.current = 'Juego terminado';
    }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#000015';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 80; i++) {
      const x = (i * 73 + Math.floor(performance.now() / 50)) % width;
      const y = (i * 29 + Math.floor(performance.now() / 70)) % height;
      ctx.fillStyle = i % 10 === 0 ? '#88f' : '#fff';
      ctx.fillRect(x, y, 2, 2);
    }

    const p = playerRef.current;
    if (playerImgRef.current && playerImgRef.current.complete) {
      ctx.drawImage(playerImgRef.current, p.x, p.y, p.w, p.h);
    } else {
      ctx.fillStyle = '#4af';
      ctx.fillRect(p.x, p.y, p.w, p.h);
    }

    enemiesRef.current.forEach((e) => {
      if (!e.alive) return;
      if (enemyImgRef.current && enemyImgRef.current.complete) {
        ctx.drawImage(enemyImgRef.current, e.x, e.y, e.w, e.h);
      } else {
        ctx.fillStyle = '#f44';
        ctx.fillRect(e.x, e.y, e.w, e.h);
      }
    });

    bulletsRef.current.forEach((b) => {
      ctx.fillStyle = b.from === 'player' ? '#0f0' : '#ff0';
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Puntuación: ${scoreRef.current}`, 10, 18);
    ctx.fillText(`Vidas: ${livesRef.current}`, 10, 36);
    ctx.fillText(`Enemigos: ${enemiesRef.current.filter((e) => e.alive).length}/${enemiesRef.current.length}`, 10, 54);

    if (gameOverRef.current) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff';
      ctx.font = '24px monospace';
      ctx.fillText(endMessageRef.current || 'Juego terminado', width / 2 - 100, height / 2);
      ctx.font = '14px monospace';
      ctx.fillText('Pulsa "Reiniciar" para jugar otra vez', width / 2 - 130, height / 2 + 24);
    }
  }

  useEffect(() => {
    resetGame(false);

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
  }, [playerSpeed, enemySpeed, enemyCount]);

  return {
    canvasRef,
    width,
    height,
    score,
    lives,
    gameOver,
    endMessage: endMessageRef.current,
    playerSpeed,
    setPlayerSpeed,
    enemySpeed,
    setEnemySpeed,
    enemyCount,
    setEnemyCount,
    resetGame,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}