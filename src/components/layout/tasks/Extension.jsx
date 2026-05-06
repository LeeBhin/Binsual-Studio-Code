import { useEffect, useRef, useState } from "react";
import Icons from "./../../../assets/icons";
import Codicon from "../../Codicon";
import Tooltip from "../../Tooltip";
import SearchInput from "../../SearchInput";
import Section from "../Section";

const sideIconBg =
  "flex justify-center items-center cursor-pointer w-[19px] h-[19px] rounded-[3px] hover:bg-[var(--hover-soft)]";
const iconCls = "w-10 h-auto";

const Extension = ({ resizeWidth, isActive = true }) => {
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  const iconStyle =
    resizeWidth < 200
      ? { width: 0 }
      : resizeWidth < 250
      ? { width: "23px", position: "absolute", top: "10px" }
      : {};

  const tools = [
    {
      icon: <Icons.Vscode className={iconCls} style={iconStyle} />,
      name: "Visual Studio code",
      description:
        "Code editor redefined and optimized for building and debugging modern web and cloud applications",
      author: "Microsoft",
    },
    {
      icon: <Icons.Brackets className={iconCls} style={iconStyle} />,
      name: "Brackets",
      description: "Lightweight, yet powerful, modern text editor",
      author: "Adobe",
    },
    {
      icon: <Icons.Inntellij className={iconCls} style={iconStyle} />,
      name: "IntelliJ IDEA",
      description: "Undoubtedly the top-choice IDE for software developers",
      author: "JetBrains",
    },
    {
      icon: <Icons.Github className={iconCls} style={iconStyle} />,
      name: "GitHub",
      description:
        "The complete developer platform to build, scale, and deliver secure software",
      author: "Microsoft",
    },
    {
      icon: <Icons.Notion className={iconCls} style={iconStyle} />,
      name: "Notion",
      description: "A new tool that blends your everyday work apps into one",
      author: "Notion Labs Inc.",
    },
  ];

  const inputActions = (
    <>
      <Tooltip label="확장 검색 결과 지우기" position="bottom" group="extension-input">
        <div className={sideIconBg}>
          <Codicon name="clear-all" size={16} />
        </div>
      </Tooltip>
      <Tooltip label="확장 필터링..." position="bottom" group="extension-input">
        <div className={sideIconBg}>
          <Codicon name="filter" size={16} />
        </div>
      </Tooltip>
    </>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="pl-[20px] pr-[11px] pt-1.5 pb-2 shrink-0">
        <SearchInput
          ref={inputRef}
          placeholder="마켓플레이스에서 확장 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          actions={inputActions}
        />
      </div>

      <Section title="설치됨" badge={tools.length} defaultOpen={true}>
        {tools.map((tool, index) => (
          <div
            key={index}
            className="flex items-center w-full h-[72px] cursor-pointer relative hover:bg-[var(--hover-search)]"
          >
            <div
              className="min-w-[72px] h-[72px] flex justify-center items-center"
              style={
                resizeWidth < 200
                  ? { minWidth: "15px" }
                  : resizeWidth < 250
                  ? { minWidth: "48px" }
                  : {}
              }
            >
              {tool.icon}
            </div>

            <div className="flex flex-col gap-0 justify-evenly overflow-hidden w-full pr-2.5">
              <span className="truncate w-full text-[var(--text)] text-[13px] font-bold">
                {tool.name}
              </span>
              <span className="truncate w-full text-[var(--text-muted)] text-[13px]">
                {tool.description}
              </span>
              <span className="truncate w-full text-[var(--text-muted)] text-[11.7px] font-bold my-[5px]">
                {tool.author}
              </span>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
};

export default Extension;
