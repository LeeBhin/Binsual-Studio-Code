import React, { useEffect, useRef, useState } from "react";
import {
  VscChevronDown,
  VscChevronRight,
  VscBlank,
} from "react-icons/vsc";
import Icons from "../../assets/icons";
import FileIcon from "../FileIcon";
import Codicon from "../Codicon";
import Tooltip from "../Tooltip";
import {
  useHistory,
  setCurrentFiles,
  setFocusedFile,
  setHistory,
  setIsCurrentActive,
} from "../../store/history";
import getExtension from "../../features/getExtension";

const sideIconBg =
  "w-5 h-5 rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]";

// indent guide 위치 상수 — 파일/폴더 두 군데에서 동일하게 사용
const FILE_PADDING_PX = 8; // depth × 이 값 = 파일 노드 paddingLeft
const FOLDER_PADDING_PX = 8.9; // depth × 이 값 = 폴더 노드 paddingLeft (chevron 정렬 보정)
const FILE_GUIDE_LEFT = 14;
const FILE_GUIDE_GAP = 8;
const FOLDER_GUIDE_LEFT = 17;
const FOLDER_GUIDE_GAP = 11;
const FOLDER_GUIDE_OFFSET = 3;

const IndentGuides = ({ depth, leftPx, gapPx, marginLeftPx = 0, isActive }) => (
  <div
    className="absolute flex h-full"
    style={{ left: `${leftPx}px`, gap: `${gapPx}px` }}
  >
    {Array.from({ length: depth }).map((_, index) => (
      <div
        key={index}
        className={`border-l border-[var(--text-dim)] opacity-0 transition-[opacity] duration-100 ease-linear group-hover/tree:opacity-10 ${
          index === 0 ? "hidden" : ""
        }`}
        style={{
          ...(marginLeftPx ? { marginLeft: `-${marginLeftPx}px` } : {}),
          ...(isActive(index) ? { opacity: "0.3" } : {}),
        }}
      />
    ))}
  </div>
);

const TreeNode = ({
  name,
  children,
  isFile,
  extension,
  depth,
  scrollref,
  activeNode,
  setActiveNode,
  path = name,
}) => {
  const sidebarRef = useRef(null);
  const activeFile = useHistory((s) => s.activeFile);
  const startLink = useHistory((s) => s.startLink);
  const win = useHistory((s) => s.windows[activeFile]);
  const currentFiles = win?.currentFiles ?? [];
  const focusedFile = win?.focusedFile ?? "";
  const history = win?.history ?? [];
  const isCurrentActive = win?.isCurrentActive;
  const [isOpen, setIsOpen] = useState(
    name === "LEE BHIN" || startLink.includes(name)
  );

  useEffect(() => {
    if (startLink.length < 1) return;
    setIsOpen(name === "LEE BHIN" || startLink.includes(name));
  }, [startLink, name]);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setActiveNode();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    if (name === "") return;

    if (!isFile) {
      setIsOpen((prev) => !prev);
    } else {
      setFocusedFile({
        id: activeFile,
        focusedFile: path,
      });

      const fileExists = currentFiles.some((file) => file.path === path);

      if (currentFiles.length === 0 && !fileExists) {
        setCurrentFiles({
          id: activeFile,
          currentFiles: [{ pinned: false, path }],
        });
      }

      const lastFile = history[history.length - 1];

      if (lastFile !== path) {
        setHistory({ id: activeFile, history: [...history, path] });
      }

      if (focusedFile === "") return;

      const i = currentFiles.findIndex((f) => f.path === focusedFile);

      const files = currentFiles.map((file, index) => {
        if (index === i && !file.pinned) {
          return { ...file, path };
        }
        return file;
      });

      if (currentFiles[i]?.pinned && !fileExists) {
        files.splice(i + 1, 0, { pinned: false, path });
      }

      if (currentFiles.length !== 0 && !fileExists) {
        setCurrentFiles({
          id: activeFile,
          currentFiles: files,
        });
      }
    }
  };

  // path가 base를 ancestor segment로 가지는지 (자기 자신 제외)
  const hasAncestor = (pathStr, base) => {
    if (!pathStr || !base) return false;
    const parts = pathStr.split("/");
    for (let i = parts.length - 1; i > 0; i--) {
      if (parts.slice(0, i).join("/") === base) return true;
    }
    return false;
  };

  const isActiveFile = (activeNode, path, index, depth) => {
    const node = activeNode || isCurrentActive;
    if (!node) return false;

    const { isFile: nIsFile, isOpen: nIsOpen, depth: nDepth, path: nPath } = node;
    const nParent = nPath?.split("/").slice(0, -1).join("/");
    const qGrand = path?.split("/").slice(0, -2).join("/");

    const sharesParent = nParent && nParent === qGrand; // active의 부모 === 현재의 grandparent
    const groupHit = hasAncestor(path, nParent); // active의 부모가 현재의 ancestor
    const inHit = hasAncestor(path, nPath); // active 자체가 현재의 ancestor

    if (nIsFile) {
      return (
        nDepth === index + 1 && (sharesParent || (groupHit && nDepth === depth))
      );
    }

    if (nIsOpen) {
      return (
        (inHit && nDepth === depth) ||
        (groupHit && nDepth === index + 1)
      );
    }

    return inHit && nDepth === index;
  };

  const handleDoubleClick = (path) => {
    const updatedFiles = currentFiles.map((file) =>
      file.path === path ? { ...file, pinned: true } : file
    );

    setCurrentFiles({ id: activeFile, currentFiles: updatedFiles });
  };

  const isActive = activeNode?.path === path && name !== "";
  const isLowActive = focusedFile === path && currentFiles.length > 0;

  const wrapStyle = isActive
    ? { backgroundColor: "var(--active)", boxShadow: "0 0 0 1px var(--accent) inset" }
    : isLowActive
    ? { backgroundColor: "var(--active-low)" }
    : {};

  return (
    <div
      className={`overflow-hidden group/wrap ${
        name === "LEE BHIN" ? "group/root" : ""
      }`}
      ref={name === "LEE BHIN" ? sidebarRef : null}
    >
      <div
        className="cursor-pointer flex items-center h-[22px] relative"
        onClick={handleClick}
      >
        {isFile ? (
          <div
            className="h-[22px] w-full hover:bg-[var(--hover)]"
            onDoubleClick={() => handleDoubleClick(path)}
            onClick={() => {
              setActiveNode({ path, name, depth, isFile });
              setIsCurrentActive({
                id: activeFile,
                isCurrentActive: { path, name, depth, isFile },
              });
            }}
            style={
              name === ""
                ? { background: "none", cursor: "default" }
                : wrapStyle
            }
          >
            <div
              className="flex items-center gap-1.5 h-[22px] leading-none relative w-full pr-0.5"
              style={{ paddingLeft: `${depth * FILE_PADDING_PX}px` }}
            >
              <div className="flex items-center h-[22px]">
                <IndentGuides
                  depth={depth}
                  leftPx={FILE_GUIDE_LEFT}
                  gapPx={FILE_GUIDE_GAP}
                  isActive={(i) => isActiveFile(activeNode, path, i, depth)}
                />
                <VscBlank style={{ marginRight: "-1px" }} />
              </div>
              <div className="flex items-center h-[22px]">
                <FileIcon extension={extension} />
              </div>
              <span className="w-full h-[22px] leading-[22px] truncate">
                {name}
              </span>
            </div>
          </div>
        ) : (
          <div
            style={
              name === "LEE BHIN" ? { background: "none" } : wrapStyle
            }
            className="h-[22px] w-full hover:bg-[var(--hover)]"
            onClick={() => setActiveNode({ path, name, depth, isFile, isOpen })}
          >
            <div
              className="flex items-center gap-1.5 h-[22px] leading-none relative w-full pr-0.5"
              style={{
                paddingLeft:
                  name === "LEE BHIN"
                    ? "1px"
                    : `${depth * FOLDER_PADDING_PX}px`,
              }}
            >
              {name === "LEE BHIN" ? (
                <>
                  {isOpen ? (
                    <div>
                      <VscChevronDown
                        className="text-base -mr-1"
                        style={{ paddingLeft: "1px" }}
                      />
                    </div>
                  ) : (
                    <div>
                      <VscChevronRight
                        className="text-base -mr-1"
                        style={{ paddingLeft: "1px" }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <IndentGuides
                    depth={depth}
                    leftPx={FOLDER_GUIDE_LEFT}
                    gapPx={FOLDER_GUIDE_GAP}
                    marginLeftPx={FOLDER_GUIDE_OFFSET}
                    isActive={(i) => isActiveFile(activeNode, path, i, depth)}
                  />
                  {isOpen ? (
                    <>
                      <div>
                        <VscChevronDown className="text-base -mr-1" />
                      </div>
                      <div>
                        {name === "images" ? (
                          <Icons.FolderImagesOpen />
                        ) : (
                          <Icons.FolderOpen />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <VscChevronRight className="text-base -mr-1" />
                      </div>
                      <div>
                        {name === "images" ? (
                          <Icons.FolderImages />
                        ) : (
                          <Icons.Folder />
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
              <span
                className="overflow-hidden"
                style={
                  name === "LEE BHIN"
                    ? {
                        width: "100%",
                        fontWeight: "bold",
                        fontSize: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                      }
                    : {}
                }
              >
                <div
                  className="w-full h-[22px] leading-[22px] truncate group/name"
                  style={
                    name === "LEE BHIN"
                      ? {
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }
                      : {}
                  }
                >
                  <div className="truncate w-full">{name}</div>
                  {name === "LEE BHIN" && (
                    <div
                      className="flex items-center text-base gap-[3px] pr-[3px] opacity-0 pointer-events-none group-hover/root:opacity-100 group-hover/root:pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip label="새 파일..." position="bottom" group="explorer-actions">
                        <div className={sideIconBg}>
                          <Codicon name="new-file" size={16} />
                        </div>
                      </Tooltip>
                      <Tooltip label="새 폴더..." position="bottom" group="explorer-actions">
                        <div className={sideIconBg}>
                          <Codicon name="new-folder" size={16} />
                        </div>
                      </Tooltip>
                      <Tooltip label="탐색기 새로 고침" position="bottom" group="explorer-actions">
                        <div className={sideIconBg}>
                          <Codicon name="refresh" size={16} />
                        </div>
                      </Tooltip>
                      <Tooltip label="탐색기에서 폴더 축소" position="bottom" group="explorer-actions">
                        <div className={sideIconBg}>
                          <Codicon name="collapse-all" size={16} />
                        </div>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className="overflow-x-hidden [&::-webkit-scrollbar]:hidden group-hover/wrap:[&::-webkit-scrollbar-thumb]:bg-[var(--scrollbar-hover)]"
        ref={name === "LEE BHIN" ? scrollref : null}
        style={
          name === "LEE BHIN"
            ? {
                display: isOpen ? "block" : "none",
                overflowY: "auto",
                maxHeight: "calc(100vh - 106px)",
                height: "auto",
                position: "relative",
              }
            : {
                display: isOpen ? "block" : "none",
              }
        }
      >
        {!isFile &&
          Object.keys(children).map((key) => (
            <TreeNode
              key={key}
              name={key}
              children={children[key]}
              isFile={typeof children[key] !== "object"}
              extension={
                typeof children[key] !== "object" ? getExtension(key) : null
              }
              depth={depth + 1}
              activeNode={activeNode}
              setActiveNode={setActiveNode}
              path={`${path}/${key}`}
            />
          ))}
      </div>
    </div>
  );
};

export default TreeNode;
