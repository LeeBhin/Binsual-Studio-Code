import React, { useEffect, useRef, useState } from "react";
import {
  VscChevronDown,
  VscChevronRight,
  VscBlank,
  VscNewFile,
  VscNewFolder,
  VscRefresh,
  VscCollapseAll,
} from "react-icons/vsc";
import Icons from "../../assets/icons";
import FileIcon from "../FileIcon";
import css from "../../styles/Layout.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentFiles,
  setFocusedFile,
  setHistory,
} from "../../features/historySlice";
import getExtension from "../../features/getExtension";

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
  const dispatch = useDispatch();
  const { activeFile, startLink } = useSelector((state) => state.history);
  const [isOpen, setIsOpen] = useState(
    name === "LEE BHIN" || startLink.includes(name)
  );
  const { currentFiles, focusedFile, history } = useSelector(
    (state) => state.history.windows[activeFile] || {}
  );

  useEffect(() => {
    if (startLink.length < 1) return;
    setIsOpen(name === "LEE BHIN" || startLink.includes(name));
  }, [startLink, name]);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      const activeElement = document.querySelector(`.${css.active}`);
      if (activeElement) {
        activeElement.classList.remove(css.active);
        activeElement.classList.add(css.lowActive);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const depthArray = Array(depth).fill(null);

  const handleClick = () => {
    if (name === "") return;

    if (!isFile) {
      setIsOpen((prev) => !prev);
    } else {
      dispatch(
        setFocusedFile({
          id: activeFile,
          focusedFile: path,
        })
      );

      const fileExists = currentFiles.some((file) => file.path === path);

      if (currentFiles.length === 0 && !fileExists) {
        dispatch(
          setCurrentFiles({
            id: activeFile,
            currentFiles: [{ pinned: false, path }],
          })
        );
      }

      const lastFile = history[history.length - 1];

      if (lastFile !== path) {
        dispatch(setHistory({ id: activeFile, history: [...history, path] }));
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
        dispatch(
          setCurrentFiles({
            id: activeFile,
            currentFiles: files,
          })
        );
      }
    }
  };

  // 상위폴더 active
  const findGroup = (activePath, path) => {
    const basePath = activePath?.split("/").slice(0, -1).join("/");
    const parts = path?.split("/");

    return findParents(parts, basePath);
  };

  // 같은 폴더 안에 있을때
  const findGroupFolder = (activePath, path) => {
    const basePath = activePath?.split("/").slice(0, -1).join("/");
    const parentPath = path?.split("/").slice(0, -2).join("/");
    return basePath === parentPath;
  };

  // 내가 active
  const findGroupFolderIn = (activePath, path) => {
    const basePath = activePath;
    const parts = path?.split("/");

    return findParents(parts, basePath);
  };

  const findParents = (parts, basePath) => {
    for (let i = parts.length - 1; i > 0; i--) {
      const current = parts.slice(0, i).join("/");
      if (current === basePath) return true;
    }
  };

  const isActiveFile = (activeNode, path, index, depth) => {
    if (!activeNode) return;

    const { isFile, isOpen, depth: nodeDepth, path: nodePath } = activeNode;

    return (
      (nodeDepth === index + 1 &&
        isFile &&
        (findGroupFolder(nodePath, path) ||
          (findGroup(nodePath, path) && nodeDepth === depth))) ||
      (!isFile &&
        ((isOpen && findGroupFolderIn(nodePath, path) && nodeDepth === depth) ||
          (isOpen && findGroup(nodePath, path) && nodeDepth === index + 1) ||
          (!isOpen &&
            findGroupFolderIn(nodePath, path) &&
            nodeDepth === index)))
    );
  };

  const handleDoubleClick = (path) => {
    const updatedFiles = currentFiles.map((file) =>
      file.path === path ? { ...file, pinned: true } : file
    );

    dispatch(setCurrentFiles({ id: activeFile, currentFiles: updatedFiles }));
  };

  return (
    <div
      className={css.treeNodeWrap}
      ref={name === "LEE BHIN" ? sidebarRef : null}
    >
      <div className={css.treeNode} onClick={handleClick}>
        {isFile ? (
          <div
            className={`${css.fileWrap} ${
              activeNode?.path === path && name !== "" ? css.active : ""
            } 
          ${
            focusedFile === path && currentFiles.length > 0 ? css.lowActive : ""
          }`}
            onDoubleClick={() => handleDoubleClick(path)}
            onClick={() => setActiveNode({ path, name, depth, isFile })}
            style={name === "" ? { background: "none", cursor: "default" } : {}}
          >
            <div className={css.file} style={{ paddingLeft: `${depth * 8}px` }}>
              <div>
                <div className={css["indent-wrap"]}>
                  {depthArray.map((_, index) => (
                    <div
                      key={index}
                      className={css["indent-guide"]}
                      style={
                        isActiveFile(activeNode, path, index, depth)
                          ? { opacity: "1" }
                          : {}
                      }
                    />
                  ))}
                </div>
                <VscBlank style={{ marginRight: "-1px" }} />
              </div>
              <div>
                <FileIcon extension={extension} />
              </div>
              <span className={css.name}>{name}</span>
            </div>
          </div>
        ) : (
          <div
            style={name === "LEE BHIN" ? { background: "none" } : {}}
            className={`${css.folderWrap} ${
              activeNode?.path === path && name !== "" ? css.active : ""
            }`}
            onClick={() => setActiveNode({ path, name, depth, isFile, isOpen })}
          >
            <div
              className={css.folder}
              style={{ paddingLeft: `${depth * 8.9}px` }}
            >
              {name === "LEE BHIN" ? (
                <>
                  {isOpen ? (
                    <div>
                      <VscChevronDown
                        className={css.treeIcon}
                        style={{ paddingLeft: "1px" }}
                      />
                    </div>
                  ) : (
                    <div>
                      <VscChevronRight
                        className={css.treeIcon}
                        style={{ paddingLeft: "1px" }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className={css["indent-wrap-folder"]}>
                    {depthArray.map((_, index) => (
                      <div
                        key={index}
                        className={css["indent-guide-folder"]}
                        style={
                          isActiveFile(activeNode, path, index, depth)
                            ? { opacity: "1" }
                            : {}
                        }
                      />
                    ))}
                  </div>
                  {isOpen ? (
                    <>
                      <div>
                        <VscChevronDown className={css.treeIcon} />
                      </div>
                      <div>
                        {name === "images" ? (
                          <Icons.FolderImagesOpen className={css.folderIcon} />
                        ) : (
                          <Icons.FolderOpen className={css.folderIcon} />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <VscChevronRight className={css.treeIcon} />
                      </div>
                      <div>
                        {name === "images" ? (
                          <Icons.FolderImages className={css.folderIcon} />
                        ) : (
                          <Icons.Folder className={css.folderIcon} />
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
              <span
                style={
                  name === "LEE BHIN"
                    ? {
                        width: "100%",
                        fontWeight: "bold",
                        fontSize: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        overflow: "hidden",
                      }
                    : {
                        overflow: "hidden",
                      }
                }
              >
                <div
                  className={css.name}
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
                  <div className={css.nameTxt}>{name}</div>
                  {name === "LEE BHIN" && (
                    <div className={css.rootFolderTool}>
                      <div className={css["side-icon-bg"]}>
                        <VscNewFile />
                      </div>
                      <div className={css["side-icon-bg"]}>
                        <VscNewFolder />
                      </div>
                      <div className={css["side-icon-bg"]}>
                        <VscRefresh />
                      </div>
                      <div className={css["side-icon-bg"]}>
                        <VscCollapseAll />
                      </div>
                    </div>
                  )}
                </div>
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className={css.treeChildren}
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
