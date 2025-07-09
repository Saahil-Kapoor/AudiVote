'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import axios from "axios"

interface Song {
  id: string
  title: string
  artist: string
  votes: number
  imageUrl: string
}

export default function VotingQueue() {
  const [queue, setQueue] = useState<Song[]>([])
  useEffect(() => {
    async function handle() {
      const res = await axios.get('/api/streams/my', { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
      const all_streams = res.data.streams;
      console.log(all_streams);
      for(let i = 1;i<all_streams.length;i++){
        const stream = all_streams[i];
        setQueue(prevQueue => [
          ...prevQueue,
          {
            id: stream.id,
            title: stream.title,
            artist: stream.id,
            votes: stream._count.upvotes,
            imageUrl: stream.smallImg || '/placeholder.svg?height=80&width=80'
          }
        ]);
      }
    }
    handle();
  }, []);
  

  const handleVote = async (id: string, increment: number) => {
    if(increment == 1){
      const res = await axios.post('/api/streams/upvote', { streamId:id }, { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
      if(res.status != 201){
        console.error("Error upvoting the song");
        return;
      }
    }
    else if(increment == -1){
      const res = await axios.post('/api/streams/downvote', { streamId:id }, { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
      if(res.status != 201){
        console.error("Error downvoting the song");
        return;
      }
    }
    setQueue(prevQueue =>
      prevQueue.map(song =>
        song.id === id ? { ...song, votes: song.votes + increment } : song
      ).sort((a, b) => b.votes - a.votes)
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {queue.map(song => (
            <li key={song.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
              <Image
                src={song.imageUrl}
                alt={`${song.title} by ${song.artist}`}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl">{song.votes}</span>
                <div className="space-y-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(song.id, 1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(song.id, -1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
