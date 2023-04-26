const path = require("path")
const fs = require("fs");
const fse = require('fs-extra');

const prebuild = () => {
  const frontendSourcePath = path.join(__dirname, "../frontend/build");
  const frontendDestinationPath = path.join(__dirname, "./frontend-build");
  fs.rmSync(frontendDestinationPath, { recursive: true, force: true });
  fs.mkdirSync(frontendDestinationPath);
  fse.copySync(frontendSourcePath, frontendDestinationPath, { overwrite: true });
}

const postbuild = () => {
  const frontendSourcePath = path.join(__dirname, "../frontend/build");
  const frontendDestinationPath = path.join(__dirname, "./frontend-build");
  fs.rmSync(frontendSourcePath, { recursive: true, force: true });
  fs.rmSync(frontendDestinationPath, { recursive: true, force: true });
}

const command = process.argv[2];
switch (command) {
  case "prebuild":
    prebuild();
    process.exit(0);
  case "postbuild":
    postbuild();
    process.exit(0);
  default:
    console.error("Command not found.");
    process.exit(1);
}
