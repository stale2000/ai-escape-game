// @ts-ignore
import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import Anthropic from '@anthropic-ai/sdk';
import { ChatAnthropic } from "@langchain/anthropic";
export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};



const temp2 = `User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body", body);
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;





    const TEMPLATE = `You are a video game engine that accepts a 2D grid of tiles, and evaluates what the output of the new game world would be after an action is taken.

    A player make take an action such as "player moves up" or "player uses an item" and the game world will update accordingly.
    
    0s are empty tiles.  1 is the exit.  2 is the player.  3 is a wall.

    The game state should always be updated in an interesting way.  

    IMPORTANT!  Always include a player (2) and exit (1) Do not include multiple of players or exits.
    A
    
    Respond in json format.  Do not include anything other than the json.  

    include the output graph, and an explanation. don't include newlines in the json.
    
    Example input/output.  
    {
        graph: [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 2]
        ]
        action: player moves up
    }
    
    {
        "output": [
            [0, 0, 0],
            [0, 1, 2],
            [0, 0, 0]
        ],
        explanation: "The player moved up one tile."
    }
    
    
    
    Human: ${currentMessageContent}
    AI:`;




    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "langchain/chat_models/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */

    /*
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-3.5-turbo-1106",
    });

    */


    const model = new ChatAnthropic({
        modelName: "claude-3-haiku-20240307",
        maxTokensToSample: 1024,
        stopSequences: ["\n\nHuman:"],
        streaming: true,
        anthropicApiKey: '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',
    });

    
    const anthropic = new Anthropic({
        apiKey: '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', // defaults to process.env["ANTHROPIC_API_KEY"]
      });

      const msg = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",//"claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: TEMPLATE }],
      });
      console.log(msg);

      

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and byte-encoding.
     */
    const outputParser = new HttpResponseOutputParser();

    /**
     * Can also initialize as:
     *
     * import { RunnableSequence } from "@langchain/core/runnables";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    /*

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
    */
   console.log("test1");

   /*
    const output = await chain.invoke({
        chat_history: formattedPreviousMessages.join("\n"),
        input: currentMessageContent,
      });
      console.log("test2");
      const outputString = new TextDecoder().decode(output);
      console.log("Output String:", outputString);
*/

    const jsonMsg = JSON.parse(msg.content[0].text);
    console.log("jsonMsg", jsonMsg);
    console.log("jsonMsg explain", jsonMsg.explanation);
    const outputArray = jsonMsg.output as number[][];
      //const outputTextSingleLine = outputText.replace('/n', '');
      //console.log("Output Text Single Line:", outputTextSingleLine);
      console.log("Output Text:", outputArray[0][0]);
      return NextResponse.json(jsonMsg);
  } catch (e: any) {
    console.log("error", e.message);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
