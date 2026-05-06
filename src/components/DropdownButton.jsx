import { useState } from "react";
import { VscChevronDown } from "react-icons/vsc";
import Tooltip from "./Tooltip";

const BASE_BG = "#0E639C";
const HOVER_BG = "#1177BB";

const DropdownButton = ({
  label,
  icon,
  onClick,
  disabled = false,
  tooltip,
  dropdownTooltip,
  onDropdownClick,
  group = "dropdown-button",
  className = "",
}) => {
  const [mainHover, setMainHover] = useState(false);
  const [chevronHover, setChevronHover] = useState(false);

  const mainBg = !disabled && mainHover ? HOVER_BG : BASE_BG;
  const chevronBg = !disabled && chevronHover ? HOVER_BG : BASE_BG;

  return (
    <div
      className={`flex rounded-sm overflow-hidden text-white text-[13px] ${className}`}
      style={{
        opacity: disabled ? 0.4 : 1,
        backgroundColor: BASE_BG,
      }}
    >
      <Tooltip
        label={tooltip}
        position="bottom"
        group={group}
        className="flex-1"
      >
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="flex-1 flex justify-center items-center gap-[3px] py-[5.3px] border-none text-[11.5px] leading-none"
          style={{
            backgroundColor: mainBg,
            cursor: disabled ? "default" : "pointer",
          }}
          onMouseEnter={() => setMainHover(true)}
          onMouseLeave={() => setMainHover(false)}
        >
          {icon}
          {label}
        </button>
      </Tooltip>
      <div
        className="self-center w-px h-[15.3px]"
        style={{ background: "rgba(255,255,255,0.3)" }}
      />
      <Tooltip label={dropdownTooltip} position="bottom" group={group}>
        <button
          type="button"
          onClick={onDropdownClick}
          disabled={disabled}
          className="h-full flex justify-center items-center px-[4px] border-none"
          style={{
            backgroundColor: chevronBg,
            cursor: disabled ? "default" : "pointer",
          }}
          onMouseEnter={() => setChevronHover(true)}
          onMouseLeave={() => setChevronHover(false)}
        >
          <VscChevronDown
            className="text-base"
            style={{ stroke: "currentColor", strokeWidth: 0.5 }}
          />
        </button>
      </Tooltip>
    </div>
  );
};

export default DropdownButton;
