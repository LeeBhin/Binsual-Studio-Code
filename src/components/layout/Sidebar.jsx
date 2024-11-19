import React, { useState, useCallback, useEffect } from "react";
import { VscEllipsis } from "react-icons/vsc";
import { Resizable } from "re-resizable";
import FolderTree from "./FolderTree";
import css from "../../styles/Layout.module.css";

const START_WIDTH = 170;
const MIN_WIDTH = 170;
const HOVER_EDGE_AREA = 6.1;
const HOVER_DELAY = 300;
const CLOSE_RANGE = 85;
const OPEN_RANGE = 90;

const Sidebar = () => {
  const [isHover, setIsHover] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(START_WIDTH);
  const [timer, setTimer] = useState(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const updateMaxWidth = () => setMaxWidth(window.innerWidth * 0.86);
    updateMaxWidth();
    window.addEventListener("resize", updateMaxWidth);
    return () => window.removeEventListener("resize", updateMaxWidth);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();

      if (isResizing) {
        if (!isCollapsed && resizeWidth === MIN_WIDTH) {
          if (rect.right - e.clientX >= CLOSE_RANGE) {
            setIsCollapsed(true);
            setResizeWidth(0);
            return;
          }
        } else if (isCollapsed) {
          if (e.clientX - rect.left >= OPEN_RANGE) {
            setIsCollapsed(false);
            setResizeWidth(START_WIDTH);
            return;
          }
        }
        return;
      }

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
    [timer, isResizing, isCollapsed, resizeWidth]
  );

  const handleMouseLeave = useCallback(() => {
    if (isResizing) return;
    clearTimeout(timer);
    setTimer(null);
    setIsHover(false);
  }, [isResizing, timer]);

  const handleResize = (e, direction, ref) => {
    setIsHover(true);
    const rect = ref.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;

    if (!isCollapsed) {
      setResizeWidth(Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth)));
    }
  };

  const handleResizeStart = () => {
    setIsResizing(true);
    setIsHover(true);
  };

  const handleResizeStop = (e, direction, ref) => {
    const rect = ref.getBoundingClientRect();
    const isNearRightEdge = Math.abs(e.clientX - rect.right) < HOVER_EDGE_AREA;

    setIsResizing(false);
    if (!isNearRightEdge) setIsHover(false);
  };

  return (
    <Resizable
      size={{ width: resizeWidth, height: "100%" }}
      minWidth={isCollapsed ? 0 : MIN_WIDTH}
      maxWidth={isCollapsed ? 0 : maxWidth}
      enable={{ right: true }}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      className={css.sidebar}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      handleStyles={{ right: { cursor: "ew-resize" } }}
    >
      <div
        className={css.ResizableWrap}
        style={{ opacity: isCollapsed ? 0 : 1 }}
      >
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
