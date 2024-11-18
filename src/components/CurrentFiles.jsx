import css from "../styles/File.module.css";
import { useSelector } from "react-redux";
import FileTab from "./FileTab";

const CurrentFiles = () => {
  const { currentFiles } = useSelector((state) => state.history);

  const getFileName = (filePath) => {
    const parts = filePath.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className={css.CurrentFiles}>
      {currentFiles.map((file, index) => (
        <>
          <FileTab
            key={index}
            fileName={getFileName(file.path)}
            filePath={file.path}
          />
        </>
      ))}
      <div className={css.fill} />
    </div>
  );
};

export default CurrentFiles;
