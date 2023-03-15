import * as vscode from 'vscode';
import { ANDROID_VIEW_ID, IOS_VIEW_ID } from './constants';
import { AndroidDeviceManager } from './managers/android';
import { IosDeviceManager } from './managers/ios';

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('emulatormanager.openSettings', () => {
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        'emulatormanager.androidhome'
      );
    })
  );

  const androidDeviceManager = new AndroidDeviceManager(
    context,
    ANDROID_VIEW_ID
  );
  const iosDeviceManager = new IosDeviceManager(context, IOS_VIEW_ID);

  await Promise.allSettled([
    androidDeviceManager.activate(),
    iosDeviceManager.activate(),
  ]);
}

export function deactivate() {
  console.log('Deactivated');
}
