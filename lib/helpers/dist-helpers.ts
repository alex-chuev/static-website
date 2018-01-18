import { copySync, outputFileSync, pathExistsSync, removeSync } from 'fs-extra';

export function distFile(srcPath: string, distPath: string) {
  if (pathExistsSync(srcPath)) {
    copySync(srcPath, distPath);
    distLog(distPath);
  }
}

export function undistFile(distPath: string) {
  if (pathExistsSync(distPath)) {
    removeSync(distPath);
    distLog(distPath, '-');
  }
}

export function distContent(content: string, distPath: string) {
  outputFileSync(distPath, content);
  distLog(distPath);
}

function distLog(distPath: string, prefix = '>') {
  console.log(prefix, distPath);
}
