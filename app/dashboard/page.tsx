"use client"

import { useEffect, useState } from "react";
import StreamView from "../components/StreamView";
import { useRouter,usePathname } from 'next/navigation';
import axios from "axios";
import { useSession } from "next-auth/react";

//const REFRESH_INTERVAL_MS = 5 * 100000000;
//const creatorId = "93e85c8f-1eca-47df-a376-84a558f287d3"; 

export default function Home() {
  const [creatorId, setCreatorId] = useState<string>("");
  useEffect(() => {
    async function handle() {
      const res = await axios.get('/api/getId');
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

