"use client"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProfileSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateUserInfo } from "@/lib/actions/user.action";
import { usePathname,useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface Props {
  clerkId: string;
  user: string;
}
const Profile = ({ clerkId, user }: Props) => {
    const pathname=usePathname()
    const router=useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedUserData = JSON.parse(user);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUserData.name || "",
      bio: parsedUserData.bio || "",
      location: parsedUserData.location || "",
      portfolioWebsite: parsedUserData.portfolioWebsite || "",
      username: parsedUserData.username || "",
    },
  });
  const {toast}=useToast()
  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    try{
        setIsSubmitting(true)
        try {
            await updateUserInfo({
                clerkId,
                updateData:{
                    name:values.name,
                    username:values.username,
                    portfolioWebsite:values.portfolioWebsite,
                    location: values.location,
                    bio: values.bio,
                },
                path:pathname
            })
            router.back()
        } catch (error) {
            console.log(error)
        }
        finally{
            setIsSubmitting(false)
            toast({description:"User Information Updated"})
        }
    }
    catch(error){
        console.log(error)
        throw error
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-9 flex w-full flex-col gap-9">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Name <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600"/>
              </FormItem>
            );
          }}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Username <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your username"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600"/>
              </FormItem>
            );
          }}
        />
        <FormField
          name="portfolioWebsite"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Portfolio Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.portfolio.com"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600"/>
              </FormItem>
            );
          }}
        />
        <FormField
          name="location"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Location <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your location"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600"/>
              </FormItem>
            );
          }}
        />
        <FormField
          name="bio"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Bio <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your bio"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600"/>
              </FormItem>
            );
          }}
        />
        <div className="flex justify-end">
            <Button disabled={isSubmitting} type="submit" className="primary-gradient w-fit text-white">
                {isSubmitting?"Saving...":"Save"}
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
