'use client'

import React from "react"

export default function BlockContent({ blocks }: { blocks: any[] }) {
  if (!blocks || !Array.isArray(blocks)) return null

  const renderInline = (child: any): React.ReactNode => {
    if (child._type !== 'span') return null
    
    let content: React.ReactNode = child.text || ''
    
    if (child.marks && Array.isArray(child.marks)) {
      child.marks.forEach((mark: string) => {
        if (mark === 'strong') {
          content = <strong>{content}</strong>
        } else if (mark === 'em') {
          content = <em>{content}</em>
        }
      })
    }
    
    return content
  }

  return (
    <div>
      {blocks.map((block, idx) => {
        if (block._type === 'block') {
          const style = block.style || 'normal'
          const children = block.children?.map((child: any, childIdx: number) => (
            <React.Fragment key={childIdx}>{renderInline(child)}</React.Fragment>
          )) || []

          if (style === 'h1') {
            return <h1 key={idx} className="text-3xl font-semibold mt-8 mb-4 text-black dark:text-zinc-50">{children}</h1>
          } else if (style === 'h2') {
            return <h2 key={idx} className="text-2xl font-semibold mt-8 mb-4 text-black dark:text-zinc-50">{children}</h2>
          } else if (style === 'h3') {
            return <h3 key={idx} className="text-xl font-semibold mt-6 mb-3 text-black dark:text-zinc-50">{children}</h3>
          } else if (style === 'h4') {
            return <h4 key={idx} className="text-lg font-semibold mt-4 mb-2 text-black dark:text-zinc-50">{children}</h4>
          } else {
            return <p key={idx} className="mb-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">{children}</p>
          }
        } else if (block._type === 'image') {
          const imageUrl = typeof block.asset === 'string' ? block.asset : block.asset?.url
          if (!imageUrl) return null
          return (
            <div key={idx} className="my-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={block.alt || ""}
                className="w-full rounded-md"
              />
              {block.caption && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center">
                  {block.caption}
                </p>
              )}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

