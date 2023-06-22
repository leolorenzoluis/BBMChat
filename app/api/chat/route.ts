import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json
  const data = {
    question: messages[messages.length - 1].content,
    chat_history: messages.slice(0, messages.length - 1),
  };

  const body = JSON.stringify(data);
  console.log('data', data);

  const url = 'https://finalprompt-fwsoq.eastus.inference.ml.azure.com/score';
  // Replace this with the primary/secondary key or AMLToken for the endpoint

  const api_key = process.env.API_KEY;
  console.log('API KEY', api_key)
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


  // console.log('fetchResponse', await fetchResponse.json())
  const botAnswerChunks = botAnswer.match(/.{1,10}/g) || [];
  let i = 0;
  const readableStream = new ReadableStream({
    start(controller) {
      console.log('heyyy');
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

  // Create a new write stream

  // if (previewToken) {
  //   configuration.apiKey = previewToken
  // }

  // const res = await openai.createChatCompletion({
  //   model: 'gpt-3.5-turbo',
  //   messages,
  //   temperature: 0.7,
  //   stream: true
  // })

  // const stream = OpenAIStream(res, {
  //   async onCompletion(completion) {
  //     const title = json.messages[0].content.substring(0, 100)
  //     const userId = session?.user?.id
  //     if (userId) {
  //       const id = json.id ?? nanoid()
  //       const createdAt = Date.now()
  //       const path = `/chat/${id}`
  //       const payload = {
  //         id,
  //         title,
  //         userId,
  //         createdAt,
  //         path,
  //         messages: [
  //           ...messages,
  //           {
  //             content: completion,
  //             role: 'assistant'
  //           }
  //         ]
  //       }
  //       await kv.hmset(`chat:${id}`, payload)
  //       await kv.zadd(`user:chat:${userId}`, {
  //         score: createdAt,
  //         member: `chat:${id}`
  //       })
  //     }
  //   }
  // })

  // return new StreamingTextResponse(stream)
}
