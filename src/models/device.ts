import { DevicePlatform } from '../constants';
import { DeviceManager } from '../managers/device-manager';

export interface Device {
  name: string;
  id: string;
  isRunning: boolean;
  platform: DevicePlatform;
  manager: DeviceManager;
}
