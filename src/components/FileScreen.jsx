import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import css from "../styles/File.module.css";
import { VscChevronRight } from "react-icons/vsc";
import FileIcon from "./FileIcon";
import MonacoEditor from "@monaco-editor/react";
import {
  setCurrentFiles,
  setErr,
  setRowCol,
  setSelected,
} from "../features/historySlice";
import { errorMsg } from "./../data/errorMsg";
import getLanguage from "./../features/getLanguage";
import getExtension from "./../features/getExtension";
import Start from "./layout/filePages/Start";
import treeData from "../data/treeData";
import Images from "../assets/Images";
import Debug from "./layout/filePages/Debug";

const FileScreen = ({ fileIndex }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoom, setZoom] = useState(false);
  const { activeFile } = useSelector((state) => state.history);

  const { currentFiles, focusedFile } = useSelector(
    (state) => state.history.windows[fileIndex]
  );

  const dispatch = useDispatch();
  const splitPath = focusedFile.split("/").slice(1);

  const getFileName = (filePath) => {
    const parts = filePath.split("/");
    return parts[parts.length - 1];
  };

  const handleEditorMount = (editor, monaco) => {
    const model = editor.getModel();

    const updateMarkers = (e) => {
      const code = model.getValue();

      const markers = [];
      const regex = /error/g;
      let match;
      while ((match = regex.exec(code)) !== null) {
        markers.push({
          startLineNumber: 1,
          startColumn: match.index + 1,
          endLineNumber: 1,
          endColumn: match.index + match[0].length + 1,
          message: errorMsg,
          severity: monaco.MarkerSeverity.Error,
        });
      }

      monaco.editor.setModelMarkers(model, "owner", markers);

      const allMarkers = monaco.editor.getModelMarkers({ model });
      const errors = allMarkers.filter(
        (marker) => marker.severity === monaco.MarkerSeverity.Error
      ).length;
      const warnings = allMarkers.filter(
        (marker) => marker.severity === monaco.MarkerSeverity.Warning
      ).length;

      dispatch(setErr({ err: errors, warning: warnings }));
    };

    editor.onDidChangeModelContent(updateMarkers);

    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      dispatch(setRowCol({ row: position.lineNumber, col: position.column }));
    });

    editor.onDidChangeCursorSelection((e) => {
      const selection = e.selection;

      const model = editor.getModel();
      const text = model.getValueInRange(selection);
      const selectionLength = text.length;

      dispatch(setSelected(selectionLength));
    });
  };

  const getFileData = (filePath) => {
    const fileName = filePath.split("/").pop();
    const findFileData = (data) => {
      for (const key in data) {
        if (typeof data[key] === "object") {
          const result = findFileData(data[key]);
          if (result) return result;
        } else if (key === fileName) return data[key];
      }
      return null;
    };
    return findFileData(treeData);
  };

  const getPNG = (filePath) => {
    const fileName = filePath.split("/").pop();
    const fileNameWithoutExtension = fileName.split(".")[0];

    const IconComponent = Images[fileNameWithoutExtension];

    if (IconComponent) {
      return <img src={IconComponent} alt={fileName} className={css.png} />;
    }
    return null;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Control") {
        setZoom(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Control") {
        setZoom(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleChange = () => {
    const updatedFiles = currentFiles.map((file) =>
      file.path === focusedFile ? { ...file, pinned: true } : file
    );
    dispatch(setCurrentFiles({ id: activeFile, currentFiles: updatedFiles }));
  };

  const getPage = () => {
    if (getFileName(focusedFile) === "시작.vs") {
      return <Start />;
    } else {
      return <Debug />;
    }
  };

  return (
    <div className={css.FileScreen}>
      {getFileName(focusedFile) === "시작.vs" ||
      getFileName(focusedFile) === "debug.exe" ? (
        <>{getPage()}</>
      ) : (
        <>
          <div className={css.pathTab}>
            {splitPath.map((item, index) => (
              <div key={index} className={css.pathElement}>
                {index === splitPath.length - 1 && (
                  <div className={css.fileIcon}>
                    <FileIcon
                      extension={getExtension(getFileName(focusedFile))}
                    />
                  </div>
                )}
                <div className={css.pathName}>{item}</div>
                {index !== splitPath.length - 1 && (
                  <VscChevronRight className={css.pathIcon} />
                )}
              </div>
            ))}
          </div>
          <div className={css.screen}>
            {focusedFile.includes("png") ? (
              <div
                className={css.pngWrap}
                style={{
                  transform: `scale(${zoomLevel})`,
                  cursor: zoom ? "zoom-out" : "zoom-in",
                }}
                onClick={(e) => {
                  if (!e.ctrlKey) {
                    setZoomLevel((prevZoom) => Math.min(prevZoom * 1.3, 3));
                  } else {
                    setZoomLevel((prevZoom) => Math.max(prevZoom / 1.3, 0.5));
                  }
                }}
              >
                {getPNG(focusedFile)}
              </div>
            ) : (
              <MonacoEditor
                height="100%"
                width="100%"
                language={getLanguage(getExtension(getFileName(focusedFile)))}
                value={getFileData(focusedFile)}
                theme="vs-dark"
                onMount={handleEditorMount}
                onChange={() => handleChange()}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FileScreen;
