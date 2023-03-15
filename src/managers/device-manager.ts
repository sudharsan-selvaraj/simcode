import vscode from 'vscode';
import { DevicePlatform } from '../constants';
import { Device, DeviceState } from '../models/device';
import { DeviceTreeProvider } from '../views/device-tree-provider';

export abstract class DeviceManager {
  private treeDataProvider: DeviceTreeProvider;
  private deviceState: Map<string, DeviceState> = new Map();

  constructor(
    protected context: vscode.ExtensionContext,
    private viewId: string,
    private platform: DevicePlatform
  ) {
    this.treeDataProvider = new DeviceTreeProvider(this);
  }

  protected async activate() {
    this.context.subscriptions.push(
      vscode.window.registerTreeDataProvider(this.viewId, this.treeDataProvider)
    );

    this.context.subscriptions.push(
      vscode.commands.registerCommand(
        `emulatormanager.${this.platform}.refreshDevice`,
        () => {
          this.refresh();
        }
      )
    );

    this.context.subscriptions.push(
      vscode.commands.registerCommand(
        `emulatormanager.${this.platform}.startDevice`,
        this.onStartDevice.bind(this)
      )
    );

    this.context.subscriptions.push(
      vscode.commands.registerCommand(
        `emulatormanager.${this.platform}.stopDevice`,
        this.onStopDevice.bind(this)
      )
    );
  }

  private async onStartDevice(device: Device) {
    this.deviceState.set(device.id, DeviceState.starting);
    this.treeDataProvider.refresh();
    const [isDeviceStarted, error] = await this.startDevice(device);
    if (isDeviceStarted) {
      this.deviceState.set(device.id, DeviceState.running);
    } else {
      vscode.window.showErrorMessage(
        'Unable to start the device: ' + error?.message
      );
      this.deviceState.set(device.id, DeviceState.stopped);
    }
    this.treeDataProvider.refresh();
  }

  private async onStopDevice(device: Device) {
    this.deviceState.set(device.id, DeviceState.stopping);
    this.treeDataProvider.refresh();
    const [isDeviceStopped, error] = await this.stopDevice(device);
    if (isDeviceStopped) {
      this.deviceState.set(device.id, DeviceState.stopped);
    } else {
      vscode.window.showErrorMessage(
        'Unable to stop the device: ' + error?.message
      );
      this.deviceState.set(device.id, device.state);
    }
    this.treeDataProvider.refresh();
  }

  protected refresh() {
    this.treeDataProvider.refresh();
  }

  protected getDeviceState(deviceId: string): DeviceState | undefined {
    return this.deviceState.get(deviceId);
  }

  abstract getDevices(): Promise<Device[]>;
  abstract startDevice(device: Device): Promise<[boolean, Error | undefined]>;
  abstract stopDevice(device: Device): Promise<[boolean, Error | undefined]>;
}
