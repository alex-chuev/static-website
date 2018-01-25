import * as webpack from 'webpack';
import { Compiler } from 'webpack';
import { FileObject } from '../file-object';
import { AppConfig } from './app-config';

export class AppScriptsBuilder {

  files: FileObject[] = [];

  private watcher: Compiler.Watching;

  constructor(private config: AppConfig) {
  }

  add(files: FileObject | FileObject[]) {
    this.files = this.files.concat(files);
  }

  removeFile(file: FileObject) {
    this.files = this.files.filter(existingFile => existingFile.absolutePath !== file.absolutePath);
  }

  build(): Promise<void> {
    return new Promise(resolve => webpack(this.createConfiguration()).run(() => resolve()));
  }

  stop(): Promise<void> {
    return new Promise(resolve => this.watcher.close(resolve));
  }

  watch() {
    this.watcher = webpack(this.createConfiguration()).watch({}, (err, stats) => {
      if (stats.hasErrors()) {
        console.log(stats.toString());
      }
    })
  }

  private createConfiguration(): webpack.Configuration {
    return {
      entry: this.createEntry(),
      output: {
        filename: '[name].js',
      },
      devtool: 'eval',
      resolve: {
        extensions: ['.ts', '.tsx', '.js']
      },
      module: {
        rules: [
          {test: /\.tsx?$/, loader: 'awesome-typescript-loader'},
          {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
        ]
      },
    };
  }

  private createEntry(): { [name: string]: string } {
    return this.files.reduce((entry, file) => {
      entry[file.slashPathWithoutExt] = file.slashPath;
      return entry;
    }, {});
  }

}
