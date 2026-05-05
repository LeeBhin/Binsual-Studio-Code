import {
  useHistory,
  setCurrentFiles,
  setFocusedFile,
} from "../../../store/history";

const Debug = () => {
  const activeFile = useHistory((s) => s.activeFile);
  const win = useHistory((s) => s.windows[activeFile]);
  const currentFiles = win?.currentFiles ?? [];
  const focusedFile = win?.focusedFile ?? "";

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

  const btn =
    "rounded-md border-none outline-none bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-1 cursor-pointer text-[13px]";
  const txt = "text-[13px] text-[var(--text)]";
  const link = "text-[var(--accent-soft)] cursor-pointer hover:underline";

  return (
    <div className="flex flex-col gap-[13px] px-[15px] pt-[5px] pb-[15px]">
      <button className={btn} onClick={handleClick}>
        시작
      </button>

      <span className={txt}>
        <span className={link}>시작</span> 버튼을 눌러 디버그를 시작합니다.
      </span>

      <button className={btn}>시작 및 기록</button>

      <span className={txt}>
        <span className={link}>시작 및 기록</span>을 사용하여 디버그 결과 및
        순위를 기록할 수 있습니다.
      </span>
    </div>
  );
};

export default Debug;
