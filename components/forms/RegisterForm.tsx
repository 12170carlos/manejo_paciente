"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import {  registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import Image from "next/image";
import FileUpLoader from "../FileUpLoader";


const RegisterForm = ({ user }: { user: User }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(isLoading)
    setIsLoading(true);

    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type
      })
      formData = new FormData();
      formData.append('bloFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name)
    }
    try {
     const patientData = {
      ...values,
      userId: user.$id,
      birthDate: new Date(values.birthDate),
      identificationDocument: formData,

     }
    //  @ts-expect-error este 
     const patient = await registerPatient(patientData);
     
     if(patient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Bienvenido 👋🏻</h1>
          <p className="text-dark-700">háganos saber más sobre usted</p>
        </section>

        {/* Personal Information */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Información Personal</h2>
          </div>

          {/* NAME */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Nombres"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          {/* EMAIL & PHONE */}
          <div className="flex flex-col gap-6 xl:flex-row">
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
          </div>
           {/* BirthDate & Gender */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Fecha de Nacimiento"
            />
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Género"
              placeholder="(555) 123-4567"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
                {/* Address & Occupation */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Dirección"
              placeholder="Rep. Panamá 636, Miraflores"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Ocupación"
              placeholder="Pediatra"
            />
          </div>
           {/* Emergency Contact Name & Emergency Contact Number */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Nombre del Contacto de Emergencia"
              placeholder="Nombre completo"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Número del Conatacto de Emergencia"
              placeholder="(555) 123-4567"
            />
          </div>
        </section>

        {/* Información Médica */}

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Información Médica</h2>
          </div>
               {/* PRIMARY CARE PHYSICIAN */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Médico principal"
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

          {/* INSURANCE & POLICY NUMBER */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Proveedor de Seguro"
              placeholder="La internacional"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Número de Póliza de Seguro"
              placeholder="ABC123456789"
            />
          </div>

         {/* ALLERGY & CURRENT MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Alergias (si aplica)"
              placeholder="penincilina, mani, polen"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Medicación Actual"
              placeholder="Ibuprofeno 200mgr, Paracentamol 500mgr"
            />
          </div>
          {/* FAMILY MEDICATION & PAST MEDICATIONS */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label="Historia Médica Familiar"
              placeholder="Mamá tuvo diábetes, Papá tuvo hipertensión"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Antecedentes Médicos"
              placeholder="apendicectomía, amigdalectomía"
            />
          </div>
        </section>

        {/* Authentication and verification */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Autenticación y Verificación</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Tipo de Identificación"
            placeholder="Selecciones un Tipo de Identificación"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Número de Identificación"
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Documento de Identidad"
            placeholder="Scanee documento de Identidad"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUpLoader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
         </section> 
            {/* Consent and Privacy */}
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consentimiento y Privacidad</h2>
            </div>
         
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="Doy mi Consentimiento para el tratamiento de datos"
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="Doy mi Consentimiento para la divulgación de datos"
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="He leído y acepto la política de privacidad"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Empezar</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
