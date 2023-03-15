import * as vscode from 'vscode';
import { DevicePlatform } from '../constants';
import { Device, DeviceState } from '../models/device';
import { DeviceTreeProvider } from '../views/device-tree-provider';
import { DeviceManager } from './device-manager';
import { spawnSync, execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { cyan, red, yellow } from 'chalk';
import { join, normalize } from 'path';
import { platform } from 'os';

export class AndroidDeviceManager implements DeviceManager {
  constructor(private context: vscode.ExtensionContext) {}
  private treeDataProvider: DeviceTreeProvider = new DeviceTreeProvider(this);
  private deviceState: Map<string, DeviceState> = new Map();

  activate(providerName: string) {
    this.context.subscriptions.push(
      vscode.window.registerTreeDataProvider(
        providerName,
        this.treeDataProvider
      )
    );

    this.context.subscriptions.push(
      vscode.commands.registerCommand('emulatormanager.android.Refresh', () => {
        this.treeDataProvider.refresh();
      })
    );

    this.context.subscriptions.push(
      vscode.commands.registerCommand(
        'emulatormanager.android.Start',
        (device: Device) => {
          this.deviceState.set(device.id, DeviceState.starting);
          this.treeDataProvider.refresh();
          setTimeout(() => {
            this.deviceState.set(device.id, DeviceState.running);
            this.treeDataProvider.refresh();
          }, 3000);
        }
      )
    );

    this.context.subscriptions.push(
      vscode.commands.registerCommand(
        'emulatormanager.android.Stop',
        (device: Device) => {
          this.deviceState.delete(device.id);
          this.treeDataProvider.refresh();
        }
      )
    );
  }

  async getDevices(): Promise<Device[]> {
    const androidHome =
      process.env.ANDROID_HOME ||
      vscode.workspace.getConfiguration('workbench');

    if (!androidHome) {
      vscode.commands.executeCommand(
        'setContext',
        'emulatormanager.androidHomeNotAvailable',
        true
      );
      return [];
    }

    const emulators = execFileSync(
      normalize(join(androidHome as string, '/emulator/emulator')),
      ['-list-avds'],
      { encoding: 'utf8' }
    )
      .replace(/\n$/, '')
      .split('\n');

    return emulators
      .filter((e) => !!e)
      .map((e) => ({
        name: e,
        state: this.deviceState.get(e) || DeviceState.stopped,
        manager: this,
        platform: DevicePlatform.android,
        id: e,
      }));
  }
}
