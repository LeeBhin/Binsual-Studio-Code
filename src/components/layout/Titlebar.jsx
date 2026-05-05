import Codicon from "../Codicon";
import Tooltip from "../Tooltip";
import EllipsisDots from "../EllipsisDots";
import Icons from "../../assets/icons";
import {
  useHistory,
  setCurrentFiles,
  setFocusedFile,
  setHistory,
  setIsLayoutActive,
} from "../../store/history";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const HOVER =
  "hover:bg-[color-mix(in_srgb,white_6.5%,transparent)]";

const iconBg = `w-[22px] h-[22px] rounded-[5px] flex justify-center items-center cursor-pointer ${HOVER}`;
const ICON_COLOR = "#CCCCCC";

const menuItems = [
  { label: "파일", key: "F" },
  { label: "편집", key: "E" },
  { label: "선택 영역", key: "S" },
  { label: "보기", key: "V" },
  { label: "이동", key: "G" },
  { label: "실행", key: "R" },
  { label: "터미널", key: "T" },
  { label: "도움말", key: "H" },
];

const Titlebar = () => {
  const activeFile = useHistory((s) => s.activeFile);
  const isLayoutActive = useHistory((s) => s.isLayoutActive);
  const win = useHistory((s) => s.windows[activeFile]);
  const currentFiles = win?.currentFiles ?? [];
  const focusedFile = win?.focusedFile ?? "";
  const history = win?.history ?? [];

  const [focusedIndex, setFocusedIndex] = useState(
    Array.isArray(history)
      ? history.findIndex((path) => path === focusedFile)
      : -1
  );

  const prevFocusedRef = useRef(focusedFile);

  // 메뉴 반응형 — ResizeObserver + 평균 메뉴 폭으로 visible 개수 계산
  const menuContainerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(menuItems.length);

  useLayoutEffect(() => {
    const ITEM_W = 65;
    const ELLIPSIS_W = 36;
    const recalc = () => {
      if (!menuContainerRef.current) return;
      const w = menuContainerRef.current.offsetWidth;
      const fits = Math.floor((w - ELLIPSIS_W) / ITEM_W);
      setVisibleCount(Math.max(0, Math.min(menuItems.length, fits)));
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    if (menuContainerRef.current) ro.observe(menuContainerRef.current);
    return () => ro.disconnect();
  }, []);

  const showHamburger = visibleCount <= 2;
  const hasHidden = visibleCount < menuItems.length;
  const visibleItems = menuItems.slice(0, visibleCount);

  useEffect(() => {
    if (
      prevFocusedRef.current !== focusedFile &&
      focusedFile !== history[focusedIndex]
    ) {
      const newHistory = [...history.slice(0, focusedIndex + 1), focusedFile];
      setHistory({ id: activeFile, history: newHistory });
      setFocusedIndex(newHistory.length - 1);
    }
    prevFocusedRef.current = focusedFile;
  }, [focusedFile, focusedIndex, history, activeFile]);

  const prevFile = () => {
    if (focusedIndex > 0) {
      const prevFocusedFile = history[focusedIndex - 1];
      const fileExists = currentFiles.some(
        (file) => file.path === prevFocusedFile
      );
      let updatedFiles = [...currentFiles];

      if (!fileExists) {
        const currentFocusedFileIndex = currentFiles.findIndex(
          (file) => file.path === prevFocusedRef.current
        );

        updatedFiles.splice(currentFocusedFileIndex + 1, 0, {
          pinned: false,
          path: prevFocusedFile,
        });
        setCurrentFiles({
          id: activeFile,
          currentFiles: updatedFiles,
        });
      }

      setFocusedFile({ id: activeFile, focusedFile: prevFocusedFile });
      setFocusedIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextFile = () => {
    if (focusedIndex < history.length - 1) {
      const nextFocusedFile = history[focusedIndex + 1];
      const fileExists = currentFiles.some(
        (file) => file.path === nextFocusedFile
      );
      let updatedFiles = [...currentFiles];

      if (!fileExists) {
        const currentFocusedFileIndex = currentFiles.findIndex(
          (file) => file.path === focusedFile
        );

        updatedFiles.splice(currentFocusedFileIndex + 1, 0, {
          pinned: false,
          path: nextFocusedFile,
        });
        setCurrentFiles({
          id: activeFile,
          currentFiles: updatedFiles,
        });
      }

      setFocusedFile({ id: activeFile, focusedFile: nextFocusedFile });
      setFocusedIndex(focusedIndex + 1);
    }
  };

  const prevArrowColor =
    focusedIndex > 0
      ? ICON_COLOR
      : "color-mix(in srgb, #CCCCCC 50%, transparent)";

  const nextArrowColor =
    focusedIndex < history.length - 1
      ? ICON_COLOR
      : "color-mix(in srgb, #CCCCCC 50%, transparent)";

  return (
    <header
      className="bg-[var(--titlebar)] h-[35px] border-b border-[var(--border)] w-screen"
      style={{ color: ICON_COLOR }}
    >
      <div className="flex justify-between items-center h-full">
        {/* 왼쪽: 앱 아이콘 + 메뉴 */}
        <div className="flex items-center gap-[5px] flex-[2] min-w-0 pl-2 h-full">
          <div className="flex items-center justify-center w-[22px] h-[22px] shrink-0">
            <Icons.Vscode className="w-4 h-4" />
          </div>
          <div
            ref={menuContainerRef}
            className="flex items-center gap-0.5 overflow-hidden flex-1 min-w-0 text-[12.5px]"
          >
            {showHamburger ? (
              <div
                className={`flex items-center justify-center px-3 h-[22px] rounded-[5px] cursor-pointer shrink-0 ${HOVER}`}
                title={menuItems.map((m) => `${m.label}(${m.key})`).join(", ")}
              >
                <Codicon name="menu" size={16} />
              </div>
            ) : (
              <>
                {visibleItems.map((m, i) => (
                  <div
                    key={i}
                    className={`px-2 py-0.5 rounded-[5px] cursor-default shrink-0 whitespace-nowrap ${HOVER}`}
                  >
                    {m.label}({m.key})
                  </div>
                ))}
                {hasHidden && (
                  <div
                    className={`flex items-center justify-center px-3 h-[22px] rounded-[5px] cursor-pointer shrink-0 ${HOVER}`}
                    title={menuItems
                      .slice(visibleCount)
                      .map((m) => `${m.label}(${m.key})`)
                      .join(", ")}
                  >
                    <EllipsisDots />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 가운데: 화살표 + 검색바 */}
        <div className="flex items-center gap-[5px] text-[17px]">
          <div
            className={iconBg}
            onClick={prevFile}
            style={
              focusedIndex > 0
                ? { pointerEvents: "auto" }
                : { pointerEvents: "none" }
            }
          >
            <Codicon
              name="arrow-left"
              size={16}
              className="-translate-y-px"
              style={{ color: prevArrowColor }}
            />
          </div>
          <div
            className={iconBg}
            onClick={nextFile}
            style={
              focusedIndex < history.length - 1
                ? { pointerEvents: "auto" }
                : { pointerEvents: "none" }
            }
          >
            <Codicon
              name="arrow-right"
              size={16}
              className="-translate-y-px"
              style={{ color: nextArrowColor }}
            />
          </div>
          <div>
            <div
              className="text-[12px] flex justify-start items-center gap-[5px] w-[40vw] max-w-[600px] min-w-[10px] h-[23px] bg-white/5 border border-[#666666] rounded-[5px] cursor-pointer mx-1.5 px-3 hover:bg-[color-mix(in_srgb,white_9%,transparent)] hover:border-[#757575]"
            >
              <span>Lee Bhin</span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 레이아웃 버튼 */}
        <div className="flex justify-end items-center flex-[2] pr-[3px] gap-1">
          <Tooltip
            label="레이아웃 사용자 지정..."
            position="bottom"
            group="titlebar-right"
          >
            <div className={iconBg}>
              <Codicon name="layout" size={16} style={{ color: ICON_COLOR }} />
            </div>
          </Tooltip>
          <Tooltip
            label="기본 사이드바 설정/해제 (Ctrl+B)"
            position="bottom"
            group="titlebar-right"
          >
            <div
              className={iconBg}
              onClick={() =>
                setIsLayoutActive({
                  isActive: !isLayoutActive.isActive,
                  width: isLayoutActive.width,
                  from: "layout",
                })
              }
            >
              <Codicon
                name={
                  isLayoutActive.isActive
                    ? "layout-sidebar-left"
                    : "layout-sidebar-left-off"
                }
                size={16}
                style={{ color: ICON_COLOR }}
              />
            </div>
          </Tooltip>
          <Tooltip
            label="패널 설정/해제 (Ctrl+J)"
            position="bottom"
            group="titlebar-right"
          >
            <div className={iconBg}>
              <Codicon
                name="layout-panel-off"
                size={16}
                style={{ color: ICON_COLOR }}
              />
            </div>
          </Tooltip>
          <Tooltip
            label="보조 사이드바 설정/해제 (Ctrl+Alt+B)"
            position="bottom"
            group="titlebar-right"
          >
            <div className={iconBg}>
              <Codicon
                name="layout-sidebar-right-off"
                size={16}
                style={{ color: ICON_COLOR }}
              />
            </div>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Titlebar;
