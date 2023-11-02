import { useAuth } from '@clerk/nextjs';

export default function useFetch() {
    const { getToken } = useAuth();
    const authenticatedFetch = async (...args: any) => {
        console.log("authenticatedFetch")

        if (args[1]) {
            args[1].headers = { Authorization: `Bearer ${await getToken()}` }
        } else {
            args[1] = { headers: { Authorization: `Bearer ${await getToken()}` } };
        }

        // @ts-ignore
        return fetch(...args);
    };
    return authenticatedFetch;
}