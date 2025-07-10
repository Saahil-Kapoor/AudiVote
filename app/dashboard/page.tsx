"use client"

import { useEffect, useState } from "react";
import StreamView from "../components/StreamView";
import axios from "axios";

//const REFRESH_INTERVAL_MS = 5 * 100000000;
//const creatorId = "93e85c8f-1eca-47df-a376-84a558f287d3"; 

export default function Home() {
  const [creatorId, setCreatorId] = useState<string>("");
  useEffect(() => {
    async function handle(){
      const res = await axios.get('/api/getId', {
        headers: {
          "Authorization": `Bearer ${process.env.AUTH_SECRET}`
        }
      });
      setCreatorId(res.data.id);
    }
    handle();
  }, []);
  return (
    <>
      {creatorId && creatorId.length > 0 ? (
        <div>
          <StreamView creatorId={creatorId} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

