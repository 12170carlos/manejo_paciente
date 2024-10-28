"use server";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ID, Query } from "node-appwrite";
import { BUCKET_ID, databases, DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwritte.config";
import { parseStringify } from "../utils";
import { InputFile } from 'node-appwrite/file';

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(), 
      user.email, 
      user.phone, 
      undefined, 
      user.name
    );
      return parseStringify(newUser);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if(error && error?.code === 409){
      const existingUser = await users.list([
        Query.equal('email', [user.email])
      ])
      return existingUser.users[0]
    }
    console.error("An error occurred while creating a new user:", error);
  }

}

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId)
    return parseStringify(user);
    } catch (error) {
      console.error("An error occurred while getting the user:", error);
      }
}
export const registerPatient = async ({ identificationDocument, ...patient}: RegisterUserParams) => {
  try {
    let file;
    if(identificationDocument){
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('bloFile') as Blob,
        identificationDocument?.get('fileName') as string
      )

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
    }
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/viewProject=${PROJECT_ID}`,
        ...patient
      }
    )
    return parseStringify(newPatient);
  } catch (error) {
    console.log(error)
  }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );
    return parseStringify(patients.documents[0]);
    } catch (error) {
      console.error("An error occurred while getting the user:", error);
      }
}