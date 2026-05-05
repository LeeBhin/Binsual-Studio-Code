import { ReactComponent as BackgroundSVG } from "../assets/svgs/background-icon.svg";

const Key = ({ children }) => (
  <span className="bg-[#8080802b] border-[0.67px] border-[#33333399] rounded-[3px] [border-bottom-color:#44444499] [box-shadow:inset_0_-1px_0_#0000005c] text-[var(--text)] text-[11px] h-[10px] leading-[10px] px-1.5 py-px mx-0.5">
    {children}
  </span>
);

const ShortcutRow = ({ label, keys }) => (
  <div className="flex gap-2.5">
    <div className="text-[color-mix(in_srgb,var(--text)_60%,transparent)] py-2.5 pl-2.5 w-[130px] text-right">
      {label}
    </div>
    <div className="py-2.5 pr-2.5 text-[var(--text)]">
      {keys.map((k, i) => (
        <span key={i}>
          {i > 0 && "+"}
          <Key>{k}</Key>
        </span>
      ))}
    </div>
  </div>
);

const EmptyScreen = () => {
  return (
    <div className="flex flex-col items-center w-auto">
      <BackgroundSVG />
      <div className="mt-[5px] flex flex-col">
        <ShortcutRow label="GitHub 열기" keys={["Ctrl", "Alt", "G"]} />
        <ShortcutRow label="파일에서 찾기" keys={["Ctrl", "Shift", "F"]} />
        <ShortcutRow label="페이지 닫기" keys={["Alt", "F4"]} />
        <ShortcutRow label="전체 화면 설정/해제" keys={["F11"]} />
        <ShortcutRow
          label="응원하기"
          keys={["Ctrl", "Shift", "Alt", "Enter"]}
        />
      </div>
    </div>
  );
};

export default EmptyScreen;
