const EllipsisDots = ({ className = "", size = 2, gap = 2 }) => (
  <span
    className={`flex items-center ${className}`}
    style={{ gap: `${gap}px` }}
  >
    <span
      className="rounded-full bg-current"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
    <span
      className="rounded-full bg-current"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
    <span
      className="rounded-full bg-current"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  </span>
);

export default EllipsisDots;
