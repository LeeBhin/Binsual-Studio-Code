import React, { useState } from "react";
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

const TreeNode = ({ name, children, isFile, extension, depth, scrollref, activeNode, setActiveNode, path = name }) => {
    const [isOpen, setIsOpen] = useState(false);

    const depthArray = Array(depth).fill(null);

    const handleClick = () => {
        if (!isFile) {
            setIsOpen((prev) => !prev);
        }
    };

    const getExtension = (fileName) => {
        const parts = fileName.split(".");
        return parts.length > 1 ? "." + parts[parts.length - 1] : "";
    };

    // const findGroup = (activePath, path) => {
    //     const a = activePath?.split('/').slice(0, -1).join('/');
    //     const p = path?.split('/').slice(0, -1).join('/');

    //     return a === p;
    // }

    // const findGroupFolder = (activePath, path) => {
    //     const a = activePath?.split('/').slice(0, -1).join('/');
    //     const p = path?.split('/').slice(0, -2).join('/');

    //     return a === p;
    // }

    // const findGroupFolderIn = (activePath, path) => {
    //     const a = activePath
    //     const p = path?.split('/').slice(0, -1).join('/');

    //     return a === p;
    // }

    return (
        <div className={css.treeNodeWrap}>
            <div className={css.treeNode} onClick={handleClick}>
                {isFile ? (
                    <div
                        className={`${css.fileWrap} ${activeNode?.path === path && name !== '' ? css.active : ""}`}
                        onClick={() => setActiveNode({ path, name, depth, isFile })}
                        style={name === "" ? { background: "none", cursor: "default" } : {}}
                    >
                        <div className={css.file} style={{ paddingLeft: `${depth * 8}px` }}>
                            <div>
                                <div className={css["indent-wrap"]}>
                                    {depthArray.map((_, index) => (
                                        <div key={index} className={css["indent-guide"]}
                                        // style={
                                        //     (activeNode?.isFile && findGroup(activeNode?.path, path) && depth === index + 1) ||
                                        //         (activeNode?.isFile && findGroupFolder(activeNode?.path, path) && depth === index + 2) ||
                                        //         (activeNode?.isFile === false && findGroup(activeNode?.path, path) && depth === index + 1) ||
                                        //         (findGroupFolderIn(activeNode?.path, path) && depth === index + 1)
                                        //         ? { opacity: '1' } : {}}
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
                        className={`${css.folderWrap} ${activeNode?.path === path && name !== '' ? css.active : ""}`}
                        onClick={() => setActiveNode({ path, name, depth, isFile })}
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
                                            <div key={index} className={css["indent-guide-folder"]}
                                            //  style={
                                            //     findGroupFolderIn(activeNode?.path, path) &&
                                            //         depth === index + 1
                                            //         ? { opacity: '1' } : {}
                                            //     } 
                                            />
                                        ))}
                                    </div>
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
                            maxHeight: "calc(100vh - 98px)",
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
