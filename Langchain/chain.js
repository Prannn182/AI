//This is LCEL - Langchain Expression Language

import "dotenv/config";
import readline from "readline-sync";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {StringOutputParser} from "@langchain/core/output_parsers";


//Setup the model
const model=new ChatGoogleGenerativeAI({
    model:"gemini-3.8-flash",
    maxOutputTokens:1024,
    temperature:0.2,
    apiKey:process.env.GEMINI_API_KEY
});

//prompt setup
const prompt=ChatPromptTemplate.fromTemplate(
    "explain this {topic} to a beginner"
);
//parse the output
const outputParser=new StringOutputParser();

//build a chain
// const chain=new LLMChain({
//     llm:model,
//     prompt:prompt
// });
const chain=prompt.pipe(model).pipe(outputParser);



//output

const topic = readline.question("Enter topic: ");
const output = await chain.invoke({ topic });
console.log("Response from Agent:",output);