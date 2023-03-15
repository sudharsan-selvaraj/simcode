import * as vscode from 'vscode';
import { ANDROID_TREE_PROVIDER } from './constants';
import { AndroidDeviceManager } from './managers/android';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('emulatormanager.openSettings', () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'emulatormanager.androidhome'
      );
    })
  );

  const androidDeviceManager = new AndroidDeviceManager();

  androidDeviceManager.activate(context, ANDROID_TREE_PROVIDER);
}

export function deactivate() {
  console.log('Deactivated');
}
