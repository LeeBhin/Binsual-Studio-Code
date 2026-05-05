import Icons from "../assets/icons";

const FileIcon = ({ extension }) => {
  let iconKey = extension.replace(".", "");

  if (iconKey === "sql" || iconKey === "accdb") {
    iconKey = "sql";
  }

  if (extension === ".vs") iconKey = "vscode";

  if (extension === "robots") iconKey = "robots";

  if (extension === ".exe") iconKey = "debug";

  const IconComponent =
    Icons[iconKey.charAt(0).toUpperCase() + iconKey.slice(1)];

  if (IconComponent) {
    const extra = iconKey === "js" ? "text-[#F7DF1E] text-[10px]" : "";
    return (
      <IconComponent
        className={`w-4 h-5 min-w-4 min-h-5 ${extra}`}
      />
    );
  }
};

export default FileIcon;
