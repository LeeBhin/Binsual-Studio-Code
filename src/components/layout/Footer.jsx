import { useHistory } from "../../store/history";
import Codicon from "../Codicon";

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

const HOVER_BG = "color-mix(in srgb, white 15%, transparent)";

const Footer = () => {
  const rowAndCol = useHistory((s) => s.rowAndCol);
  const selected = useHistory((s) => s.selected);
  const errors = useHistory((s) => s.errors);
  const activeFile = useHistory((s) => s.activeFile);
  const focusedFile = useHistory(
    (s) => s.windows[activeFile]?.focusedFile ?? ""
  );

  const getExtension = (filePath) => {
    const extension = filePath?.split(".").pop();
    return extensionMap[extension] || "일반 텍스트";
  };

  return (
    <div className="relative w-screen h-[22px] bg-[var(--accent)] flex items-center justify-between text-white">
      <div className="flex items-center gap-[3px] flex-1 h-full">
        <div className="w-[34px] h-full flex items-center justify-center rounded-bl-lg text-sm cursor-pointer hover:bg-[color-mix(in_srgb,white_15%,transparent)]">
          <Codicon name="remote" size={16} />
        </div>

        <div className="h-full flex items-center gap-[3px] cursor-pointer px-[5px] hover:bg-[color-mix(in_srgb,white_15%,transparent)]">
          <div className="flex items-center gap-1">
            <Codicon name="error" size={14} />
            <span className="text-xs leading-none">{errors.err}</span>
          </div>
          <div className="flex items-center gap-1">
            <Codicon name="warning" size={14} />
            <span className="text-xs leading-none">{errors.warning}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center h-full pr-[10px]">
        <div className="flex items-center gap-1.5 text-xs h-full [&>div]:h-full [&>div]:flex [&>div]:items-center [&>div]:px-[5px] [&>div]:cursor-pointer [&>div:hover]:bg-[color-mix(in_srgb,white_15%,transparent)]">
          {focusedFile &&
            !(focusedFile.includes("vs") || focusedFile.includes("debug")) && (
              <>
                <div>
                  줄 {rowAndCol.row}, 열 {rowAndCol.col}
                  {selected > 0 && `(${selected} 선택됨)`}
                </div>
                <div>공백: 4</div>
                <div>UTF-8</div>
                <div>CRLF</div>
                {getExtension(focusedFile) !== "text" ? (
                  <div className="!gap-[5px]">
                    <Codicon name="json" size={16} />
                    <span>{getExtension(focusedFile)}</span>
                  </div>
                ) : (
                  <div>일반 텍스트</div>
                )}
              </>
            )}

          <div>배열: US</div>
          <div className="!justify-center">
            <Codicon name="bell" size={15} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
