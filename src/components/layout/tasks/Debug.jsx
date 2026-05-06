import { useEffect, useRef, useState } from "react";
import {
  useHistory,
  setCurrentFiles,
  setFocusedFile,
} from "../../../store/history";
import CommitButton from "../../CommitButton";

const LINK_COLOR = "#3791F9";
const FOCUS_COLOR = "#007ED2";

const Debug = ({ isActive = true }) => {
  const activeFile = useHistory((s) => s.activeFile);
  const win = useHistory((s) => s.windows[activeFile]);
  const currentFiles = win?.currentFiles ?? [];
  const focusedFile = win?.focusedFile ?? "";
  const [isFocused, setIsFocused] = useState(true);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (isActive) setIsFocused(true);
  }, [isActive]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const handleClick = () => {
    const fileExists = currentFiles.some((file) => file.path === "debug.exe");

    if (currentFiles.length === 0 && !fileExists) {
      setCurrentFiles({
        id: activeFile,
        currentFiles: [{ pinned: true, path: "debug.exe" }],
      });
    }

    if (focusedFile === "") return;

    const i = currentFiles.findIndex((f) => f.path === focusedFile);

    const files = currentFiles.map((file, index) => {
      if (index === i && !file.pinned) {
        return { ...file, pinned: true, path: "debug.exe" };
      }
      return file;
    });

    if (currentFiles[i]?.pinned && !fileExists) {
      files.splice(i + 1, 0, { pinned: true, path: "debug.exe" });
    }

    if (currentFiles.length !== 0 && !fileExists) {
      setCurrentFiles({
        id: activeFile,
        currentFiles: files,
      });
    }

    setFocusedFile({ id: activeFile, focusedFile: "debug.exe" });
  };

  const txt = "text-[13px] text-[var(--text)]";
  const link = "cursor-pointer hover:underline";

  return (
    <div
      ref={wrapperRef}
      onMouseDown={() => setIsFocused(true)}
      className="mt-px h-[calc(100%-1px)] flex flex-col gap-[13px] pl-[20px] pr-[11px] pt-[14px] pb-[15px]"
      style={{
        boxShadow: isFocused ? `inset 0 0 0 1px ${FOCUS_COLOR}` : undefined,
      }}
    >
      <CommitButton label="시작" onClick={handleClick} className="w-full rounded-sm" />

      <span className={txt}>
        <span className={link} style={{ color: LINK_COLOR }}>
          시작
        </span>{" "}
        버튼을 눌러 디버그를 시작합니다.
      </span>

      <CommitButton label="시작 및 기록" className="w-full rounded-sm" />

      <span className={txt}>
        <span className={link} style={{ color: LINK_COLOR }}>
          시작 및 기록
        </span>
        을 사용하여 디버그 결과 및 순위를 기록할 수 있습니다.
      </span>
    </div>
  );
};

export default Debug;
