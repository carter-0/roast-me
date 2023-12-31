import Image from 'next/image'
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Layout from "@/components/layout";
import {GetServerSideProps} from "next";
import {ClerkLoading, SignedIn, SignedOut, useClerk} from "@clerk/nextjs";
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { User } from '@prisma/client';
import PaymentPopup from '@/components/PaymentPopup';
import { useState } from 'react';
import Footer from "@/components/Footer";
import {HowItWorks} from "@/components/component/how-it-works";

type HomeProps = {
    roasts: number,
    user?: User
}

export default function Home(props: HomeProps) {
    const { roasts, user } = props;

    const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);
    const clerk = useClerk();

    return (
        <>
            <Navbar />

            <Layout>
                <main className={"flex flex-col items-center"}>
                    <PaymentPopup open={paymentPopupOpen} setOpen={setPaymentPopupOpen} />

                    <div className={"flex items-center mt-10 sm:mt-24"}>
                        <Image className={"w-8 h-8 rounded-md mt-1"} src={"/assets/logo.png"} alt={"Logo"} width={40} height={40} priority={true} />
                        <h1 className={"font-bold text-3xl mt-1 text-main-white ml-3"}>Roast Me</h1>
                    </div>

                    <div className={"flex flex-col items-center text-center mt-5 mx-5 mb-24 sm:mx-0 sm:max-w-[620px]"}>
                        <h1 className={"text-2xl sm:text-4xl lg:text-[38px] font-bold leading-[1.6rem] sm:leading-[3rem]"}>Roast your selfies with Roast AI</h1>
                        <h2 className={"text-xl font-semibold hidden sm:block"}>Can you handle our brutal roasts?</h2>
                        <h3 className={"text-sm mt-2 leading-[1.4rem] md:leading-[1.8rem] md:text-lg font-normal text-gray-600"}>Get a free savage roast generated by our unrelenting AI-roaster. Upload your photo & receive your roasts within 30 seconds.</h3>

                        <div className={"sm:space-x-2 mt-5"}>
                            <div className="flex gap-4 items-center content-center sm:justify-center sm:gap-6">
                                <ClerkLoading>
                                    <button role="button" onClick={() => clerk.openSignUp()} className={"sm:w-auto w-full"}>
                                        <div className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-orange-500 px-4 py-2 text-base font-semibold leading-6 text-white shadow-sm transition-all duration-150 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto">
                                            <span className="block md:hidden">Start now</span> <span className="hidden md:block">Roast Me</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </button>
                                </ClerkLoading>

                                <SignedOut>
                                    <button role="button" onClick={() => clerk.openSignUp()} className={"sm:w-auto w-full"}>
                                        <div className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-orange-500 px-4 py-2 text-base font-semibold leading-6 text-white shadow-sm transition-all duration-150 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto">
                                            <span className="block md:hidden">Start now</span> <span className="hidden md:block">Roast Me</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </button>
                                </SignedOut>

                                <SignedIn>
                                    { (user && (!user.premium && roasts > 0) ? (
                                        <>
                                            <button onClick={() => {
                                                setPaymentPopupOpen(true);
                                            }} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-orange-500 px-4 py-2 text-base font-semibold leading-6 text-white shadow-sm transition-all duration-150 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto">
                                                <span className="block md:hidden">Start now</span> <span className="hidden md:block">Roast Me</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={"/app"} className={"sm:w-auto w-full"}>
                                                <div className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-orange-500 px-4 py-2 text-base font-semibold leading-6 text-white shadow-sm transition-all duration-150 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:w-auto">
                                                    <span className="block md:hidden">Start now</span> <span className="hidden md:block">Roast Me</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            </Link>
                                        </>
                                    )) }
                                    
                                </SignedIn>

                                <span className="text-sm font-bold uppercase tracking-wide text-gray-400 hidden sm:block">Or</span>

                                <Link href={"/roast-of/demo-person/cloq597jx0000vm3c0nw67s7k"} className="hidden sm:flex content-center items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-center text-base font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 text-sm font-medium transition-all duration-150 hover:opacity-90" title="">
                                    Demo Roast
                                </Link>
                            </div>

                            <div className={"flex flex-col items-center sm:flex-row sm:space-x-3 mt-4"}>
                                <div className={"flex -space-x-3 overflow-hidden"}>
                                    <Image className={"aspect-[1/1] inline-block h-10 w-10 rounded-full border-[3px] border-white"} src={"/assets/person_1.avif"} alt={"Person 1"} width={200} height={200} />
                                    <Image className={"aspect-[1/1] inline-block h-10 w-10 rounded-full border-[3px] border-white"} src={"/assets/person_2.avif"} alt={"Person 1"} width={200} height={200} />
                                    <Image className={"aspect-[1/1] inline-block h-10 w-10 rounded-full border-[3px] border-white"} src={"/assets/person_3.avif"} alt={"Person 1"} width={200} height={200} />
                                    <Image className={"aspect-[1/1] inline-block h-10 w-10 rounded-full border-[3px] border-white"} src={"/assets/person_4.avif"} alt={"Person 1"} width={200} height={200} />
                                    <Image className={"aspect-[1/1] inline-block h-10 w-10 rounded-full border-[3px] border-white"} src={"/assets/person_5.avif"} alt={"Person 1"} width={200} height={200} />
                                </div>

                                <h4 className={"mx-auto max-w-lg text-sm text-gray-500 lg:mx-0"}><strong>37+</strong> people already roasted</h4>
                            </div>
                        </div>
                    </div>

                    <HowItWorks />
                </main>
            </Layout>

            <div className={"mb-24"}>

            </div>

            <Footer />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { userId } = getAuth(context.req);

    if (!userId) {
        return {
            props: {
                user: null,
                roasts: 0
            }
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            userId: userId
        }
    });

    if (!user) {
        return {
            props: {
                user: null,
                roasts: 0
            }
        }
    }

    const roasts = await prisma.roast.findMany({
        where: {
            userId: userId
        }
    })

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            roasts: roasts.length
        }
    }
}
