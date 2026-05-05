import Titlebar from "./Titlebar";
import Taskbar from "./Taskbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useEffect } from "react";
import { useHistory, setFocusedFile } from "../../store/history";

const Layout = ({ children }) => {
  const activeFile = useHistory((s) => s.activeFile);
  const win = useHistory((s) => s.windows[activeFile]);
  const currentFiles = win?.currentFiles ?? [];
  const focusedFile = win?.focusedFile ?? null;
  const history = win?.history ?? [];

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

      setFocusedFile({
        id: activeFile,
        focusedFile:
          nextFocusedFile || currentFiles[currentFiles.length - 1]?.path,
      });
    }
  }, [currentFiles, focusedFile, history, activeFile]);

  return (
    <div>
      <Titlebar />

      <div className="flex overflow-hidden h-[calc((var(--vh,1vh)*100)-57px)]">
        <header className="bg-[var(--activitybar)] w-auto h-full text-[var(--text-dim)] flex">
          <Taskbar />

          <Sidebar />
        </header>

        <main className="grow shrink overflow-hidden">{children}</main>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
