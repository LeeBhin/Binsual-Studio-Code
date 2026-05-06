import { useCallback, useEffect, useRef, useState } from "react";
import { VscCheck } from "react-icons/vsc";
import Tooltip from "../../Tooltip";
import Codicon from "../../Codicon";
import EllipsisDots from "../../EllipsisDots";
import Section from "../Section";
import Divider from "../Divider";
import DropdownButton from "../../DropdownButton";
import SearchInput from "../../SearchInput";

const LINE_COLOR = "#416A96";
const DOT_COLOR = "#59A4F9";

const sideIconBg =
  "w-5 h-5 rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]";

const CommitDot = ({ index, totalCount }) => {
  const isFirst = index === 0;
  const isLast = index === totalCount - 1;
  const topLineH = "5px";
  const bottomLineH = isFirst ? "3px" : "5px";
  return (
    <div className="relative w-3 h-[22px] shrink-0">
      {!isFirst && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px]"
          style={{ background: LINE_COLOR, height: topLineH }}
        />
      )}
      {!isLast && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px]"
          style={{ background: LINE_COLOR, height: bottomLineH }}
        />
      )}
      {isFirst ? (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full flex justify-center items-center group-hover/commit:scale-[1.25]"
          style={{ background: DOT_COLOR }}
        >
          <div className="w-2 h-2 rounded-full bg-black group-hover/commit:scale-[0.8]" />
        </div>
      ) : (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full group-hover/commit:scale-[1.35]"
          style={{ background: DOT_COLOR }}
        />
      )}
    </div>
  );
};

const Git = ({ isActive = true }) => {
  const [commits, setCommits] = useState([]);
  const [commitMsg, setCommitMsg] = useState("");
  const inputRef = useRef(null);

  const disabled = !commitMsg.trim();

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

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

  const graphActions = (
    <>
      <Tooltip label="모든 원격에서 패치" position="bottom" group="git-actions">
        <div className={sideIconBg}>
          <Codicon name="repo-fetch" size={16} />
        </div>
      </Tooltip>
      <Tooltip label="풀" position="bottom" group="git-actions">
        <div className={sideIconBg}>
          <Codicon name="repo-pull" size={16} />
        </div>
      </Tooltip>
      <Tooltip label="푸시" position="bottom" group="git-actions">
        <div className={sideIconBg}>
          <Codicon name="repo-push" size={16} />
        </div>
      </Tooltip>
      <Tooltip label="새로 고침" position="bottom" group="git-actions">
        <div className={sideIconBg} onClick={() => fetchData()}>
          <Codicon name="refresh" size={16} />
        </div>
      </Tooltip>
      <Tooltip label="기타 작업..." position="bottom" group="git-actions">
        <div className={sideIconBg}>
          <EllipsisDots />
        </div>
      </Tooltip>
    </>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Section title="변경 내용" defaultOpen={true}>
        <div className="flex flex-col pl-[22px] pr-[11px]">
          <div className="mt-1.5">
            <SearchInput
              ref={inputRef}
              placeholder={`메시지(Ctrl+Enter(으)로 "main"에 커밋)`}
              value={commitMsg}
              onChange={(e) => setCommitMsg(e.target.value)}
            />
          </div>
          <DropdownButton
            label="커밋"
            icon={
              <VscCheck
                className="text-[14px] block -translate-y-[1.5px]"
                style={{ stroke: "currentColor", strokeWidth: 0.5, width: "16px" }}
                preserveAspectRatio="none"
              />
            }
            disabled={disabled}
            tooltip={`"main"에 변경 내용 커밋`}
            dropdownTooltip="더 많은 행동..."
            group="commit-bar"
            className="w-full mt-[10.5px]"
          />
        </div>
      </Section>

      <Divider />
      <Section
        title="그래프"
        defaultOpen={true}
        actions={graphActions}
        actionsAlwaysVisible={true}
      >
        <div className="text-[11px] w-full text-[var(--text)] flex flex-col">
          {commits.map((commit, index) => (
            <div
              key={index}
              className="group/commit flex items-center gap-1.5 text-[13px] cursor-pointer pl-2 hover:bg-[var(--hover-2)] min-w-0"
            >
              <CommitDot index={index} totalCount={commits.length} />
              <span
                className="flex-1 min-w-0 pr-[5px] h-[22px] leading-5 truncate"
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
      </Section>
    </div>
  );
};

export default Git;
