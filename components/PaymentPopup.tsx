import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import Link from "next/link";
import {StarIcon} from "@heroicons/react/solid";
import {useRouter} from "next/router";

type PaymentPopupProps = {
    open: boolean,
    setOpen: any
}

export default function PaymentPopup(props: PaymentPopupProps) {
    const { open, setOpen } = props;
    const router = useRouter();

    const cancelButtonRef = useRef(null)

    const createCheckoutSession = async () => {
        await router.push("/api/stripe/checkout")
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white dark:bg-primary-black rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="rounded-2xl dark:bg-secondary-black bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 dark:ring-gray-100/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                <div className="mx-auto max-w-xs px-8">
                                    <p className="text-2xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-300">You have 0 roasts left</p>
                                    <p className="mt-6 flex mx-5 flex-col items-baseline justify-center gap-x-2">
                                        {[
                                            'Unlimited roasts',
                                            '$10 USD',
                                            'One-time payment',
                                        ].map((feature) => (
                                            <li key={feature} className="flex">
                                                <CheckIcon className="flex-shrink-0 w-6 h-6 text-orange-500" aria-hidden="true" />
                                                <span className="ml-3 text-gray-500 dark:text-gray-400 line-clamp-1 text-left">{feature}</span>
                                            </li>
                                        ))}
                                    </p>

                                    <button
                                        onClick={() => createCheckoutSession()}
                                        className="mt-10 block w-full rounded-md px-5 py-2 text-center text-sm font-semibold shadow-sm bg-orange-500 text-white hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                                    >
                                        Unlock All ($9.99 USD)
                                    </button>

                                    <div className="inline-flex mt-2 items-center divide-x divide-gray-300">
                                        <div className="flex-shrink-0 flex pr-3">
                                            <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                                            <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                                            <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                                            <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                                            <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                                        </div>

                                        <div className="min-w-0 font-semibold flex-1 text-xs pl-3 py-1 text-gray-600 dark:text-gray-300 sm:py-3">
                                            <span className="font-semibold">Join</span> over {' '}
                                            <span className="font-semibold text-sp-orange">37 cool people</span>
                                        </div>
                                    </div>

                                    <p className="mt-5 text-xs leading-5 text-gray-600 dark:text-gray-300">
                                        Lifetime payment. No recurring fees. Processed securely by Stripe.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 mt-5">
                                <button
                                    type="button"
                                    className="mt-3 w-full min-w-[100px] inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 dark:bg-secondary-black dark:border-gray-600 bg-white text-base font-medium dark:text-gray-300 text-gray-700 dark:hover:bg-gray-950 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
