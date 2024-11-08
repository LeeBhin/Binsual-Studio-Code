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
  VscEllipsis,
} from "react-icons/vsc";

const Layout = ({ children }) => {
  return (
    <div className={css.Layout}>
      <header className={css.titlebar}>
        <div className={css["titlebar-wrap"]}>
          <div className={css["titlebar-left"]}></div>
          <div className={css["titlebar-center"]}>
            <div className={css["icon-bg"]}>
              <VscArrowLeft className={css["titlebar-arrow"]} />
            </div>
            <div className={css["icon-bg"]}>
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

      <header className={css.activitybar}>
        <div className={css["activitybar-wrap"]}>
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
        </div>

        <div className={css.sidebar}>
          <div className={css["sidebar-title"]}>
            <span className={css["sidebar-title-txt"]}>탐색기</span>
            <div className={`${css["icon-bg"]} ${css.ellipsis}`}>
              <VscEllipsis />
            </div>
          </div>
        </div>
      </header>
      <main className={css.main}>{children}</main>

      <footer className={css.footer}></footer>
    </div>
  );
};

export default Layout;
