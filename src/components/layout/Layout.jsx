import css from "../../styles/Layout.module.css";
import { VscMenu } from "react-icons/vsc";
import Titlebar from "./Titlebar";
import Taskbar from "./Taskbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
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

      <footer className={css.footer}></footer>
    </div>
  );
};

export default Layout;
