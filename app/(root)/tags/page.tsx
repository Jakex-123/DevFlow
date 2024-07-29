import TagCard from "@/components/cards/TagCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import React from "react";

const page = async ({ searchParams }: SearchParamsProps) => {
  const results = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>
      <div className="mt-11 flex flex-wrap justify-between gap-5">
        <LocalSearch
          route="/tags"
          otherClasses={"flex-1"}
          iconPosition="left"
          placeholder="Search by tag name..."
          imgSrc="/assets/icons/search.svg"
        />
        <Filter
          filters={TagFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className="mt-11 flex flex-wrap gap-4">
        {results?.tags?.length > 0 ? (
          results.tags.map((tag) => {
            return <TagCard key={tag._id} tag={tag}></TagCard>;
          })
        ) : (
          <p>No tags Found</p>
        )}
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={results.isNext}
        />
      </div>
    </>
  );
};

export default page;
