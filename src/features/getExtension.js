const getExtension = (fileName) => {
    if (fileName === "robots.txt") return "robots";
    const parts = fileName.split(".");
    return parts.length > 1 ? "." + parts[parts.length - 1] : "";
};

export default getExtension;