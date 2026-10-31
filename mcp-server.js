import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
//to connect mcp with llm
import {z} from "zod";

//mcp server creation
const server = new McpServer({
    name: "mcp-server",
    version: "1.0.0",
})

//creating tool and schema for the server
server.tool(
    "currency-converter", //name
    "Converts currency from one to another", //description
    { //parameters schema
        amount:z.number().describe("Amount to convert"),
        from:z.string().describe("base currency code"),
        to:z.string().describe("target currency code"),
    },
    async({amount,from,to})=>{
        try{
           //dummy implementation of currency conversion
           const res=await fetch(`https://v6.exchangerate-api.com/v6/1992ac42a80e96fd51177309/latest/${from.toUpperCase()}`);
           const data=await res.json();
           const rate=data.rates[to.toUpperCase()];
           const convertedAmount=(amount*rate).toFixed(2);
           const result=`${amount} ${from.toUpperCase()} = ${convertedAmount} ${to.toUpperCase()}`;
           return{
           content:
            [
                {
                type: "text",
                text:result
                }

            ]
           }
        }catch(error){
             return{
                content:[
                    {
                        type:"text",
                        text:`error. ${error}`
                    }
                ]
             };
        }
    }
)

//starting the server with stdio transport
async function startServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP server started and connected via stdio transport.");
    
}
//start the server 
startServer().catch((error) => {
    console.error("Error starting MCP server:", error);
    process.exit(1);
})
//