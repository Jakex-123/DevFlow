"use client"
import React from 'react'
import Image from 'next/image'
import { deleteQuestion } from '@/lib/actions/question.action'
import { usePathname, useRouter } from 'next/navigation'
import { deleteAnswer } from '@/lib/actions/answer.action'
import { useToast } from '../ui/use-toast'

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
    const {toast}=useToast()
    const handleDelete=async ()=>{
        if(type==="question"){
            try{
                await deleteQuestion({questionId:id,path:pathname})
                toast({description:"Question Deleted",variant:"destructive"})
            }
            catch(error){
                console.log(error)
                throw error
            }
        }
        else{
            try{
            await deleteAnswer({answerId:id,path:pathname})
            toast({description:"Answer Deleted",variant:"destructive"})
            }
            catch(error){
                console.log(error)
            }
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