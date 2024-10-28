/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'
import { Input } from 'postcss'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

type FileUploaderProps = {
  files: File[] | undefined,
  onChange: (files: File[]) => void

}

const FileUpLoader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}
    className='file-upload'>
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image src={convertFileToUrl(files[0])}
        alt='documento'
        height={1000}
        width={1000} 
        className='max-h-[400px] overflow-hidden object-cover'
        />
      ): (
        <>
        <Image
        src="/assets/icons/upload.svg"
        alt='error upload'
        height={40}
        width={40}
        />
        <div className='file-upload_label'>
          <p className="text-14-regular">
            <span className='text-green-500'>CLick para iniar la Descarga </span>
             o Arrastra y suelta tus archivos
            </p> 
            <p>
              SVG, PNG, JPG or GIF (max 800x400)
            </p>
        </div>
        </>
      )}
     
    </div>
  )
}
export default FileUpLoader

