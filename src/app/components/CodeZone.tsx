import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyButton } from './CopyButton'
import { FormRow } from '@/types/Form'
import { ValuePairGroup } from '@/types/ValuePairs'

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

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-2">XML Code</h2>
      <div className="border rounded overflow-hidden relative">
        <CopyButton code={xml} />
        <SyntaxHighlighter language="xml" style={vscDarkPlus} customStyle={{margin: 0}} showLineNumbers>
          {xml}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}