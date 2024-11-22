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
  const { activeFile } = useSelector((state) => state.history);

  const {
    currentFiles = [],
    focusedFile = null,
    history = [],
  } = useSelector((state) => state.history.windows[activeFile] || {});

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      currentFiles.length !== 0 &&
      !currentFiles.some((file) => file.path === focusedFile) &&
      history.length !== 0
    ) {
      const nextFocusedFile = [...history]
        .reverse()
        .find((historyPath) =>
          currentFiles.some((file) => file.path === historyPath)
        );

      dispatch(
        setFocusedFile({
          id: activeFile,
          focusedFile:
            nextFocusedFile || currentFiles[currentFiles.length - 1]?.path,
        })
      );
    }
  }, [currentFiles, dispatch, focusedFile, history, activeFile]);

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
