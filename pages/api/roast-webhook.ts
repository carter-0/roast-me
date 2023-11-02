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
                description: description
            }
        })

        res.status(200).json({ received: true })

        const [chatCompletion, chatCompletionTwo] = await Promise.all([
            openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
                    { role: 'user', content: `Can you roast the person in the described image: \n\n${description}` },
                ],
                model: 'gpt-4',
                temperature: 0.7
            }),
            openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
                    { role: 'user', content: `Can you roast the person in the described image: \n\n${description}` },
                ],
                model: 'gpt-4',
                temperature: 0.7
            })
        ]);


        const response = chatCompletion.choices[0].message.content + "\n\n" + chatCompletionTwo.choices[0].message.content;
        console.log(response)

        let finalChatCompletion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.' },
                { role: 'user', content: `Remove text unrelated to roasts, and convert these roasts into a JSON list like ["roast1", "roast2"]. You must respond in nothing but valid JSON. :\n\n${response}` },
            ],
            model: 'gpt-4',
            temperature: 0.2
        });

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