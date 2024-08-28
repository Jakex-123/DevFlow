import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import dynamic from "next/dynamic";
import React from "react";
import type { Metadata } from "next";

export const metadata:Metadata={
    title:"Community | DevOverflow",
}
const Page = async ({ searchParams }: SearchParamsProps) => {
  const res = await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  const UserCard = dynamic(() => import('@/components/cards/UserCard'), { ssr: false })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex flex-wrap justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder={"Search amazing minds here..."}
          otherClasses={"flex-1"}
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-11 flex flex-wrap gap-4">
        {res.users.length > 0
          ? res.users.map((user) => {
              return <UserCard key={user._id} user={user} />;
            })
          : "no users"}
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={res.isNext}
        />
      </div>
    </>
  );
};

export default Page;
