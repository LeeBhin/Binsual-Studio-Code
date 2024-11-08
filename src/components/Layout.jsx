import css from "../styles/Layout.module.css";
import {
  VscSearch,
  VscArrowLeft,
  VscArrowRight,
  VscLayoutPanelOff,
  VscLayoutSidebarRightOff,
  VscLayoutSidebarLeftOff,
  VscLayout,
} from "react-icons/vsc";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className={css.titlebar}>
        <div className={css["titlebar-wrap"]}>
          <div className={css["titlebar-left"]}></div>
          <div className={css["titlebar-center"]}>
            <div className={css["titlebar-arrow-bg"]}>
              <VscArrowLeft className={css["titlebar-arrow"]} />
            </div>
            <div className={css["titlebar-arrow-bg"]}>
              <VscArrowRight style={{ color: "rgba(204, 204, 204, 0.5)" }} />
            </div>
            <div className={css.search}>
              <div className={css["search-wrap"]}>
                <VscSearch style={{ fontSize: "14px" }} />
                <span>작업 영역</span>
              </div>
            </div>
          </div>
          <div className={css["titlebar-right"]}>
            <VscLayoutSidebarRightOff />
            <VscLayoutPanelOff />
            <VscLayoutSidebarLeftOff />
            <VscLayout />
          </div>
        </div>
      </header>
      <main className={css.main}>{children}</main>
      <footer className={css.footer}></footer>
    </div>
  );
};

export default Layout;
