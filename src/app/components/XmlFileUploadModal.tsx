"use client"

import { Button } from "@/components/ui/button"
import { validateXmlFileStructure } from '@/utils/xmlValidator'
import { convertXmlFileToJson } from '@/utils/xmlToJsonConverter'
import { Form } from "@/types/Form"
import { ValuePairGroup } from "@/types/ValuePairs"

interface XmlFileUploadModalProps {
    updateForms: (jsonForm: Form[]) => void
    updateValuePairs: (newValuePairGroups: ValuePairGroup[]) => void;
  }

export default function XmlFileUploadModal({ updateForms, updateValuePairs }: XmlFileUploadModalProps) {

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/xml") {
      const content = await file.text()
      if (validateXmlFileStructure(content)){
        const jsonFile = convertXmlFileToJson(content)
        updateForms(jsonFile.forms)
        updateValuePairs(jsonFile.valuePairs)
      } else {
        alert("El archivo XML seleccionado no tiene la estructura correcta. Por favor, revisa el formato.")
      }
    } else {
      alert("Por favor, selecciona un archivo XML válido.")
    }
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto p-4">
      <Button
        onClick={() => document.getElementById('fileInput')?.click()}
        className="w-full"
      >
        Seleccionar archivo XML
      </Button>
      <input
        id="fileInput"
        type="file"
        accept=".xml"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}