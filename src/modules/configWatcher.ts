import * as vscode from 'vscode';
import * as fs from 'fs';
import logger from '../logger';
import { CONFIG_PATH } from '../constants';

class Configwatcher {

  private watcher: vscode.FileSystemWatcher;
  // 配置文件时间戳
  private readonly configModifyDateMap = new Map<string, Date>();

  /**
   * 监控配置文件变化
   * @param handleConfigSave 配置变更事件
   */
  watche(handleConfigSave: ((uri: vscode.Uri) => {})) {
    this.watcher = vscode.workspace.createFileSystemWatcher('**/' + CONFIG_PATH, false, false, false);
    this.watcher.onDidChange(uri => { // 文件发生更新
      handleConfigSave(uri);
    });
    this.watcher.onDidCreate(uri => { // 新建了js文件
      handleConfigSave(uri);
    });
    this.watcher.onDidDelete(uri => { // 删除了js文件
      logger.info(`js deleted, ${uri.fsPath}`);
    });
  }

  destory() {
    if (this.watcher) {
      this.watcher.dispose();
    }
  }

  /**
   * 配置文件是否变更
   * @param uri 配置文件
   */
  isConfigChange(uri: vscode.Uri) {
    const stat = fs.statSync(uri.fsPath);
    const cacheDate: Date | undefined = this.configModifyDateMap.get(uri.fsPath);
    if (cacheDate && stat.mtime.getTime() === cacheDate.getTime()) {
      return false;
    } else {
      this.configModifyDateMap.set(uri.fsPath, stat.mtime);
    }
    return true;
  }

}

export const configwatcher = new Configwatcher();
