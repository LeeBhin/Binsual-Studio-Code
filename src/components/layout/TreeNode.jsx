import React, { useState, memo } from 'react';
import { VscChevronDown, VscChevronRight, VscBlank } from 'react-icons/vsc';
import Icons from '../../assets/icons';
import css from "../../styles/Layout.module.css"
import treeData from '../../data/treeData'

const FileIcon = ({ extension }) => {
    let iconKey = extension.replace('.', '')

    if (iconKey === 'sql' || iconKey === 'accdb') {
        iconKey = 'sql'
    }

    const IconComponent = Icons[iconKey.charAt(0).toUpperCase() + iconKey.slice(1)];

    if (IconComponent) {
        return <IconComponent className={css.icon} />;
    }
};

const TreeNode = memo(({ name, children, isFile, extension }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (!isFile) {
            setIsOpen((prev) => !prev);
        }
    };

    return (
        <div className={css.treeNodeWrap} style={name === "LEE BHIN" ? { paddingLeft: '2px' } : {}}>
            <div
                className={css.treeNode}
                onClick={handleClick}
            >
                {isFile ? (
                    <div className={css.fileWrap}>
                        <div className={css.fileHover} />
                        <div className={css.file}>
                            <div><VscBlank style={{ marginRight: '-1px' }} /></div>
                            <div><FileIcon extension={extension} /></div>
                            <span className={css.name}>{name}</span>
                        </div>
                    </div>
                ) : (
                    <div className={css.folderWrap}>
                        <div className={css.fileHover} />
                        <div className={css.folder}>
                            {name === "LEE BHIN" ? (
                                <>
                                    {isOpen ? (
                                        <div><VscChevronDown className={css.treeIcon} /></div>
                                    ) : (
                                        <div><VscChevronRight className={css.treeIcon} /></div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {isOpen ? (
                                        <>
                                            <div><VscChevronDown className={css.treeIcon} /></div>
                                            <div><Icons.FolderOpen className={css.folderIcon} /></div>
                                        </>
                                    ) : (
                                        <>
                                            <div><VscChevronRight className={css.treeIcon} /></div>
                                            <div><Icons.Folder className={css.folderIcon} /></div>
                                        </>
                                    )}
                                </>
                            )}
                            <span style={name === "LEE BHIN" ? { fontWeight: 'bold', fontSize: '12px' } : {}}>
                                <div className={css.name}>{name}</div>
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div className={css.treeChildren} style={{ display: isOpen ? 'block' : 'none' }}>
                {!isFile && Object.keys(children).map((key) => (
                    <TreeNode
                        key={key}
                        name={key}
                        children={children[key]}
                        isFile={children[key] === null}
                        extension={children[key] === null ? getExtension(key) : null}
                    />
                ))}
            </div>
        </div>
    );
});

const getExtension = (fileName) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
};

const FolderTree = () => {
    return (
        <div className={css.folderTree}>
            {Object.keys(treeData).map((key) => (
                <TreeNode
                    key={key}
                    name={key}
                    children={treeData[key]}
                    isFile={false}
                    path=""
                />
            ))}
        </div>
    );
};

export default FolderTree;