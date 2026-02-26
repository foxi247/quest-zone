import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'target' | 'flashlight'>('default');
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="target"]')) {
        setCursorVariant('target');
        setIsHovering(true);
      } else if (target.closest('[data-cursor="flashlight"]')) {
        setCursorVariant('flashlight');
        setIsHovering(true);
      } else if (target.closest('a, button, [role="button"]')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor], a, button, [role="button"]')) {
        setCursorVariant('default');
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  const variants = {
    default: {
      width: 20,
      height: 20,
      backgroundColor: 'rgba(0, 212, 255, 0.3)',
      border: '1px solid rgba(0, 212, 255, 0.5)',
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
    },
    hover: {
      width: 50,
      height: 50,
      backgroundColor: 'rgba(0, 212, 255, 0.1)',
      border: '1px solid rgba(0, 212, 255, 0.8)',
      boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
    },
    target: {
      width: 60,
      height: 60,
      backgroundColor: 'transparent',
      border: '2px solid rgba(220, 38, 38, 0.8)',
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.5), inset 0 0 20px rgba(220, 38, 38, 0.2)',
    },
    flashlight: {
      width: 120,
      height: 120,
      backgroundColor: 'rgba(255, 255, 200, 0.1)',
      border: '1px solid rgba(255, 255, 200, 0.3)',
      boxShadow: '0 0 60px rgba(255, 255, 200, 0.2), inset 0 0 40px rgba(255, 255, 200, 0.1)',
    },
    clicking: {
      scale: 0.8,
    },
  };

  // Flash effect on click
  const flashVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 2, 
      opacity: [0, 0.5, 0],
      transition: { duration: 0.3 }
    },
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-screen hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={[
          isClicking ? 'clicking' : isHovering ? cursorVariant : 'default',
        ]}
        variants={variants}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      />
      
      {/* Click flash effect */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9998] hidden md:block"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
          variants={flashVariants}
          initial="initial"
          animate="animate"
        />
      )}

      {/* Target crosshair for target variant */}
      {cursorVariant === 'target' && isHovering && (
        <>
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: '-50%',
              translateY: '-50%',
            }}
          >
            <div className="w-[60px] h-[2px] bg-red-500/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="w-[2px] h-[60px] bg-red-500/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        </>
      )}
    </>
  );
}
