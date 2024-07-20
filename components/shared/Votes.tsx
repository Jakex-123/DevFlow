"use client";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { saveQuestion } from "@/lib/actions/user.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname,useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  upvotes: number;
  downvotes: number;
  type: string;
  itemId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  upvotes,
  downvotes,
  itemId,
  type,
  userId,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}: Props) => {

  const router=useRouter()
  const pathname = usePathname();

  useEffect(()=>{
    viewQuestion({questionId:itemId?.toString(),userId:userId?userId?.toString():undefined})
  },[itemId,pathname,userId,router])

  const handleVote = async (action: string) => {
    if (action === "upvote" && type === "question") {
      await upvoteQuestion({
        questionId: itemId,
        userId,
        hasdownVoted,
        hasupVoted,
        path: pathname,
      });
    } else if (action === "downvote" && type === "question") {
      await downvoteQuestion({
        questionId: itemId,
        userId,
        hasdownVoted,
        hasupVoted,
        path: pathname,
      });
    } else if (action === "upvote" && type === "answer") {
      await upvoteAnswer({
        answerId: itemId,
        userId,
        hasdownVoted,
        hasupVoted,
        path: pathname,
      });
    } else if (action === "downvote" && type === "answer") {
      await downvoteAnswer({
        answerId: itemId,
        userId,
        hasdownVoted,
        hasupVoted,
        path: pathname,
      });
    }
  };

  const handleSave =async () => await saveQuestion({
    questionId:itemId.toString(),
    userId,
    path:pathname
  });
  return (
    <div className="flex gap-5">
      <div className="flex items-center gap-2">
        <div className="flex-center gap-1">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            height={18}
            width={18}
            onClick={() => handleVote("upvote")}
          />
          <div className="background-light700_dark400 min-w-[18px] rounded-sm p-1 text-center">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            height={18}
            width={18}
            onClick={() => handleVote("downvote")}
          />
          <div className="background-light700_dark400 min-w-[18px] rounded-sm p-1 text-center">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "question" && (
        <Image
          onClick={() => handleSave()}
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="favourite"
        />
      )}
    </div>
  );
};

export default Votes;
