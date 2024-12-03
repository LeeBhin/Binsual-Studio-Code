import { useCallback, useEffect, useRef, useState } from "react";
import css from "../../../styles/tasks/Git.module.css";
import { VscCheck, VscRefresh } from "react-icons/vsc";

const CommitDot = ({ index, totalCount }) => {
  const first = index === 0;
  const last = index < totalCount - 1;
  return (
    <div className={css.wrap} style={index === 0 ? { marginLeft: "-2px" } : {}}>
      {!first && <div className={css.line} />}
      {first && <div className={css.line} style={{ background: "none" }} />}
      {first ? (
        <div className={css.firstDot}>
          <div className={css.inner} />
        </div>
      ) : (
        <div className={css.dot} />
      )}
      {!last && <div className={css.line} style={{ background: "none" }} />}
      {last && <div className={css.line} />}
    </div>
  );
};

const Git = () => {
  const [commits, setCommits] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const nameAndMsg = (data) => {
    return data.map((item) => ({
      name: item.commit.author.name,
      msg: item.commit.message,
    }));
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/leebhin/Binsual-Studio-Code/commits?page=1&per_page=10000"
      );
      const data = await response.json();
      setCommits(nameAndMsg(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={css.Git}>
      <div className={css.top}>
        <input
          type="text"
          className={css.input}
          placeholder="메시지(Github의 'main'에 커밋하고 푸시하려면 Ctrl+Enter"
          ref={inputRef}
        />
        <button className={css.submit}>
          <VscCheck className={css.check} />
          커밋
        </button>
      </div>

      <div className={css.bottom}>
        <div className={css.source}>
          <div className={css.header}>
            소스 제어 그래프
            <div className={css["icon-bg"]} onClick={() => fetchData()}>
              <VscRefresh className={css.icon} />
            </div>
          </div>
          <div className={css.commits}>
            {commits.map((commit, index) => (
              <div key={index} className={css.commit}>
                <CommitDot
                  index={index}
                  totalCount={commits.length}
                  className={css.commitDot}
                />
                <span
                  className={css.commitMSG}
                  style={index === 0 ? { fontWeight: "bold" } : {}}
                >
                  {commit.msg} <span className={css.who}>{commit.name}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Git;
