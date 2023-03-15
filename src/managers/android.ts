import * as vscode from 'vscode';
import { DevicePlatform } from '../constants';
import { Device, DeviceState } from '../models/device';
import { DeviceManager } from './device-manager';
import _ from 'lodash';
import ADB from 'appium-adb';
import { execFileSync } from 'child_process';
import { join, normalize } from 'path';

export class AndroidDeviceManager extends DeviceManager {
  private adb!: ADB;
  private isADBAvailable = true;
  private androidHome: string = '';
  constructor(context: vscode.ExtensionContext, viewId: string) {
    super(context, viewId, DevicePlatform.android);
  }

  async activate() {
    try {
      this.adb = await ADB.createADB({});
      this.androidHome = this.adb.executable.path.replace(
        '/platform-tools/adb',
        ''
      );
    } catch (err) {
      this.isADBAvailable = false;
      vscode.commands.executeCommand(
        'setContext',
        'simcode.androidNotAvailable',
        true
      );
    }

    await super.activate();
  }

  async startDevice(device: Device): Promise<[boolean, Error | undefined]> {
    try {
      await this.adb.launchAVD(device.name);
      return [true, undefined];
    } catch (err) {
      return [false, err as Error];
    }
  }

  async stopDevice(device: Device): Promise<[boolean, Error | undefined]> {
    try {
      await this.adb.killEmulator(device.name);
      return [true, undefined];
    } catch (err) {
      return [false, err as Error];
    }
  }

  async getDevices(): Promise<Device[]> {
    if (!this.isADBAvailable) {
      return [];
    }

    const emulators = execFileSync(
      normalize(join(this.androidHome as string, '/emulator/emulator')),
      ['-list-avds'],
      { encoding: 'utf8' }
    )
      .replace(/\n$/, '')
      .split('\n');

    return await Promise.all(
      emulators
        .filter((e) => !!e)
        .map(async (e) => {
          const { target } = (await this.adb.getEmuImageProperties(e)) as any;
          const apiMatch = /\d+/.exec(target);
          return {
            name: e,
            state: this.getDeviceState(e) || DeviceState.stopped,
            manager: this,
            platform: DevicePlatform.android,
            id: e,
            version: apiMatch?.length ? apiMatch[0] : '',
          };
        })
    );
  }
}
