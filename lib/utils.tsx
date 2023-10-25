import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function urlEncName(name: string) {
    return name.toLowerCase().replace(/ /g, "-")
}
