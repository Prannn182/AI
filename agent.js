import {config} from "dotenv";
config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import { SerpAPI } from "@langchain/community/tools/serpapi";

const model=new ChatGoogleGenerativeAI({
    model:"gemini-3.8-flash",
    maxOutputTokens:1024,
    temperature:0.2,
    apiKey:process.env.GEMINI_API_KEY
});
const searchTool=new SerpAPI({
    serpApiKey:process.env.SERPAPI_KEY,
    location:"Austin,Texas,United States",
    hl:"en",
    gl:"us"
});

const agent=await createAgent({
    model: model,
    tools: [searchTool]
});

    const res = await agent.invoke({
    messages: [{ role: "user", content: "What is Austin, Texas?" }]
});

console.log(res);