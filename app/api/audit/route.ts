import { Configuration, OpenAIApi } from 'openai-edge'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
import { TableClient } from "@azure/data-tables";

const tableClient = TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!, 'audit');

export async function POST(req: Request) {
    const json = await req.json()
    const { message } = json

    const ip = req.headers.get("x-forwarded-for")
    const task = {
        partitionKey: ip!,
        rowKey: ip + " " + Date.now().toString(),
        ip: ip,
        question: message,
        createdDate: new Date(),
    };

    await tableClient.createEntity(task);
    return new Response('beh bote nga', { status: 200 });

}
