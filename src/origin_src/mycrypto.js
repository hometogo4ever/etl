import * as fs from "fs";
import * as vm from "vm";
import * as path from "path";

// 실행할 JavaScript 파일들이 있는 폴더 경로
const directoryPath = "./crypto"; // 예: ./scripts 폴더에 여러 JS 파일이 있음

// 폴더 내 모든 파일 가져오기
const files = fs
  .readdirSync(directoryPath)
  .filter((file) => file.endsWith(".js"));

// 모든 파일 읽어서 실행
files.forEach((file) => {
  const filePath = path.join(directoryPath, file);
  const code = fs.readFileSync(filePath, "utf8");

  console.log(`Executing: ${file}`);
  vm.runInThisContext(code);
});
