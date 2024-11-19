import React, { useState, useCallback, useEffect } from "react";
import { VscEllipsis } from "react-icons/vsc";
import { Resizable } from "re-resizable";
import FolderTree from "./FolderTree";
import css from "../../styles/Layout.module.css";

const START_WIDTH = 170;
const MIN_WIDTH = 170;
const HOVER_EDGE_AREA = 6.1;
const HOVER_DELAY = 300;

const Sidebar = () => {
  const [isHover, setIsHover] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(START_WIDTH);
  const [timer, setTimer] = useState(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const updateMaxWidth = () => setMaxWidth(window.innerWidth * 0.86);

    updateMaxWidth();
    window.addEventListener("resize", updateMaxWidth);
    return () => window.removeEventListener("resize", updateMaxWidth);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isResizing) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const isNearRightEdge =
        Math.abs(e.clientX - rect.right) < HOVER_EDGE_AREA;

      if (isNearRightEdge) {
        if (!timer) {
          const newTimer = setTimeout(() => setIsHover(true), HOVER_DELAY);
          setTimer(newTimer);
        }
      } else {
        clearTimeout(timer);
        setTimer(null);
        setIsHover(false);
      }
    },
    [timer, isResizing]
  );

  const handleMouseLeave = useCallback(() => {
    if (isResizing) return;
    clearTimeout(timer);
    setTimer(null);
    setIsHover(false);
  }, [isResizing, timer]);

  const handleResize = () => setIsHover(true);

  const handleResizeStart = () => {
    setIsResizing(true);
    setIsHover(true);
  };

  const handleResizeStop = (e, delta, node) => {
    const rect = node.getBoundingClientRect();
    const isNearRightEdge = Math.abs(e.clientX - rect.right) < HOVER_EDGE_AREA;

    setResizeWidth((prev) => prev + delta.width);
    setIsResizing(false);
    if (!isNearRightEdge) setIsHover(false);
  };

  return (
    <Resizable
      size={{ width: resizeWidth, height: "100%" }}
      minWidth={MIN_WIDTH}
      maxWidth={maxWidth}
      enable={{ right: true }}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      className={css.sidebar}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      handleStyles={{ right: { cursor: "ew-resize" } }}
    >
      <div className={css.ResizableWrap}>
        <div className={css["sidebar-title"]}>
          <span className={css["sidebar-title-txt"]}>탐색기</span>
          <div className={`${css["icon-bg"]} ${css.ellipsis}`}>
            <VscEllipsis />
          </div>
        </div>
        <div className={css["sidebar-content"]}>
          <FolderTree />
        </div>
      </div>

      <div
        className={css.resizeBar}
        style={isHover ? { backgroundColor: "#0078d4" } : {}}
      />
    </Resizable>
  );
};

export default Sidebar;
