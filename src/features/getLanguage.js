const getLanguage = (extension) => {
    switch (extension) {
        case ".js":
            return "javascript";
        case ".jsx":
            return "javascript";
        case ".ts":
            return "typescript";
        case ".tsx":
            return "typescript";
        case ".vue":
            return "javascript";
        case ".json":
            return "json";
        case ".html":
            return "html";
        case ".css":
            return "css";
        case ".md":
            return "markdown";
        case ".py":
            return "python";
        case ".sql":
            return "sql";
        case ".cql":
            return "cypher";
        case ".png":
            return "image";
        case ".yaml":
            return "yaml";
        case ".txt":
            return "plaintext";
        case ".gitignore":
            return "ignore";
        case ".url":
            return "url";
        case ".accdb":
            return "access";
        case ".pptx":
            return "powerpoint";
        case ".xlsx":
            return "excel";
        case ".hwp":
            return "hangul";
        case ".ppt":
            return "powerpoint";
        case ".docx":
            return "word";
        case ".env":
            return "properties";
        default:
            return "plaintext";
    }
};

export default getLanguage;