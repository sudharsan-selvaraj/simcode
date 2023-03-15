import * as vscode from 'vscode';
import { DeviceManager } from '../managers/device-manager';
import { Device } from '../models/device';

export class DeviceTreeProvider implements vscode.TreeDataProvider<Device> {
  constructor(private deviceManager: DeviceManager) {}

  getTreeItem(element: Device): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return new DeviceTreeItem(element);
  }

  async getChildren(element?: Device | undefined): Promise<Device[]> {
    return this.deviceManager.getDevices();
  }
}

export class DeviceTreeItem extends vscode.TreeItem {
  constructor(private device: Device) {
    super(device.name, vscode.TreeItemCollapsibleState.None);
  }
}
