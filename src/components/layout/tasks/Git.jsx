import { useCallback, useEffect, useRef, useState } from "react";
import { VscCheck } from "react-icons/vsc";
import Tooltip from "../../Tooltip";
import Codicon from "../../Codicon";
import EllipsisDots from "../../EllipsisDots";
import Section from "../Section";
import DropdownButton from "../../DropdownButton";
import SearchInput from "../../SearchInput";
import ResizeHandle from "../../ResizeHandle";

const LINE_COLOR = "#416A96";
const DOT_COLOR = "#59A4F9";

const sideIconBg =
  "w-5 h-5 rounded-[5px] flex justify-center items-center cursor-pointer hover:bg-[var(--hover)]";

const TargetIcon = ({ color = "#E0E0E0", size = 17.5 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="1" fill={color} />
    <circle cx="8" cy="8" r="3.3" stroke={color} strokeWidth="1" />
    <circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1" />
  </svg>
);

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

const PAGE_SIZE = 100;

const MIN_SECTION_HEIGHT = 60;

const Git = ({ isActive = true }) => {
  const [commits, setCommits] = useState([]);
  const [commitMsg, setCommitMsg] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const inputRef = useRef(null);
  const sentinelRef = useRef(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const changesRef = useRef(null);
  const graphRef = useRef(null);
  const [basis, setBasis] = useState([null, null]);
  const [changesOpen, setChangesOpenRaw] = useState(true);
  const [graphOpen, setGraphOpenRaw] = useState(true);
  const [lastOpened, setLastOpened] = useState("graph");
  const [isResizing, setIsResizing] = useState(false);

  const trackOpen = (id, raw) => (val) => {
    raw((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      if (next && !prev) setLastOpened(id);
      return next;
    });
  };

  const setChangesOpen = trackOpen("changes", setChangesOpenRaw);
  const setGraphOpen = trackOpen("graph", setGraphOpenRaw);

  const changesGrow = lastOpened === "changes" ? 4 : 1;
  const graphGrow = lastOpened === "graph" ? 4 : 1;

  const startResize = () => {
    setIsResizing(true);
    setBasis([
      changesRef.current?.offsetHeight ?? 0,
      graphRef.current?.offsetHeight ?? 0,
    ]);
  };

  const stopResize = () => setIsResizing(false);

  const handleResize = (delta) => {
    setBasis((prev) => {
      let a = prev[0] + delta;
      let b = prev[1] - delta;
      if (a < MIN_SECTION_HEIGHT) {
        b -= MIN_SECTION_HEIGHT - a;
        a = MIN_SECTION_HEIGHT;
      }
      if (b < MIN_SECTION_HEIGHT) {
        a -= MIN_SECTION_HEIGHT - b;
        b = MIN_SECTION_HEIGHT;
      }
      return [a, b];
    });
  };

  const disabled = !commitMsg.trim();

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  const nameAndMsg = (data) =>
    data.map((item) => ({
      name: item.commit.author.name,
      msg: item.commit.message,
    }));

  const fetchData = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    if (!reset && !hasMoreRef.current) return;

    loadingRef.current = true;
    const pageToFetch = reset ? 1 : pageRef.current;

    try {
      const response = await fetch(
        `https://api.github.com/repos/leebhin/Binsual-Studio-Code/commits?page=${pageToFetch}&per_page=${PAGE_SIZE}`
      );
      const data = await response.json();
      const newCommits = nameAndMsg(data);

      if (reset) {
        setCommits(newCommits);
        pageRef.current = 2;
      } else {
        setCommits((prev) => [...prev, ...newCommits]);
        pageRef.current = pageToFetch + 1;
      }

      const more = newCommits.length === PAGE_SIZE;
      hasMoreRef.current = more;
      setHasMore(more);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchData();
      },
      { threshold: 0.1 }
    );
    const node = sentinelRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [hasMore, fetchData]);

  const graphActions = (
    <>
      <Tooltip label="main, origin/main" position="bottom" group="git-actions">
        <div className="h-5 px-[2.4px] rounded-[5px] flex items-center cursor-pointer hover:bg-[var(--hover)]">
          <Codicon name="source-control" size={16} />
          <span className="text-[11px]">자동</span>
        </div>
      </Tooltip>
      <Tooltip label="현재 기록 항목으로 이동" position="bottom" group="git-actions">
        <div className={sideIconBg}>
          <TargetIcon />
        </div>
      </Tooltip>
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
        <div className={sideIconBg} onClick={() => fetchData(true)}>
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

  const changesActions = (
    <>
      <Tooltip label="커밋" position="bottom" group="changes-actions">
        <div className={sideIconBg}>
          <Codicon name="check" size={16} />
        </div>
      </Tooltip>
      <Tooltip label="새로 고침" position="bottom" group="changes-actions">
        <div className={sideIconBg} onClick={() => fetchData(true)}>
          <Codicon name="refresh" size={16} />
        </div>
      </Tooltip>
      <Tooltip label="기타 작업..." position="bottom" group="changes-actions">
        <div className={sideIconBg}>
          <EllipsisDots />
        </div>
      </Tooltip>
    </>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Section
        innerRef={changesRef}
        title="변경 내용"
        isOpen={changesOpen}
        setIsOpen={setChangesOpen}
        actions={changesActions}
        grow={changesGrow}
        basis={basis[0]}
        isResizing={isResizing}
      >
        <div className="flex flex-col pl-[19.4px] pr-[11px]">
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

      <ResizeHandle
        direction="vertical"
        enabled={changesOpen && graphOpen}
        onResizeStart={startResize}
        onResize={handleResize}
        onResizeStop={stopResize}
      />
      <Section
        innerRef={graphRef}
        title="그래프"
        isOpen={graphOpen}
        setIsOpen={setGraphOpen}
        actions={graphActions}
        actionsAlwaysVisible={true}
        grow={graphGrow}
        basis={basis[1]}
        isResizing={isResizing}
      >
        <div className="text-[11px] w-full text-[var(--text)] flex flex-col">
          {commits.map((commit, index) => (
            <div
              key={index}
              className="group/commit flex items-center gap-1.5 text-[13px] cursor-pointer pl-[4px] hover:bg-[var(--hover-2)] min-w-0"
            >
              <CommitDot index={index} totalCount={commits.length} />
              <span
                className="flex-1 min-w-0 pr-[8px] h-[22px] leading-5 truncate"
                style={index === 0 ? { fontWeight: "bold" } : {}}
              >
                {commit.msg}{" "}
                <span className="text-white/50 text-xs leading-[23px]">
                  {commit.name}
                </span>
              </span>
              {index === 0 && (
                <div className="flex items-center gap-1 pr-3 group-hover/commit:pr-0 group-hover/commit:-mr-px shrink-0">
                  <div className="flex items-center pl-[1px] pr-[3px] h-[18px] rounded-full bg-[#59A4F9] text-black text-[12px] leading-none font-normal">
                    <TargetIcon color="#000" size={16} />
                    <span>main</span>
                  </div>
                  <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#B180D7] text-black">
                    <Codicon name="cloud" size={16} />
                  </div>
                </div>
              )}
              <Tooltip label="변경 내용 열기" position="bottom" group="git-commit-actions">
                <div className="hidden group-hover/commit:flex w-5 h-5 rounded-[5px] justify-center items-center cursor-pointer hover:bg-[var(--hover)] shrink-0 mr-3">
                  <Codicon name="expand-all" size={16} />
                </div>
              </Tooltip>
            </div>
          ))}
          {hasMore && <div ref={sentinelRef} className="h-1 w-full shrink-0" />}
        </div>
      </Section>
    </div>
  );
};

export default Git;
