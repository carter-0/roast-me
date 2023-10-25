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

    const roast = await prisma.roast.create({
        data: {
            userId: userId,
            roastee: name,
            key: `${userId}/${id}.png`
        }
    })

    return res.status(200).json({success: true, message: "Roast created", roast: roast});
}

function roast_get(req: NextApiRequest, res: NextApiResponse<Data>) {

}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        return roast_post(req, res)
    } else if (req.method === 'GET') {
        return roast_get(req, res)
    }

    res.status(400).json({ success: false })
}
