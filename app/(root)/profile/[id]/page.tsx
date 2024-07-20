import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";

const Page = async ({ params }: URLProps) => {
    const { id: clerkId } = params;
    const result = await getUserById({ userId: clerkId });
    console.log(result);

    return (
        <>
            <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
                <div className=" flex flex-col items-start gap-4 lg:flex-row">
                    <Image
                        src={result.picture}
                        width={140}
                        height={140}
                        alt="profile"
                        className="aspect-square rounded-full object-cover"
                    />
                    <div className="mt-3">
                        <h2 className="h2-bold text-dark100_light900">{result.name}</h2>
                        <p className="paragraph-regular text-dark200_light800">
                            @{result.username}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                            {result.portfolioLink && <ProfileLink imgUrl="/assets/icons/link.svg" title={`${result.portfolioLink}`}/>}
                            {result.location && <ProfileLink imgUrl="/assets/icons/location.svg" title={`${result.location}`} />}
                            <ProfileLink imgUrl="/assets/icons/calendar.svg" title={`Joined ${result.joinedOn.toLocaleString("default", {month: "long",year: "numeric",})}`}/>
                            
                        </div>
                        {result.bio && (
                            <p className="paragraph-regular text-dark400_light800 mt-8">
                                {result.bio}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
                    <SignedIn>
                        {clerkId === result.clerkId && (
                            <Link href={`/profile/edit`}>
                                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                                    Edit Profile
                                </Button>
                            </Link>
                        )}
                    </SignedIn>
                </div>
            </div>
            <div className="mt-10">
                <Stats totalQuestions={1} totalAnswers={1} badges={{GOLD: 1,SILVER: 1,BRONZE: 1}} reputation={1}/>
            </div>
            <div className="mt-10 flex gap-10">
                <Tabs defaultValue="top-posts" className="flex-1">
                    <TabsList className="background-light800_dark400 min-h-[42px] p-1">
                        <TabsTrigger className="tab" value="top-posts">
                            Top Posts
                        </TabsTrigger>
                        <TabsTrigger className="tab" value="answers">
                            Answers
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-posts">Posts</TabsContent>
                    <TabsContent value="answers">Answers</TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default Page;
