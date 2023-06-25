import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight, SquigglyLines } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Exploring Executive Orders: A Deeper Understanding',
    message: `What are sections of executive order 10?`
  },
  {
    heading:
      "Restructuring President BBM's Speech: Key Takeaways and Highlights",
    message: 'What are the key highlights of his 2022 SONA?'
  },
  {
    heading: 'Are OFWs affected by the new executive order?',
    message: `Are there any executive orders specifically related to overseas Filipino workers (OFWs)?`
  },
  {
    heading: 'Executive Orders Shaping Our Cultural Landscape',
    message: `Which executive orders have had an impact on our culture?`
  },
  {
    heading: 'Check if an agency is affected by any executive orders',
    message: `Are there any recent executive orders that have affected the Department of Environment and Natural Resources (DENR)?`
  },
  {
    heading: 'Economy and tax rates',
    message: `Are there any executive orders that have had an impact on the economy and tax rates?`
  },
  {
    heading: 'What is build build build program?',
    message: `What is build build build program?`
  },
  {
    heading: 'Verify Impact of Topic of Interest',
    message: `Have cockfights been affected by any changes or regulations?`
  },
  {
    heading: 'Jejemon or Filipino language is supported!',
    message: `4n0 p0whz un6 c0ckf!ghts s4 3x3cutiv3 0rd3rs?`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 ">
        <h1 className="mb-2 font-semibold text-4xl ">
          Introducing{' '}
          <span className="relative whitespace-nowrap text-red-600 ">
            <SquigglyLines />
            <span className="relative">BBM Chatbot</span>
          </span>
        </h1>

        <p className="leading-normal text-muted-foreground">
          You can start a conversation related to SONA 2022 or Executive Orders.
          As of today, there are 31 executive orders you can search around. Try
          the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base text-left "
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
