import React, { useState, memo } from "react";
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

  const IconComponent =
    Icons[iconKey.charAt(0).toUpperCase() + iconKey.slice(1)];

  if (IconComponent) {
    return <IconComponent className={css.icon} />;
  }
};

const TreeNode = memo(
  ({ name, children, isFile, extension, depth, scrollref }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
      if (!isFile) {
        setIsOpen((prev) => !prev);
      }
    };

    return (
      <div className={css.treeNodeWrap}>
        <div className={css.treeNode} onClick={handleClick}>
          {isFile ? (
            <div
              className={css.fileWrap}
              style={
                name === "" ? { background: "none", cursor: "default" } : {}
              }
            >
              <div
                className={css.file}
                style={{ paddingLeft: `${depth * 8}px` }}
              >
                <div>
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
              className={css.folderWrap}
              style={name === "LEE BHIN" ? { background: "none" } : {}}
            >
              <div
                className={css.folder}
                style={{ paddingLeft: `${depth * 8}px` }}
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
                    {isOpen ? (
                      <>
                        <div>
                          <VscChevronDown className={css.treeIcon} />
                        </div>
                        <div>
                          <Icons.FolderOpen className={css.folderIcon} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <VscChevronRight className={css.treeIcon} />
                        </div>
                        <div>
                          <Icons.Folder className={css.folderIcon} />
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
                  maxHeight: "calc(100vh - 95px)",
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
              />
            ))}
        </div>
      </div>
    );
  }
);

const getExtension = (fileName) => {
  const parts = fileName.split(".");
  return parts.length > 1 ? "." + parts[parts.length - 1] : "";
};

export default TreeNode;
