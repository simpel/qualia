'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const educationEmojis = [
  { emoji: '🎓', color: 'bg-slate-300/75' },
  { emoji: '📚', color: 'bg-gray-300/75' },
  { emoji: '🏫', color: 'bg-zinc-300/75' },
  { emoji: '🎒', color: 'bg-neutral-300/75' },
  { emoji: '📖', color: 'bg-violet-300/75' },
  { emoji: '🧠', color: 'bg-purple-300/75' },
  { emoji: '📐', color: 'bg-fuchsia-300/75' },
  { emoji: '📏', color: 'bg-pink-300/75' },
];

const getRandomVelocity = () => Math.random() * 600 + 300;
const generateRandomStartDistance = (height: number) =>
  (Math.random() * height) / 2; // Random start distance relative to viewport height
const generateRandomEndDistance = (startPosition: number) =>
  Math.random() * 2000 + 600 + startPosition; // Random end distance

const EmojiAnimation = () => {
  const [dimensions, setDimensions] = useState({
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
    maxViewportDimension: Math.max(window.innerWidth, window.innerHeight),
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        centerX: window.innerWidth / 2,
        centerY: window.innerHeight / 2,
        maxViewportDimension: Math.max(window.innerWidth, window.innerHeight),
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const numEmojis = educationEmojis.length;
  const angleStep = (2 * Math.PI) / numEmojis; // Divide 360 degrees by the number of emojis

  const getAnimationProps = (index: number) => {
    const angle = angleStep * index;
    const start = generateRandomStartDistance(dimensions.maxViewportDimension);
    const end = generateRandomEndDistance(start);
    const velocity = getRandomVelocity();

    return {
      startX: Math.cos(angle) * start,
      endX: Math.cos(angle) * end,
      startY: Math.sin(angle) * start,
      endY: Math.sin(angle) * end,
      velocity,
    };
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      {educationEmojis.map((item, index) => {
        const { emoji, color } = item;
        const { startX, startY, endX, endY, velocity } =
          getAnimationProps(index);

        return (
          <motion.div
            key={index}
            className={`absolute ${color} flex h-44 w-44 items-center justify-center rounded-full text-7xl backdrop-blur-xl `}
            initial={{ x: startX, y: startY }}
            animate={{
              x: endX,
              y: endY,
            }}
            transition={{
              duration: velocity,
              ease: 'easeOut',

              repeat: Infinity,
              repeatType: 'loop',
            }}
            style={{
              top: dimensions.centerY,
              left: dimensions.centerX,
              transformOrigin: 'center',
            }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
};

export default EmojiAnimation;
