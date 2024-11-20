import { useDispatch, useSelector } from "react-redux";
import css from "../../styles/Layout.module.css";
import {
  VscFiles,
  VscSearch,
  VscSourceControl,
  VscDebugAlt,
  VscExtensions,
  VscDatabase,
  VscMail,
} from "react-icons/vsc";
import { setFocusedTask, setIsLayoutActive } from "../../features/historySlice";
import { useEffect } from "react";

const icons = [
  { id: "files", Icon: VscFiles },
  { id: "search", Icon: VscSearch },
  { id: "git", Icon: VscSourceControl },
  { id: "debug", Icon: VscDebugAlt },
  { id: "extensions", Icon: VscExtensions },
  { id: "db", Icon: VscDatabase },
  { id: "mail", Icon: VscMail },
];

const Taskbar = () => {
  const { focusedTask, isLayoutActive } = useSelector((state) => state.history);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFocusedTask(isLayoutActive.isActive ? "files" : ""));
  }, [isLayoutActive.isActive, dispatch]);

  const handleClick = (id, Icon) => {
    if (Icon === VscFiles) {
      dispatch(
        setIsLayoutActive({
          isActive:
            isLayoutActive.width === 0 ? true : !isLayoutActive.isActive,
          width: isLayoutActive.width || 170,
          from: "layout",
        })
      );
    }
    dispatch(setFocusedTask(id));
  };

  return (
    <div className={css.taskbar}>
      {icons.map(({ id, Icon }) => (
        <div
          key={id}
          className={css["taskbar-wrap"]}
          onClick={() => handleClick(id, Icon)}
          style={
            focusedTask === id
              ? { color: "#cccccc", borderLeft: "solid 2px #d7d7d7" }
              : {}
          }
        >
          <Icon />
        </div>
      ))}
    </div>
  );
};

export default Taskbar;
