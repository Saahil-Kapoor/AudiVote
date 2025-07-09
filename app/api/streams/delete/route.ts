import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from '@/app/lib/db'
import { getServerSession } from "next-auth/next";

export async function DELETE(req: NextRequest) {
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 411
        })
    }
    //console.log("this is the body",req.body)
    console.log("Deleting stream");

    let body: { id?: string }
    try {
        body = await req.json()
    } catch (err) {
        return NextResponse.json(
            { message: 'Invalid JSON body' },
            { status: 400 }
        )
    }

    const { id } = body
    console.log("Stream ID to delete:", id)
    
    const stream = await prismaClient.stream.delete({
        where: {
            id: id,
            userId: user.id
        }
    })

    return NextResponse.json({
        message: "Stream deleted successfully",
        streamId: stream.id
    }, {
        status: 200
    })
}
