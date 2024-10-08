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
import {toast} from "@/components/ui/use-toast";

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

    const { noAnimations } = router.query;

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

    const share = async (withAnimations?: boolean) => {
        if (withAnimations) {
            await navigator.clipboard.writeText(`https://roastai.app/roast-of/${name}/${id}`);
        } else {
            await navigator.clipboard.writeText(`https://roastai.app/roast-of/${name}/${id}?noAnimations=true`);
        }

        toast({
            title: "Copied to clipboard!",
            description: "You can now paste the link anywhere you want.",
        })
    }

    const parseJSON = (obj: any) => {
        if (typeof obj !== 'string') return null;
        try {
            const str = obj.replaceAll("\n", "");
            const jsonStart = str.indexOf('{') !== -1 ? str.indexOf('{') : str.indexOf('[');
            if (jsonStart !== -1) {
                let jsonStr = str.substring(jsonStart);
                jsonStr = jsonStr.replace(/```/g, '');
                if ((jsonStr.startsWith('{') && jsonStr.endsWith('}')) || (jsonStr.startsWith('[') && jsonStr.endsWith(']'))) {
                    return JSON.parse(jsonStr);
                }
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
        return null;
    };

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

                <div className={"flex flex-col mx-3 sm:mx-0 items-center mt-10 sm:mt-12"}>
                    <div className={"flex mb-10 flex-col items-center bg-white shadow rounded-xl max-w-xl w-full"}>
                        <h1 className={"text-3xl mt-5 border-b border-gray-500 w-full text-center font-semibold text-main-white"}>Roast of {roast.roastee}</h1>

                        <div className={"mt-10 min-h-screen h-full w-full px-5"}>
                            <div>
                                { completedStages.includes(1) || noAnimations ? (
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

                                { completedStages.includes(2) || noAnimations ?  (
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

                                { completedStages.includes(3) || noAnimations ?  (
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

                                { completedStages.includes(4) || noAnimations ?  (
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

                                { (completedStages.includes(4) || noAnimations) && data?.roast.completed ? (
                                    <>
                                        <br />

                                        {(() => {
                                            const parsedRoasts = parseJSON(data.roast.roasts);
                                            if (Array.isArray(parsedRoasts)) {
                                                return parsedRoasts.map((roast: string, index: number) => (
                                                    <>
                                                        <h2 className={"text-lg text-main-white"}>{`> ${roast}`}</h2>
                                                        <br />
                                                    </>
                                                ));
                                            } else if (typeof data.roast.roasts === 'string') {
                                                return (
                                                    <h2 className={"text-lg text-main-white"}>{`> ${data.roast.roasts}`}</h2>
                                                );
                                            } else {
                                                return (
                                                    <h2 className={"text-lg text-main-white"}>No roasts available.</h2>
                                                );
                                            }
                                        })()}
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

                    <div className={"flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-white justify-start max-w-xl w-full p-5 rounded-md mb-10 shadow"}>
                        {user?.userId == roast.userId ? (
                            <>
                                <button role="button" onClick={() => generateMore()} className={"sm:w-auto w-full"}>
                                    <div className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium leading-4 text-white shadow-sm transition-all duration-150 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto">
                                        <span>Generate another Roast</span>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <>
                                <button role="button" onClick={() => generateMore()} className={"sm:w-auto w-full"}>
                                    <div className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium leading-4 text-white shadow-sm transition-all duration-150 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto">
                                        <span>Create a Roast</span>
                                    </div>
                                </button>
                            </>
                        )}

                        <button onClick={() => share(true)} type="button" className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500">
                            Share with animations
                        </button>

                        <button onClick={() => share(false)} type="button" className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500">
                            Share without animations
                        </button>
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

    const parseJSON = (obj: any) => {
        const str = JSON.stringify(obj);
        const match = str.match(/\{.*\}/s);
        return match ? JSON.parse(match[0]) : null;
    };

    if (!userId) {
        return {
            props: {
                name: name,
                id: id,
                roast: parseJSON(roast)
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
                roast: parseJSON(roast),
                user: parseJSON(user)
            }
        }
    }
}
