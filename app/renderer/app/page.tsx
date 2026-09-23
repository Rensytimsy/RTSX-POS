import React from 'react'
import Image from 'next/image'
import { GetDeviceDetails } from '../../hooks/deviceDetails';
import { uniqueDeviceId } from '../../hooks/deviceDetails';


async function IndexPage() {

  const {cpu, system, macAddress} = await GetDeviceDetails();


  return (
    <main className="flex flex-col items-center gap-2 pt-10">
      <p>hell world!</p>
    </main>
  )
}

export default IndexPage
