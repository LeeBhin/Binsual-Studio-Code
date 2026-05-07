import { useEffect, useRef, useState } from "react";

const DIVIDER_COLOR = "color-mix(in srgb, var(--border) 94%, white)";
const ACCENT_THICKNESS = 4;

const ResizeHandle = ({
  direction = "vertical",
  hoverArea = 3.5,
  hoverDelay = 280,
  divider = true,
  enabled = true,
  onResize,
  onResizeStart,
  onResizeStop,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef(null);
  const lastPos = useRef(0);
  const isHorizontal = direction === "horizontal";

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleMouseEnter = () => {
    if (isDragging || timerRef.current) return;
    timerRef.current = setTimeout(() => {
      setIsHover(true);
      timerRef.current = null;
    }, hoverDelay);
  };

  const handleMouseLeave = () => {
    if (isDragging) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHover(false);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsHover(true);
    lastPos.current = isHorizontal ? e.clientX : e.clientY;
    onResizeStart?.(e);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const current = isHorizontal ? e.clientX : e.clientY;
      const delta = current - lastPos.current;
      lastPos.current = current;
      onResize?.(delta, e);
    };
    const handleMouseUp = (e) => {
      setIsDragging(false);
      setIsHover(false);
      onResizeStop?.(e);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = isHorizontal ? "ew-resize" : "ns-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
    };
  }, [isDragging, isHorizontal, onResize, onResizeStop]);

  const containerStyle = {
    flexShrink: 0,
    position: "relative",
    backgroundColor: divider ? DIVIDER_COLOR : "transparent",
    ...(isHorizontal
      ? { width: 1, height: "100%" }
      : { height: 1, width: "100%" }),
  };

  if (!enabled) {
    return <div style={containerStyle} />;
  }

  const hitStyle = {
    position: "absolute",
    cursor: isHorizontal ? "ew-resize" : "ns-resize",
    zIndex: 1,
    ...(isHorizontal
      ? { top: 0, bottom: 0, left: -hoverArea, right: -hoverArea }
      : { left: 0, right: 0, top: -hoverArea, bottom: -hoverArea }),
  };

  const accentStyle = {
    position: "absolute",
    backgroundColor: "var(--accent)",
    pointerEvents: "none",
    ...(isHorizontal
      ? {
          top: 0,
          bottom: 0,
          left: "50%",
          width: ACCENT_THICKNESS,
          transform: "translateX(-50%)",
        }
      : {
          left: 0,
          right: 0,
          top: "50%",
          height: ACCENT_THICKNESS,
          transform: "translateY(-50%)",
        }),
  };

  return (
    <div style={containerStyle}>
      <div
        style={hitStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
      >
        {(isHover || isDragging) && <div style={accentStyle} />}
      </div>
    </div>
  );
};

export default ResizeHandle;
