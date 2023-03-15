import * as vscode from 'vscode';
import { DevicePlatform } from '../constants';
import { Device } from '../models/device';
import { DeviceTreeProvider } from '../views/device-tree-provider';
import { DeviceManager } from './device-manager';

export class AndroidDeviceManager implements DeviceManager {
  private treeDataProvider: DeviceTreeProvider = new DeviceTreeProvider(this);

  activate(context: vscode.ExtensionContext, providerName: string) {
    vscode.commands.executeCommand(
      'setContext',
      'emulatormanager.androidHomeNotAvailable',
      false
    );

    context.subscriptions.push(
      vscode.window.registerTreeDataProvider(
        providerName,
        this.treeDataProvider
      )
    );
    // vscode.window.createTreeView(providerName, {
    //   treeDataProvider: this.treeDataProvider,
    // });
    // context.subscriptions.push(
    //   vscode.window.registerWebviewViewProvider(providerName, new wvProvider())
    // );
  }

  async getDevices(): Promise<Device[]> {
    return [
      {
        name: 'onplus',
        id: '123',
        isRunning: true,
        manager: this,
        platform: DevicePlatform.android,
      },
      {
        name: 'samsung',
        id: '123',
        isRunning: true,
        manager: this,
        platform: DevicePlatform.android,
      },
    ];
  }
}

export class wvProvider implements vscode.WebviewViewProvider {
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewView.webview.html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
    </head>
    <body>
        <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    </body>
    </html>`;
  }
}
