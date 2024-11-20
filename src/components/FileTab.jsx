import { useDispatch, useSelector } from "react-redux";
import css from "../styles/File.module.css";
import FileIcon from "./FileIcon";
import { VscChromeClose } from "react-icons/vsc";
import { setFocusedFile, setHistory } from "../features/historySlice";
import { setCurrentFiles } from "../features/historySlice";
import { useEffect, useState } from "react";
import getExtension from "../features/getExtension";

const FileTab = ({ fileName, filePath }) => {
  const dispatch = useDispatch();
  const [dup, setDup] = useState(null);

  const { focusedFile, currentFiles, history } = useSelector(
    (state) => state.history
  );

  const closeFile = (e) => {
    e.stopPropagation();
    const updatedFiles = currentFiles.filter((file) => file.path !== filePath);

    dispatch(setCurrentFiles(updatedFiles));
  };

  const tabClick = () => {
    const lastFile = history[history.length - 1];
    dispatch(setFocusedFile(filePath));
    if (lastFile !== filePath) {
      dispatch(setHistory([...history, filePath]));
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
        dispatch(setCurrentFiles(updatedFiles));
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
      {focusedFile === filePath && <div className={css.tabLine} />}

      <div
        className={css.fileWrap}
        style={{
          color: focusedFile === filePath ? "#ffffff" : undefined,
          fontStyle: currentFiles.find(
            (file) => file.path === filePath && !file.pinned
          )
            ? "italic"
            : "normal",
        }}
      >
        <FileIcon extension={getExtension(fileName)} />
        <div className={css.name}>{fileName}</div>
        {dup && dup === fileName && (
          <div className={css.path}>{getUpPath(filePath)}</div>
        )}
      </div>

      <div
        className={css.close}
        onClick={(e) => closeFile(e)}
        style={focusedFile === filePath ? { color: "#ffffff" } : {}}
      >
        <VscChromeClose />
      </div>
    </div>
  );
};

export default FileTab;
