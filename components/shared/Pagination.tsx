"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formURLQuery } from "@/lib/utils";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNav = (direction: string) => {
    const nextPageNum = direction === "prev" ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formURLQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNum.toString(),
    });
    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNav("prev")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2 text-light-900">
        {pageNumber}
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNav("next")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
