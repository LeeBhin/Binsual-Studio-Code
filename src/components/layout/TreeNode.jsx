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
import css from "../../styles/Layout.module.css";

const FileIcon = ({ extension }) => {
  let iconKey = extension.replace(".", "");

  if (iconKey === "sql" || iconKey === "accdb") {
    iconKey = "sql";
  }

  if (extension === "robots") iconKey = "robots";

  const IconComponent =
    Icons[iconKey.charAt(0).toUpperCase() + iconKey.slice(1)];

  if (IconComponent) {
    return <IconComponent className={css.icon} />;
  }
};

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
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
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
    if (!isFile) {
      setIsOpen((prev) => !prev);
    }
  };

  const getExtension = (fileName) => {
    if (fileName === "robots.txt") return "robots";
    const parts = fileName.split(".");
    return parts.length > 1 ? "." + parts[parts.length - 1] : "";
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
            }`}
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
                    ? { fontWeight: "bold", fontSize: "12px" }
                    : {}
                }
              >
                <div
                  className={css.name}
                  style={
                    name === "LEE BHIN"
                      ? {
                          width: "180px",
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
              isFile={children[key] === null}
              extension={children[key] === null ? getExtension(key) : null}
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
