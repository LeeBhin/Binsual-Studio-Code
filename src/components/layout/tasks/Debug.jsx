import { useDispatch, useSelector } from "react-redux";
import css from "../../../styles/Debug.module.css";
import {
  setCurrentFiles,
  setFocusedFile,
  setHistory,
} from "../../../features/historySlice";

const Debug = () => {
  const { activeFile } = useSelector((state) => state.history);

  const { currentFiles, focusedFile, history } = useSelector(
    (state) => state.history.windows[activeFile]
  );

  const dispatch = useDispatch();

  const handleClick = () => {
    const fileExists = currentFiles.some((file) => file.path === "debug.exe");

    if (currentFiles.length === 0 && !fileExists) {
      dispatch(
        setCurrentFiles({
          id: activeFile,
          currentFiles: [{ pinned: true, path: "debug.exe" }],
        })
      );
    }

    const lastFile = history[history.length - 1];

    if (lastFile !== "debug.exe") {
      dispatch(
        setHistory({
          id: activeFile,
          history: [...history, "debug.exe"],
        })
      );
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
      dispatch(
        setCurrentFiles({
          id: activeFile,
          currentFiles: files,
        })
      );
    }

    dispatch(setFocusedFile({ id: activeFile, focusedFile: "debug.exe" }));
  };

  return (
    <div className={css.Debug}>
      <button className={css.button} onClick={() => handleClick()}>
        시작
      </button>

      <span className={css.txt}>
        <span className={css.highlight}>시작</span> 버튼을 눌러 디버그를
        시작합니다.
      </span>

      <button className={css.button}>시작 및 기록</button>

      <span className={css.txt}>
        <span className={css.highlight}>시작 및 기록</span>을 사용하여 디버그
        결과 및 순위를 기록할 수 있습니다.
      </span>
    </div>
  );
};

export default Debug;
