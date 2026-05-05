import React, { useState, useCallback, useEffect, useRef } from "react";
import { Resizable } from "re-resizable";
import EllipsisDots from "../EllipsisDots";
import FolderTree from "./FolderTree";
import { useHistory, setIsLayoutActive } from "../../store/history";
import Search from "./tasks/Search";
import Git from "./tasks/Git";
import Debug from "./tasks/Debug";
import Extension from "./tasks/Extension";
import Mail from "./tasks/Mail";

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
  const contentRef = useRef(null);

  const isLayoutActive = useHistory((s) => s.isLayoutActive);
  const focusedTask = useHistory((s) => s.focusedTask);

  useEffect(() => {
    if (!isLayoutActive.from) return;
    if (isLayoutActive.isActive) {
      setIsCollapsed(false);
      setResizeWidth(isLayoutActive.width);
    } else {
      setIsCollapsed(true);
      setResizeWidth(0);
    }
  }, [isLayoutActive]);

  useEffect(() => {
    const updateMaxWidth = () => setMaxWidth(window.innerWidth * 0.86);
    updateMaxWidth();
    window.addEventListener("resize", updateMaxWidth);
    return () => window.removeEventListener("resize", updateMaxWidth);
  }, []);

  useEffect(() => {
    const handleDocumentMouseMove = (e) => {
      if (isResizing) return;

      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        const isNearRightEdge =
          Math.abs(e.clientX - rect.right) < HOVER_EDGE_AREA;

        if (!isNearRightEdge) {
          clearTimeout(timer);
          setTimer(null);
          setIsHover(false);
        }
      }
    };

    document.addEventListener("mousemove", handleDocumentMouseMove);
    return () =>
      document.removeEventListener("mousemove", handleDocumentMouseMove);
  }, [isResizing, timer]);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();

      if (isResizing) {
        if (!isCollapsed && resizeWidth === MIN_WIDTH) {
          if (rect.right - e.clientX >= CLOSE_RANGE) {
            setIsCollapsed(true);
            setResizeWidth(0);
            setIsLayoutActive({ isActive: false, width: 0 });
            return;
          }
        } else if (isCollapsed) {
          if (e.clientX - rect.left >= OPEN_RANGE) {
            setIsCollapsed(false);
            setResizeWidth(START_WIDTH);
            setIsLayoutActive({ isActive: true, width: START_WIDTH });
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

    setIsLayoutActive({
      isActive: isLayoutActive.isActive,
      width: resizeWidth,
    });
  };

  const focusedComponent = (resizeWidth) => {
    switch (focusedTask) {
      case "files":
        return <FolderTree />;
      case "search":
        return <Search />;
      case "git":
        return <Git />;
      case "debug":
        return <Debug />;
      case "extensions":
        return <Extension resizeWidth={resizeWidth} />;
      case "mail":
        return <Mail />;
      default:
        return <FolderTree />;
    }
  };

  const focusedTitle = () => {
    switch (focusedTask) {
      case "files":
        return "탐색기";
      case "search":
        return "검색";
      case "git":
        return "소스 제어";
      case "debug":
        return "디버그: 벌레 잡기";
      case "extensions":
        return "확장";
      case "db":
        return "데이터베이스";
      case "mail":
        return "메일";
      default:
        return "탐색기";
    }
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
      className="bg-[var(--panel)] text-[var(--text)] relative z-[1]"
      style={{
        "--text": "#CFD2D2",
        "--text-strong": "#CFD2D2",
        "--text-muted": "#CFD2D2",
        "--text-dim": "#CFD2D2",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      handleStyles={{ right: { cursor: "ew-resize" } }}
    >
      <div
        ref={contentRef}
        className="h-full"
        style={{ opacity: isCollapsed ? 0 : 1 }}
      >
        <div className="flex justify-between items-center h-[35px] text-[11px] px-[15px]">
          <span>{focusedTitle()}</span>
          {focusedTask !== "search" && (
            <div className="w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]">
              <EllipsisDots />
            </div>
          )}
        </div>
        <div className="h-full">{focusedComponent(resizeWidth)}</div>
      </div>

      <div
        className="absolute -right-[2.5px] top-0 w-1 h-full transition-[background-color] duration-150"
        style={isHover ? { backgroundColor: "var(--accent)" } : {}}
      />
    </Resizable>
  );
};

export default Sidebar;
