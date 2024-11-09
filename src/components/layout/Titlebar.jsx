import css from "../../styles/Layout.module.css"

import {
  VscArrowLeft,
  VscArrowRight,
  VscLayoutPanelOff,
  VscLayoutSidebarRightOff,
  VscLayoutSidebarLeftOff,
  VscLayout,
  VscSearch,
} from "react-icons/vsc";

const Titlebar = () => {
  return (
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
  );
};

export default Titlebar;
