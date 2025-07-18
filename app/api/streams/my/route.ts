import { NextRequest, NextResponse } from "next/server";

import {prismaClient} from '@/app/lib/db'
import { getServerSession } from "next-auth/next";

export async function GET() {
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
    const streams = await prismaClient.stream.findMany({
        where: {
            userId: user.id ?? ""
        },
        include:{
            _count:{
                select:{
                    upvotes:true
                }
            },
            upvotes:{
                where:{
                    userId:user.id
                }
            }
        },
        orderBy: {
            upvotes:{
                _count: 'desc'
            }
        }
    })
    //console.log(streams);
    return NextResponse.json({
        streams: streams
    })
}