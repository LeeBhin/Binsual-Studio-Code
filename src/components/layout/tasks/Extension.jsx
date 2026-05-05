import { useEffect, useRef, useState } from "react";
import Icons from "./../../../assets/icons";
import {
  VscClearAll,
  VscFilter,
  VscChevronDown,
  VscChevronRight,
} from "react-icons/vsc";

const iconBgCls =
  "flex justify-center items-center cursor-pointer w-[19px] h-[19px] p-[1.5px] rounded-[3px] hover:bg-[var(--hover-soft)]";
const iconCls = "w-10 h-auto";

const Extension = ({ resizeWidth }) => {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

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

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-center items-center pt-1.5">
        <div
          className="flex items-center bg-[var(--input)] border rounded-sm w-[calc(100%-15px)] outline-none text-[var(--text)] relative"
          style={{
            borderColor: isFocused ? "var(--accent)" : "var(--border-2)",
          }}
        >
          <input
            type="text"
            className="bg-[var(--input)] border-none rounded-sm px-[5px] py-1 w-[70%] outline-none text-[var(--text)] text-[13px] truncate"
            placeholder="마켓플레이스에서 확장 검색"
            ref={inputRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="absolute right-[9px] flex gap-[3px] pl-[10px] bg-[var(--input)]">
            <div className={iconBgCls}>
              <VscClearAll className={iconCls} />
            </div>
            <div className={iconBgCls}>
              <VscFilter className={iconCls} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="text-[11px] text-[var(--text)] font-bold flex gap-0.5 items-center cursor-pointer w-full mt-[13px] mx-[10px] mb-[3px] pl-px relative"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <VscChevronDown size={"17px"} />
        ) : (
          <VscChevronRight size={"17px"} />
        )}
        설치됨
        <div className="absolute right-3 w-[18px] h-[18px] flex items-center justify-center text-[#f8f8f8] bg-[#616161] rounded-full leading-none font-normal text-[11px]">
          {tools.length}
        </div>
      </div>

      <div className="w-full">
        {open &&
          tools.map((tool, index) => (
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
      </div>
    </div>
  );
};

export default Extension;
