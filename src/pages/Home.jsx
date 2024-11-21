import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useSelector } from "react-redux";
import CurrentFiles from "../components/CurrentFiles";
import EmptyScreen from "../components/EmptyScreen";
import FileScreen from "../components/FileScreen";
import css from "../styles/Home.module.css";

const Home = () => {
  const { currentFiles, fileSplit } = useSelector((state) => state.history);
  const [activeFile, setActiveFile] = useState();

  return (
    <div className={css.Home}>
      {currentFiles.length === 0 ? (
        <EmptyScreen />
      ) : (
        <PanelGroup direction="horizontal">
          {[...Array(fileSplit)].map((_, index) => (
            <React.Fragment key={index}>
              {index > 0 && <PanelResizeHandle className={css.resizeHandle} />}
              <Panel minSize={9.5} defaultSize={100 / fileSplit}>
                <div
                  className={css.fileWrap}
                  onClick={() => setActiveFile(index)}
                >
                  <div className={css.filesTop}>
                    <CurrentFiles activeFile={activeFile === index} />
                  </div>
                  <div className={css.file}>
                    <FileScreen />
                  </div>
                </div>
              </Panel>
            </React.Fragment>
          ))}
        </PanelGroup>
      )}
    </div>
  );
};

export default Home;
