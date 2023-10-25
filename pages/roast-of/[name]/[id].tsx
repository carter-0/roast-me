import {GetServerSideProps} from "next";
import {prisma} from "@/lib/db";
import {Roast} from "@prisma/client";

type RoastOfProps = {
    name: string,
    id: string,
    roast: Roast
}

export default function RoastOf(props: RoastOfProps) {
    const { name, id, roast } = props;

    return (
        <>
            Roasted {roast.roastee}!
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
