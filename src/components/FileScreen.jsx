import { useDispatch, useSelector } from "react-redux";
import css from "../styles/File.module.css";
import { VscChevronRight } from "react-icons/vsc";
import FileIcon from "./FileIcon";
import MonacoEditor from "@monaco-editor/react";
import { setErr, setRowCol, setSelected } from "../features/historySlice";
import { errorMsg } from "./../data/errorMsg";
import getLanguage from "./../features/getLanguage";
import getExtension from "./../features/getExtension";

const FileScreen = () => {
  const { focusedFile } = useSelector((state) => state.history);
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

  return (
    <div className={css.FileScreen}>
      <div className={css.pathTab}>
        {splitPath.map((item, index) => (
          <div key={index} className={css.pathElement}>
            {index === splitPath.length - 1 && (
              <div className={css.fileIcon}>
                <FileIcon extension={getExtension(getFileName(focusedFile))} />
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
        <MonacoEditor
          height="100%"
          width="100%"
          language={getLanguage(getExtension(getFileName(focusedFile)))}
          value={"hello world"}
          theme="vs-dark"
          onMount={handleEditorMount}
        />
      </div>
    </div>
  );
};

export default FileScreen;
