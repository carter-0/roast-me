import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <>
            <nav className={"bg-white shadow relative w-full"}>
                <div className={"mx-auto max-w-md sm:max-w-3xl px-4 sm:px-6 lg:max-w-7xl flex w-full items-center justify-between bg-inherit py-4"}>
                    <Link href={"/"}>
                        <div className={"flex items-center justify-center"}>
                            <Image className={"w-6 h-6 rounded-md mt-1"} src={"/assets/logo.png"} alt={"Logo"} width={40} height={40} priority={true} />
                            <h1 className={"font-bold text-xl text-main-white ml-3"}>Roast Me</h1>
                        </div>
                    </Link>

                    <div className={"hidden lg:ml-16 lg:mr-auto lg:flex lg:items-center lg:justify-start lg:gap-12 xl:ml-20"}>
                        {/*<Link href={"/#examples"} className={"text-base font-semibold leading-6 text-gray-600 transition-all duration-150 hover:text-gray-900"}>Reviews & Examples</Link>*/}
                        {/*<Link href={"/#pricing"} className={"text-base font-semibold leading-6 text-gray-600 transition-all duration-150 hover:text-gray-900"}>Pricing</Link>*/}
                        {/*<Link href={"/decks"} className={"text-base font-semibold leading-6 text-gray-600 transition-all duration-150 hover:text-gray-900"}>Decks</Link>*/}
                        {/*<Link href={"/#faq"} className={"text-base font-semibold leading-6 text-gray-600 transition-all duration-150 hover:text-gray-900"}>How it works</Link>*/}
                        {/*<Link href={"/demo"} className={"text-base font-semibold leading-6 text-gray-600 transition-all duration-150 hover:text-gray-900"}>Demo</Link>*/}
                    </div>

                    <Link href={"/demo"} className={"text-base font-semibold leading-6 text-gray-600"}>
                        Demo
                    </Link>
                </div>
            </nav>
        </>
    )
}