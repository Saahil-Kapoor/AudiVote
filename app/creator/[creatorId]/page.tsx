
"use client"
import StreamView from '@/app/components/StreamView'
import React from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react';

import { use } from 'react';

type Params = { creatorId: string };


export default function CreatorStreamPage({ params }: { params: Promise<Params> }) {
  const { creatorId } = use(params);
  const {status} = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); 
    }
  }, [status]);

  if (status === 'loading') {
    return <p>Loading…</p>;
  }
  return (
    <div>
      <StreamView creatorId={creatorId} />
    </div>
  )
}
