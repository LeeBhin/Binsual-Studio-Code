import Codicon from "../Codicon";
import {
  useHistory,
  setFocusedTask,
  setIsLayoutActive,
} from "../../store/history";

const icons = [
  { id: "files", name: "files" },
  { id: "search", name: "search" },
  { id: "git", name: "source-control" },
  { id: "debug", name: "debug-alt" },
  { id: "extensions", name: "extensions" },
  { id: "mail", name: "mail" },
];

const taskCls =
  "w-12 h-12 flex justify-center items-center cursor-pointer hover:text-[var(--text)]";

const Taskbar = () => {
  const focusedTask = useHistory((s) => s.focusedTask);
  const isLayoutActive = useHistory((s) => s.isLayoutActive);

  const handleClick = (id) => {
    if (focusedTask === id) {
      setIsLayoutActive({
        isActive:
          isLayoutActive.width === 0 ? true : !isLayoutActive.isActive,
        width: isLayoutActive.width || 170,
        from: "layout",
      });
    } else {
      if (!isLayoutActive.isActive) {
        setIsLayoutActive({
          width: isLayoutActive.width,
          isActive: true,
          from: "layout",
        });
      }
    }

    setFocusedTask(id);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        {icons.map(({ id, name }) => (
          <div
            key={id}
            className={taskCls}
            onClick={() => handleClick(id)}
            style={
              focusedTask === id && isLayoutActive.isActive
                ? { color: "var(--text)", borderLeft: "solid 2px var(--text-strong)" }
                : { borderLeft: "solid 2px transparent" }
            }
          >
            <Codicon name={name} size={24} style={{ marginRight: "2px" }} />
          </div>
        ))}
      </div>

      <div className="w-12 text-2xl flex flex-col items-center">
        <div className={taskCls}>
          <Codicon name="account" size={24} />
        </div>
        <div className={taskCls}>
          <Codicon name="settings-gear" size={24} />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
