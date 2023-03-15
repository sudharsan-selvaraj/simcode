import * as vscode from 'vscode';
import { ANDROID_VIEW_ID, IOS_VIEW_ID } from './constants';
import { AndroidDeviceManager } from './managers/android';
import { IosDeviceManager } from './managers/ios';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('emulatormanager.openSettings', () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'emulatormanager.androidhome'
      );
    })
  );

  const androidDeviceManager = new AndroidDeviceManager(context);
  const iosDeviceManager = new IosDeviceManager(context);

  androidDeviceManager.activate(ANDROID_VIEW_ID);
  iosDeviceManager.activate(IOS_VIEW_ID);
}

export function deactivate() {
  console.log('Deactivated');
}
