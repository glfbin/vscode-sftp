import { checkFileCommand } from './abstract/createCommand';
import * as vscode from 'vscode';
import { reportError } from '../helper';
import { tryLoadConfigs } from '../modules/config';
import { createFileService, disposeFileService, findAllFileService } from '../modules/serviceManager';
import { getWorkspaceFolders } from '../host';
import app from '../app';

async function setupWorkspaceFolder(dir) {
    const configs = await tryLoadConfigs(dir);
    configs.forEach(config => {
        createFileService(config, dir);
    });
}

function reload(workspaceFolders: vscode.WorkspaceFolder[]) {
    const pendingInits = workspaceFolders.map(async folder => {
        const workspacePath = folder.uri.fsPath;

        // dispose old service
        findAllFileService(service => service.workspace === workspacePath).forEach(disposeFileService);
        await setupWorkspaceFolder(folder.uri.fsPath);
    });

    return Promise.all(pendingInits);
}

export default checkFileCommand({
    id: 'sftp.reloadConfig',
    getFileTarget: async (): Promise<undefined> => {
        const workspaceFolders = getWorkspaceFolders();
        if (!workspaceFolders) {
            return;
        }

        try {
            await reload(workspaceFolders);
        } catch (error) {
            reportError(error);
        } finally {
            app.remoteExplorer.refresh();
        }
        return undefined;
    },

    async handleFile() {
        return undefined;
    },
});
