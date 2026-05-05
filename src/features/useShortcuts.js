import { useEffect } from "react";
import {
  useHistory,
  setIsLayoutActive,
  setCurrentFiles,
  setFocusedTask,
} from "../store/history";

/**
 * 전역 단축키 매니저.
 * - chord (Ctrl+K W 등) 지원: 1.5초 안에 다음 키 입력 대기
 * - input/textarea focus 시 일부 chord/Ctrl+B 등은 무시
 * - 브라우저 기본 동작은 e.preventDefault() 로 차단
 */
export const useShortcuts = () => {
  useEffect(() => {
    let chordPrefix = null;
    let chordTimer = null;

    const resetChord = () => {
      chordPrefix = null;
      if (chordTimer) clearTimeout(chordTimer);
      chordTimer = null;
    };

    const getCtx = () => {
      const state = useHistory.getState();
      const activeFile = state.activeFile;
      const win = state.windows[activeFile] || {};
      return {
        activeFile,
        currentFiles: win.currentFiles ?? [],
        focusedFile: win.focusedFile ?? "",
        isLayoutActive: state.isLayoutActive,
      };
    };

    const closeFocused = () => {
      const { activeFile, currentFiles, focusedFile } = getCtx();
      if (!focusedFile) return;
      setCurrentFiles({
        id: activeFile,
        currentFiles: currentFiles.filter((f) => f.path !== focusedFile),
      });
    };

    const closeAll = () => {
      const { activeFile } = getCtx();
      setCurrentFiles({ id: activeFile, currentFiles: [] });
    };

    const closeUnsaved = () => {
      // 현재 모델: pinned가 'saved'에 가까움. 저장 안 된(=pinned 아닌) 탭만 닫기.
      const { activeFile, currentFiles } = getCtx();
      setCurrentFiles({
        id: activeFile,
        currentFiles: currentFiles.filter((f) => f.pinned),
      });
    };

    const toggleSidebar = () => {
      const { isLayoutActive } = getCtx();
      setIsLayoutActive({
        isActive: !isLayoutActive.isActive,
        width: isLayoutActive.width || 170,
        from: "layout",
      });
    };

    const copyFocusedPath = () => {
      const { focusedFile } = getCtx();
      if (focusedFile) navigator.clipboard?.writeText(focusedFile).catch(() => {});
    };

    const openSearch = () => {
      const { isLayoutActive } = getCtx();
      setIsLayoutActive({
        isActive: true,
        width: isLayoutActive.width || 170,
        from: "layout",
      });
      setFocusedTask("search");
    };

    const handler = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      const inInput = tag === "input" || tag === "textarea";
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;
      const code = e.code;

      // ─── Ctrl+F4: 활성 탭 닫기 (브라우저 기본 동작 막기) ───
      if (ctrl && !shift && !alt && code === "F4") {
        e.preventDefault();
        closeFocused();
        return;
      }

      // ─── Ctrl+K (chord 시작) ───
      if (ctrl && !shift && !alt && code === "KeyK") {
        e.preventDefault();
        chordPrefix = "ctrl-k";
        if (chordTimer) clearTimeout(chordTimer);
        chordTimer = setTimeout(resetChord, 1500);
        return;
      }

      // ─── chord 후속 키 ───
      if (chordPrefix === "ctrl-k") {
        // Ctrl+K W: 모두 닫기
        if (!ctrl && !shift && !alt && code === "KeyW") {
          e.preventDefault();
          closeAll();
          resetChord();
          return;
        }
        // Ctrl+K U: 저장된 항목 닫기 (저장 안 된 탭만 남김 X — VSCode와 동일하게 unsaved 닫기)
        if (!ctrl && !shift && !alt && code === "KeyU") {
          e.preventDefault();
          closeUnsaved();
          resetChord();
          return;
        }
        // Ctrl+K Ctrl+Shift+C: 상대 경로 복사
        if (ctrl && shift && !alt && code === "KeyC") {
          e.preventDefault();
          copyFocusedPath();
          resetChord();
          return;
        }
        // 매칭 안 되면 chord 종료하고 일반 처리로
        resetChord();
      }

      // ─── Shift+Alt+C: 경로 복사 ───
      if (!ctrl && shift && alt && code === "KeyC") {
        e.preventDefault();
        copyFocusedPath();
        return;
      }

      // ─── Ctrl+B: 사이드바 토글 (브라우저 북마크 막기) ───
      if (ctrl && !shift && !alt && code === "KeyB" && !inInput) {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // ─── Ctrl+J: 패널 토글 (브라우저 다운로드 막기) ───
      if (ctrl && !shift && !alt && code === "KeyJ" && !inInput) {
        e.preventDefault();
        // 패널 영역 미구현 — preventDefault만 적용
        return;
      }

      // ─── Ctrl+Alt+B: 보조 사이드바 토글 ───
      if (ctrl && !shift && alt && code === "KeyB" && !inInput) {
        e.preventDefault();
        // 보조 사이드바 미구현
        return;
      }

      // ─── Ctrl+Shift+F: 검색 패널 ───
      if (ctrl && shift && !alt && code === "KeyF") {
        e.preventDefault();
        openSearch();
        return;
      }

      // ─── Ctrl+Alt+G: GitHub 열기 ───
      if (ctrl && !shift && alt && code === "KeyG") {
        e.preventDefault();
        window.open("https://github.com/LeeBhin/portfolio", "_blank");
        return;
      }

      // ─── F11: 전체 화면 (브라우저 기본 동작은 사용자 제스처로 직접 호출 못 막음, preventDefault 시도) ───
      if (code === "F11") {
        e.preventDefault();
        const el = document.documentElement;
        if (!document.fullscreenElement) {
          el.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
        return;
      }

      // ─── Alt+F4: 페이지 닫기 (OS 단축키라 브라우저는 막을 수 없음 — preventDefault만 시도) ───
      if (alt && !ctrl && !shift && code === "F4") {
        e.preventDefault();
        return;
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);
};
