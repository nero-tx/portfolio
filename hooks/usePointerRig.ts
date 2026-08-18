"use client";

import { useEffect, useRef, RefObject } from "react";

export interface PointerRig {
  ndc: RefObject<{ x: number; y: number }>;
  isDragging: RefObject<boolean>;
  dragDelta: RefObject<{ x: number; y: number }>;
  dragVelocity: RefObject<number>;
}

export function usePointerRig(): PointerRig {
  const ndc = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragDelta = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef(0);

  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  useEffect(() => {
    const toNDC = (x: number, y: number) => ({
      x: (x / window.innerWidth) * 2 - 1,
      y: -(y / window.innerHeight) * 2 + 1,
    });

    const onPointerMove = (e: PointerEvent) => {
      const { x, y } = toNDC(e.clientX, e.clientY);
      ndc.current.x = x;
      ndc.current.y = y;

      if (isDragging.current) {
        const now = performance.now();
        const dt = Math.max(now - lastTime.current, 1);
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;

        dragDelta.current.x = dx;
        dragDelta.current.y = dy;

        const speed = Math.sqrt(dx * dx + dy * dy) / dt; // px/ms
        dragVelocity.current = dragVelocity.current * 0.8 + speed * 0.2;

        lastPos.current = { x: e.clientX, y: e.clientY };
        lastTime.current = now;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = performance.now();
    };

    const onPointerUp = () => {
      isDragging.current = false;
      dragDelta.current = { x: 0, y: 0 };
    };

    // passive:true is safe here — we never call preventDefault
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return { ndc, isDragging, dragDelta, dragVelocity };
}
