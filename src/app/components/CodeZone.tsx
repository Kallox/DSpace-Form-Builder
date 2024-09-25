import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface JSONViewerProps {
  data: {
    key: string;
  };
}

export function CodeZone({ data }: JSONViewerProps) {
  const jsonString = JSON.stringify(data, null, 2)

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">Form JSON</h2>
      <div className="border rounded overflow-hidden">
        <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{margin: 0}}>
          {jsonString}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}