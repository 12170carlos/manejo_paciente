/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { ID, Query } from "node-appwrite"
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwritte.config"
import { formatDateTime, parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async ( appointment: CreateAppointmentParams) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    )
    return parseStringify(newAppointment)
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error)
  }
}

export const getAppontment = async ( appointmenId: string ) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!, 
      APPOINTMENT_COLLECTION_ID!, 
      appointmenId
      );
      return parseStringify(appointment);
  } catch (error) {
    console.error(error)
  }
}
export const getRecentAppointmenList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    const initialCounts = {
      scheduleCount: 0,
      cancelledCount: 0,
      pendingCount: 0,
    }
    const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if (appointment.status === 'scheduled'){
        acc.scheduleCount += 1;
      } else if (appointment.status === 'pending') {
        acc.pendingCount += 1;
      } else if (appointment.status === 'cancelled') {
        acc.cancelledCount += 1;
      }
      return acc;
    }, initialCounts);

    const data =  {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents
    }
    return parseStringify(data);

  } catch (error) {
    console.error(error)
  }
}

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
  try {
    const updateAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment,
    )

    if (!updateAppointment) {
      throw new Error('Cita no encontrada')
    }
    
    const smsMEssage = `
    Hola, es HeatlhCare.
    ${type === 'schedule' ?
      `Se ha programado una cita para el ${formatDateTime(appointment.schedule!)
      .dateTime} con el(la) Dr(a) ${appointment.primaryPhysician}`
      : `Lamentamos informarle de que su cita ha sido cancelada por la siguiente razón: ${appointment.cancellationReason}`
    } 
    `
    await sendSMSNotification(userId, smsMEssage)

    revalidatePath('/admin');
    return parseStringify(updateAppointment);
  } catch (error) {
    console.error(error)
  }
}

export const sendSMSNotification = async ( userId: string, content: string ) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    )
    return parseStringify(message);

  } catch (error) {
    console.log(error)
  }
}