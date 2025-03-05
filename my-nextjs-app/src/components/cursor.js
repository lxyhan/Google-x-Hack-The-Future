'use client'

import { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Add cursor styles to body to hide default cursor
    document.body.style.cursor = 'none';
    
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onLinkHoverEvents = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])').forEach(el => {
        el.addEventListener('mouseenter', () => setLinkHovered(true));
        el.addEventListener('mouseleave', () => setLinkHovered(false));
      });
    };

    addEventListeners();
    onLinkHoverEvents();

    return () => {
      removeEventListeners();
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Dynamically calculate cursor styles
  const cursorOuterStyle = {
    position: 'fixed',
    width: clicked ? '30px' : linkHovered ? '40px' : '32px',
    height: clicked ? '30px' : linkHovered ? '40px' : '32px',
    borderRadius: '50%',
    border: `2px solid #16a34a`, // Green-600
    borderWidth: clicked ? '3px' : '2px',
    backgroundColor: linkHovered ? 'rgba(22, 163, 74, 0.2)' : 'transparent',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    transition: 'width 0.2s, height 0.2s, background-color 0.2s, border-width 0.2s, opacity 0.2s',
    zIndex: 9999,
    top: position.y,
    left: position.x,
    opacity: hidden ? 0 : 1,
  };

  const cursorInnerStyle = {
    position: 'fixed',
    width: clicked ? '8px' : '10px',
    height: clicked ? '8px' : '10px',
    borderRadius: '50%',
    backgroundColor: '#16a34a', // Green-600
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    transition: 'width 0.1s, height 0.1s, opacity 0.2s',
    zIndex: 9999,
    top: position.y,
    left: position.x,
    opacity: hidden ? 0 : linkHovered ? 0.8 : 1,
  };

  return (
    <>
      <div style={cursorOuterStyle} />
      <div style={cursorInnerStyle} />
    </>
  );
}