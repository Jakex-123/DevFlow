import * as z from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(5).max(130),
  explaination: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(5),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(50),
  bio: z.string().min(10).max(150),
  portfolioWebsite: z.string().refine(value => value === '' || z.string().url().safeParse(value).success, {
    message: "Invalid URL",
  }),
  location: z.string().min(5).max(50),
});
