"use client"
import React from 'react'
import Image from 'next/image'
import { deleteQuestion } from '@/lib/actions/question.action'
import { usePathname, useRouter } from 'next/navigation'
import { deleteAnswer } from '@/lib/actions/answer.action'

interface Props{
    type:string,
    id:string
}



const EditDeleteAction = ({type,id}:Props) => {
    const pathname=usePathname()
    const router=useRouter()
    const handleEdit=()=>{
        router.push(`/question/edit/${id.toString()}`)
    }
    const handleDelete=async ()=>{
        if(type==="question"){
            await deleteQuestion({questionId:id,path:pathname})
        }
        else{
            await deleteAnswer({answerId:id,path:pathname})
        }
    }
  return (
    <div className='flex items-center justify-end gap-3 max-sm:w-full'>
        {type==="question" && (
            <Image src={"/assets/icons/edit.svg"} onClick={handleEdit} alt="edit" height={15} width={15} className='cursor-pointer object-contain' />
        )}
        <Image src={"/assets/icons/trash.svg"} onClick={handleDelete} alt="delete" height={15} width={15} className='cursor-pointer object-contain'/>
    </div>
  )
}

export default EditDeleteAction