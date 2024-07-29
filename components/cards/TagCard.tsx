import React from 'react'
import Link from 'next/link'

interface Props{
    tag:{
        _id:string,
        name:string,
        questions:string[]
    }
}

const TagCard = async ({tag}:Props) => {
    return (
    <Link href={`/tags/${tag._id}`} className='background-light900_dark200 flex h-72 w-[15.625rem] flex-col rounded-2xl px-8 py-10 shadow-light-100 max-xs:min-w-full sm:w-[250px]'>
        <article className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
            <p className='paragraph-semibold text-dark300_light900'>{tag.name}</p>
        </article>
            <p className='body-regular text-dark300_light900 mt-4'>
            JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS
            </p>
            <p className='body-regular text-dark300_light900 mt-4'>
                <span className='body-semibold primary-text-gradient mr-2.5'>{tag.questions.length}+</span> Questions
            </p>
    </Link>
  )
}

export default TagCard