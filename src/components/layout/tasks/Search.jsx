import React, { useEffect, useRef, useState, useCallback } from "react";
import css from "../../../styles/tasks/Search.module.css";
import {
  VscCaseSensitive,
  VscWholeWord,
  VscRegex,
  VscEllipsis,
  VscBook,
  VscExclude,
  VscChevronDown,
} from "react-icons/vsc";
import treeData from "../../../data/treeData";
import FileIcon from "../../FileIcon";
import getExtension from "../../../features/getExtension";

const Search = () => {
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState({});
  const [openResults, setOpenResults] = useState({});
  const [searchOptions, setSearchOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  });
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
        <mark key={index} className={css.highlight}>
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

  return (
    <div className={css.Search}>
      <div className={css.inputWrap}>
        <input
          type="text"
          className={css.input}
          placeholder="검색"
          ref={searchRef}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className={css.iconWrap}>
          <div
            className={`${css["icon-bg"]} ${
              searchOptions.caseSensitive ? css.active : ""
            }`}
            onClick={() => toggleSearchOption("caseSensitive")}
          >
            <VscCaseSensitive className={css.icon} />
          </div>
          <div
            className={`${css["icon-bg"]} ${
              searchOptions.wholeWord ? css.active : ""
            }`}
            onClick={() => toggleSearchOption("wholeWord")}
          >
            <VscWholeWord className={css.icon} />
          </div>
          <div
            className={`${css["icon-bg"]} ${
              searchOptions.regex ? css.active : ""
            }`}
            onClick={() => toggleSearchOption("regex")}
          >
            <VscRegex className={css.icon} />
          </div>
        </div>
      </div>
      <div
        className={css.ellipsis}
        onClick={() => setIsActive((prev) => !prev)}
      >
        <VscEllipsis />
      </div>

      {isActive && (
        <div className={css.filter}>
          <div className={css.include}>
            <span className={css.includeTxt}>포함할 파일</span>
            <div className={css.inputWrap}>
              <input type="text" className={css.input} ref={includeRef} />
              <div className={css.iconWrap}>
                <div className={css["icon-bg"]}>
                  <VscBook className={css.icon} />
                </div>
              </div>
            </div>
          </div>
          <div className={css.include}>
            <span className={css.includeTxt}>제외할 파일</span>
            <div className={css.inputWrap}>
              <input type="text" className={css.input} />
              <div className={css.iconWrap}>
                <div className={css["icon-bg"]}>
                  <VscExclude className={css.icon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={css.results}>
        {Object.entries(results)?.length > 0 && (
          <div className={css.count}>{`${
            Object.entries(results)?.length
          }개 파일에서 ${Object.values(results).flat().length}개 결과`}</div>
        )}
        {Object.entries(results).map(([path, matches]) => (
          <div key={path} className={css.result}>
            <div className={css.file} onClick={() => toggleResultOpen(path)}>
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
              <div className={css.namepath}>
                <span className={css.name}>{path.split("/").pop()}</span>
                <span className={css.path}>
                  {path.split("/").slice(0, -1).join("/")}
                </span>
              </div>
            </div>
            {!openResults[path] && (
              <div className={css.matches}>
                {matches.map((match, index) => (
                  <div key={index} className={css.code}>
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
