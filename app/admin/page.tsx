import {DataTable} from '@/components/table/DataTable'
import StatCard from '@/components/StatCard'
import { getRecentAppointmenList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { columns } from '@/components/table/columns'

const Admin = async () => {
 
  const appointments = await getRecentAppointmenList();
  
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
        <Link href='/' className='cursor-pointer'>
        <Image 
        src='/assets/icons/logo-nuevo.svg'
        height={32}
        width={162}
        alt='logo'
        className='h-8 w-fit'
        />
        </Link>

        <p className='text-16-semibold'>Admin Dashboard</p>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>Bienvenido👋🏻</h1>
          <p className='text-dark-700'>Empezar el día gestionando una nueva cita</p>
        </section>

        <section className='admin-stat'>
          <StatCard 
          type="appointments"
          count={appointments.scheduleCount} 
          label="Citas programadas"
          icon="/assets/icons/appointments.svg"
          />
          <StatCard 
          type="pending"
          count={appointments.pendingCount} 
          label="Citas pendientes"
          icon="/assets/icons/pending.svg"
          />
          <StatCard 
          type="cancelled"
          count={appointments.cancelledCount} 
          label="Citas canceladas"
          icon="/assets/icons/cancelled.svg"
          />
        </section>

        {/* DataTable component */}
        <DataTable columns={columns} data={appointments.documents}/>
      </main>
    </div>
  )
}

export default Admin