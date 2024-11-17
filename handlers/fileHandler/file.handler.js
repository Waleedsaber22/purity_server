const fs = require("fs");
const path = require("path");
class FileHandler {
  static baseDir = path.join(__dirname, "..", "..");
  static writeToFile(data, filePath = ["public"]) {
    fs.writeFileSync(
      path.join(this.baseDir, ...filePath),
      JSON.stringify(data)
    );
  }
  static readFromFile(filePath = ["public"]) {
    JSON.parse(fs.readFileSync(path.join(this.baseDir, ...filePath)));
  }
  static getAllModules(allFiles, props = {}, allModules = []) {
    props = { filePattern: "", excludeFilePattern: null, ...props };
    allFiles.forEach((file) => {
      const currentPath = path.join(file.path, file.name);
      if (file.isFile()) {
        if (
          file.name.match(props.filePattern) &&
          !file.name.match(props.excludeFilePattern)
        )
          allModules.push(require(currentPath));
        return allModules;
      }
      const allFiles = fs.readdirSync(currentPath, {
        withFileTypes: true,
      });
      return this.getAllModules(allFiles, props, allModules);
    });
    return allModules;
  }
  static readModules(folderPath, targetPath) {
    const targetFolder = path.join(this.baseDir, folderPath);
    const allFiles = fs.readdirSync(targetFolder, { withFileTypes: true });
    return this.getAllModules(allFiles, { filePattern: "controller" });
  }
}
module.exports = FileHandler;
