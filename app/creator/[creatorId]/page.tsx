import StreamView from '@/app/components/StreamView'
import React from 'react'

export default function({
    params: {creatorId}
}){
  return (
    <div>
        <StreamView creatorId={creatorId} />
    </div>
  )
}
