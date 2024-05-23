import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import {getQuestions} from "@/lib/actions/question.action";
import Link from "next/link";

// const questions=[{_id:'1', 
//     title:'Cascading deletes in sqlalchemy?',
//     tags:[{_id:'1',name:'python'},],
//     author:{
//         _id: '2',
//         name: "Doc Brown",
//         avatar: "https://example.com/docbrown.png"
//       },
//       upvotes:10,views:100,
//       answers:[],
//       createdAt:new Date('2023-11-17T03:24:00')},{_id:'1', 
//       title:'Cascading deletes in sqlalchemy?',
//       tags:[{_id:'1',name:'python'},],
//       author:{
//           _id: '2',
//           name: "Doc Brown",
//           avatar: "https://example.com/docbrown.png"
//         },
//         upvotes:10,views:1000,
//         answers:[],
//         createdAt:new Date('2023-12-17T03:24:00')}]

export default async function Home() {

    const results= await getQuestions({})
    console.log(results.questions)
    return(
        <>
            <div className="background-light900_darkgradient flex w-full flex-col-reverse justify-between sm:flex-row  sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Link href={'/ask-question'} className="flex justify-end max-sm:w-full">
                <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">Ask a Question</Button>
                </Link>
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearch route='/' iconPosition="left" imgSrc='/assets/icons/search.svg' placeholder="Search for Questions" otherClasses="flex-1" />
                <Filter filters={HomePageFilters}
                otherClasses="min-h-[56px] sm:min-w-[170px]"
                containerClasses="hidden max-md:flex"
                />
            </div>

            <HomeFilters/>
            <div className="mt-10 flex w-full flex-col gap-6">
            {results.questions.length>0 ? results.questions.map((question)=>{
                return (<QuestionCard key={question._id} _id={question._id} title={question.title} tags={question.tags}  author={question.author} upvotes={question.upvotes} views={question.views} answers={question.answers} createdAt={question.createdAt}/>)
            }): <NoResult
                title="There are no questions to show" description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
                link='ask-question'
                btnTxt='Ask a Question'
            />}
            </div>
        </>
    )
}
