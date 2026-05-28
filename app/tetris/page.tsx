"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

type Cell = number; // 0 empty, >0 color id

const COLS = 10;
const ROWS = 20;

const COLORS: Record<number, string> = {
  1: "#00FFFF", // I - cyan
  2: "#FFFF00", // O - yellow
  3: "#800080", // T - purple
  4: "#00FF00", // S - green
  5: "#FF0000", // Z - red
  6: "#0000FF", // J - blue
  7: "#FFA500", // L - orange
};

const TETROMINOES: Array<{ id: number; shape: number[][] }> = [
  { id: 1, shape: [[1, 1, 1, 1]] }, // I
  { id: 2, shape: [[2, 2], [2, 2]] }, // O
  { id: 3, shape: [[0, 3, 0], [3, 3, 3]] }, // T
  { id: 4, shape: [[0, 4, 4], [4, 4, 0]] }, // S
  { id: 5, shape: [[5, 5, 0], [0, 5, 5]] }, // Z
  { id: 6, shape: [[6, 0, 0], [6, 6, 6]] }, // J
  { id: 7, shape: [[0, 0, 7], [7, 7, 7]] }, // L
];

function rotate(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const res: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      res[x][rows - 1 - y] = matrix[y][x];
    }
  }
  return res;
}

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

interface Piece {
  id: number;
  shape: number[][];
  x: number;
  y: number;
}

function randomPiece(): Piece {
  const t = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  const w = t.shape[0].length;
  return {
    id: t.id,
    shape: t.shape.map(row => [...row]),
    x: Math.floor((COLS - w) / 2),
    y: 0,
  };
}

function canPlace(board: Cell[][], piece: Piece, nx: number, ny: number, shape: number[][] = piece.shape): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[0].length; x++) {
      const val = shape[y][x];
      if (!val) continue;
      const bx = nx + x;
      const by = ny + y;
      if (bx < 0 || bx >= COLS || by < 0 || by >= ROWS) return false;
      if (board[by][bx] !== 0) return false;
    }
  }
  return true;
}

function mergeBoard(board: Cell[][], piece: Piece): Cell[][] {
  const newBoard = board.map(row => [...row]);
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[0].length; x++) {
      const val = piece.shape[y][x];
      if (val) {
        const bx = piece.x + x;
        const by = piece.y + y;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          newBoard[by][bx] = val;
        }
      }
    }
  }
  return newBoard;
}

function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const newBoard: Cell[][] = [];
  let cleared = 0;
  for (let y = 0; y < ROWS; y++) {
    if (board[y].every(cell => cell !== 0)) {
      cleared++;
    } else {
      newBoard.push(board[y]);
    }
  }
  while (newBoard.length < ROWS) {
    newBoard.unshift(Array(COLS).fill(0));
  }
  return { board: newBoard, cleared };
}

export default function TetrisPage() {
  const intl = useIntl();
  const [board, setBoard] = useState<Cell[][]>(emptyBoard());
  const [piece, setPiece] = useState<Piece>(randomPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [awardedLevels, setAwardedLevels] = useState<number[]>([]);
  const [canPlayAfterLevel10, setCanPlayAfterLevel10] = useState<boolean>(true);
  const [checkingGate, setCheckingGate] = useState<boolean>(true);
  const prevLevelRef = useRef<number>(1);

  const dropInterval = useMemo(() => Math.max(150, 1000 - (level - 1) * 80), [level]);
  const dropTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const lockPiece = useCallback(() => {
    const merged = mergeBoard(board, piece);
    const { board: clearedBoard, cleared } = clearLines(merged);
    if (cleared > 0) {
  // Puntaje fijo: 100 por línea limpiada, sin multiplicar por nivel
  setScore(prev => prev + cleared * 100);
      setLines(prev => prev + cleared);
    }
    const next = randomPiece();
    if (!canPlace(clearedBoard, next, next.x, next.y)) {
      setBoard(clearedBoard);
      setGameOver(true);
    } else {
      setBoard(clearedBoard);
      setPiece(next);
    }
  }, [board, piece, level]);

  const move = useCallback((dx: number, dy: number) => {
    if (paused || gameOver) return;
    const nx = piece.x + dx;
    const ny = piece.y + dy;
    if (canPlace(board, piece, nx, ny)) {
      setPiece(p => ({ ...p, x: nx, y: ny }));
    } else if (dy > 0) {
      lockPiece();
    }
  }, [board, piece, paused, gameOver, lockPiece]);

  const rotatePiece = useCallback(() => {
    if (paused || gameOver) return;
    const rotated = rotate(piece.shape);
    if (canPlace(board, piece, piece.x, piece.y, rotated)) {
      setPiece(p => ({ ...p, shape: rotated }));
    } else if (canPlace(board, piece, piece.x - 1, piece.y, rotated)) {
      setPiece(p => ({ ...p, x: p.x - 1, shape: rotated }));
    } else if (canPlace(board, piece, piece.x + 1, piece.y, rotated)) {
      setPiece(p => ({ ...p, x: p.x + 1, shape: rotated }));
    }
  }, [board, piece, paused, gameOver]);

  const hardDrop = useCallback(() => {
    if (paused || gameOver) return;
    let ny = piece.y;
    while (canPlace(board, piece, piece.x, ny + 1)) {
      ny++;
    }
    setPiece(p => ({ ...p, y: ny }));
    lockPiece();
  }, [board, piece, paused, gameOver, lockPiece]);

  useEffect(() => {
    if (paused || gameOver) return;
    if (dropTimer.current) clearInterval(dropTimer.current);
    dropTimer.current = setInterval(() => {
      setPiece(p => {
        const ny = p.y + 1;
        if (canPlace(board, p, p.x, ny)) {
          return { ...p, y: ny };
        } else {
          // lock
          lockPiece();
          return p;
        }
      });
    }, dropInterval);
    return () => {
      if (dropTimer.current) clearInterval(dropTimer.current);
    };
  }, [dropInterval, paused, gameOver, board, lockPiece]);
  useEffect(() => {
    // Progresión: cada nivel requiere 2000 puntos acumulados
    const computeLevelFromScore = (s: number): number => {
      const lvl = 1 + Math.floor(s / 2000);
      return Math.min(10, Math.max(1, lvl));
    };

    const newLevel = computeLevelFromScore(score);

    if (newLevel > level) {
      setLevel(newLevel);
    }

    // Recompensa una vez por nivel
    if (newLevel > prevLevelRef.current) {
      prevLevelRef.current = newLevel;
      if (!awardedLevels.includes(newLevel)) {
        fetch("/api/tetris", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level: newLevel, score }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.awarded) {
              setAwardedLevels(prev => [...prev, newLevel]);
            }
          })
          .catch(() => {});
      }
    }

    // Gate en nivel 10: requiere nuevo referido inversionista para seguir
    if (newLevel >= 10 && !canPlayAfterLevel10) {
      setPaused(true);
      setGameOver(false);
    }
  }, [score]);

  // Initial load: fetch awarded levels and gate status
  useEffect(() => {
    setCheckingGate(true);
    fetch("/api/tetris")
      .then(res => res.json())
      .then(data => {
        if (data?.awardedLevels) setAwardedLevels(data.awardedLevels);
        if (typeof data?.canPlayAfterLevel10 === "boolean") setCanPlayAfterLevel10(data.canPlayAfterLevel10);
        // Set starting level to last awarded level if exists
        const levels = Array.isArray(data?.awardedLevels) ? data.awardedLevels : [];
        if (levels.length > 0) {
          const lastLevel = Math.max(...levels);
          setLevel(lastLevel);
          // Inicializa el score acumulado al umbral del nivel cargado
          setScore((lastLevel - 1) * 2000);
          prevLevelRef.current = lastLevel;
          // If gate applies and last level is >=10, ensure paused state
          if (lastLevel >= 10 && data?.canPlayAfterLevel10 === false) {
            setPaused(true);
          }
        }
      })
      .finally(() => setCheckingGate(false));
  }, []);

  const recheckGate = useCallback(() => {
    setCheckingGate(true);
    fetch("/api/tetris")
      .then(res => res.json())
      .then(data => {
        if (typeof data?.canPlayAfterLevel10 === "boolean") setCanPlayAfterLevel10(data.canPlayAfterLevel10);
        if (data?.awardedLevels) setAwardedLevels(data.awardedLevels);
        if (level >= 10 && data?.canPlayAfterLevel10) {
          setPaused(false);
        }
      })
      .finally(() => setCheckingGate(false));
  }, [level]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          move(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          move(1, 0);
          break;
        case "ArrowDown":
          e.preventDefault();
          move(0, 1);
          break;
        case "ArrowUp":
        case "x":
          e.preventDefault();
          rotatePiece();
          break;
        case " ": // space
        case "z":
          e.preventDefault();
          hardDrop();
          break;
        case "p":
          // At level >=10, pause toggle only if allowed
          if (level >= 10 && !canPlayAfterLevel10) return;
          setPaused(prev => !prev);
          break;
        case "r":
          reset();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, rotatePiece, hardDrop]);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    const np = randomPiece();
    setPiece(np);
    setLines(0);
    setPaused(false);
    setGameOver(false);
  }, []);

  // Render board cells, combining locked board and current piece
  const renderCells = useMemo(() => {
    const temp = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[0].length; x++) {
        const val = piece.shape[y][x];
        if (!val) continue;
        const bx = piece.x + x;
        const by = piece.y + y;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          temp[by][bx] = val;
        }
      }
    }
    return temp;
  }, [board, piece]);

  // Touch controls helpers
  const touchLeftRef = useRef<NodeJS.Timeout | null>(null);
  const touchRightRef = useRef<NodeJS.Timeout | null>(null);
  const touchDownRef = useRef<NodeJS.Timeout | null>(null);

  const startRepeat = (fn: () => void, ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
    fn();
    ref.current = setInterval(fn, 100);
  };
  const stopRepeat = (ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (ref.current) clearInterval(ref.current);
    ref.current = null;
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-[900px] w-full grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest mb-2">{intl.formatMessage({ id: 'games.tetris.title' })}</h1>
          <div className="flex gap-4 text-sm mb-2">
            <div className="px-3 py-2 rounded bg-gray-800/60 border border-gray-700">{intl.formatMessage({ id: 'games.tetris.score' })}: {score}</div>
            <div className="px-3 py-2 rounded bg-gray-800/60 border border-gray-700">{intl.formatMessage({ id: 'games.tetris.lines' })}: {lines}</div>
            <div className="px-3 py-2 rounded bg-gray-800/60 border border-gray-700">{intl.formatMessage({ id: 'games.tetris.level' })}: {level}</div>
          </div>
          <div
            className="relative"
            style={{
              width: COLS * 24,
              height: ROWS * 24,
              boxShadow: "0 0 20px rgba(0,255,255,0.25)",
            }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 24px)`,
                gridTemplateRows: `repeat(${ROWS}, 24px)`,
                gap: 1,
                background: "#0b0b0b",
                border: "1px solid #1f2937",
              }}
            >
              {renderCells.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    style={{
                      width: 24,
                      height: 24,
                      background: cell ? COLORS[cell] : "#111827",
                      borderRadius: 3,
                      boxShadow: cell ? "inset 0 -2px 0 rgba(0,0,0,0.3)" : "none",
                    }}
                  />
                ))
              )}
            </div>
            {(gameOver || (level >= 10 && !canPlayAfterLevel10)) && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center">
                  {gameOver ? (
                    <>
                      <div className="text-xl font-bold mb-2">{intl.formatMessage({ id: 'games.tetris.gameOver' })}</div>
                      <button
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded"
                        onClick={reset}
                      >
                        {intl.formatMessage({ id: 'games.tetris.restart' })}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-semibold mb-3">{intl.formatMessage({ id: 'games.tetris.level10.title' })}</div>
                      <p className="mb-4 text-gray-200">
                        {intl.formatMessage({ id: 'games.tetris.level10.message' })}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded"
                          onClick={recheckGate}
                          disabled={checkingGate}
                        >
                          {checkingGate ? intl.formatMessage({ id: 'games.tetris.level10.checking' }) : intl.formatMessage({ id: 'games.tetris.level10.checkNow' })}
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded"
                          onClick={reset}
                        >
                          {intl.formatMessage({ id: 'games.tetris.level10.restartGame' })}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button className="px-3 py-2 bg-gray-800 rounded border border-gray-700" onClick={() => { if (level >= 10 && !canPlayAfterLevel10) return; setPaused(p => !p); }}>
              {paused ? intl.formatMessage({ id: 'games.tetris.continueWithKey' }) : intl.formatMessage({ id: 'games.tetris.pauseWithKey' })}
            </button>
            <button className="px-3 py-2 bg-gray-800 rounded border border-gray-700" onClick={reset}>
              {intl.formatMessage({ id: 'games.tetris.restartWithKey' })}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div className="fixed md:hidden bottom-4 left-0 right-0 px-6 flex items-center justify-between select-none">
        <div className="flex gap-3">
          <button
            className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 active:bg-gray-700"
            onTouchStart={() => startRepeat(() => move(-1, 0), touchLeftRef)}
            onTouchEnd={() => stopRepeat(touchLeftRef)}
          >
            ←
          </button>
          <button
            className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 active:bg-gray-700"
            onTouchStart={() => startRepeat(() => move(1, 0), touchRightRef)}
            onTouchEnd={() => stopRepeat(touchRightRef)}
          >
            →
          </button>
        </div>
        <div className="flex gap-3">
          <button
            className="w-14 h-14 rounded-full bg-cyan-700 border border-cyan-500 active:bg-cyan-600"
            onTouchStart={rotatePiece}
          >
            ↻
          </button>
          <button
            className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 active:bg-gray-700"
            onTouchStart={() => startRepeat(() => move(0, 1), touchDownRef)}
            onTouchEnd={() => stopRepeat(touchDownRef)}
          >
            ↓
          </button>
          {/* <button
            className="w-20 h-14 rounded bg-emerald-700 border border-emerald-500 active:bg-emerald-600"
            onTouchStart={hardDrop}
          >
            DROP
          </button> */}
        </div>
      </div>
    </div>
  );
}

