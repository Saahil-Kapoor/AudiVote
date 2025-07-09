"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from "axios"
import { SetStateAction, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'

const REFRESH_INTERVAL_MS = 5 * 1000;

var prev = "";
export default function CurrentlyPlaying() {
  // In a real application, you would get this ID from your backend
  //const currentVideoId = 
  const [url, seturl] = useState<string | null>(null);

  useEffect(() => {
    async function handle() {
      const interval = setInterval(async () => {
        const res = await axios.get('/api/streams/my', { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
        if (prev != res.data.streams[0].extractedId) {
          console.log(res.data.streams[0].extractedId);
          prev = res.data.streams[0].extractedId;
          seturl(res.data.streams[0].extractedId);
        }
      }, REFRESH_INTERVAL_MS);
      return () => clearInterval(interval);
    }
    handle();
  }, []);

  console.log("this is a the url" + url);
  return (
    <>
    {!url && (
      <div className="text-center mb-4">
        <p>Loading...</p>
      </div>
    )}
    <Card>
      <CardHeader>
        <CardTitle>Currently Playing</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${url}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </CardContent>
    </Card>
    </>
  )
}

