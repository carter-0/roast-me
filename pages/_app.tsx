import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Baloo_Bhaijaan_2 } from 'next/font/google'
import {AnimatePresence} from "framer-motion";
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "@/components/ui/toaster";

const font = Baloo_Bhaijaan_2({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
                <ClerkProvider>
                    <div className={`${font.className}`}>
                        <Component {...pageProps} />
                        <Toaster />
                    </div>
                </ClerkProvider>
            </AnimatePresence>
        </>
    )
}
