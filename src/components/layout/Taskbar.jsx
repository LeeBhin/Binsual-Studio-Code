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
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";
import { setFocusedTask, setIsLayoutActive } from "../../features/historySlice";

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

  const handleClick = (id) => {
    if (focusedTask === id) {
      dispatch(
        setIsLayoutActive({
          isActive:
            isLayoutActive.width === 0 ? true : !isLayoutActive.isActive,
          width: isLayoutActive.width || 170,
          from: "layout",
        })
      );
    } else {
      if (!isLayoutActive.isActive) {
        dispatch(
          setIsLayoutActive({
            width: isLayoutActive.width,
            isActive: true,
            from: "layout",
          })
        );
      }
    }

    dispatch(setFocusedTask(id));
  };

  return (
    <div className={css.taskbar}>
      <div className={css.tasks}>
        {icons.map(({ id, Icon }) => (
          <div
            key={id}
            className={css["taskbar-wrap"]}
            onClick={() => handleClick(id, Icon)}
            style={
              focusedTask === id && isLayoutActive.isActive
                ? { color: "#cccccc", borderLeft: "solid 2px #0078d4" }
                : { borderLeft: "solid 2px transparent" }
            }
          >
            <Icon style={{ marginRight: "2px" }} />
          </div>
        ))}
      </div>

      <div className={css.setting}>
        <div className={css["taskbar-wrap"]}>
          <VscAccount />
        </div>
        <div className={css["taskbar-wrap"]}>
          <VscSettingsGear />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
