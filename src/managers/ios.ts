import * as vscode from 'vscode';
import { DevicePlatform } from '../constants';
import { Device, DeviceState } from '../models/device';
import { DeviceTreeProvider } from '../views/device-tree-provider';
import { DeviceManager } from './device-manager';
import SimCtl from 'node-simctl';
import _ from 'lodash';

export class IosDeviceManager implements DeviceManager {
  private simctl: any;
  constructor(private context: vscode.ExtensionContext) {}
  private treeDataProvider: DeviceTreeProvider = new DeviceTreeProvider(this);

  activate(providerName: string) {
    try {
      this.simctl = new SimCtl();
    } catch (err) {}

    this.context.subscriptions.push(
      vscode.window.registerTreeDataProvider(
        providerName,
        this.treeDataProvider
      )
    );

    this.context.subscriptions.push(
      vscode.commands.registerCommand('emulatormanager.ios.Refresh', () => {
        this.treeDataProvider.refresh();
      })
    );
  }

  async getDevices(): Promise<Device[]> {
    if (this.simctl) {
      const devices = await this.simctl.getDevices();
      const _devices: Array<Device> = [];
      _.flatten(Object.values(devices)).forEach((d: any) => {
        _devices.push({
          name: d.name,
          id: d.udid,
          manager: this,
          state: DeviceState.stopped,
          platform: DevicePlatform.ios,

          // type: DeviceType.SIMULATOR,
          // busy: false,
          // model: this.getSimulatorModel(d.name),
          // mode:
          //   d.name.toLowerCase().indexOf('ipad') >= 0
          //     ? DeviceMode.TABLET
          //     : DeviceMode.MOBILE,
          // platform: d.platform.toLowerCase(),
        });
      });
      return _devices;
    } else {
      return [];
    }
  }
}
