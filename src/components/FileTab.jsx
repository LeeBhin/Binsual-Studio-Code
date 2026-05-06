import FileIcon from "./FileIcon";
import Codicon from "./Codicon";
import ContextMenu from "./ContextMenu";
import {
  useHistory,
  setFocusedFile,
  setHistory,
  setCurrentFiles,
} from "../store/history";
import { useEffect, useState } from "react";
import getExtension from "../features/getExtension";

const FileTab = ({ fileName, filePath, fileIndex }) => {
  const activeFile = useHistory((s) => s.activeFile);
  const win = useHistory((s) => s.windows[fileIndex]);
  const currentFiles = win?.currentFiles ?? [];
  const focusedFile = win?.focusedFile ?? "";
  const history = win?.history ?? [];
  const [dup, setDup] = useState(null);
  const [menu, setMenu] = useState(null);

  const isFocused = focusedFile === filePath;
  const fileItem = currentFiles.find((f) => f.path === filePath);
  const isPinned = !!fileItem?.pinned;
  const isSticky = !!fileItem?.sticky;
  const idx = currentFiles.findIndex((f) => f.path === filePath);
  const isLastTab = currentFiles.length <= 1;
  const isRightmost = idx === currentFiles.length - 1;

  const closeFile = (e) => {
    e?.stopPropagation?.();
    setCurrentFiles({
      id: fileIndex,
      currentFiles: currentFiles.filter((file) => file.path !== filePath),
    });
  };

  const closeOthers = () => {
    setCurrentFiles({
      id: fileIndex,
      currentFiles: currentFiles.filter((f) => f.path === filePath),
    });
  };

  const closeRight = () => {
    const idx = currentFiles.findIndex((f) => f.path === filePath);
    if (idx === -1) return;
    setCurrentFiles({
      id: fileIndex,
      currentFiles: currentFiles.slice(0, idx + 1),
    });
  };

  const closeAll = () => {
    setCurrentFiles({ id: fileIndex, currentFiles: [] });
  };

  const toggleSticky = () => {
    const updated = currentFiles.map((f) =>
      f.path === filePath ? { ...f, sticky: !f.sticky } : f
    );
    setCurrentFiles({ id: fileIndex, currentFiles: updated });
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  const tabClick = () => {
    const lastFile = history[history.length - 1];
    setFocusedFile({
      id: fileIndex,
      focusedFile: filePath,
    });
    if (lastFile !== filePath && !fileName.includes("vs")) {
      setHistory({ id: fileIndex, history: [...history, filePath] });
    }
  };

  const getUpPath = (filePath) => {
    if (filePath.startsWith(`LEE-BHIN/${fileName}`)) {
      return filePath.split("/").slice(0)[0];
    } else {
      return `...\\${filePath.split("/").slice(-2, -1)[0]}`;
    }
  };

  useEffect(() => {
    const fileNames = currentFiles.map((file) => file.path.split("/").pop());
    const duplicateFile = fileNames.find(
      (name, index) => fileNames.indexOf(name) !== index
    );
    if (duplicateFile) {
      setDup(duplicateFile);
    } else {
      setDup(null);
    }
  }, [currentFiles]);

  const fileWrapColor = isFocused
    ? activeFile === fileIndex
      ? "var(--text-strong)"
      : "color-mix(in srgb, var(--text-strong) 50%, transparent)"
    : activeFile === fileIndex
    ? "var(--text-muted)"
    : "color-mix(in srgb, var(--text-muted) 50%, transparent)";

  const isItalic = currentFiles.find(
    (file) => file.path === filePath && !file.pinned
  );

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  const menuItems = [
    { label: "닫기", shortcut: "Ctrl+F4", onClick: () => closeFile() },
    { label: "기타 항목 닫기", disabled: isLastTab, onClick: closeOthers },
    {
      label: "오른쪽에 있는 항목 닫기",
      disabled: isRightmost,
      onClick: closeRight,
    },
    { label: "저장된 항목 닫기", shortcut: "Ctrl+K U", onClick: closeAll },
    { label: "모두 닫기", shortcut: "Ctrl+K W", onClick: closeAll },
    { type: "separator" },
    {
      label: "경로 복사",
      shortcut: "Shift+Alt+C",
      onClick: () => copy(filePath),
    },
    {
      label: "상대 경로 복사",
      shortcut: "Ctrl+K Ctrl+Shift+C",
      onClick: () => copy(filePath),
    },
    {
      label: "이동 경로 복사",
      onClick: () =>
        copy(filePath.split("/").slice(0, -1).join("/")),
    },
    { type: "separator" },
    { label: isSticky ? "고정 해제" : "고정", onClick: toggleSticky },
  ];

  return (
    <>
      <div
        data-filetab
        className="group w-auto min-w-[120px] pt-[7px] pr-[5px] pb-[7px] pl-2.5 flex justify-between items-center gap-[5px] cursor-pointer text-[13px] text-[var(--text-muted)] relative shrink-0 bg-[var(--tab-inactive)]"
        onClick={tabClick}
        onContextMenu={handleContextMenu}
        onDoubleClick={() => {
          const updatedFiles = currentFiles.map((file) =>
            file.path === filePath ? { ...file, pinned: true } : file
          );
          setCurrentFiles({ id: activeFile, currentFiles: updatedFiles });
        }}
        style={
          isFocused
            ? {
                backgroundColor: "var(--tab-active)",
                borderBottom: "solid 1px var(--tab-active)",
              }
            : {}
        }
      >
        <div
          className="flex gap-1.5"
          style={{
            color: fileWrapColor,
            fontStyle: isItalic ? "italic" : "normal",
          }}
        >
          <FileIcon extension={getExtension(fileName)} />
          <div className="leading-5 whitespace-nowrap text-ellipsis">
            {fileName === "시작.vs" ? "시작" : fileName}
          </div>
          {dup && dup === fileName && (
            <div className="leading-5 text-[11px]">{getUpPath(filePath)}</div>
          )}
        </div>

        <div
          className={`text-[14px] w-5 h-5 flex justify-center items-center rounded-[5px] hover:bg-[var(--hover)] ${
            isSticky ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isSticky) toggleSticky();
            else closeFile(e);
          }}
          style={isFocused ? { color: "var(--text-strong)", opacity: 1 } : {}}
        >
          <Codicon name={isSticky ? "pinned" : "chrome-close"} size={14} />
        </div>
      </div>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={menuItems}
          onClose={() => setMenu(null)}
        />
      )}
    </>
  );
};

export default FileTab;
