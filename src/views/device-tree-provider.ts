import * as vscode from 'vscode';
import { DEVICE, LOADER, STARTED } from '../constants';
import { DeviceManager } from '../managers/device-manager';
import { Device, DeviceState } from '../models/device';

export class DeviceTreeProvider implements vscode.TreeDataProvider<Device> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Device | undefined | null | void
  > = new vscode.EventEmitter<Device | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Device | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private deviceManager: DeviceManager) {}

  getTreeItem(element: Device): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return new DeviceTreeItem(element);
  }

  async getChildren(element?: Device | undefined): Promise<Device[]> {
    return this.deviceManager.getDevices();
  }

  async refresh() {
    this._onDidChangeTreeData.fire();
  }
}

export class DeviceTreeItem extends vscode.TreeItem {
  constructor(private device: Device) {
    super(
      `${device.name} (${device.state})`,
      vscode.TreeItemCollapsibleState.None
    );

    this.contextValue = device.state;
    this.iconPath =
      device.state === DeviceState.starting
        ? LOADER
        : device.state === DeviceState.running
        ? STARTED
        : DEVICE;
  }
}
