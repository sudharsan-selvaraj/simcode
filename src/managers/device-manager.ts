import { ExtensionContext } from 'vscode';
import { Device } from '../models/device';

export interface DeviceManager {
  activate(context: ExtensionContext, providerName: string): any;
  getDevices(): Promise<Device[]>;
}
