import {GetServerSideProps} from "next";
import {prisma} from "@/lib/db";
import {Roast, User} from "@prisma/client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import useSWR from "swr";
import useFetch from "@/lib/useFetch";
import PaymentPopup from "@/components/PaymentPopup";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import {getAuth} from "@clerk/nextjs/server";
import { useRouter } from "next/router";
import Typewriter from 'typewriter-effect';
import Head from "next/head";
import {cn} from "@/lib/utils";

type RoastOfProps = {
    name: string,
    id: string,
    roast: Roast,
    user?: User
}

export default function RoastOf(props: RoastOfProps) {
    const { name, id, roast, user } = props;
    
    const router = useRouter();
    const clerk = useClerk();
    const clerkFetch = useFetch();

    const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);

    const [completedStages, setCompletedStages] = useState<number[]>([]);
    const [scanLineEnabled, setScanLineEnabled] = useState<boolean>(false);
    const [imageShown, setImageShown] = useState<boolean>(false);

    const fetcher = async (url: string) => {
        const response = await clerkFetch(url);
        return response.json();
    }

    const { data, error, isLoading } = useSWR(`/api/roast?roastId=${id}`, fetcher, {
        refreshInterval: 1000
    });

    const generateMore = () => {
        if (!user) {
            clerk.openSignUp({
                redirectUrl: "/app"
            });
        } else {
            if (user.premium) {
                router.push("/app");
            } else {
                setPaymentPopupOpen(true);
            }
        }
    }

    return (
        <>
            <Head>
                <title>{`Roast of ${roast.roastee}`}</title>
                <meta property="og:title" content={`Roast of ${roast.roastee}`} key="title" />
                <meta property="og:image" content={`https://roast-me.carter.red/${roast.key}`} key="image" />
                <meta property="description" content={`An AI roast of ${roast.roastee}.`} key="description" />

                <link
                    rel="preload"
                    href={`https://roast-me.carter.red/${roast.key}`}
                    as="image"
                />
            </Head>

            <Navbar />

            <main>
                <PaymentPopup open={paymentPopupOpen} setOpen={setPaymentPopupOpen} />

                <div className={"flex flex-col items-center mt-10 sm:mt-12"}>
                    <div className={"flex flex-col items-center bg-white shadow rounded-xl max-w-xl w-full"}>
                        <h1 className={"text-3xl mt-5 border-b border-gray-500 w-full text-center font-semibold text-main-white"}>Roast of {roast.roastee}</h1>

                        <div className={"mt-10 min-h-screen h-full w-full px-5"}>
                            <div>
                                { completedStages.includes(1) ? (
                                    <h2 className={"text-lg text-main-white"}>{`> Hi, I'm an AI trained to roast people.`}</h2>
                                ) : (
                                    <>
                                        <Typewriter
                                            options={{
                                                delay: 20,
                                                deleteSpeed: 150,
                                                wrapperClassName: 'text-lg text-main-white',
                                                cursorClassName: 'text-lg text-main-white'
                                            }}
                                            onInit={(typewriter) => {
                                                typewriter
                                                    .pauseFor(1000)
                                                    .typeString(`> Hi, I'm an AI trained to roast people.`)
                                                    .pauseFor(2000)
                                                    .callFunction(() => {
                                                        setCompletedStages([...completedStages, 1]);
                                                    })
                                                    .start();
                                            }}
                                        />
                                    </>
                                )}

                                { completedStages.includes(2) ?  (
                                    <>
                                        <h2 className={"text-lg text-main-white"}>{`> Loading today's roastee...`}</h2>
                                    </>
                                ) : completedStages.includes(1) && (
                                    <>
                                        <Typewriter
                                            options={{
                                                delay: 20,
                                                wrapperClassName: 'text-lg text-main-white',
                                                cursorClassName: 'text-lg text-main-white'
                                            }}
                                            onInit={(typewriter) => {
                                                typewriter
                                                    .pauseFor(1000)
                                                    .typeString(`> Loading today's victim...`)
                                                    .pauseFor(1000)
                                                    .changeDelay(75)
                                                    .deleteChars(`victim...`.length)
                                                    .typeString(`roastee...`)
                                                    .callFunction(() => {
                                                        setCompletedStages([...completedStages, 2]);
                                                    })
                                                    .start();
                                            }}
                                        />
                                    </>
                                )}

                                { completedStages.includes(3) ?  (
                                    <>
                                        <div className={"flex flex-row"}>
                                            <h2 className={"mr-1"}>{`>`}</h2>
                                            <div className="scanner-container">
                                                <Image priority={true} src={`https://roast-me.carter.red/${roast.key}`} className={"object-cover w-96 h-96 rounded-md"} width={1000} height={1000} alt={`Image of ${name}`}/>
                                                <div className={cn(scanLineEnabled ? "opacity-100" : "opacity-0", "scan-line transition-all duration-300")}></div>
                                            </div>
                                        </div>

                                        <h2 className={"text-lg text-main-white"}>{`> Okay, let's get this over with.`}</h2>
                                    </>
                                ) : (completedStages.includes(1) && completedStages.includes(2)) && (
                                    <>
                                        <div className={cn(imageShown ? "opacity-100" : "opacity-0", "flex flex-row")}>
                                            <h2 className={"mr-1"}>{`>`}</h2>
                                            <div className="scanner-container">
                                                <Image priority={true} src={`https://roast-me.carter.red/${roast.key}`} className={cn(imageShown ? "opacity-100" : "opacity-0", "mr-2 object-cover transition-all duration-300 w-96 h-96 rounded-md")} width={1000} height={1000} alt={`Image of ${name}`}/>
                                                <div className={cn(scanLineEnabled ? "opacity-100" : "opacity-0", "scan-line transition-all duration-300")}></div>
                                            </div>
                                        </div>

                                        <Typewriter
                                            options={{
                                                delay: 20,
                                                wrapperClassName: 'text-lg text-main-white',
                                                cursorClassName: 'text-lg text-main-white'
                                            }}
                                            onInit={(typewriter) => {
                                                typewriter
                                                    .callFunction(() => {
                                                        setImageShown(true);
                                                        setScanLineEnabled(true);
                                                    })
                                                    .pauseFor(1000)
                                                    .typeString(`> Scanning...`)
                                                    .pauseFor(3000)
                                                    .deleteChars(`Scanning...`.length)
                                                    .typeString(`lol really.`)
                                                    .pauseFor(1000)
                                                    .deleteChars(`lol really.`.length)
                                                    .typeString(`omg.`)
                                                    .pauseFor(1000)
                                                    .deleteChars(`omg.`.length)
                                                    .typeString(`Okay, let's get this over with.`)
                                                    .callFunction(() => {
                                                        setCompletedStages([...completedStages, 3]);
                                                        setScanLineEnabled(false);
                                                    })
                                                    .start();
                                            }}
                                        />
                                    </>
                                )}

                                { completedStages.includes(4) ?  (
                                    <>
                                        <h2 className={"text-lg text-main-white"}>{`> So this is `}<strong>{roast.roastee}</strong>{`, huh?`}</h2>
                                    </>
                                ) : (completedStages.includes(1) && completedStages.includes(2) && completedStages.includes(3)) && (
                                    <>
                                        <Typewriter
                                            options={{
                                                delay: 20,
                                                wrapperClassName: 'text-lg text-main-white',
                                                cursorClassName: 'text-lg text-main-white'
                                            }}
                                            onInit={(typewriter) => {
                                                typewriter
                                                    .pauseFor(1000)
                                                    .typeString(`> So this is <strong>${roast.roastee}</strong>, huh?`)
                                                    .pauseFor(1000)
                                                    .callFunction(() => {
                                                        setCompletedStages([...completedStages, 4]);
                                                    })
                                                    .start();
                                            }}
                                        />
                                    </>
                                )}

                                { completedStages.includes(4) && data.roast.completed ? (
                                    <>
                                        <br />

                                        {
                                            JSON.parse(data.roast.roasts.replace("\n", "")).map((roast: string, index: number) => (
                                                <>
                                                    <h2 key={index} className={"text-lg text-main-white"}>{`> ${roast}`}</h2>
                                                    <br />
                                                </>
                                            ))
                                        }
                                    </>
                                ) : (completedStages.includes(4) && !data.roast.completed) && (
                                    <>
                                        <Typewriter
                                            options={{
                                                delay: 20,
                                                wrapperClassName: 'text-lg text-main-white',
                                                cursorClassName: 'text-lg text-main-white'
                                            }}
                                            onInit={(typewriter) => {
                                                typewriter
                                                    .pauseFor(3000)
                                                    .typeString(`> Roasting is taking longer than usual, Don't worry, I haven't given up.`)
                                                    .pauseFor(3000)
                                                    .deleteAll()
                                                    .pauseFor(2000)
                                                    .typeString(`> So many things to roast, so little time.`)
                                                    .pauseFor(3000)
                                                    .deleteAll()
                                                    .pauseFor(2000)
                                                    .typeString(`> I'm still working on it...`)
                                                    .pauseFor(3000)
                                                    .deleteAll()
                                                    .pauseFor(2000)
                                                    .typeString(`> Damn, this is a tough one.`)
                                                    .pauseFor(3000)
                                                    .deleteAll()
                                                    .pauseFor(2000)
                                                    .typeString(`> Congratulate ${roast.roastee} for being so hard to roast.`)
                                                    .pauseFor(3000)
                                                    .deleteAll()
                                                    .pauseFor(2000)
                                                    .typeString(`> If you're still waiting, I'm still roasting.`)
                                                    .pauseFor(3000)
                                                    .deleteAll()
                                                    .typeString(`> Sometimes I wonder if I'm the one being roasted.`)
                                                    .pauseFor(3000)
                                                    .deleteAll()
                                                    .pauseFor(2000)
                                                    .typeString(`> I'm still roasting, I promise.`)
                                                    .pauseFor(3000)
                                                    .deleteAll()
                                                    .pauseFor(2000)
                                                    .typeString(`> I think my model is cold booting. Feel free to visit another tab for a few minutes.`)
                                                    .start();
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (!context.params) {
        return {
            notFound: true
        }
    }

    const { userId } = getAuth(context.req);
    const { name, id } = context.params;

    const roast = await prisma.roast.findUnique({
        where: {
            id: id as string
        }
    })

    if (!userId) {
        return {
            props: {
                name: name,
                id: id,
                roast: JSON.parse(JSON.stringify(roast))
            }
        }
    } else {
        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            }
        });

        return {
            props: {
                name: name,
                id: id,
                roast: JSON.parse(JSON.stringify(roast)),
                user: JSON.parse(JSON.stringify(user))
            }
        }
    }
}
