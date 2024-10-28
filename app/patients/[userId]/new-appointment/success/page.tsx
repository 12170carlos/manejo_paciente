/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppontment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";


const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  // http://localhost:3000/patients/67100b67000d27e9b062/new-appointment/success?appointmentId=67182d70001b29dc3f12
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppontment(appointmentId);
  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );


  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-nuevo.svg"
            width={1000}
            height={1000}
            alt="Logo"
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
            unoptimized
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Su <span className="text-green-500">solicitud de cita</span> ha sido
            enviada correctamente!
          </h2>
          <p>En breve nos pondremos en contacto con usted para confirmárselo</p>
        </section>

        <section className="request-details">
          <p>Detalles de la cita solicitada:</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image ?? "/assets/images/appointment-img.png"}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>

          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant='outline' className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
          Solicitar una nueva cita
          </Link>
        </Button>

        <p className="copyright">© 2024 HealthCare</p>
      </div>
    </div>
  );
};

export default Success;
