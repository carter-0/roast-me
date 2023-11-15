import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function howToSeeYourSpotifyListeningTime() {
    return (
        <>
            <Head>
                <title>How to create Anki decks with AI</title>
                <meta key={'description'} name="description" content="With Anki Decks, a new website that converts your notes to flashcards, you can start learning up to 5X faster." />
                <meta key={'og:title'} property="og:title" content="How to create Anki decks with AI" />
            </Head>

            <div className={"bg-[#EEEEEE] text-[#444]"}>
                <Navbar />

                <main>
                    <article className={"mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8 flex flex-col items-center justify-left w-full bg-inherit py-4"}>
                        <div className={"flex flex-col w-full items-center"}>
                            <Image priority={true} className={"rounded-md w-[600px]"} src={"/assets/roast-example.png"} width={500} height={500} alt={''} />
                            <h1 className={"font-bold text-3xl pt-5"}>How to generate AI roasts</h1>
                            <p className={"text-lg font-medium"}>Posted by <span className={"font-bold"}>Carter</span> on <span className={"font-bold"}>November 15, 2023</span></p>
                        </div>

                        <div className={"prose text-lg pt-10"}>
                            <p>Are you in the mood for a roast? Well with new technology you can roast pictures of yourself and your friends with AI!</p>

                            <p>In this article, we&apos;ll show you how to create AI roasts for free.</p>

                            <p>1. Go to the <Link href={"/"}>Roast AI website</Link> and click on the &apos;Roast Me&apos; button.</p>
                            <div className={"flex justify-center"}>
                                <Image className={"rounded-md w-[600px]"} src={"/assets/step-1-roast.png"} width={500} height={500} alt={''} />
                            </div>

                            <p>2. Log in with one of the available methods.</p>
                            <div className={"flex justify-center"}>
                                <Image className={"rounded-md w-[600px]"} src={"/assets/step-2-roast.png"} width={500} height={500} alt={''} />
                            </div>

                            <p>3. Once you&apos;re logged in, you&apos;ll be directed to a page where you can upload the person you want to roast. Once you&apos;ve uploaded the image, just press the &quot;Roast Me&quot; button</p>
                            <div className={"flex justify-center"}>
                                <Image className={"rounded-md w-[600px]"} src={"/assets/step-3-roast.png"} width={500} height={500} alt={''} />
                            </div>

                            <p>4. That&apos;s it! You should be redirected to the roast page and the user will be roasted using AI. If the service is under heavy load, the roast may take a while to load.</p>
                            <div className={"flex justify-center"}>
                                <Image className={"rounded-md w-[600px]"} src={"/assets/roast-example.png"} width={500} height={500} alt={''} />
                            </div>
                        </div>
                    </article>
                </main>

                <Footer />
            </div>
        </>
    )
}