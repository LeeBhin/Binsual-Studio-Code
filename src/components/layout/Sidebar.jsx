import React, { useState, useCallback, useEffect, useRef } from "react";
import { Resizable } from "re-resizable";
import EllipsisDots from "../EllipsisDots";
import Codicon from "../Codicon";
import Tooltip from "../Tooltip";
import ResizeHandle from "../ResizeHandle";
import FolderTree from "./FolderTree";
import Section from "./Section";
import { useHistory, setIsLayoutActive } from "../../store/history";
import Search from "./tasks/Search";
import Git from "./tasks/Git";
import Debug from "./tasks/Debug";
import Extension from "./tasks/Extension";
import Mail from "./tasks/Mail";

const sideIconBg =
  "w-5 h-5 rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]";

const EmptyHint = ({ children }) => (
  <div className="px-[15px] py-[5px] text-[13px]" style={{ color: "#787878" }}>
    {children}
  </div>
);

const outlineActions = (
  <>
    <Tooltip label="모두 축소" position="bottom" group="outline-actions">
      <div className={sideIconBg}>
        <Codicon name="collapse-all" size={16} />
      </div>
    </Tooltip>
    <Tooltip label="기타 작업..." position="bottom" group="outline-actions">
      <div className={sideIconBg}>
        <EllipsisDots />
      </div>
    </Tooltip>
  </>
);

const timelineActions = (
  <>
    <Tooltip label="현재 타임라인 고정" position="bottom" group="timeline-actions">
      <div className={sideIconBg}>
        <Codicon name="pin" size={16} />
      </div>
    </Tooltip>
    <Tooltip label="새로 고침" position="bottom" group="timeline-actions">
      <div className={sideIconBg}>
        <Codicon name="refresh" size={16} />
      </div>
    </Tooltip>
    <Tooltip label="타임라인 필터링" position="bottom" group="timeline-actions">
      <div className={sideIconBg}>
        <Codicon name="filter" size={16} />
      </div>
    </Tooltip>
    <Tooltip label="기타 작업..." position="bottom" group="timeline-actions">
      <div className={sideIconBg}>
        <EllipsisDots />
      </div>
    </Tooltip>
  </>
);

const MIN_SECTION_HEIGHT = 60;

const FilesView = () => {
  const [leebhinOpen, setLeebhinOpenRaw] = useState(true);
  const [outlineOpen, setOutlineOpenRaw] = useState(false);
  const [timelineOpen, setTimelineOpenRaw] = useState(false);
  const [lastOpened, setLastOpened] = useState("leebhin");

  const trackOpen = (id, raw) => (val) => {
    raw((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (next && !prev) setLastOpened(id);
      return next;
    });
  };

  const setLeebhinOpen = trackOpen("leebhin", setLeebhinOpenRaw);
  const setOutlineOpen = trackOpen("outline", setOutlineOpenRaw);
  const setTimelineOpen = trackOpen("timeline", setTimelineOpenRaw);

  const folderRef = useRef(null);
  const outlineRef = useRef(null);
  const timelineRef = useRef(null);
  const [basis, setBasis] = useState([null, null, null]);
  const [isResizing, setIsResizing] = useState(false);

  const startResize = () => {
    setIsResizing(true);
    setBasis([
      folderRef.current?.offsetHeight ?? 0,
      outlineRef.current?.offsetHeight ?? 0,
      timelineRef.current?.offsetHeight ?? 0,
    ]);
  };

  const stopResize = () => setIsResizing(false);

  const handleResizeAt = (i) => (delta) => {
    setBasis((prev) => {
      const next = [...prev];
      let a = next[i] + delta;
      let b = next[i + 1] - delta;
      if (a < MIN_SECTION_HEIGHT) {
        b -= MIN_SECTION_HEIGHT - a;
        a = MIN_SECTION_HEIGHT;
      }
      if (b < MIN_SECTION_HEIGHT) {
        a -= MIN_SECTION_HEIGHT - b;
        b = MIN_SECTION_HEIGHT;
      }
      next[i] = a;
      next[i + 1] = b;
      return next;
    });
  };

  const leebhinGrow = lastOpened === "leebhin" ? 4 : 1;
  const outlineGrow = lastOpened === "outline" ? 4 : 1;
  const timelineGrow = lastOpened === "timeline" ? 4 : 1;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FolderTree
        innerRef={folderRef}
        isOpen={leebhinOpen}
        setIsOpen={setLeebhinOpen}
        grow={leebhinGrow}
        basis={basis[0]}
        isResizing={isResizing}
      />
      <ResizeHandle
        direction="vertical"
        enabled={leebhinOpen && outlineOpen}
        onResizeStart={startResize}
        onResize={handleResizeAt(0)}
        onResizeStop={stopResize}
      />
      <Section
        innerRef={outlineRef}
        title="개요"
        actions={outlineActions}
        isOpen={outlineOpen}
        setIsOpen={setOutlineOpen}
        grow={outlineGrow}
        basis={basis[1]}
        isResizing={isResizing}
      >
        <EmptyHint>활성 편집기에서 개요 정보를 제공할 수 없습니다.</EmptyHint>
      </Section>
      <ResizeHandle
        direction="vertical"
        enabled={outlineOpen && timelineOpen}
        onResizeStart={startResize}
        onResize={handleResizeAt(1)}
        onResizeStop={stopResize}
      />
      <Section
        innerRef={timelineRef}
        title="타임라인"
        actions={timelineActions}
        isOpen={timelineOpen}
        setIsOpen={setTimelineOpen}
        grow={timelineGrow}
        basis={basis[2]}
        isResizing={isResizing}
      >
        <EmptyHint>활성 편집기에서 타임라인 정보를 제공할 수 없습니다.</EmptyHint>
      </Section>
    </div>
  );
};

const START_WIDTH = 300;
const MIN_WIDTH = 238;
const HOVER_EDGE_AREA = 3.5;
const HOVER_DELAY = 280;
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

  const renderTabs = (resizeWidth) => {
    const active = focusedTask || "files";
    const tabs = [
      { key: "files", node: <FilesView /> },
      { key: "search", node: <Search isActive={active === "search"} /> },
      { key: "git", node: <Git isActive={active === "git"} /> },
      { key: "debug", node: <Debug isActive={active === "debug"} /> },
      {
        key: "extensions",
        node: (
          <Extension
            resizeWidth={resizeWidth}
            isActive={active === "extensions"}
          />
        ),
      },
      { key: "mail", node: <Mail isActive={active === "mail"} /> },
    ];
    return tabs.map(({ key, node }) => (
      <div
        key={key}
        className="h-full"
        style={{ display: active === key ? "flex" : "none", flexDirection: "column" }}
      >
        {node}
      </div>
    ));
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
        "--text": "#CCCCCC",
        "--text-strong": "#CCCCCC",
        "--text-muted": "#CCCCCC",
        "--text-dim": "#CCCCCC",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      handleStyles={{ right: { cursor: "ew-resize", width: "7px", right: "-3.5px" } }}
    >
      <div
        ref={contentRef}
        className="h-full flex flex-col overflow-hidden"
        style={{ opacity: isCollapsed ? 0 : 1 }}
      >
        <div className="flex justify-between items-center gap-2 h-[35px] shrink-0 text-[11px] pl-[20px] pr-[11px]">
          <span
            className="flex-1 min-w-0 truncate"
            style={{ color: "#CCCCCC" }}
          >
            {focusedTitle()}
          </span>
          <div className="flex items-center gap-[3px] shrink-0">
            {focusedTask === "extensions" && (
              <Tooltip label="새로 고침" position="bottom" group="sidebar-title">
                <div className="w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]">
                  <Codicon name="refresh" size={16} />
                </div>
              </Tooltip>
            )}
            {focusedTask === "search" && (
              <>
                <Tooltip label="새로 고침" position="bottom" group="sidebar-title">
                  <div className="w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]">
                    <Codicon name="refresh" size={16} />
                  </div>
                </Tooltip>
                <Tooltip label="검색 결과 지우기" position="bottom" group="sidebar-title">
                  <div className="w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]">
                    <Codicon name="clear-all" size={16} />
                  </div>
                </Tooltip>
                <Tooltip label="새 검색 편집기 열기" position="bottom" group="sidebar-title">
                  <div className="w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]">
                    <Codicon name="new-file" size={16} />
                  </div>
                </Tooltip>
                <Tooltip label="트리로 보기" position="bottom" group="sidebar-title">
                  <div className="w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]">
                    <Codicon name="list-flat" size={16} />
                  </div>
                </Tooltip>
                <Tooltip label="모두 축소" position="bottom" group="sidebar-title">
                  <div className="w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]">
                    <Codicon name="collapse-all" size={16} />
                  </div>
                </Tooltip>
              </>
            )}
            {focusedTask !== "search" && (
              <Tooltip label="보기 및 기타 작업..." position="bottom" group="sidebar-title">
                <div className="w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]">
                  <EllipsisDots />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0">{renderTabs(resizeWidth)}</div>
      </div>

      <div
        className="absolute -right-[2.5px] top-0 w-1 h-full transition-[background-color] duration-150"
        style={isHover ? { backgroundColor: "var(--accent)" } : {}}
      />
    </Resizable>
  );
};

export default Sidebar;
