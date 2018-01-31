import * as webpack from 'webpack';
import * as _ from 'lodash';
import { Compiler } from 'webpack';
import { FileObject } from '../file-object';
import { AppConfig } from '../app/app-config';
import * as glob from 'glob';
import * as path from 'path';
import { AppPages } from '../app/app-pages';
import { Page } from '../code/page';
import * as minimatch from 'minimatch';
import { PageId } from '../../types';

export class TypescriptCompiler {

  private files: FileObject[] = [];
  private watcher: Compiler.Watching;
  private existingPageIds: PageId[];

  constructor(private config: AppConfig) {
    this.existingPageIds = AppPages.getPageFiles(this.config)
      .map(file => Page.createPageId(file));

    this.files = glob.sync(path.join(this.config.srcFolder, '**/*.ts'))
      .map(filePath => new FileObject(filePath))
      .filter(file => this.shouldFileBeCompiled(file));
  }

  shouldFileBeCompiled(file: FileObject): boolean {
    return this.isAppTypescriptFile(file) || this.isPageTypescriptFile(file);
  }

  private isAppTypescriptFile(file: FileObject): boolean {
    return minimatch(file.absolutePath, this.config.appTypescriptGlob);
  }

  private isPageTypescriptFile(file: FileObject) {
    if (false === minimatch(file.absolutePath, this.config.pagesTypescriptGlob)) {
      return false;
    }

    return _.includes(this.existingPageIds, Page.createPageId(file));
  }

  addFileAndRestartWatching(file: FileObject | FileObject[]): Promise<void> {
    return this.setFilesAndRestartWatching(this.files.concat(file));
  }

  removeFileAndRestartWatching(file: FileObject): Promise<void> {
    return this.setFilesAndRestartWatching(_.without<FileObject>(this.files, file));
  }

  private setFilesAndRestartWatching(files: FileObject[]): Promise<void> {
    this.files = files;

    return this.restartWatching();
  }

  private restartWatching(): Promise<void> {
    return this.stopWatching()
      .then(() => this.watch());
  }

  compile(): Promise<void> {
    const config = this.createConfig();

    return new Promise(resolve => {
      webpack(config)
        .run(() => resolve());
    });
  }

  stopWatching(): Promise<void> {
    return new Promise(resolve => {
      this.watcher.close(() => {
        delete this.watcher;
        resolve();
      });
    });
  }

  watch() {
    const config = this.createConfig();

    this.watcher = webpack(config)
      .watch({}, (err, stats) => {
        if (stats.hasErrors()) {
          stats.toJson().errors
            .forEach(error => console.error(error));
        }
      });
  }

  private createConfig(): webpack.Configuration {
    return {
      entry: this.createEntry(),
      output: {
        filename: '[name].js',
      },
      devtool: this.config.production ? false : 'eval',
      resolve: {
        extensions: ['.ts', '.tsx'],
      },
      module: {
        rules: [
          {test: /\.tsx?$/, loader: 'awesome-typescript-loader'},
          {test: /\.js$/, loader: 'source-map-loader'},
        ]
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin(),
      ],
    };
  }

  private createEntry(): { [name: string]: string } {
    return _(this.files)
      .keyBy(file => file.slashPathWithoutExt)
      .mapValues(file => file.slashPath)
      .value();
  }

}
