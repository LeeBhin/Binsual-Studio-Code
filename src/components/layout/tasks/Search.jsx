import { useEffect, useRef, useState } from "react";
import css from "../../../styles/Search.module.css";
import {
  VscCaseSensitive,
  VscWholeWord,
  VscRegex,
  VscEllipsis,
  VscBook,
  VscExclude,
} from "react-icons/vsc";

const Search = () => {
  const [isActive, setIsActive] = useState(false);
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

  return (
    <div className={css.Search}>
      <div className={css.inputWrap}>
        <input
          type="text"
          className={css.input}
          placeholder="검색"
          ref={searchRef}
        />
        <div className={css.iconWrap}>
          <div className={css["icon-bg"]}>
            <VscCaseSensitive className={css.icon} />
          </div>
          <div className={css["icon-bg"]}>
            <VscWholeWord className={css.icon} />
          </div>
          <div className={css["icon-bg"]}>
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
                  <VscBook CaseSensitive className={css.icon} />
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
    </div>
  );
};

export default Search;
