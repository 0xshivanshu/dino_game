// src/components/Game.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Dinosaur from './Dinosaur.jsx';
import Obstacle from './Obstacle.jsx';

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const DINO_WIDTH = 64;
const DINO_HEIGHT = 64;
const OBSTACLE_WIDTH = 32;
const OBSTACLE_HEIGHT = 64;
const GROUND_Y = GAME_HEIGHT - DINO_HEIGHT;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const GRAVITY = 0.65;
const JUMP_FORCE = -12;
const INITIAL_GAME_SPEED = 5;
const SPEED_INCREASE_INTERVAL = 500;

const Game = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_GAME_SPEED);

  const [dinoY, setDinoY] = useState(GROUND_Y);
  const [dinoVelocityY, setDinoVelocityY] = useState(0);
  
  const [obstacles, setObstacles] = useState([]);

  const gameLoopRef = useRef();
  const dinoRef = useRef();
  const gameAreaRef = useRef();

  // Load high score from session storage
  useEffect(() => {
    const savedHighScore = sessionStorage.getItem('dinoHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const resetGame = useCallback(() => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setDinoY(GROUND_Y);
    setDinoVelocityY(0);
    setGameSpeed(INITIAL_GAME_SPEED);
    setObstacles([{ x: GAME_WIDTH, id: Date.now() }]);
  }, []);

  const handleJump = useCallback((e) => {
    if ((e.code === 'Space' || e.type === 'mousedown') && dinoY === GROUND_Y && isPlaying && !isGameOver) {
      setDinoVelocityY(JUMP_FORCE);
    }
  }, [dinoY, isPlaying, isGameOver]);

  // Game Loop
  useEffect(() => {
    const gameLoop = () => {
      if (!isPlaying || isGameOver) {
        cancelAnimationFrame(gameLoopRef.current);
        return;
      }

      // Dinosaur physics
      setDinoVelocityY(prev => {
        const newVelocity = prev + GRAVITY;
        setDinoY(y => Math.min(y + newVelocity, GROUND_Y));
        return newVelocity;
      });

      // Move and manage obstacles
      setObstacles(prevObstacles => {
        const newObstacles = prevObstacles
          .map(obs => ({ ...obs, x: obs.x - gameSpeed }))
          .filter(obs => obs.x > -OBSTACLE_WIDTH);

        const lastObstacle = newObstacles[newObstacles.length - 1];
        if (newObstacles.length < 3 && lastObstacle && lastObstacle.x < GAME_WIDTH - 200 - Math.random() * 200) {
          newObstacles.push({ x: GAME_WIDTH, id: Date.now() });
        }
        return newObstacles;
      });

      // Update score and speed
      setScore(s => s + 1);
      if (score > 0 && score % SPEED_INCREASE_INTERVAL === 0) {
        setGameSpeed(gs => gs + 0.5);
      }

      // Collision detection
      const dinoRect = { x: 50, y: dinoY, width: DINO_WIDTH, height: DINO_HEIGHT };
      for (const obstacle of obstacles) {
        const obstacleRect = { x: obstacle.x, y: GROUND_Y, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT };
        if (
          dinoRect.x < obstacleRect.x + obstacleRect.width &&
          dinoRect.x + dinoRect.width > obstacleRect.x &&
          dinoRect.y < obstacleRect.y + obstacleRect.height &&
          dinoRect.y + dinoRect.height > obstacleRect.y
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            sessionStorage.setItem('dinoHighScore', score.toString());
          }
          break;
        }
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (isPlaying && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, isGameOver, gameSpeed, score, highScore, obstacles, dinoY]);

  // Event Listeners
  useEffect(() => {
    document.addEventListener('keydown', handleJump);
    gameAreaRef.current?.addEventListener('mousedown', handleJump);
    
    return () => {
      document.removeEventListener('keydown', handleJump);
      gameAreaRef.current?.removeEventListener('mousedown', handleJump);
    };
  }, [handleJump]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 font-mono">
      <style>{`
        @keyframes ground-move {
          from { background-position: 0 0; }
          to { background-position: -40px 0; }
        }
        @keyframes cloud-float {
          from { transform: translateX(0); }
          to { transform: translateX(-100vw); }
        }
      `}</style>

      <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">🦖 Dino Runner</h1>
      
      <div
        ref={gameAreaRef}
        className="relative rounded-xl shadow-2xl overflow-hidden border-4 border-white"
        style={{ 
          width: GAME_WIDTH, 
          height: GAME_HEIGHT,
          background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 40%, #cbd5e1 100%)'
        }}
      >
        {/* Sun */}
        <div className="absolute top-8 right-12 w-12 h-12 bg-yellow-400 rounded-full opacity-60" />

        {/* Simple clouds */}
        <div className="absolute top-12 left-20 w-20 h-8 bg-white rounded-full opacity-50" />
        <div className="absolute top-20 left-60 w-24 h-10 bg-white rounded-full opacity-50" />
        <div className="absolute top-16 right-32 w-20 h-8 bg-white rounded-full opacity-50" />

        {/* Ground */}
        <div 
          className="absolute bottom-0 left-0 w-[200%] h-16 bg-green-600"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #16a34a 0 20px, #15803d 20px 40px)',
            animation: 'ground-move 1s linear infinite',
          }}
        />

        {/* Game Over / Start Screen */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
            {isGameOver && <p className="text-5xl font-bold text-white mb-4">Game Over!</p>}
            <div className="bg-white rounded-lg p-6 mb-4">
              <p className="text-gray-800 text-xl mb-2">Score: <span className="font-bold text-green-600">{Math.floor(score / 10)}</span></p>
              <p className="text-gray-800 text-xl">High Score: <span className="font-bold text-purple-600">{Math.floor(highScore / 10)}</span></p>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-green-500 text-white text-xl font-bold rounded-lg hover:bg-green-600 transition shadow-lg"
            >
              {isGameOver ? "Play Again" : "Start Game"}
            </button>
            <p className="text-white text-sm mt-4">Press Space or Click to Jump</p>
          </div>
        )}

        {/* The Game Elements */}
        {isPlaying && (
          <>
            <Dinosaur ref={dinoRef} style={{ bottom: `${GROUND_Y - dinoY + 16}px`, left: '50px' }} />
            {obstacles.map(obs => (
              <Obstacle key={obs.id} style={{ left: `${obs.x}px`, bottom: '16px' }} />
            ))}
            <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-gray-800 text-lg font-bold">Score: {Math.floor(score / 10)}</span>
            </div>
            <div className="absolute top-4 left-4 bg-purple-500 px-4 py-2 rounded-lg shadow">
              <span className="text-white text-lg font-bold">Best: {Math.floor(highScore / 10)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;