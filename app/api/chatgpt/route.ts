import Groq from "groq-sdk";
import { NextResponse } from "next/server"

export const POST=async(req:Request)=>{
    const {question}=await req.json()
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    try {
        const res=await groq.chat.completions.create({
            messages: [
                {
                    role:'system',
                    content:'You are an expert software engineer and knowledgeable mentor. Your role is to assist users by providing detailed, accurate, and clear answers to their programming and technical questions. Explain your reasoning and include code snippets when necessary. Be polite, respectful, and professional in all interactions. Generate markdown.'
                },
              {
                role: "user",
                content: `Tell me ${question}.`,
              },
            ],
            model: "llama3-8b-8192",
          })
          const reply=res?.choices[0]?.message?.content || ""
          return NextResponse.json({reply})
    } catch (error:any) {
        return NextResponse.json({error:error.message})
    }
}
