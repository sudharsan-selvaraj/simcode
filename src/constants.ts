import path from 'path';
import vscode, { ThemeColor } from 'vscode';
export const ANDROID_VIEW_ID = 'emulatormanager.android';
export const IOS_VIEW_ID = 'emulatormanager.ios';
export enum DevicePlatform {
  'android' = 'android',
  'ios' = 'ios',
}

export const STARTED = new vscode.ThemeIcon(
  'notebook-state-success',
  new ThemeColor('terminal.ansiBrightGreen')
);
export const DEVICE = new vscode.ThemeIcon('device-mobile');
export const LOADER = new vscode.ThemeIcon('sync~spin');
export const IOS = path.join(__filename, '../../media/ios.png');
export const ANDROID = path.join(__filename, '../../media/android.png');
