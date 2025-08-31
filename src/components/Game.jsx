// src/components/Game.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Dinosaur from './Dino.jsx';
import Obstacle from './Obstacle.jsx';

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const DINO_WIDTH = 64;
const DINO_HEIGHT = 64;
const OBSTACLE_WIDTH = 32;
const OBSTACLE_HEIGHT = 64;
const GROUND_Y = GAME_HEIGHT - DINO_HEIGHT;
const GRAVITY = 0.65;
const JUMP_FORCE = -12;
const INITIAL_GAME_SPEED = 5;
const SPEED_INCREASE_INTERVAL = 500; // Increase speed every 500 score

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

  // Load high score from local storage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('dinoHighScore');
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
    // Initial obstacle
    setObstacles([{ x: GAME_WIDTH, id: Date.now() }]);
  }, []);

  const handleJump = useCallback((e) => {
    if ((e.code === 'Space' || e.type === 'mousedown') && dinoY === GROUND_Y) {
      setDinoVelocityY(JUMP_FORCE);
    }
  }, [dinoY]);

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

        // Add a new obstacle when the last one is far enough
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
            localStorage.setItem('dinoHighScore', score.toString());
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 font-mono">
      <h1 className="text-4xl font-bold mb-4">React Dino Game</h1>
      <div 
        ref={gameAreaRef}
        className="relative border-2 border-black bg-white" 
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, overflow: 'hidden' }}
      >
        {/* Game Over / Start Screen */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 bg-gray-800 bg-opacity-50">
            {isGameOver && <p className="text-4xl font-bold text-white mb-4">Game Over</p>}
            <p className="text-white text-lg mb-2">Your Score: {Math.floor(score / 10)}</p>
            <p className="text-white text-lg mb-4">High Score: {Math.floor(highScore / 10)}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition"
            >
              {isGameOver ? "Restart" : "Start Game"}
            </button>
             <p className="text-white text-sm mt-4">Press Space or Click to Jump</p>
          </div>
        )}

        {/* Ground */}
        <div 
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: 'repeating-linear-gradient(90deg, #333, #333 10px, transparent 10px, transparent 20px)'}}
        />

        {/* The Game Elements */}
        {isPlaying && (
          <>
            <Dinosaur ref={dinoRef} style={{ bottom: `${GROUND_Y - dinoY}px`, left: '50px' }} />
            {obstacles.map(obs => (
              <Obstacle key={obs.id} style={{ left: `${obs.x}px`, bottom: 0 }} />
            ))}
            <div className="absolute top-2 right-2 text-lg font-bold text-gray-700">
              Score: {Math.floor(score / 10)}
            </div>
            <div className="absolute top-2 left-2 text-lg font-bold text-gray-700">
              HI: {Math.floor(highScore / 10)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;