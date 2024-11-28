import { useEffect, useState } from "react";
import css from "../../../styles/Git.module.css";
import { VscCheck, VscRefresh } from "react-icons/vsc";

const CommitDot = () => {
  return (
    <div className={css.wrap}>
      <div className={css.line} />
      <div className={css.dot} />
      <div className={css.line} />
    </div>
  );
};

const Git = () => {
  const [commits, setCommits] = useState([]);

  const nameAndMsg = (data) => {
    return data.map((item) => ({
      name: item.commit.author.name,
      msg: item.commit.message,
    }));
  };

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/leebhin/Binsual-Studio-Code/commits?page=1&per_page=10000"
    )
      .then((res) => res.json())
      .then((data) => setCommits(nameAndMsg(data)));
  }, []);

  return (
    <div className={css.Git}>
      <div className={css.top}>
        <input
          type="text"
          className={css.input}
          placeholder="메시지(Github의 'main'에 커밋하고 푸시하려면 Ctrl+Enter"
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
            <div className={css["icon-bg"]}>
              <VscRefresh className={css.icon} />
            </div>
          </div>
          <div className={css.commits}>
            {commits.map((commit, index) => (
              <div key={index} className={css.commit}>
                <CommitDot className={css.commitDot} />
                <span className={css.commitMSG}>
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
