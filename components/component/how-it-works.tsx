/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/KejiKQGUwq9
 */
import { Button } from "@/components/ui/button"

export function HowItWorks() {
    return (
        <div>
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">How It Works</h2>
                        <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
                            Follow these simple steps to get roasted by our AI.
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        <div className="flex flex-col items-center space-y-4">
                            <svg
                                className=" h-16 w-16 text-zinc-900 dark:text-zinc-50"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                            <h3 className="text-2xl font-semibold">Upload Your Picture</h3>
                            <p className="text-zinc-500 dark:text-zinc-400">Choose a picture that you want the AI to roast.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <svg
                                className=" h-16 w-16 text-zinc-900 dark:text-zinc-50"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                                <path d="M10 2c1 .5 2 2 2 5" />
                            </svg>
                            <h3 className="text-2xl font-semibold">AI Analyzes Your Picture</h3>
                            <p className="text-zinc-500 dark:text-zinc-400">Our AI will analyze your picture and generate a roast.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <svg
                                className=" h-16 w-16 text-zinc-900 dark:text-zinc-50"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1" />
                                <path d="M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66" />
                                <path d="M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04" />
                                <line x1="2" x2="22" y1="2" y2="22" />
                            </svg>
                            <h3 className="text-2xl font-semibold">Get Roasted</h3>
                            <p className="text-zinc-500 dark:text-zinc-400">Sit back and enjoy the roast from our AI.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
