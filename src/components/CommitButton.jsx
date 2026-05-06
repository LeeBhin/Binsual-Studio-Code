import { useState } from "react";
import Tooltip from "./Tooltip";

const BASE_BG = "#0E639C";
const HOVER_BG = "#1177BB";

const CommitButton = ({
  label,
  icon,
  onClick,
  disabled = false,
  tooltip,
  group = "commit-button",
  className = "",
}) => {
  const [hover, setHover] = useState(false);

  const bg = !disabled && hover ? HOVER_BG : BASE_BG;

  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex justify-center items-center gap-[3px] h-[24.5px] border-none text-white text-[11.5px] leading-[14px] ${className}`}
      style={{
        backgroundColor: bg,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon}
      {label}
    </button>
  );

  return tooltip ? (
    <Tooltip label={tooltip} position="bottom" group={group}>
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default CommitButton;
