import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
    streamId:z.string()
})

export async function POST(req:NextRequest){
    const session = await getServerSession();
    
    const user = await prismaClient.user.findFirst({
        where:{
            email:session?.user?.email??""
        }
    })

    if(!user){
        return NextResponse.json({
            message:"Unauthenticated"
        },{
            status:411
        })
    }

    try{
        const data = UpvoteSchema.parse(await req.json());
        await prismaClient.upvote.delete({
            where:{
                userId_streamId:{
                    userId:user.id,
                    streamId:data.streamId
                }
            }
        })

        return NextResponse.json({
            message:"Downvoted successfully"
        }, { status: 201 });
    }catch(e){
        console.error("Error downvoting stream:", e);
        return NextResponse.json({
            message:"Error while downvoting"
        },{
            status:403
        })
    }
}