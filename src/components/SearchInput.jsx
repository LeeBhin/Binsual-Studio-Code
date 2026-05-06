import { forwardRef } from "react";

const SearchInput = forwardRef(
  (
    {
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      actions = null,
      className = "",
    },
    ref
  ) => (
    <div
      className={`flex items-center w-full min-w-0 rounded-sm bg-[var(--input)] focus-within:[box-shadow:0_0_0_1px_var(--accent)] ${className}`}
    >
      <input
        type="text"
        className="flex-1 min-w-0 bg-transparent border-none outline-none text-[var(--text)] text-[13px] py-[3.5px] pl-[7px] pr-[7px] truncate"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={ref}
      />
      {actions && (
        <div className="flex gap-0.5 pr-1 shrink-0">{actions}</div>
      )}
    </div>
  )
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
