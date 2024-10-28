/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Dispatch, SetStateAction, useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { newDate } from "react-datepicker/dist/date_utils";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule" ;
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const AppointmentFormValidation = getAppointmentSchema(type);

  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason: '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });
console.log(userId,
  patientId,
  type,
  appointment,)
  async function onSubmit(values : z.infer<typeof AppointmentFormValidation>) {
     console.log('Im here submitting', {type})
    setIsLoading(true);

    let status;

    switch (type) {
      case 'schedule':
        status = 'scheduled'                
        break;
      case 'cancel':
        status = 'cancelled'
        break; 
      default:
        status = 'pending'
        break;
    }
     console.log("type:", type)
    try {
      if(type === 'create' && patientId){
        const appointmentData = {
          userId: userId,
          patient: patientId,
          status: status as Status, 
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          primaryPhysician: values.primaryPhysician,
        }
        const appointment = await createAppointment(appointmentData)

        if(appointment){
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      } else {
        console.log('Updating Appointment')
        const appopintmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type
        }
        const updatedAppointment = await updateAppointment(appopintmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false)
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancelar Cita'
      break;
    case 'create':
      buttonLabel = 'Crear cita'
      break;
    case 'schedule':
      buttonLabel = 'Programar cita'
      break;
    default:
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === 'create' && <section className="mb-12 space-y-4">
          <h1 className="header">Nueva Cita</h1>
          <p className="text-dark-700">Pide una cita en 10 segundos</p>
        </section>}
        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Seleccione un médico"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt="Doctor"
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="fecha prevista para la cita"
              // timeFormat="HH:mm"
              showTimeSelect
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="reason"
              label="Motivo de la cita"
              placeholder="Escribe el motivo de la cita"
              />
              <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="note"
              label="Notas"
              placeholder="Escribas sus anotaciones" 
              />
            </div>
          </>
        )}
        {type === 'cancel' && (
          <>
          <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="cancellationReason"
          label="Motivo de la cancelación"
          placeholder="Escriba motivo de la cancelación"
          />
          </>
        )}

        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
