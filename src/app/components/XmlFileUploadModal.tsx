"use client"

import { Button } from "@/components/ui/button"
import { validateXmlFileStructure } from '@/utils/xmlValidator'
import { convertXmlFileToJson } from '@/utils/xmlToJsonConverter'
import { Form } from "@/types/Form"
import { ValuePairGroup } from "@/types/ValuePairs"
import { FileUp } from "lucide-react"

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
        alert("The XML does not have the correct structure. Please check the format..")
      }
    } else {
      alert("Select a valid XML file.")
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      <Button
        onClick={() => document.getElementById('fileInput')?.click()}
        className="w-[200px]"
      >
        <FileUp className="h-4 w-4 mr-2"/>Upload XML file
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