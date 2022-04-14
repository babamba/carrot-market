// import twilio from 'twilio';
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body;
    const user = phone ? { phone: phone } : email ? { email } : null;
    if (!user) return res.status(400).json({ ok: false });

    const payload = Math.floor(100000 + Math.random() * 900000) + "";

    // const user = await client.user.upsert({
    //     where: {
    //         ...payload,
    //     },
    //     create: {
    //         name: "Anonymous",
    //         ...payload,
    //     },
    //     update: {},
    // });
    // console.log("user : ", user);

    const token = await client.token.create({
        data: {
            payload,
            user: {
                // connect: {
                //     id: user.id,
                // },
                connectOrCreate: {
                    where: {
                        ...user,
                    },
                    create: {
                        name: "Anonymous",
                        ...user,
                    },
                },
            },
        },
    });

    console.log('token : ', token)
    // if (phone) {
    //     await twilioClient.messages.create({
    //         messagingServiceSid: process.env.TWILIO_MSID,
    //         to: process.env.MY_PHONE!,
    //         body: `Your login token is ${payload}`,
    //     });
    // }
    //console.log("token : ", token);

    // if (email) {
    //     user = await client.user.findUnique({
    //         where: {
    //             email,
    //         },
    //     });

    //     if (user) console.log("find it : ", user);
    //     if (!user) {
    //         console.log("Did not find. will create");
    //         user = await client.user.create({
    //             data: {
    //                 name: "Anonymous",
    //                 email,
    //             },
    //         });
    //     }

    //     console.log("user : ", user);
    // }
    // if (phone) {
    //     user = await client.user.findUnique({
    //         where: {
    //             phone: +phone,
    //         },
    //     });

    //     if (user) console.log("find it : ", user);
    //     if (!user) {
    //         console.log("Did not find. will create");
    //         user = await client.user.create({
    //             data: {
    //                 name: "Anonymous",
    //                 phone: +phone,
    //             },
    //         });
    //     }

    //     console.log("user : ", user);
    // }
    return res.json({ ok: true });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
