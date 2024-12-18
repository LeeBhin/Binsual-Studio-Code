import { useDispatch, useSelector } from "react-redux";
import css from "../styles/File.module.css";
import FileIcon from "./FileIcon";
import { VscChromeClose } from "react-icons/vsc";
import { setFocusedFile, setHistory } from "../features/historySlice";
import { setCurrentFiles } from "../features/historySlice";
import { useEffect, useState } from "react";
import getExtension from "../features/getExtension";

const FileTab = ({ fileName, filePath, fileIndex }) => {
  const dispatch = useDispatch();
  const { activeFile } = useSelector((state) => state.history);
  const [dup, setDup] = useState(null);

  const { currentFiles, focusedFile, history } = useSelector(
    (state) => state.history.windows[fileIndex]
  );

  const closeFile = (e) => {
    e.stopPropagation();
    const updatedFiles = currentFiles.filter((file) => file.path !== filePath);
    dispatch(
      setCurrentFiles({
        id: fileIndex,
        currentFiles: updatedFiles,
      })
    );
  };

  const tabClick = () => {
    const lastFile = history[history.length - 1];
    dispatch(
      setFocusedFile({
        id: fileIndex,
        focusedFile: filePath,
      })
    );
    if (lastFile !== filePath && !fileName.includes("vs")) {
      dispatch(setHistory({ id: fileIndex, history: [...history, filePath] }));
    }
  };

  const getUpPath = (filePath) => {
    if (filePath.startsWith(`LEE BHIN/${fileName}`)) {
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

  return (
    <div
      className={css.FileTab}
      onClick={() => tabClick()}
      onDoubleClick={() => {
        const updatedFiles = currentFiles.map((file) =>
          file.path === filePath ? { ...file, pinned: true } : file
        );
        dispatch(
          setCurrentFiles({ id: activeFile, currentFiles: updatedFiles })
        );
      }}
      style={
        focusedFile === filePath
          ? {
              backgroundColor: "#1f1f1f",
              borderBottom: "solid 1px #1f1f1f",
            }
          : {}
      }
    >
      {focusedFile === filePath && (
        <div
          className={css.tabLine}
          style={
            activeFile === fileIndex
              ? { borderTop: "solid 1px #0078d4" }
              : { borderTop: "solid 1px #2b2b2b" }
          }
        />
      )}

      <div
        className={css.fileWrap}
        style={{
          color:
            focusedFile === filePath
              ? activeFile === fileIndex
                ? "#ffffff"
                : "#ffffff80"
              : activeFile === fileIndex
              ? "#9d9d9d"
              : "#9d9d9d80",
          fontStyle: currentFiles.find(
            (file) => file.path === filePath && !file.pinned
          )
            ? "italic"
            : "normal",
        }}
      >
        <FileIcon extension={getExtension(fileName)} />
        <div className={css.name}>
          {fileName === "시작.vs" ? "시작" : fileName}
        </div>
        {dup && dup === fileName && (
          <div className={css.path}>{getUpPath(filePath)}</div>
        )}
      </div>

      <div
        className={css.close}
        onClick={(e) => closeFile(e)}
        style={focusedFile === filePath ? { color: "#ffffff", opacity: 1 } : {}}
      >
        <VscChromeClose />
      </div>
    </div>
  );
};

export default FileTab;
