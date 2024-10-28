/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneinput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datepicker",
  SELECT = "select",
  SKELETON = "skeleton"
}




const PatientForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ isLoading, setIsLoading ] = useState(false);
  const router = useRouter();


  // ...
 // 1. Define your form.
 const form = useForm<z.infer<typeof UserFormValidation>>({
  resolver: zodResolver(UserFormValidation),
  defaultValues: {
    name: "",
    email: "",
    phone: ""
  },
})

async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
  // Do something with the form values.
  // ✅ This will be type-safe and validated.
  setIsLoading(true);

  try {
    const userData = {
      name, email, phone
    }
    const user = await createUser(userData);
    if(user) router.push(`/patients/${user.$id}/register`)

  } catch (error) {
    console.log(error)
  }
}
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hola, gusto en saludarte 👋🏻</h1>
          <p className="text-dark-700">Programa tu primera Cita</p>
        </section>

        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="Johndoe@email.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label="Teléfono"
        placeholder="(555) 123-4567"   
        />

        <SubmitButton isLoading={isLoading}>Comencemos</SubmitButton>
      </form>
    </Form>
  )
}


export default PatientForm