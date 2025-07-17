import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const creatorId = req.nextUrl.searchParams.get("creatorId");
        if (!creatorId) {
            return NextResponse.json({
                message: "Missing creatorId"
            }, {
                status: 400
            })
        }
        const data = await req.json();
        const currPlaying = await prismaClient.currPlaying.create({
            data: {
                creatorId: creatorId,
                url: data.url,
                streamId: data.streamId,
            }
        });
        console.log(currPlaying);

        return NextResponse.json({
            message: "Added Streams",
        })

    }
    catch (e) {
        console.log(e);
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    if (!creatorId) {
        return NextResponse.json({
            message: "Missing creatorId"
        }, {
            status: 400
        })
    }
    const streams = await prismaClient.currPlaying.findFirst({
        where: {
            creatorId: creatorId ?? ""
        }
    })
    //console.log(streams);
    return NextResponse.json({
        streams: streams
    })
}

export async function DELETE(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    if (!creatorId) {
        return NextResponse.json({
            message: "Missing creatorId"
        }, {
            status: 400
        })
    }
    const streams = await prismaClient.currPlaying.deleteMany({
        where: {
            creatorId: creatorId ?? ""
        }
    })
    //console.log(streams);
    return NextResponse.json({
        streams: streams
    })
}