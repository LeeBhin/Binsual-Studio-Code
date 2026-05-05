import { useEffect, useRef, useState } from "react";
import Codicon from "./Codicon";

/**
 * items: Array<
 *   | { type: "separator" }
 *   | {
 *       label: string,
 *       shortcut?: string,
 *       disabled?: boolean,
 *       submenu?: items[],
 *       onClick?: () => void,
 *     }
 * >
 */
const ContextMenu = ({ items, x, y, onClose }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x, y });
  const [openSubIndex, setOpenSubIndex] = useState(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // 화면 밖으로 나가지 않게 위치 보정
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    let nx = x;
    let ny = y;
    if (x + rect.width > window.innerWidth) nx = window.innerWidth - rect.width - 4;
    if (y + rect.height > window.innerHeight)
      ny = window.innerHeight - rect.height - 4;
    setPos({ x: Math.max(0, nx), y: Math.max(0, ny) });
  }, [x, y]);

  const handleItem = (item) => {
    if (item.disabled || item.submenu) return;
    item.onClick?.();
    onClose?.();
  };

  return (
    <div
      ref={ref}
      className="fixed z-[1000] min-w-[220px] py-1 px-1 rounded-[5px] shadow-lg text-[12px] text-[#CCCCCC] select-none"
      style={{
        top: pos.y,
        left: pos.x,
        background: "#252526",
        border: "1px solid #454545",
        fontFamily:
          '"Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", system-ui, sans-serif',
        fontWeight: 400,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {items.map((item, i) => {
        if (item.type === "separator") {
          return <div key={i} className="my-1 -mx-1 h-px bg-[#454545]" />;
        }
        const isOpen = openSubIndex === i;
        return (
          <div
            key={i}
            className={`group/menuitem relative flex items-center justify-between rounded-[5px] px-7 py-[2px] ${
              item.disabled
                ? "opacity-50 cursor-default"
                : "cursor-pointer hover:bg-[color-mix(in_srgb,white_4.5%,transparent)]"
            }`}
            onClick={() => handleItem(item)}
            onMouseEnter={() => setOpenSubIndex(item.submenu ? i : null)}
          >
            <span className="flex-1 truncate pr-6">{item.label}</span>
            {item.shortcut && (
              <span
                className={`text-[11px] whitespace-nowrap text-[#9B9B9B] ${
                  item.disabled ? "" : "group-hover/menuitem:text-[#CCCCCC]"
                }`}
              >
                {item.shortcut}
              </span>
            )}
            {item.submenu && (
              <Codicon name="chevron-right" size={14} className="ml-1" />
            )}
            {item.submenu && isOpen && (
              <ContextMenu
                items={item.submenu}
                x={(ref.current?.getBoundingClientRect().right ?? 0) - 2}
                y={(ref.current?.getBoundingClientRect().top ?? 0) + i * 24}
                onClose={onClose}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;
