import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'

import { Analytics } from '@vercel/analytics/react'
export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()

  return (
    <>
      <Analytics />
      <Chat id={id} />
    </>
  )
}
