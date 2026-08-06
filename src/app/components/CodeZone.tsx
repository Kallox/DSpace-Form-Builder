import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyButton } from './CopyButton'
import { FormRow } from '@/types/Form'
import { ValuePairGroup } from '@/types/ValuePairs'
import { FileCode } from 'lucide-react'

interface JSONViewerProps {
  data: FormRow[] | ValuePairGroup[];
  title: string;
}

const formJsonToXml = (json: FormRow[] | ValuePairGroup[], title: string): string => {
  let xml = ''
  xml += `<form name="${title}">\n`
  for (const key in json) {
    xml += '\t<row>\n'
    for (const innerKey in json[key]['elements']) {
      xml += `\t\t<field>\n`
      xml += `\t\t\t<dc-schema>${json[key]['elements'][innerKey]['schema']}</dc-schema>\n`
      xml += `\t\t\t<dc-element>${json[key]['elements'][innerKey]['element']}</dc-element>\n`
      if (json[key]['elements'][innerKey]['qualifier'] !== '')
        xml += `\t\t\t<dc-qualifier>${json[key]['elements'][innerKey]['qualifier']}</dc-qualifier>\n`
      xml += `\t\t\t<label>${json[key]['elements'][innerKey]['label']}</label>\n`
      if (json[key]['elements'][innerKey]['valuePairsName'] !== '')
        xml += `\t\t\t<input-type value-pairs-name="${json[key]['elements'][innerKey]['valuePairsName']}">${json[key]['elements'][innerKey]['inputType']}</input-type>\n`
      else
        xml += `\t\t\t<input-type>${json[key]['elements'][innerKey]['inputType']}</input-type>\n`
      xml += `\t\t\t<repeatable>${json[key]['elements'][innerKey]['repeatable']}</repeatable>\n`
      if (json[key]['elements'][innerKey]['required'] !== '')
        xml += `\t\t\t<required>${json[key]['elements'][innerKey]['required']}</required>\n`
      else
        xml += `\t\t\t<required />\n`
      if (json[key]['elements'][innerKey]['hint'] !== '')
        xml += `\t\t\t<hint>${json[key]['elements'][innerKey]['hint']}</hint>\n`
      else
        xml += `\t\t\t<hint />\n`
      if (json[key]['elements'][innerKey]['style'] !== '')
        xml += `\t\t\t<style>${json[key]['elements'][innerKey]['style']}</style>\n`
      if (json[key]['elements'][innerKey]['typeBind'] !== '')
        xml += `\t\t\t<type-bind>${json[key]['elements'][innerKey]['typeBind']}</type-bind>\n`
      if (json[key]['elements'][innerKey]['regex'] !== '')
        xml += `\t\t\t<regex>${json[key]['elements'][innerKey]['regex']}</regex>\n`
      if (json[key]['elements'][innerKey]['vocabulary'] !== '')
        if (json[key]['elements'][innerKey]['vocabularyClosed'])
          xml += `\t\t\t<vocabulary closed="true">${json[key]['elements'][innerKey]['vocabulary']}</vocabulary>\n`
        else
          xml += `\t\t\t<vocabulary>${json[key]['elements'][innerKey]['vocabulary']}</vocabulary>\n`
      if (!json[key]['elements'][innerKey]['visibility'])
        xml += `\t\t\t<visibility>${json[key]['elements'][innerKey]['visibility']}</visibility>\n`
      if (json[key]['elements'][innerKey]['readonly'])
        xml += `\t\t\t<readonly>${json[key]['elements'][innerKey]['readonly']}</readonly>\n`
      xml += `\t\t</field>\n`
    }
    xml += '\t</row>\n'
  }
  xml += '</form>'
  return xml
}

const pairJsonToXml = (json: FormRow[] | ValuePairGroup[]): string => {
  let xml = ''
  for (const key in json) {
    const name = json[key]['name']
    xml += `<value-pairs value-pairs-name="${name}" dc-term="${name}">\n`
    for (const innerKey in json[key]['pairs']) {
      xml += `\t<pair>\n`
      xml += `\t\t<displayed-value>${json[key]['pairs'][innerKey]['displayedValue']}</displayed-value>\n`
      xml += `\t\t<stored-value>${json[key]['pairs'][innerKey]['storedValue']}</stored-value>\n`
      xml += `\t</pair>\n`
    }
    xml += `</value-pairs>\n`
  }
  return xml
}

export function CodeZone({ data, title }: JSONViewerProps) {
  const dataType = data[0].hasOwnProperty('elements') ? 'form' : 'value-pairs'
  const xml = dataType === "form" ? formJsonToXml(data, title) : pairJsonToXml(data)
  const filename = dataType === "form" ? `${title || 'form'}.xml` : 'value-pairs.xml'
  
  return (
    <div className="space-y-3 mt-6">
      <div className="flex items-center gap-2">
        <FileCode className="h-5 w-5 text-purple-500" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Generated XML Preview
        </h3>
      </div>
      
      {/* Editor Mockup Wrapper */}
      <div className="rounded-xl overflow-hidden border border-slate-700/70 bg-slate-950 shadow-2xl relative">
        {/* Editor Topbar */}
        <div className="h-10 px-4 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between select-none">
          {/* Mock dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {/* File Label */}
          <span className="text-xs font-mono text-slate-400 max-w-[200px] truncate">
            {filename}
          </span>
          <div className="w-12" /> {/* spacer balance */}
        </div>

        {/* Syntax Highlighter Content */}
        <div className="relative text-sm max-h-[450px] overflow-auto">
          <CopyButton code={xml} />
          <SyntaxHighlighter 
            language="xml" 
            style={vscDarkPlus} 
            customStyle={{
              margin: 0, 
              background: 'transparent',
              padding: '1.25rem',
              fontFamily: 'var(--font-geist-mono), Courier, monospace',
            }} 
            showLineNumbers
          >
            {xml}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}