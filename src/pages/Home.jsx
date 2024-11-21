import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useDispatch, useSelector } from "react-redux";
import CurrentFiles from "../components/CurrentFiles";
import EmptyScreen from "../components/EmptyScreen";
import FileScreen from "../components/FileScreen";
import css from "../styles/Home.module.css";
import { setActiveFile } from "../features/historySlice";

const Home = () => {
  const { currentFiles, fileSplit, activeFile } = useSelector(
    (state) => state.history
  );
  const dispatch = useDispatch();

  return (
    <div className={css.Home}>
      {currentFiles.length === 0 ? (
        <EmptyScreen />
      ) : (
        <PanelGroup direction="horizontal">
          {[...Array(fileSplit)].map((_, index) => (
            <Panel
              minSize={9.5}
              defaultSize={100 / fileSplit}
              style={{ borderRight: "solid 1px #2b2b2b" }}
              key={index}
            >
              {index > 0 && (
                <div className={css.resizeWrap}>
                  <PanelResizeHandle className={css.resizeHandle} />{" "}
                </div>
              )}
              <div
                className={css.fileWrap}
                onClick={() => dispatch(setActiveFile(index))}
              >
                <div className={css.filesTop}>
                  <CurrentFiles isActive={activeFile === index} />
                </div>
                <div className={css.file}>
                  <FileScreen />
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
