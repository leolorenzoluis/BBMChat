import { StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
import { TableServiceClient, TableClient, AzureNamedKeyCredential, odata } from "@azure/data-tables";
const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json
  const data = {
    question: messages[messages.length - 1].content,
    chat_history: messages.slice(0, messages.length - 1),
  };

  const body = JSON.stringify(data);

  const url = 'https://finalprompt-fwsoq.eastus.inference.ml.azure.com/score';
  // Replace this with the primary/secondary key or AMLToken for the endpoint

  const api_key = process.env.API_KEY;
  if (!api_key) {
    throw new Error('A key should be provided to invoke the endpoint');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${api_key}`,
    'azureml-model-deployment': 'blue',
  };

  const options = {
    method: 'POST',
    headers: headers,
    body: body,
    transferEncoding: 'chunked',
  };

  const fetchResponse = await fetch(url, options);
  const message = await fetchResponse.json();
  const botAnswer = message['chat_output'];
  // Create a readable stream from botAnswer
  if (botAnswer === undefined) {
    return new Response('Sorry the answer is too long for me to handle. Try asking a shorter question.');
  }
  const botAnswerChunks = botAnswer.match(/.{1,10}/g) || [];
  let i = 0;
  const readableStream = new ReadableStream({
    start(controller) {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i >= botAnswerChunks.length) {
          clearInterval(intervalId);
          controller.close();
          return;
        }

        const chunk = botAnswerChunks[i];
        const encoder = new TextEncoder();
        const chunkAsUint8Array = encoder.encode(chunk);

        controller.enqueue(chunkAsUint8Array);
        i++;
      }, 10);
    },
  });
  return new StreamingTextResponse(readableStream);

}
