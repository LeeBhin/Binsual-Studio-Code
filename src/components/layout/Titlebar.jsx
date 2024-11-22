import { useDispatch, useSelector } from "react-redux";
import css from "../../styles/Layout.module.css";
import {
  VscArrowLeft,
  VscArrowRight,
  VscLayoutPanelOff,
  VscLayoutSidebarRightOff,
  VscLayoutSidebarLeftOff,
  VscLayout,
  VscSearch,
} from "react-icons/vsc";
import {
  setCurrentFiles,
  setFocusedFile,
  setHistory,
} from "../../features/historySlice";
import { useEffect, useRef, useState } from "react";

const Titlebar = () => {
  const { activeFile } = useSelector((state) => state.history);

  const {
    currentFiles,
    focusedFile,
    history = [],
  } = useSelector((state) => state.history.windows[activeFile] || {});

  const dispatch = useDispatch();

  const [focusedIndex, setFocusedIndex] = useState(
    Array.isArray(history)
      ? history.findIndex((path) => path === focusedFile)
      : -1
  );

  const prevFocusedRef = useRef(focusedFile);

  useEffect(() => {
    if (
      prevFocusedRef.current !== focusedFile &&
      focusedFile !== history[focusedIndex]
    ) {
      const newHistory = [...history.slice(0, focusedIndex + 1), focusedFile];
      dispatch(setHistory({ id: activeFile, history: newHistory }));
      setFocusedIndex(newHistory.length - 1);
    }

    prevFocusedRef.current = focusedFile;
  }, [focusedFile, focusedIndex, history, dispatch, activeFile]);

  const prevFile = () => {
    if (focusedIndex > 0) {
      const prevFocusedFile = history[focusedIndex - 1];
      const fileExists = currentFiles.some(
        (file) => file.path === prevFocusedFile
      );
      let updatedFiles = [...currentFiles];

      if (!fileExists) {
        const currentFocusedFileIndex = currentFiles.findIndex(
          (file) => file.path === prevFocusedRef.current
        );

        updatedFiles.splice(currentFocusedFileIndex + 1, 0, {
          pinned: false,
          path: prevFocusedFile,
        });
        dispatch(
          setCurrentFiles({
            id: activeFile,
            currentFiles: updatedFiles,
          })
        );
      }

      dispatch(
        setFocusedFile({
          id: activeFile,
          focusedFile: prevFocusedFile,
        })
      );
      setFocusedIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextFile = () => {
    if (focusedIndex < history.length - 1) {
      const nextFocusedFile = history[focusedIndex + 1];
      const fileExists = currentFiles.some(
        (file) => file.path === nextFocusedFile
      );
      let updatedFiles = [...currentFiles];

      if (!fileExists) {
        const currentFocusedFileIndex = currentFiles.findIndex(
          (file) => file.path === focusedFile
        );

        updatedFiles.splice(currentFocusedFileIndex + 1, 0, {
          pinned: false,
          path: nextFocusedFile,
        });
        dispatch(
          setCurrentFiles({
            id: activeFile,
            currentFiles: updatedFiles,
          })
        );
      }

      dispatch(
        setFocusedFile({
          id: activeFile,
          focusedFile: nextFocusedFile,
        })
      );
      setFocusedIndex(focusedIndex + 1);
    }
  };

  const prevArrowColor =
    focusedIndex > 0 ? "rgba(204, 204, 204)" : "rgb(204, 204, 204,0.5)";

  const nextArrowColor =
    focusedIndex < history.length - 1
      ? "rgba(204, 204, 204)"
      : "rgb(204, 204, 204,0.5)";

  return (
    <header className={css.titlebar}>
      <div className={css["titlebar-wrap"]}>
        <div className={css["titlebar-left"]}></div>
        <div className={css["titlebar-center"]}>
          <div className={css["icon-bg"]} onClick={prevFile}>
            <VscArrowLeft
              className={css["titlebar-arrow"]}
              style={{ color: prevArrowColor }}
            />
          </div>
          <div className={css["icon-bg"]} onClick={nextFile}>
            <VscArrowRight
              className={css["titlebar-arrow"]}
              style={{ color: nextArrowColor }}
            />
          </div>
          <div className={css.search}>
            <div className={css["search-wrap"]}>
              <VscSearch style={{ fontSize: "14px" }} />
              <span>작업 영역</span>
            </div>
          </div>
        </div>
        <div className={css["titlebar-right"]}>
          <div className={css["icon-bg"]}>
            <VscLayoutSidebarLeftOff />
          </div>
          <div className={css["icon-bg"]}>
            <VscLayoutPanelOff />
          </div>
          <div className={css["icon-bg"]}>
            <VscLayoutSidebarRightOff />
          </div>
          <div className={css["icon-bg"]}>
            <VscLayout />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Titlebar;
