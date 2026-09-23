import si from "systeminformation";
import {machineIdSync} from "node-machine-id"

export const GetDeviceDetails = async() => {
    const cpu = await si.cpu();
    const system = await si.system();

    const networkInterface = await si.networkInterfaceDefault();
    const networkStats = await si.networkStats()
    const primaryInterface = networkStats.find(i => i.iface === networkInterface);

    return {
        cpu, system, macAddress: primaryInterface ? primaryInterface : null
    }
}


export const uniqueDeviceId = machineIdSync(true);