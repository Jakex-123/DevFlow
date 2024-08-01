"use client";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";
import { AnswerSchema } from "@/lib/validations";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { marked } from "marked";

type AnswerFormInputs = z.infer<typeof AnswerSchema>;

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = (params: Props) => {
  const pathName = usePathname();
  const { question,questionId, authorId } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mode } = useTheme();
  const editorRef = useRef<any>(null);
  const form = useForm<AnswerFormInputs>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathName,
      });
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isSubmittingAI,setIsSubmittingAI]=useState(false)

  const generateAIAnswer=async()=>{
    if(!authorId) return;
    setIsSubmittingAI(true)
    try {
      const res=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,{
        method:'POST',
        body:JSON.stringify({question})
      })
      const aiResponse=await res.json()
      const htmlContent = marked(aiResponse.reply,{
        "async": false,
        "breaks": false,
        "extensions": null,
        "gfm": true,
        "hooks": null,
        "pedantic": false,
        "silent": false,
        "tokenizer": null,
        "walkTokens": null
       });
      editorRef.current.setContent(htmlContent)
    } catch (error) {
      console.log(error)
    }
    finally{
      setIsSubmittingAI(false)
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          onClick={() => generateAIAnswer()}
          className="btn light-border-2 gap-2 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
        >
         {isSubmittingAI?(<>
         Generating...
         </>):( <>
          <Image
            src={"/assets/icons/stars.svg"}
            width={15}
            height={15}
            alt="stars"
            className="object-contain"
          />
          Generate AI answer
         </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={`${process.env.NEXT_PUBLIC_TINY_API_KEY}`}
                    onInit={(evt, editor) => {
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                      toolbar:
                        "undo redo | codesample bold italic forecolor | alignleft aligncenter | alignright alignjustify | bullist numlist | ",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="primary-gradient text-light-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Post Answer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
