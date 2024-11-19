import { useSelector } from "react-redux";
import css from "../styles/File.module.css";
import { VscChevronRight } from "react-icons/vsc";
import FileIcon from "./FileIcon";

const FileScreen = () => {
  const { focusedFile } = useSelector((state) => state.history);

  const splitPath = focusedFile.split("/").slice(1);

  const getFileName = (filePath) => {
    const parts = filePath.split("/");
    return parts[parts.length - 1];
  };

  const getExtension = (fileName) => {
    if (fileName === "robots.txt") return "robots";
    const parts = fileName.split(".");
    return parts.length > 1 ? "." + parts[parts.length - 1] : "";
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
    </div>
  );
};

export default FileScreen;
