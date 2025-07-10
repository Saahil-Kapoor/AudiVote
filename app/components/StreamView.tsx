"use client"
import SongSubmission from '@/app/components/SongSubmission'
import VotingQueue from '@/app/components/VotingQueue'
import CurrentlyPlaying from '@/app/components/CurrentlyPlaying'
import { useEffect, useState, useRef } from 'react'
import { signOut } from 'next-auth/react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { toast, Toaster } from 'react-hot-toast'
import { set } from 'zod'

interface Song {
  id: string
  title: string
  artist: string
  votes: number
  imageUrl: string
}

const REFRESH_INTERVAL_MS = 2 * 1000;

export default function StreamView({
  creatorId
}: {
  creatorId: string
}) {
  const prev = useRef<string>("");
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [queue, setQueue] = useState<Song[]>([])
  const [url, seturl] = useState<string | null>(null);
  const [all_streams, setAllStreams] = useState<any[]>([]);
  const [curr_state, setcurrstate] = useState<any>(null);

  useEffect(() => {
    async function handle() {
      const interval = setInterval(async () => {
        const res = await axios.get(`/api/streams/?creatorId=${creatorId}`, { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
        const all_stream = res.data.streams;
        const newId = all_stream[0]?.extractedId;
        const currentStream = all_stream[0];
    
    // Update current stream state
        setcurrstate(currentStream);
        if (newId && prev.current !== newId) {
          prev.current = newId;
          seturl(newId);
        }
       /*
        if (prev.current === "") {
          prev.current = newId;
          seturl(newId);
        }
          */
        const newQueue = all_stream.length > 0
      ? all_stream.slice(1).map(stream => ({
          id: stream.id,
          title: stream.title,
          artist: stream.id,
          votes: stream._count.upvotes,
          imageUrl: stream.smallImg || '/placeholder.svg?height=80&width=80'
        }))
      : [];
    setQueue(newQueue);
        setAllStreams(all_stream);
      }, REFRESH_INTERVAL_MS);
      return () => clearInterval(interval);
    }
    handle();
  }, []);
  /*
  useEffect(() => {
    async function handle() {
      const res = await axios.get(`/api/streams/?creatorId=${creatorId}`, { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
      const all_streams = res.data.streams;
      const newId = all_streams[0]?.extractedId;
      /*
      if (newId && prev.current !== newId) {
        prev.current = newId;
        seturl(newId);
      }
      if (prev.current === "") {
        prev.current = newId;
        seturl(newId);
      }
      const newQueue = all_streams.slice(1).map(stream => ({
        id: stream.id,
        title: stream.title,
        artist: stream.id,
        votes: stream._count.upvotes,
        imageUrl: stream.smallImg || '/placeholder.svg?height=80&width=80'
      }));
      setQueue(newQueue);

      setAllStreams(all_streams);
    }
    handle();
    console.log("this is new url", url);
  }, []);
  */


  const handleShare = (e: any) => {
    e.preventDefault();
    const shareableLink = `${window.location.host}/creator/${creatorId}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareableLink).then(() => {
        toast.success("Shareable link copied to clipboard!", {
          position: 'top-right',
          duration: 3000,
        });
      }).catch((err) => {
        console.error("Failed to copy:", err);
      });
    } else {
      console.error("Clipboard API not supported.");
    }
  }



  const playNextVideo = async () => {
    console.log("This is queue", all_streams);
    if (all_streams.length == 0) {
      console.log("No videos in queue");
      return;
    }
    const currStream = curr_state;
    console.log("Deleting stream:", currStream.id);
    const res = await axios.delete(`/api/streams/delete/?creatorId=${creatorId}`, { data: { id: currStream.id } })
    if (res.status != 200) {
      console.error("Error deleting the stream");
      return;
    }
    setAllStreams(all_streams => all_streams.filter(stream => stream.id !== currStream.id));
    const curr = all_streams[1];
    setQueue(prevQueue => prevQueue.filter(song => song.id !== curr.id));
    if (curr) {
      seturl(curr.extractedId);
      setcurrstate(curr);
      console.log("Playing next video:", curr.extractedId);
    } else {
      seturl(null);
      console.log("No more videos in queue");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/streams/?creatorId=${creatorId}`, { url: videoUrl });
      console.log(res.data);
      setQueue(prevQueue => {
        const updated = [
          ...prevQueue,
          {
            id: res.data.id,
            title: res.data.title,
            artist: res.data.title,
            votes: 0,
            imageUrl: res.data.smallImg || '/placeholder.svg?height=80&width=80'
          }
        ];
        return updated.sort((a, b) => b.votes - a.votes);
      });
      setVideoUrl('')
      setVideoId('');
      const result = await axios.get(`/api/streams/?creatorId=${creatorId}`, { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
      setAllStreams(result.data.streams);
    } catch (error) {
      console.error('Error submitting video URL:', error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVideoUrl(url)
    const id = extractVideoId(url)
    setVideoId(id)
  }

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : ''
  }


  const handleVote = async (id: string, increment: number) => {
    if (increment == 1) {
      const res = await axios.post('/api/streams/upvote', { streamId: id }, { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
      if (res.status != 201) {
        console.error("Error upvoting the song");
        return;
      }
    }
    else if (increment == -1) {
      const res = await axios.post('/api/streams/downvote', { streamId: id }, { headers: { "Authorization": `Bearer ${process.env.AUTH_SECRET}` } });
      if (res.status != 201) {
        console.error("Error downvoting the song");
        return;
      }
    }
    setQueue(prevQueue =>
      prevQueue.map(song =>
        song.id === id ? { ...song, votes: song.votes + increment } : song
      ).sort((a, b) => b.votes - a.votes)
    )
    setAllStreams(prevallStreams => prevallStreams.map(song => song.id === id ? { ...song, _count: { ...song._count, upvotes: song._count.upvotes + increment } } : song).sort((a, b) => b._count.upvotes - a._count.upvotes));
    console.log(queue)
    console.log(all_streams);
  }



  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Stream Song Voting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* submit song component */}
          <Card>
            <CardHeader>
              <CardTitle>Submit a Song</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter YouTube video URL"
                  value={videoUrl}
                  onChange={handleInputChange}
                />
                <Button type="submit" disabled={!videoId}>Submit</Button>
              </form>
              {videoId && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Voting Queue Component */}
          <Card >
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

        </div>
        {/* Currently Playing Component */}
        <>

          {!url && (
            <div className="text-center mb-4">
              <p>Loading...</p>
            </div>
          )}
          {url != null && url?.length > 0 && (
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
              <Button className='m-10 w-xl' onClick={() => playNextVideo()}>Play next</Button>
              <Button className='m-10 w-xl' onClick={(e) => handleShare(e)}>Share</Button>
            </Card>
          )}

        </>

        <Button onClick={() => signOut()}>logout</Button>
        <Toaster />
      </div>
    </div>
  )
}

