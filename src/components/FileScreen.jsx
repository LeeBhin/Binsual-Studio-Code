import React, { useEffect, useRef, useState } from "react";
import Codicon from "./Codicon";
import FileIcon from "./FileIcon";
import MonacoEditor from "@monaco-editor/react";
import {
  useHistory,
  setCurrentFiles,
  setErr,
  setRowCol,
  setSelected,
} from "../store/history";
import { errorMsg } from "./../data/errorMsg";
import getLanguage from "./../features/getLanguage";
import getExtension from "./../features/getExtension";
import {
  registerSymbolProviders,
  getEnclosingPath,
} from "./../features/symbolPath";
import Start from "./layout/filePages/Start";
import treeData from "../data/treeData";
import Images from "../assets/Images";
import Debug from "./layout/filePages/Debug";

// monaco.languages.SymbolKind enum index → codicon suffix
const kindByIndex = [
  "file",
  "namespace",
  "namespace",
  "package",
  "class",
  "method",
  "property",
  "field",
  "constructor",
  "enum",
  "interface",
  "method",
  "variable",
  "variable",
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "key",
  "null",
  "enum-member",
  "structure",
  "event",
  "operator",
  "parameter",
];

// TS ScriptElementKind (string) → codicon suffix
const kindByName = {
  method: "method",
  function: "method",
  "local function": "method",
  getter: "method",
  setter: "method",
  accessor: "method",
  property: "property",
  class: "class",
  "local class": "class",
  variable: "variable",
  var: "variable",
  "local var": "variable",
  let: "variable",
  const: "variable",
  field: "field",
  interface: "interface",
  enum: "enum",
  "enum member": "enum-member",
  constructor: "constructor",
  module: "namespace",
  namespace: "namespace",
  type: "interface",
  alias: "namespace",
  parameter: "parameter",
  string: "string",
};

const kindToSuffix = (kind) => {
  if (typeof kind === "number") return kindByIndex[kind] || "misc";
  if (typeof kind === "string") return kindByName[kind] || "misc";
  return "misc";
};

const pickCodiconName = ({ name, kind, lang }) => {
  if (lang === "json") return "json";
  if (lang === "html") return "symbol-field";
  if (lang === "css") return "symbol-class";
  if (lang === "javascript" || lang === "typescript") {
    if (name && /\bcallback\b/i.test(name)) return "symbol-method";
    if (kind === "property") return "symbol-property";
  }
  return `symbol-${kindToSuffix(kind)}`;
};

const codiconColorMap = {
  "symbol-method": "#73BAF9",
  "symbol-variable": "#73BAF9",
  "symbol-property": "white",
  "symbol-class": "#F2A528",
  "symbol-field": "#3B90EC",
};

const FileScreen = ({ fileIndex }) => {
  const [zoomLevels, setZoomLevels] = useState({});
  const [zoom, setZoom] = useState(false);
  const [symbolPath, setSymbolPath] = useState([]);
  const activeFile = useHistory((s) => s.activeFile);
  const win = useHistory((s) => s.windows[fileIndex]);
  const currentFiles = win?.currentFiles ?? [];
  const focusedFile = win?.focusedFile ?? "";

  const debounceRef = useRef(null);

  const splitPath = focusedFile.split("/").slice(1);

  const zoomLevel = zoomLevels[focusedFile] ?? 1;
  const setZoomLevel = (updater) => {
    setZoomLevels((prev) => {
      const cur = prev[focusedFile] ?? 1;
      const next = typeof updater === "function" ? updater(cur) : updater;
      return { ...prev, [focusedFile]: next };
    });
  };

  useEffect(() => {
    setSymbolPath([]);
  }, [focusedFile]);

  // 닫힌 파일의 zoom 정리 (재오픈 시 초기화)
  useEffect(() => {
    setZoomLevels((prev) => {
      const openPaths = new Set(currentFiles.map((f) => f.path));
      const next = {};
      for (const k of Object.keys(prev)) {
        if (openPaths.has(k)) next[k] = prev[k];
      }
      return next;
    });
  }, [currentFiles]);

  const getFileName = (filePath) => {
    const parts = filePath.split("/");
    return parts[parts.length - 1];
  };

  const handleEditorMount = (editor, monaco) => {
    const model = editor.getModel();
    registerSymbolProviders(monaco);

    const updateSymbolPath = (position) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const path = await getEnclosingPath(monaco, model, position);
        setSymbolPath(path);
      }, 150);
    };
    updateSymbolPath(editor.getPosition());

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

      setErr({ err: errors, warning: warnings });
    };

    editor.onDidChangeModelContent(updateMarkers);

    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      setRowCol({ row: position.lineNumber, col: position.column });
      updateSymbolPath(position);
    });

    editor.onDidChangeModelContent(() => {
      updateSymbolPath(editor.getPosition());
    });

    editor.onDidChangeCursorSelection((e) => {
      const selection = e.selection;

      const model = editor.getModel();
      const text = model.getValueInRange(selection);
      const selectionLength = text.length;

      setSelected(selectionLength);
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
      return (
        <img
          src={IconComponent}
          alt={fileName}
          className="max-w-full max-h-full w-auto h-auto"
        />
      );
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
    setCurrentFiles({ id: activeFile, currentFiles: updatedFiles });
  };

  const getPage = () => {
    if (getFileName(focusedFile) === "시작.vs") {
      return <Start />;
    } else {
      return <Debug />;
    }
  };

  return (
    <div className="w-full h-full">
      {getFileName(focusedFile) === "시작.vs" ||
      getFileName(focusedFile) === "debug.exe" ? (
        <>{getPage()}</>
      ) : (
        <>
          <div className="flex items-center text-[#A1A1A1] text-[13px] py-[3px] px-[17px]">
            {splitPath.map((item, index) => (
              <div
                key={`f-${index}`}
                className="flex items-center cursor-pointer hover:text-[var(--text-strong)]"
              >
                {index === splitPath.length - 1 && (
                  <div className="h-5 pr-[5px]">
                    <FileIcon
                      extension={getExtension(getFileName(focusedFile))}
                    />
                  </div>
                )}
                <div className="h-[18px] leading-[18px]">{item}</div>
                {(index !== splitPath.length - 1 ||
                  symbolPath.length > 0) && (
                  <Codicon name="chevron-right" size={18} />
                )}
              </div>
            ))}
            {symbolPath.map((item, index) => {
              const iconName = pickCodiconName(item);
              return (
                <div
                  key={`s-${index}`}
                  className="flex items-center cursor-pointer hover:text-[var(--text-strong)]"
                >
                  <Codicon
                    name={iconName}
                    size={16}
                    className="mr-1"
                    style={{ color: codiconColorMap[iconName] || "white" }}
                  />
                  <div className="h-[18px] leading-[18px] truncate max-w-[200px]">
                    {item.name}
                  </div>
                  {index !== symbolPath.length - 1 && (
                    <Codicon name="chevron-right" size={18} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full h-[calc(100%-26px)] relative overflow-hidden">
            {focusedFile.includes("png") ? (
              <div
                className="w-full h-full flex justify-center items-center"
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
