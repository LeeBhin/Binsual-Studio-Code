import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  VscCaseSensitive,
  VscWholeWord,
  VscRegex,
  VscBook,
  VscExclude,
  VscChevronDown,
  VscChevronRight,
  VscReplaceAll,
  VscPreserveCase,
} from "react-icons/vsc";
import treeData from "../../../data/treeData";
import FileIcon from "../../FileIcon";
import Tooltip from "../../Tooltip";
import EllipsisDots from "../../EllipsisDots";
import getExtension from "../../../features/getExtension";

const cls = {
  input:
    "w-full min-w-0 rounded-sm bg-[var(--input)] border-none text-[var(--text)] text-[13px] py-[3px] outline-none focus:[box-shadow:0_0_0_1px_var(--accent)]",
  iconBg:
    "flex justify-center items-center cursor-pointer w-[20px] h-[20px] p-[1px] rounded-[3px] hover:bg-[color-mix(in_srgb,white_8%,transparent)]",
  iconBgActive:
    "!bg-[color-mix(in_srgb,var(--accent)_45%,transparent)] [box-shadow:inset_0_0_0_1px_var(--accent)]",
  icon: "text-[17px]",
  externalSlot:
    "flex justify-center items-center cursor-pointer w-5 h-[22px] rounded-[3px] shrink-0 hover:bg-[var(--hover-soft)]",
};

const Search = () => {
  const [isActive, setIsActive] = useState(false);
  const [isReplaceOpen, setIsReplaceOpen] = useState(false);
  const [results, setResults] = useState({});
  const [openResults, setOpenResults] = useState({});
  const [searchOptions, setSearchOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  });
  const [preserveCase, setPreserveCase] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [useIgnore, setUseIgnore] = useState(false);
  const [keyword, setKeyword] = useState("");

  const searchRef = useRef(null);
  const includeRef = useRef(null);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  useEffect(() => {
    if (isActive) {
      includeRef.current.focus();
    } else {
      searchRef.current.focus();
    }
  }, [isActive]);

  const toggleSearchOption = (option) => {
    setSearchOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));

    searchFiles(keyword);
  };

  const toggleResultOpen = (path) => {
    setOpenResults((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const objectToArray = (data) => {
    const result = {};

    data.forEach((item) => {
      item.matches.forEach((match) => {
        if (!result[item.path]) {
          result[item.path] = [];
        }
        result[item.path].push({
          ...match,
        });
      });
    });

    return result;
  };

  const highlightKeyword = (line, keyword) => {
    if (!keyword) return line;

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(
      `(${escapedKeyword})`,
      searchOptions.caseSensitive ? "g" : "gi"
    );

    return line.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-[var(--highlight)] text-[var(--text)]">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const searchFiles = useCallback(
    (searchKeyword) => {
      if (!searchKeyword) {
        setResults([]);
        return;
      }

      const results = [];

      const searchNode = (node, currentPath = "") => {
        if (typeof node === "string") {
          const lines = node.split("\n");
          const matchedLines = lines.reduce((acc, line, index) => {
            let matchCondition = false;

            if (searchOptions.regex) {
              try {
                const regex = new RegExp(
                  searchKeyword,
                  searchOptions.caseSensitive ? "" : "i"
                );
                matchCondition = regex.test(line);
              } catch (error) {
                return acc;
              }
            } else if (searchOptions.wholeWord) {
              const wordRegex = new RegExp(
                `\\b${searchKeyword}\\b`,
                searchOptions.caseSensitive ? "" : "i"
              );
              matchCondition = wordRegex.test(line);
            } else {
              matchCondition = searchOptions.caseSensitive
                ? line.includes(searchKeyword)
                : line.toLowerCase().includes(searchKeyword.toLowerCase());
            }

            if (matchCondition) {
              acc.push({
                line: line.trim(),
                lineNumber: index + 1,
              });
            }
            return acc;
          }, []);

          if (matchedLines.length > 0) {
            results.push({
              path: currentPath,
              matches: matchedLines,
            });
          }
        } else if (typeof node === "object") {
          Object.keys(node).forEach((key) => {
            const newPath = currentPath ? `${currentPath}/${key}` : key;
            searchNode(node[key], newPath);
          });
        }
      };

      searchNode(treeData);
      setResults(objectToArray(results));
    },
    [searchOptions]
  );

  useEffect(() => {
    searchFiles(keyword);
  }, [keyword, searchFiles]);

  const iconBgCls = (active) =>
    `${cls.iconBg} ${active ? cls.iconBgActive : ""}`;

  return (
    <div>
      <div className="pl-px pr-2 pt-1.5">
        <div className="flex items-stretch gap-0.5">
          <div
            className="flex justify-center items-center cursor-pointer w-[16px] hover:bg-[var(--hover-soft)] rounded-[3px] shrink-0 text-white"
            onClick={() => setIsReplaceOpen((p) => !p)}
          >
            {isReplaceOpen ? (
              <VscChevronDown className="text-[17px] stroke-current [stroke-width:0.5]" />
            ) : (
              <VscChevronRight className="text-[17px] stroke-current [stroke-width:0.5]" />
            )}
          </div>

          <div className="flex-1 flex flex-col gap-[5px] min-w-0">
            <div className="flex items-center gap-0.5">
              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  type="text"
                  className={`${cls.input} pl-[5px] pr-[68px]`}
                  placeholder="검색"
                  ref={searchRef}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <div className="absolute right-1 flex gap-0.5">
                  <Tooltip label="대/소문자 구분(Alt+C)" group="search">
                    <div
                      className={iconBgCls(searchOptions.caseSensitive)}
                      onClick={() => toggleSearchOption("caseSensitive")}
                    >
                      <VscCaseSensitive className={cls.icon} />
                    </div>
                  </Tooltip>
                  <Tooltip label="단어 단위로(Alt+W)" group="search">
                    <div
                      className={iconBgCls(searchOptions.wholeWord)}
                      onClick={() => toggleSearchOption("wholeWord")}
                    >
                      <VscWholeWord className={cls.icon} />
                    </div>
                  </Tooltip>
                  <Tooltip label="정규식 사용(Alt+R)" group="search">
                    <div
                      className={iconBgCls(searchOptions.regex)}
                      onClick={() => toggleSearchOption("regex")}
                    >
                      <VscRegex className={cls.icon} />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>

            {isReplaceOpen && (
              <div className="flex items-center gap-0.5">
                <div className="relative flex-1 flex items-center min-w-0">
                  <input
                    type="text"
                    className={`${cls.input} pl-[5px] pr-[26px]`}
                    placeholder="바꾸기"
                  />
                  <div className="absolute right-1 flex gap-0.5">
                    <Tooltip label="대/소문자 보존(Alt+P)" group="replace">
                      <div
                        className={iconBgCls(preserveCase)}
                        onClick={() => setPreserveCase((p) => !p)}
                      >
                        <VscPreserveCase className={cls.icon} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
                <Tooltip label="모두 바꾸기(사용하려면 검색 전송)" group="replace">
                  <div className="flex justify-center items-center w-5 h-[22px] rounded-[3px] shrink-0 opacity-50 cursor-default">
                    <VscReplaceAll className={cls.icon} />
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        <div className="pl-[18px]">
          <div className="flex justify-end mt-[0.5px]">
            <Tooltip label="검색 세부 정보 설정/해제">
              <div
                className="flex justify-center items-center cursor-pointer w-5 h-[12px] shrink-0"
                onClick={() => setIsActive((p) => !p)}
              >
                <EllipsisDots />
              </div>
            </Tooltip>
          </div>

          {isActive && (
            <div className="text-[var(--text)] text-[11.5px] -mt-[7px]">
              <div>
                <span className="pl-[2px] mb-[1px] block leading-tight">포함할 파일</span>
                <div className="relative flex items-center min-w-0">
                  <input
                    type="text"
                    className={`${cls.input} pl-[5px] pr-[26px]`}
                    ref={includeRef}
                  />
                  <div className="absolute right-1 flex gap-0.5">
                    <Tooltip label="열린 편집기에서만 검색" group="include">
                      <div
                        className={iconBgCls(openOnly)}
                        onClick={() => setOpenOnly((p) => !p)}
                      >
                        <VscBook className={cls.icon} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <span className="pl-[2px] mb-[1px] block leading-tight">제외할 파일</span>
                <div className="relative flex items-center min-w-0">
                  <input
                    type="text"
                    className={`${cls.input} pl-[5px] pr-[26px]`}
                  />
                  <div className="absolute right-1 flex gap-0.5">
                    <Tooltip label="제외 설정 및 파일 무시 사용" group="exclude">
                      <div
                        className={iconBgCls(useIgnore)}
                        onClick={() => setUseIgnore((p) => !p)}
                      >
                        <VscExclude className={cls.icon} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-[13px] overflow-y-auto h-[calc(100vh-143px)] [&::-webkit-scrollbar]:hidden">
        {Object.entries(results)?.length > 0 && (
          <div className="text-[13px] pl-2 mb-2.5 text-[color-mix(in_srgb,var(--text)_65%,transparent)]">{`${
            Object.entries(results)?.length
          }개 파일에서 ${Object.values(results).flat().length}개 결과`}</div>
        )}
        {Object.entries(results).map(([path, matches]) => (
          <div key={path} className="truncate">
            <div
              className="flex items-center gap-[5px] px-[5px] cursor-pointer h-[22px] leading-[22px] hover:bg-[var(--hover-search)]"
              onClick={() => toggleResultOpen(path)}
            >
              <VscChevronDown
                style={{
                  minWidth: "16px",
                  margin: "0 1px",
                  transform: openResults[path]
                    ? "rotate(-90deg)"
                    : "rotate(0deg)",
                }}
              />
              <FileIcon extension={getExtension(path.split("/").pop())} />
              <div className="truncate">
                <span className="text-[13px] text-[var(--text)] leading-none h-full">
                  {path.split("/").pop()}
                </span>
                <span className="text-[11.7px] text-[var(--text)] opacity-70 pl-[5px] leading-none h-full">
                  {path.split("/").slice(0, -1).join("/")}
                </span>
              </div>
            </div>
            {!openResults[path] && (
              <div>
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="text-[13px] text-[var(--text)] pl-[31px] pr-[7px] cursor-pointer h-[22px] leading-[22px] truncate hover:bg-[var(--hover-search)]"
                  >
                    {highlightKeyword(match.line, keyword)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
