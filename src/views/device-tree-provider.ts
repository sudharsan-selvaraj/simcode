import _ from 'lodash';
import * as vscode from 'vscode';
import {
  ANDROID,
  DEVICE,
  DevicePlatform,
  IOS,
  LOADER,
  STARTED,
} from '../constants';
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
    super(device.name, vscode.TreeItemCollapsibleState.None);

    this.contextValue = device.state;
    this.iconPath = this.getIcon();
    this.description = this.getDescription();
  }

  getIcon() {
    if (this.isBusy()) {
      return LOADER;
    } else if (this.device.state === DeviceState.running) {
      return STARTED;
    } else {
      return this.device.platform === DevicePlatform.android ? ANDROID : IOS;
    }
  }

  getDescription() {
    if (this.isBusy()) {
      return `${_.camelCase(this.device.state)}...`;
    } else {
      return this.device.version ? `(v${this.device.version})` : undefined;
    }
  }

  isBusy() {
    return (
      this.device.state === DeviceState.starting ||
      this.device.state === DeviceState.stopping
    );
  }
}
