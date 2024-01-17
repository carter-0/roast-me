import type { NextApiRequest, NextApiResponse } from 'next'
import {getAuth} from "@clerk/nextjs/server";
// @ts-ignore
import multer from "multer";
import crypto from "crypto";
import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import {prisma} from "@/lib/db";
import {Roast} from "@prisma/client";
import Replicate from "replicate";

const bucket = 'roast-me';

// @ts-ignore
const s3 = new S3Client({
    endpoint: `https://6c7add82567c8755e3f0022bfd49e5e0.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY
    },
    region: 'auto',
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

type Data = {
    success: boolean,
    message?: string,
    roast?: Roast
}

async function roast_post(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({success: false, message: "Unauthorized"});
    }

    let user = await prisma.user.findUnique({
        where: {
            userId: userId
        }
    })

    if (!user) {
        user = await prisma.user.create({
            data: {
                userId: userId,
                premium: false
            }
        })
    }

    const existing = await prisma.roast.findMany({
        where: {
            userId: userId
        }
    })

    if (existing.length > 0 && !user.premium) {
        return res.status(402).json({
            success: false,
            message: "You must be a premium user to create more roasts."
        })
    }

    await new Promise(resolve => {
        const mw = multer().any()
        mw(req, res, resolve)
    })

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({success: false, message: "Missing roastee"});
    }

    const file = (req as any).files[0]

    if (file.buffer.byteLength > 100 * 1024 * 1024) {
        return res.status(400).json({success: false, message: "This image is currently too large for us to process :("});
    }

    let id = String(crypto.randomBytes(20).toString('hex'))

    const params = {
        Bucket: bucket,
        Key: `${userId}/${id}.png`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const output = await replicate.predictions.create({
        version: "c293ca6d551ce5e74893ab153c61380f5bcbd80e02d49e08c582de184a8f6c83",
        input: {
            image: `https://roast-me.carter.red/${userId}/${id}.png`,
            top_p: 0.7,
            prompt: "Describe this image in detail.",
            max_tokens: 1024,
            temperature: 0.6
        },
        webhook: "https://roastai.app/api/roast-webhook",
        webhook_events_filter: ["completed"]
    });

    const roast = await prisma.roast.create({
        data: {
            userId: userId,
            roastee: name,
            misspelledName: name.replaceAll(/[s]/gi, "z").replaceAll(/[a]/gi, "e").replaceAll(/[o]/gi, "a").replaceAll(/[i]/gi, "e").replaceAll(/[u]/gi, "e"),
            key: `${userId}/${id}.png`,
            replicateId: output.id,
        }
    })

    return res.status(200).json({success: true, message: "Roast created", roast: roast});
}

async function roast_get(req: NextApiRequest, res: NextApiResponse<Data>) {
    const {userId} = getAuth(req);
    const {roastId} = req.query;

    const roast = await prisma.roast.findFirst({
        where: {
            id: roastId as string,
        }
    })

    if (!roast) {
        return res.status(404).json({success: false, message: "Roast not found"});
    }

    return res.status(200).json({success: true, message: "Roast found", roast: JSON.parse(JSON.stringify(roast))});
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        return roast_post(req, res)
    } else if (req.method === 'GET') {
        return await roast_get(req, res)
    }

    res.status(400).json({success: false})
}
