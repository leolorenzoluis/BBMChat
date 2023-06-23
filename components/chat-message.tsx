'use client'
import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString()

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import { useLayoutEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@radix-ui/react-dialog'
import { DialogFooter } from './ui/dialog'
import { Button } from './ui/button'

export interface ChatMessageProps {
  message: Message
  append: (message: Message) => Promise<string | null | undefined>
}

export function ChatMessage({ message, append, ...props }: ChatMessageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null)
  const pdfWrapperRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    console.log(
      'pdfWrapperRef',
      pdfWrapperRef.current?.getBoundingClientRect()?.width!
    )
  }, [])

  const extractFollowUpQuestions = (str: string) => {
    const regex = /<<([^>]*)>>/g
    const matches = str.match(regex)
    if (matches) {
      return matches.map(match => match.replace(/<|>/g, '').trim())
    }
    return []
  }

  const extractCitations = (str: string) => {
    const regex = /\[([^\]]*)\]/g
    const matches = str.match(regex)
    if (matches) {
      return matches.map(match => match.replace(/\[|\]/g, '').trim())
    }
    return []
  }

  const followUpQuestions = extractFollowUpQuestions(message.content)
  const citations = extractCitations(message.content)

  return (
    <div ref={pdfWrapperRef}>
      <div
        className={cn('group relative mb-4 flex items-start md:-ml-12')}
        {...props}
      >
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
            message.role === 'user'
              ? 'bg-background'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
        </div>
        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
          <MemoizedReactMarkdown
            className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                console.log('children is', children)
                const cleanContent = message.content.replace(
                  /<<[^>]*>>|\[[^\]]*\]/g,
                  ''
                )
                return (
                  <div className="mb-2 last:mb-0">
                    {' '}
                    {cleanContent}
                    {followUpQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="bg-pink-400 rounded-3xl text-white p-1 mr-1 text-xs text-left"
                        onClick={async () => {
                          await append({
                            id: '',
                            role: 'user',
                            content: question
                          })
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == '▍') {
                    return (
                      <span className="mt-1 animate-pulse cursor-default">
                        ▍
                      </span>
                    )
                  }

                  children[0] = (children[0] as string).replace('`▍`', '▍')
                }

                const match = /language-(\w+)/.exec(className || '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              }
            }}
          >
            {message.content}
          </MemoizedReactMarkdown>
          {message.role === 'assistant' && citations.length > 0 && (
            <>
              <div className="flex flex-row items-center">
                <h4 className="text-xs font-bold mr-1">Citations:</h4>
                {citations.map((citation, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 rounded-lg text-white p-2 text-xs"
                    onClick={async () => {
                      const response = await fetch(`/api/content/${citation}`)
                      const buffer = await response.arrayBuffer()
                      const decoder = new TextDecoder('utf-8')
                      const text = decoder.decode(buffer)

                      setSelectedCitation(citation)
                      setIsDialogOpen(true)
                    }}
                  >
                    {citation}
                  </button>
                ))}
              </div>
              <ChatMessageActions message={message} />
            </>
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <div>
            <Document file={`/api/content/${selectedCitation}`}>
              <Page
                pageNumber={1}
                width={
                  pdfWrapperRef.current?.getBoundingClientRect()?.width! * 0.95
                }
              />
            </Document>
          </div>
          <DialogFooter className="items-center pt-1">
            <Button
              onClick={() => {
                setIsDialogOpen(!isDialogOpen)
              }}
            >
              Close citation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
