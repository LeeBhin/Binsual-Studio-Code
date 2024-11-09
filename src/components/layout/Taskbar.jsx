import css from "../../styles/Layout.module.css"

import {
  VscSearch,
  VscSourceControl,
  VscExtensions,
  VscDatabase,
  VscDebugAlt,
  VscFiles,
  VscMail,
} from "react-icons/vsc";

const Taskbar = () => {
  return (
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
        <VscExtensions />
      </div>
      <div className={css["taskbar-wrap"]}>
        <VscDatabase />
      </div>
      <div className={css["taskbar-wrap"]}>
        <VscMail />
      </div>
    </div>
  );
};

export default Taskbar;
