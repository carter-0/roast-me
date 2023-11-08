import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Set the paths that don't require the user to be signed in
const publicPaths = ['/', '/sign-in*', '/sign-up*', '/images*', '/favicon.ico', '/api/*', '/*.png', '/*.ico', '/*.svg', '/*.mp4', '/*.webmanifest']
const privatePaths = ['/app']

const isPublic = (path: string) => {
    // return publicPaths.find(x =>
    //     path.match(new RegExp(`^${x}$`.replaceAll('*$', '($|/)')))
    // )

    for (const privatePath of privatePaths) {
        if (path.toLowerCase().includes(privatePath)) {
            return false
        }
    }

    return true
}

export default withClerkMiddleware((request: NextRequest) => {
    if (request.nextUrl.pathname.includes("/new-deck")) {
        const { userId } = getAuth(request)

        if (userId) {
            let baseUrl = new URL('request.url')
            baseUrl.hostname = 'roastai.app'
            baseUrl.protocol = 'https'

            return NextResponse.redirect(new URL('/dashboard/decks/new', baseUrl))
        }

        return NextResponse.next()
    }

    if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    // if the user is not signed in redirect them to the sign-in page.
    const { userId } = getAuth(request)

    if (!userId) {
        // redirect the users to /pages/sign-in/[[...index]].ts
        if (process.env.NODE_ENV === 'production') {
            let baseUrl = new URL('request.url')
            baseUrl.hostname = 'roastai.app'
            baseUrl.protocol = 'https'

            const signInUrl = new URL('/sign-in', baseUrl)
            signInUrl.searchParams.set('redirect_url', baseUrl.toString())
            return NextResponse.redirect(signInUrl)
        } else {
            const signInUrl = new URL('/sign-in', request.url)
            signInUrl.searchParams.set('redirect_url', request.url)
            return NextResponse.redirect(signInUrl)
        }
    }
    return NextResponse.next()
})

export const config = { matcher:  '/((?!_next/image|_next/static|favicon.ico).*)',};
