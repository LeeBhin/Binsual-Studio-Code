import { useEffect, useRef, useState } from "react";
import css from "../../../styles/tasks/Extension.module.css";
import Icons from "./../../../assets/icons";
import {
  VscClearAll,
  VscFilter,
  VscChevronDown,
  VscChevronRight,
} from "react-icons/vsc";

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
      icon: <Icons.Vscode className={css.icon} style={iconStyle} />,
      name: "Visual Studio code",
      description:
        "Code editor redefined and optimized for building and debugging modern web and cloud applications",
      author: "Microsoft",
    },
    {
      icon: <Icons.Brackets className={css.icon} style={iconStyle} />,
      name: "Brackets",
      description: "Lightweight, yet powerful, modern text editor",
      author: "Adobe",
    },
    {
      icon: <Icons.Inntellij className={css.icon} style={iconStyle} />,
      name: "IntelliJ IDEA",
      description: "Undoubtedly the top-choice IDE for software developers",
      author: "JetBrains",
    },
    {
      icon: <Icons.Github className={css.icon} style={iconStyle} />,
      name: "GitHub",
      description:
        "The complete developer platform to build, scale, and deliver secure software",
      author: "Microsoft",
    },
    {
      icon: <Icons.Notion className={css.icon} style={iconStyle} />,
      name: "Notion",
      description: "A new tool that blends your everyday work apps into one",
      author: "Notion Labs Inc.",
    },
  ];

  return (
    <div className={css.Extension}>
      <div className={css.inputWrap}>
        <div
          className={css.wrap}
          style={{
            borderColor: isFocused ? "#0078d4" : "transparent",
          }}
        >
          <input
            type="text"
            className={css.input}
            placeholder="마켓플레이스에서 확장 검색"
            ref={inputRef}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className={css.outline} />
          <div className={css.iconWrap}>
            <div className={css["icon-bg"]}>
              <VscClearAll className={css.icon} />
            </div>
            <div className={css["icon-bg"]}>
              <VscFilter className={css.icon} />
            </div>
          </div>
        </div>
      </div>

      <div className={css.installed} onClick={() => setOpen(!open)}>
        {open ? (
          <VscChevronDown size={"17px"} />
        ) : (
          <VscChevronRight size={"17px"} />
        )}
        설치됨<div className={css.count}>{tools.length}</div>
      </div>

      <div className={css.tools}>
        {open &&
          tools.map((tool, index) => (
            <div key={index} className={css.tool}>
              <div
                className={css.iconDiv}
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

              <div className={css.detail}>
                <span className={css.name}>{tool.name}</span>
                <span className={css.description}>{tool.description}</span>
                <span className={css.author}>{tool.author}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Extension;
