import { useEffect, useRef, useState } from "react";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";
import CustomScrollbar from "../CustomScrollbar";

const Section = ({
  title,
  badge,
  children,
  defaultOpen = true,
  actions = null,
  actionsAlwaysVisible = false,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  grow = 1,
  basis,
  innerRef,
  isResizing = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen =
    controlledSetIsOpen !== undefined ? controlledSetIsOpen : setInternalIsOpen;
  const [isActive, setIsActive] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const flexStyle = !isOpen
    ? { flexGrow: 0, flexBasis: 0 }
    : basis != null
    ? { flexGrow: 0, flexBasis: `${basis}px` }
    : { flexGrow: grow, flexBasis: 0 };

  return (
    <div
      ref={(el) => {
        sectionRef.current = el;
        if (typeof innerRef === "function") innerRef(el);
        else if (innerRef) innerRef.current = el;
      }}
      className="overflow-hidden flex flex-col text-[13px] group/section"
      style={{
        ...flexStyle,
        flexShrink: 0,
        minHeight: 22,
        transition: isResizing
          ? "none"
          : "flex-grow 0.15s linear, flex-basis 0.15s linear",
      }}
    >
      <div
        className="cursor-pointer flex items-center h-[22px] relative shrink-0"
        style={isActive ? { boxShadow: "0 0 0 1px var(--accent) inset" } : {}}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setIsActive((prev) => !prev);
        }}
      >
        <div
          className="flex items-center gap-1.5 h-[22px] leading-none w-full pr-[9px]"
          style={{ paddingLeft: "1px" }}
        >
          <div>
            {isOpen ? (
              <VscChevronDown
                className="text-[17px] -mr-1"
                style={{
                  paddingLeft: "1px",
                  stroke: "currentColor",
                  strokeWidth: 0.5,
                }}
              />
            ) : (
              <VscChevronRight
                className="text-[17px] -mr-1"
                style={{
                  paddingLeft: "1px",
                  stroke: "currentColor",
                  strokeWidth: 0.5,
                }}
              />
            )}
          </div>
          <div className="flex-1 flex items-center justify-between overflow-hidden">
            <span className="font-bold text-[11px] leading-[22px] truncate min-w-0">
              {title}
            </span>
            <div className="flex items-center gap-1.5 shrink-0 pr-[3px]">
              {badge !== undefined && (
                <span
                  className="min-w-[16px] h-[16px] px-[5px] mr-[6px] inline-flex items-center justify-center rounded-full text-[10px] font-normal leading-none"
                  style={{
                    color: "#f8f8f8",
                    backgroundColor: "#616161",
                    paddingBottom: "1px",
                  }}
                >
                  {badge}
                </span>
              )}
              {actions && (
                <div
                  className={`flex items-center text-base gap-[3px] ${
                    actionsAlwaysVisible
                      ? ""
                      : isOpen
                      ? `${
                          isActive
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                        } group-hover/section:opacity-100 group-hover/section:pointer-events-auto`
                      : "opacity-0 pointer-events-none"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CustomScrollbar style={{ flex: "1 1 0" }}>
        <div
          className="min-h-full"
          onMouseDown={() => setIsActive(true)}
        >
          {children}
        </div>
      </CustomScrollbar>
    </div>
  );
};

export default Section;
