import {GetServerSideProps} from "next";
import {prisma} from "@/lib/db";
import {Roast} from "@prisma/client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import useSWR from "swr";
import useFetch from "@/lib/useFetch";

type RoastOfProps = {
    name: string,
    id: string,
    roast: Roast
}

export default function RoastOf(props: RoastOfProps) {
    const { name, id, roast } = props;
    const clerkFetch = useFetch();

    const fetcher = async (url: string) => {
        const response = await clerkFetch(url);
        return response.json();
    }

    const { data, error, isLoading } = useSWR(`/api/roast?roastId=${id}`, fetcher, {
        refreshInterval: 2000
    })

    return (
        <>
            <Navbar />

            <main>
                <div className={"flex flex-col items-center mt-10 sm:mt-24"}>
                    <h1 className={"text-3xl font-bold text-main-white mt-10 sm:mt-24"}>Roast of {name}</h1>
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

    const { name, id } = context.params;

    const roast = await prisma.roast.findUnique({
        where: {
            id: id as string
        }
    })

    return {
        props: {
            name: name,
            id: id,
            roast: JSON.parse(JSON.stringify(roast))
        }
    }
}
