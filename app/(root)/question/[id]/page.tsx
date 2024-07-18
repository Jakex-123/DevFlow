import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Answer from "@/components/forms/Answer";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params }: Props) => {
  const { id } = params;
  const result = await getQuestionById({ questionId: id });
  const { userId: clerkId } = auth();
  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });  }
  const { author, tags } = result;
  return (
    <div>
      <div className="flex justify-between">
        <Link
          href={`/profile/${author.clerkId}`}
          className="flex items-center gap-1 "
        >
          <Image
            src={`${author.picture}`}
            width={30}
            height={30}
            className="aspect-square rounded-full object-cover"
            alt="author picture"
          />
          <p className="paragraph-semibold text-dark300_light700">
            {author.name}
          </p>
        </Link>
        <Votes
          type="question"
          itemId={result?._id.toString()}
          userId={mongoUser?._id.toString()}
          upvotes={result?.upvotes?.length}
          downvotes={result?.downvotes?.length}
          hasdownVoted={result?.downvotes?.includes(mongoUser?._id)}
          hasupVoted={result?.upvotes?.includes(mongoUser?._id)}
          hasSaved={mongoUser?.saved?.includes(result?._id)}
        />
      </div>
      <h2 className="h2-bold text-dark300_light700 mt-3.5 w-full text-left">
        {result?.title}
      </h2>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(result.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(result?.answers?.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(result?.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result?.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: any) => {
          return (
            <RenderTag
              key={tag?._id}
              _id={tag?._id}
              name={tag?.name}
              showCount={false}
            />
          );
        })}
      </div>
      <AllAnswers
        questionId={result?._id.toString()}
        userId={mongoUser?._id}
        totalAnswers={result?.answers?.length}
      />
      <Answer
        authorId={JSON.stringify(mongoUser)}
        questionId={JSON.stringify(result?._id)}
        question={result?.content}
      />
    </div>
  );
};

export default Page;
