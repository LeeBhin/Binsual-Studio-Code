import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CurrentFiles from "../components/CurrentFiles";
import EmptyScreen from "../components/EmptyScreen";
import FileScreen from "../components/FileScreen";
import { useHistory, setActiveFile } from "../store/history";

const Home = () => {
  const fileSplit = useHistory((s) => s.fileSplit);
  const activeFile = useHistory((s) => s.activeFile);
  const win = useHistory((s) => s.windows[activeFile]);
  const currentFiles = win?.currentFiles ?? [];

  return (
    <div className="bg-[var(--tab-active)] flex h-full flex-col justify-center items-center text-[13px]">
      {currentFiles.length === 0 ? (
        <EmptyScreen />
      ) : (
        <PanelGroup direction="horizontal">
          {fileSplit.map((_, index) => (
            <Panel
              minSize={9.5}
              defaultSize={100 / fileSplit.length}
              style={{ borderRight: "solid 1px var(--border)" }}
              key={index}
              onClick={() => setActiveFile(index)}
            >
              {index > 0 && (
                <div className="absolute h-full -ml-[5.8px] z-[2] flex justify-center w-[12.2px] group">
                  <PanelResizeHandle className="w-1 h-full z-[1] bg-[var(--accent)] opacity-0 transition-[opacity] duration-200 group-hover:opacity-100 group-hover:[transition-delay:300ms] active:opacity-100" />
                </div>
              )}
              <div className="flex h-full flex-col overflow-hidden border-r border-[var(--border)] last:border-r-0">
                <div className="w-full h-[35px] bg-[var(--tab-bar)]">
                  <CurrentFiles
                    isActive={activeFile === index}
                    fileIndex={index}
                  />
                </div>
                <div className="w-full h-full">
                  <FileScreen fileIndex={index} />
                </div>
              </div>
            </Panel>
          ))}
        </PanelGroup>
      )}
    </div>
  );
};

export default Home;
