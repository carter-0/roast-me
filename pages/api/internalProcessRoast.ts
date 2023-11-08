import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "@/lib/db";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const internalProcessRoast = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req.body)
    const roastId = req.body;

    const roast = await prisma.roast.findFirst({
        where: {
            id: roastId
        }
    })

    if (!roast) {
        res.status(404).json({ received: false })
        console.log("Roast not found")
        return;
    }

    await prisma.roast.update({
        where: {
            id: roast.id
        },
        data: {
            completedStageOne: true
        }
    })

    const chatCompletion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: 'You are ChatGPT, a large language and image multimodal trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
            { role: 'user', content: [
                { type: "text", text: `What's going on in this? (It's an AI-generated image)` },
                {
                    type: "image_url",
                    // @ts-ignore
                    image_url: `https://roast-me.carter.red/${roast.key}`,
                },
            ] }
        ],
        model: 'gpt-4-vision-preview',
        temperature: 0.6,
        max_tokens: 1024
    })

    const response = chatCompletion.choices[0].message.content;
    console.log(response)

    const roastCompletion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
            { role: 'user', content: [
                    { type: "text", text: `Can you roast the person in the described image:\n\n${response}` },
                ] }
        ],
        model: 'gpt-4',
        temperature: 0.7
    })

    const roastResponse = roastCompletion.choices[0].message.content;
    console.log(roastResponse)

    let finalChatCompletion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
            { role: 'user', content: `Remove text unrelated to roasts, and convert these roasts into a JSON list like ["roast1", "roast2"]. You must respond in nothing but valid JSON.\n\n${roastResponse}` },
        ],
        model: 'gpt-4',
        temperature: 0.2,
        // response_format: { type: "json_object" }
    });

    let finalResponse = finalChatCompletion.choices[0].message.content;

    console.log(finalResponse)

    await prisma.roast.update({
        where: {
            id: roast.id
        },
        data: {
            completed: true,
            roasts: `[${finalResponse?.substring(finalResponse?.indexOf("[") + 1, finalResponse?.lastIndexOf("]"))}]`
        }
    })

    return res.status(200).json({ received: true });
}

export default internalProcessRoast;