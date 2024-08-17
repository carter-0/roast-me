import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "@/lib/db";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req.body)
    const body = req.body;

    const roast = await prisma.roast.findFirst({
        where: {
            replicateId: body.id,
        }
    })

    if (!roast) {
        res.status(404).json({ received: false })
        return;
    }

    if (body.status == "succeeded") {
        if (roast.completed) {
            return res.status(200).json({ received: true });
        }

        const description = body.output.join("");

        await prisma.roast.update({
            where: {
                id: roast.id
            },
            data: {
                description: description,
                completedStageOne: true
            }
        })

        res.status(200).json({ received: true })

        // const misspelledName = await openai.chat.completions.create({
        //     messages: [
        //         { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
        //         { role: 'user', content: `Can you give me a small misspelling of the following. You must respond only with the misspelling. Here are the words:\n\n${roast.roastee}` },
        //     ],
        //     model: 'gpt-3.5-turbo',
        //     temperature: 0.1
        // })
        //
        // const name = misspelledName.choices[0].message.content;
        //
        // await prisma.roast.update({
        //     where: {
        //         id: roast.id
        //     },
        //     data: {
        //         misspelledName: name,
        //         completedStageTwo: true
        //     }
        // });

        let chatCompletion;

        try {
            chatCompletion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
                    { role: 'user', content: `Can you roast the person in the described image:\n\n${description}` },
                ],
                model: 'gpt-4o-mini',
                temperature: 0.7
            });
        } catch (e) {
            console.log(e, "retrying");

            chatCompletion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
                    { role: 'user', content: `Can you roast the person in the described image:\n\n${description}` },
                ],
                model: 'gpt-4o-mini',
                temperature: 0.7
            });
        }

        const response = chatCompletion.choices[0].message.content;
        console.log(response)

        let finalChatCompletion;

        try {
            finalChatCompletion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
                    { role: 'user', content: `Remove text unrelated to roasts, and convert these roasts into a JSON list like ["roast1", "roast2"]. You must respond in nothing but valid JSON.\n\n${response}` },
                ],
                model: 'gpt-4o-mini',
                temperature: 0.2
            });
        } catch (e) {
            console.log(e, "retrying");

            finalChatCompletion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
                    { role: 'user', content: `Remove text unrelated to roasts, and convert these roasts into a JSON list like ["roast1", "roast2"]. You must respond in nothing but valid JSON.\n\n${response}` },
                ],
                model: 'gpt-4o-mini',
                temperature: 0.2
            });
        }

        let finalResponse = finalChatCompletion.choices[0].message.content;

        console.log(finalResponse)

        await prisma.roast.update({
            where: {
                id: roast.id
            },
            data: {
                completed: true,
                roasts: finalResponse
            }
        })
    }

    return res.status(200).json({ received: true })
}

export default webhookHandler;
