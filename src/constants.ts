import vscode from 'vscode';
export const ANDROID_VIEW_ID = 'emulatormanager.android';
export const IOS_VIEW_ID = 'emulatormanager.ios';
export enum DevicePlatform {
  'android' = 'android',
  'ios' = 'ios',
}

export const STARTED = new vscode.ThemeIcon('notebook-state-success');
export const DEVICE = new vscode.ThemeIcon('device-mobile');
export const LOADER = new vscode.ThemeIcon('sync~spin');
