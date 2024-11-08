import React, { useState, memo } from 'react';
import { VscArchive, VscAzure, VscBeaker, VscChevronDown, VscChevronRight, VscFolderOpened, VscFolder } from 'react-icons/vsc';
import styles from '../styles/Layout.module.css';

const testData = {
    'LEE BHIN': {
        about: ['introduction.txt'],
        skills: {
            'html-skills.html': null,
            'css-skills.css': null,
            'javascript-skills.js': null,
        },
        projects: {
            project1: {
                'README.md': null,
                front: null,
                back: null,
            },
        },
    },
};

const FileIcon = ({ extension }) => {
    switch (extension) {
        case '.html':
            return <VscBeaker />;
        case '.css':
            return <VscAzure />;
        case '.js':
            return <VscArchive />;
        default:
            return <VscFolder />;
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
        <div className={styles.treeNodeWrap}>
            <div
                className={styles.treeNode}
                onClick={handleClick}
            >
                {isFile ? (
                    <>
                        <FileIcon extension={extension} />
                        {name}
                    </>
                ) : (
                    <>
                        {isOpen ? (
                            <>
                                <VscChevronDown className={styles.treeIcon} />
                                <VscFolderOpened />
                            </>
                        ) : (
                            <>
                                <VscChevronRight className={styles.treeIcon} />
                                <VscFolder />
                            </>
                        )}
                        {name}
                    </>
                )}
            </div>
            {!isFile && isOpen && (
                <div className={styles.treeChildren}>
                    {Object.keys(children).map((key) => (
                        <TreeNode
                            key={key}
                            name={key}
                            children={children[key]}
                            isFile={children[key] === null}
                            extension={children[key] === null ? getExtension(key) : null}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

const getExtension = (fileName) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
};

const FolderTree = () => {
    return (
        <div className={styles.folderTree}>
            {Object.keys(testData).map((key) => (
                <TreeNode
                    key={key}
                    name={key}
                    children={testData[key]}
                    isFile={false}
                />
            ))}
        </div>
    );
};

export default FolderTree;