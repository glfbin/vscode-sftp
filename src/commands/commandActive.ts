
import * as vscode from 'vscode';
import { checkCommand } from './abstract/createCommand';

export default checkCommand({
  id: 'sftp.active',

  async handleCommand() {
    vscode.commands.executeCommand(
      'sftp.download',
      ['/wlan_wlan_v2r19c10_master/ccjson_5paw5bu65paH5pys5paH5qGj.txt']
    );
  },
});
