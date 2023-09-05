export const getFileName = filePath => filePath?.replaceAll("\\", "/").split("/").pop() ?? "";
