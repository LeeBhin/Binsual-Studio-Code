import css from "../../styles/Layout.module.css";
import { VscMenu } from "react-icons/vsc";
import Titlebar from "./Titlebar";
import Taskbar from "./Taskbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setFocusedFile } from "../../features/historySlice";

const Layout = ({ children }) => {
  const { currentFiles, history, focusedFile } = useSelector(
    (state) => state.history
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      currentFiles.length !== 0 &&
      !currentFiles.some((file) => file.path === focusedFile) &&
      history.length !== 0
    ) {
      const filteredHistory = history.filter(
        (file) =>
          currentFiles.some((currentFile) => currentFile.path === file) ||
          file === focusedFile
      );

      const reversedHistory = [...filteredHistory].reverse();

      const fileIndex = reversedHistory.findIndex(
        (file) => file === focusedFile
      );
      if (fileIndex !== -1) {
        if (fileIndex < reversedHistory.length - 1) {
          const prevFile = reversedHistory[fileIndex + 1];
          dispatch(setFocusedFile(prevFile));
        } else if (fileIndex === reversedHistory.length - 1) {
          dispatch(setFocusedFile(currentFiles[0]?.path));
        }
      } else {
        dispatch(setFocusedFile(currentFiles[0]?.path));
      }
    }
  }, [currentFiles, dispatch, focusedFile, history]);

  return (
    <div className={css.Layout}>
      <Titlebar />

      <div className={css.wrap}>
        <header className={css.activitybar}>
          <div className={css["activitybar-wrap"]}>
            <div className={css.menubar}>
              <VscMenu />
            </div>

            <Taskbar />
          </div>

          <Sidebar />
        </header>

        <main className={css.main}>{children}</main>
      </div>

      <footer className={css.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
