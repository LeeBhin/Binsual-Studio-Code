import css from "../styles/Layout.module.css";
import {
  VscSearch,
  VscArrowLeft,
  VscArrowRight,
  VscLayoutPanelOff,
  VscLayoutSidebarRightOff,
  VscLayoutSidebarLeftOff,
  VscLayout,
  VscMenu,
  VscFiles,
  VscSourceControl,
  VscExtensions,
  VscDatabase,
  VscDebugAlt,
} from "react-icons/vsc";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className={css.titlebar}>
        <div className={css["titlebar-wrap"]}>
          <div className={css["titlebar-left"]}></div>
          <div className={css["titlebar-center"]}>
            <div className={css["titlebar-icon-bg"]}>
              <VscArrowLeft className={css["titlebar-arrow"]} />
            </div>
            <div className={css["titlebar-icon-bg"]}>
              <VscArrowRight
                className={css["titlebar-arrow"]}
                style={{ color: "rgba(204, 204, 204, 0.5)" }}
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
            <div className={css["titlebar-icon-bg"]}>
              <VscLayoutSidebarLeftOff />
            </div>
            <div className={css["titlebar-icon-bg"]}>
              <VscLayoutPanelOff />
            </div>
            <div className={css["titlebar-icon-bg"]}>
              <VscLayoutSidebarRightOff />
            </div>
            <div className={css["titlebar-icon-bg"]}>
              <VscLayout />
            </div>
          </div>
        </div>
      </header>

      <header className={css.activitybar}>
        <div className={css.menubar}>
          <VscMenu />
        </div>

        <div className={css.taskbar}>
          <div className={css["taskbar-wrap"]}>
            <VscFiles />
          </div>
          <div className={css["taskbar-wrap"]}>
            <VscSearch />
          </div>
          <div className={css["taskbar-wrap"]}>
            <VscSourceControl />
          </div>
          <div className={css["taskbar-wrap"]}>
            <VscDebugAlt />
          </div>
          <div className={css["taskbar-wrap"]}>
            <VscDatabase />
          </div>
          <div className={css["taskbar-wrap"]}>
            <VscExtensions />
          </div>
        </div>
      </header>

      <main className={css.main}>{children}</main>

      <footer className={css.footer}></footer>
    </div>
  );
};

export default Layout;
