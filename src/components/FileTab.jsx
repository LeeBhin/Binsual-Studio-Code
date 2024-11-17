import { useDispatch, useSelector } from 'react-redux';
import css from '../styles/File.module.css'
import FileIcon from './FileIcon';
import { VscChromeClose } from "react-icons/vsc";
import { setFocusedFile, setHistory } from '../features/historySlice';
import { setCurrentFiles } from '../features/historySlice';

const FileTab = ({ fileName, filePath }) => {
    const dispatch = useDispatch();

    const { focusedFile, currentFiles, history } = useSelector(
        (state) => state.history
    );

    const getExtension = (fileName) => {
        if (fileName === "robots.txt") return "robots";
        const parts = fileName.split(".");
        return parts.length > 1 ? "." + parts[parts.length - 1] : "";
    };

    const closeFile = (e) => {
        e.stopPropagation();
        const updatedFiles = currentFiles.filter((file) => file.path !== filePath);

        dispatch(setCurrentFiles(updatedFiles));
    };

    const tabClick = () => {
        const lastFile = history[history.length - 1];
        dispatch(setFocusedFile(filePath))
        if (lastFile !== filePath) {
            dispatch(setHistory([...history, filePath]));
        }
    }

    return (
        <div className={css.FileTab}
            onClick={() => tabClick()}
            style={focusedFile === filePath ? { backgroundColor: '#1f1f1f' } : {}}>
            {focusedFile === filePath && <div className={css.tabLine} />}

            <div className={css.fileWrap}>
                <FileIcon extension={getExtension(fileName)} />
                <div className={css.name}>
                    {fileName}
                </div>
            </div>

            <div className={css.close} onClick={(e) => closeFile(e)}>
                <VscChromeClose />
            </div>
            {focusedFile === filePath && <div className={css.outline} />}
        </div >
    );
};

export default FileTab;
