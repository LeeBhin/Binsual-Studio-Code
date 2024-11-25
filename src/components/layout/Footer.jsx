import { useSelector } from "react-redux";
import css from "../../styles/Layout.module.css";
import {
  VscRemote,
  VscError,
  VscWarning,
  VscBell,
  VscJson,
} from "react-icons/vsc";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

const extensionMap = {
  js: "JavaScript",
  jsx: "JavaScript JSX",
  ts: "TypeScript",
  tsx: "TypeScript JSX",
  vue: "JavaScript JSX",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  md: "Markdown",
  py: "Python",
  sql: "SQL",
  cql: "Cypher",
  png: "Image",
  yaml: "YAML",
  txt: "일반 텍스트",
  gitignore: "Ignore",
  url: "URL",
  accdb: "Access Database",
  pptx: "PowerPoint",
  xlsx: "Excel",
  hwp: "Hangul",
  ppt: "PowerPoint",
  docx: "Word",
  env: "Properties",
};

const Footer = () => {
  const { rowAndCol, selected, errors, activeFile } = useSelector(
    (state) => state.history
  );

  const { focusedFile } = useSelector(
    (state) => state.history.windows[activeFile] || {}
  );

  const [thumbs, setThumbs] = useState();

  const getExtension = (filePath) => {
    const extension = filePath?.split(".").pop();
    return extensionMap[extension] || "일반 텍스트";
  };

  useEffect(() => {
    const docRef = doc(db, "rainThumbsData", "triggerCount");

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setThumbs(docSnap.data().count);
      } else {
        setThumbs(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={css.footerWrap}>
      <div className={css["footer-left"]}>
        <div className={css.remote}>
          <VscRemote />
        </div>

        <div className={css.problem}>
          <div className={css.err}>
            <span>
              <VscError />
            </span>
            <span className={css["problem-txt"]}>{errors.err}</span>
          </div>
          <div className={css.warning}>
            <span>
              <VscWarning />
            </span>
            <span className={css["problem-txt"]}>{errors.warning}</span>
          </div>
        </div>
      </div>

      <div className={css["footer-right"]}>
        <div className={css["right-content"]}>
          {focusedFile && (
            <>
              <div className={css["row-colmun"]}>
                줄 {rowAndCol.row}, 열 {rowAndCol.col}
                {selected > 0 && `(${selected} 선택됨)`}
              </div>
              <div className={css["blank"]}>공백: 4</div>
              <div className={css["utf"]}>UTF-8</div>
              <div className={css["CRLF"]}>CRLF</div>
              {getExtension(focusedFile) !== "text" ? (
                <div className={css["json"]}>
                  <VscJson />
                  <span className={css["json-txt"]}>
                    {getExtension(focusedFile)}
                  </span>
                </div>
              ) : (
                <div className={css["general-txt"]}>일반 텍스트</div>
              )}
            </>
          )}

          <div className={css["key-array"]}>배열: US</div>
          <div className={css["key-array"]}>응원: {thumbs}</div>
          <div className={css["bell"]}>
            <VscBell />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
