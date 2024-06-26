import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  Subscription,
} from "react-native-ble-plx";

import base64 from "react-native-base64";

const LIGHT_RATE_UUID = "f046c313-801e-408f-8d71-d16f5a70d987";
const LIGHT_RATE_CHARACTERISTIC = "c9e6d26c-c676-4ef7-97e2-4f40c6c871c6";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  checkBluetooth: () => Promise<boolean>;
  connectedDevice: Device | null;
  allDevices: Device[];
  bluetoothState: string | undefined;
  onBluetoothState: () => Subscription;
  setAllDevices: Dispatch<SetStateAction<Device[]>>;
  heartRate: number;
  bleManager: BleManager;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [bluetoothState, setBluetoothState] = useState<string>();

  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    console.log("bluetoothScanPermission: ", bluetoothScanPermission);
    console.log("bluetoothConnectPermission: ", bluetoothConnectPermission);
    console.log("fineLocationPermission: ", fineLocationPermission);

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const checkBluetooth = async (): Promise<boolean> => {
		try {
			const state = await bleManager.state()

			if (state === "PoweredOn")
				return true;

			return false;
		} catch (err) {
			console.log(err)
			return false;
		}
	}

  const onBluetoothState = (): Subscription => {
      const subscription = bleManager.onStateChange((state) => {
        setBluetoothState(state)

        /*if (state === 'PoweredOff')
          setAllDevices([]);*/
    }, true);

    return subscription;
	}

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = async () => {
    if (bluetoothState === "PoweredOn")
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
        }

        if (device && device.name?.includes("Xiaomi Smart Band 7 3410")) {
          bleManager.stopDeviceScan();
          
          setAllDevices((prevState: Device[]) => {
            if (!isDuplicteDevice(prevState, device)) {
              return [...prevState, device];
            }
            return prevState;
          });
        }
      }
  )};

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      bleManager.cancelTransaction('LISTEN');
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      setHeartRate(0);

      /*await connectedDevice.cancelConnection().then(() => {
        setConnectedDevice(null);
        setHeartRate(0);
      });
      await bleManager.cancelDeviceConnection(connectedDevice.id).then((device) => {
        setConnectedDevice(null);
        setHeartRate(0);
      });*/
    }
  };

  const onHeartRateUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = base64.decode(characteristic.value);
    let innerHeartRate: number = -1;

    const firstBitValue: number = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerHeartRate = rawData[1].charCodeAt(0);
    } else {
      innerHeartRate =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }

    setHeartRate(innerHeartRate);
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        LIGHT_RATE_UUID,
        LIGHT_RATE_CHARACTERISTIC,
        onHeartRateUpdate
      );
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    checkBluetooth,
    onBluetoothState,
    allDevices,
    bluetoothState,
    setAllDevices,
    connectedDevice,
    disconnectFromDevice,
    heartRate,
    bleManager
  };
}

export default useBLE;