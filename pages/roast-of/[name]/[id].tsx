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
import Head from "next/head";

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

    const fetcher = async (url: string) => {
        const response = await clerkFetch(url);
        return response.json();
    }

    const { data, error, isLoading } = useSWR(`/api/roast?roastId=${id}`, fetcher, {
        refreshInterval: 2000
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
            </Head>

            <Navbar />

            <main>
                <div className={"flex flex-col items-center mt-10 sm:mt-24"}>
                    <PaymentPopup open={paymentPopupOpen} setOpen={setPaymentPopupOpen} /> 

                    <h1 className={"text-3xl font-bold text-main-white mt-10 sm:mt-24"}>Roast of {roast.roastee}</h1>
                    <Image src={`https://roast-me.carter.red/${roast.key}`} className={"object-cover w-96 h-96 rounded-md"} width={300} height={300} alt={`Image of ${name}`}/>

                    { data ? (
                        data.roast.completed ? (
                            <>
                                <h1 className={"text-3xl font-bold text-main-white mt-10 sm:mt-24"}>Roasts</h1>
                                <div className={"flex flex-col items-center mt-10 sm:mt-24 max-w-md"}>
                                    { JSON.parse(data.roast.roasts.replace("\n", "")).map((roast: string, index: number) => (
                                        <div key={index} className={"flex flex-col items-center mt-10 sm:mt-24"}>
                                            <h1 className={"text-xl font-bold text-main-white mt-10 sm:mt-24"}>{roast}</h1>
                                        </div>
                                    )) }
                                </div>

                                <button onClick={() => {
                                    generateMore()
                                }}>
                                    Generate More
                                </button>
                            </>
                        ) : (
                            <>
                                <h1 className={"text-3xl font-bold text-main-white mt-10 sm:mt-24"}>Roasting... ETA 30 seconds</h1>
                            </>
                        )
                    ) : (
                        <>
                            <h1 className={"text-3xl font-bold text-main-white mt-10 sm:mt-24"}>Loading...</h1>
                        </>
                    ) }
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
