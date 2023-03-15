import vscode from 'vscode';

const SETTINGS_PREFIX = 'emulatormanager';

function getSettings(settingName: string) {
  return vscode.workspace.getConfiguration(`${SETTINGS_PREFIX}.${settingName}`);
}

function getAndroidHome() {
  return getSettings('androidHome');
}

export { getSettings, getAndroidHome };
