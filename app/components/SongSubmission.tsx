'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prismaClient } from '@/app/lib/db'
import axios from 'axios'


export default function SongSubmission() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoId, setVideoId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      const res = await axios.post('/api/streams', { url: videoUrl });
      e.preventDefault();
      console.log(res.data.message);
      console.log('Submitted:', videoUrl);
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


  return (
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
  )
}

