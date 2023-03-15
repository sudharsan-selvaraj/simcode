import { ExtensionContext } from 'vscode';
import { Device } from '../models/device';

export interface DeviceManager {
  activate(providerName: string): any;
  getDevices(): Promise<Device[]>;
}
