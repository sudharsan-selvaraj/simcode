import { DevicePlatform } from '../constants';
import { DeviceManager } from '../managers/device-manager';

export enum DeviceState {
  'starting' = 'starting',
  'running' = 'running',
  'stopped' = 'stopped',
}

export interface Device {
  name: string;
  id: string;
  state: DeviceState;
  platform: DevicePlatform;
  manager: DeviceManager;
}
