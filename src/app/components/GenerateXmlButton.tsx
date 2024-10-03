import React from 'react'
import { Button } from '@/components/ui/button';
import { Form } from '@/types/Form'
import { ValuePairGroup } from '@/types/ValuePairs'
import { Download } from 'lucide-react';

interface GenerateXmlButtonProps {
  forms: Form[];
  valuePairs: ValuePairGroup[];
}

const formJsonToXml = (json: Form[]): string => {
  let xml = ''
  for (const form in json) {
    const title = json[form]['name']
    xml += `    <form name="${title}">\n`
    for (const row in json[form]['rows']) {
        xml += `      <row>\n`
        for (const element in json[form]['rows'][row]['elements']) {
            xml += `        <field>\n`
            xml += `          <dc-schema>${json[form]['rows'][row]['elements'][element]['schema']}</dc-schema>\n`
            xml += `          <dc-element>${json[form]['rows'][row]['elements'][element]['element']}</dc-element>\n`
            if (json[form]['rows'][row]['elements'][element]['qualifier'] !== '')
              xml += `          <dc-qualifier>${json[form]['rows'][row]['elements'][element]['qualifier']}</dc-qualifier>\n`
            xml += `          <label>${json[form]['rows'][row]['elements'][element]['label']}</label>\n`
            if (json[form]['rows'][row]['elements'][element]['valuePairsName'] !== '')
              xml += `          <input-type value-pairs-name="${json[form]['rows'][row]['elements'][element]['valuePairsName']}">${json[form]['rows'][row]['elements'][element]['inputType']}</input-type>\n`
            else
              xml += `          <input-type>${json[form]['rows'][row]['elements'][element]['inputType']}</input-type>\n`
            xml += `          <repeatable>${json[form]['rows'][row]['elements'][element]['repeatable']}</repeatable>\n`
            if (json[form]['rows'][row]['elements'][element]['required'] !== '')
              xml += `          <required>${json[form]['rows'][row]['elements'][element]['required']}</required>\n`
            else
              xml += `          <required />\n`
            if (json[form]['rows'][row]['elements'][element]['hint'] !== '')
              xml += `          <hint>${json[form]['rows'][row]['elements'][element]['hint']}</hint>\n`
            else
              xml += `          <hint />\n`
            if (json[form]['rows'][row]['elements'][element]['style'] !== '')
              xml += `          <style>${json[form]['rows'][row]['elements'][element]['style']}</style>\n`
            if (json[form]['rows'][row]['elements'][element]['typeBind'] !== '')
              xml += `          <type-bind>${json[form]['rows'][row]['elements'][element]['typeBind']}</type-bind>\n`
            if (json[form]['rows'][row]['elements'][element]['regex'] !== '')
              xml += `          <regex>${json[form]['rows'][row]['elements'][element]['regex']}</regex>\n`
            if (json[form]['rows'][row]['elements'][element]['vocabulary'] !== '')
              if (json[form]['rows'][row]['elements'][element]['vocabularyClosed'])
                xml += `          <vocabulary closed="true">${json[form]['rows'][row]['elements'][element]['vocabulary']}</vocabulary>\n`
              else
                xml += `          <vocabulary>${json[form]['rows'][row]['elements'][element]['vocabulary']}</vocabulary>\n`
            if (!json[form]['rows'][row]['elements'][element]['visibility'])
              xml += `          <visibility>${json[form]['rows'][row]['elements'][element]['visibility']}</visibility>\n`
            if (json[form]['rows'][row]['elements'][element]['readonly'])
              xml += `          <readonly>${json[form]['rows'][row]['elements'][element]['readonly']}</readonly>\n`
            xml += `        </field>\n`
        }
        xml += `      </row>\n`
    }
    xml += `    </form>\n`
  }
  return xml
}

const generateXml = (formsXml: string, valuePairsXml: string): string => {
    let xml = ''
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<!DOCTYPE input-forms SYSTEM "submission-forms.dtd">\n'
    xml += '<input-forms>\n'
    xml += '  <form-definitions>\n'
    xml += `${formsXml}`
    xml += '  </form-definitions>\n'
    xml += '  <value-pairs-definitions>\n'
    xml += `${valuePairsXml}`
    xml += '  </value-pairs-definitions>\n'
    xml += '</input-forms>'

    return xml
}

const pairJsonToXml = (json: ValuePairGroup[]): string => {
  let xml = ''
  for (const key in json) {
    const name = json[key]['name']
    xml += `    <value-pairs value-pairs-name="${name}" dc-term="${name}">\n`
    for (const innerKey in json[key]['pairs']) {
      xml += `      <pair>\n`
      xml += `        <displayed-value>${json[key]['pairs'][innerKey]['displayedValue']}</displayed-value>\n`
      xml += `        <stored-value>${json[key]['pairs'][innerKey]['storedValue']}</stored-value>\n`
      xml += `      </pair>\n`
    }
    xml += `    </value-pairs>\n`
  }
  return xml
}

const handleDownload = (forms, valuePairs) => {
    const formsXml = formJsonToXml(forms)
    const valuePairsXml = pairJsonToXml(valuePairs)
    const xml = generateXml(formsXml, valuePairsXml)
    const blob = new Blob([xml], { type: 'application/xml' })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'submission-forms.xml'

    // Añadir el enlace al documento, hacer clic en él y luego eliminarlo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Liberar la URL del objeto
    URL.revokeObjectURL(url)
  }

export function GenerateXmlButton({ forms, valuePairs }: GenerateXmlButtonProps) {
  
  return (
    <Button onClick={() => handleDownload(forms, valuePairs)}>
      <Download className="mr-2 h-4 w-4" /> Download XML
    </Button>
  )
}