const Codicon = ({ name, className = "", style, size }) => (
  <i
    className={`codicon codicon-${name} ${className}`}
    style={size != null ? { fontSize: size, ...style } : style}
  />
);

export default Codicon;
