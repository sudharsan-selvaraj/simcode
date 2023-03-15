import * as vscode from 'vscode';
import { DevicePlatform } from '../constants';
import { Device, DeviceState } from '../models/device';
import { DeviceManager } from './device-manager';
import SimCtl from 'node-simctl';
import _ from 'lodash';

export class IosDeviceManager extends DeviceManager {
  private simctl: any;
  private isSimctlAvailable: boolean = true;

  constructor(context: vscode.ExtensionContext, viewId: string) {
    super(context, viewId, DevicePlatform.ios);
  }

  async activate() {
    try {
      this.simctl = new SimCtl();
      const devices = await this.getDevices();
    } catch (err) {
      this.isSimctlAvailable = false;
      vscode.commands.executeCommand(
        'setContext',
        'simcode.iosNotAvailable',
        true
      );
    }
    await super.activate();
  }

  async startDevice(device: Device): Promise<[boolean, Error | undefined]> {
    try {
      const simclt = new SimCtl({
        udid: device.id,
      });

      await simclt.bootDevice();
      return [true, undefined];
    } catch (err) {
      return [false, err as Error];
    }
  }

  async stopDevice(device: Device): Promise<[boolean, Error | undefined]> {
    try {
      const simclt = new SimCtl({
        udid: device.id,
      });

      await simclt.shutdownDevice();
      return [true, undefined];
    } catch (err) {
      return [false, err as Error];
    }
  }

  async getDevices(): Promise<Device[]> {
    if (this.isSimctlAvailable) {
      const devices = await this.simctl.getDevices();
      const _devices: Array<Device> = [];
      _.flatten(Object.values(devices)).forEach((d: any) => {
        _devices.push({
          name: d.name,
          id: d.udid,
          manager: this,
          state: this.computeDeviceState(d.udid, d.state || ''),
          platform: DevicePlatform.ios,
          version: d.sdk,
        });
      });
      return _devices;
    } else {
      return [];
    }
  }

  computeDeviceState(id: string, simState: string) {
    if (!_.isUndefined(this.getDeviceState(id))) {
      return this.getDeviceState(id) as DeviceState;
    } else {
      return simState.toLowerCase() === 'shutdown'
        ? DeviceState.stopped
        : DeviceState.running;
    }
  }
}
