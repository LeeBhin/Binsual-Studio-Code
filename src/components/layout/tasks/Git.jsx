import { useCallback, useEffect, useRef, useState } from "react";
import { VscCheck, VscRefresh } from "react-icons/vsc";

const LINE_COLOR = "#416A96";
const DOT_COLOR = "#59A4F9";

const CommitDot = ({ index, totalCount }) => {
  const first = index === 0;
  const last = index < totalCount - 1;
  return (
    <div className="relative w-3 h-[22px] shrink-0">
      {!first && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[5.8px]"
          style={{ background: LINE_COLOR }}
        />
      )}
      {first ? (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full flex justify-center items-center"
          style={{ background: DOT_COLOR }}
        >
          <div className="w-2 h-2 rounded-full bg-black" />
        </div>
      ) : (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: DOT_COLOR }}
        />
      )}
      {last && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-[5.9px]"
          style={{ background: LINE_COLOR }}
        />
      )}
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
    <div className="flex flex-col justify-between h-[calc(100%-35px)]">
      <div className="h-[30vh] max-w-[300px] w-full flex flex-col items-center">
        <input
          type="text"
          className="mt-1.5 w-[calc(100%-15px)] rounded-sm bg-[var(--input)] border border-[var(--border-2)] text-[var(--text)] text-[13px] px-[5px] py-1 outline-none truncate focus:border-[var(--accent)]"
          placeholder="메시지(Github의 'main'에 커밋하고 푸시하려면 Ctrl+Enter"
          ref={inputRef}
        />
        <button className="w-[calc(100%-15px)] py-1 rounded-md border-none bg-[var(--accent)] text-white text-[13px] mt-3 flex justify-center items-center gap-[3px] opacity-50 cursor-pointer">
          <VscCheck className="text-base" />
          커밋
        </button>
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="text-[11px] w-full text-[var(--text)] h-full">
          <div className="px-[3px] pt-[3px] pb-[5px] pl-[3px] border-t border-[var(--border)] flex justify-between items-center">
            소스 제어 그래프
            <div
              className="flex justify-center items-center cursor-pointer w-[18.5px] h-[18.5px] rounded-[3px] mr-[3px] hover:bg-[var(--hover-soft)]"
              onClick={() => fetchData()}
            >
              <VscRefresh className="text-base" />
            </div>
          </div>
          <div className="flex flex-col overflow-y-auto h-[60vh] [&::-webkit-scrollbar]:hidden">
            {commits.map((commit, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 text-[13px] cursor-pointer pl-2 hover:bg-[var(--hover-2)]"
              >
                <CommitDot index={index} totalCount={commits.length} />
                <span
                  className="pr-[5px] h-[22px] leading-5 truncate"
                  style={index === 0 ? { fontWeight: "bold" } : {}}
                >
                  {commit.msg}{" "}
                  <span className="text-white/50 text-xs leading-[23px]">
                    {commit.name}
                  </span>
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
