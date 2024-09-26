import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { validateXmlStructure } from "@/utils/xmlValidator"
import { convertXmlToJson } from "@/utils/xmlToJsonConverter"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Settings } from "lucide-react"
import { FormElement, FormRow, Form } from '@/types/Form'

interface XmlUploadModalProps {
  onUpload: (jsonForm: Form) => void,
  element: FormElement
}

export function FormElementSettingsModal({ onUpload, element }: XmlUploadModalProps) {
  const [xmlContent, setXmlContent] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = () => {
    if (validateXmlStructure(xmlContent)) {
      try {
        const jsonForm = convertXmlToJson(xmlContent);
        onUpload(jsonForm);
        setIsOpen(false);
        setXmlContent('');
        setError(null);
      } catch (err) {
        setError("Error al convertir XML a JSON. Por favor, verifica el formato." + err);
      }
    } else {
      setError("El XML no tiene la estructura correcta. Por favor, verifica el formato.");
    }
  }

  const handleElementSettingsClick = () => {
    console.log("Element settings clicked")
    console.log(element)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => handleElementSettingsClick()}><Settings className="h-4 w-4"/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Advance input settings</DialogTitle>
          <DialogDescription>
            Configure optional input fields
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={xmlContent}
          onChange={(e) => {
            setXmlContent(e.target.value)
            setError(null)
          }}
          placeholder="Pega tu código XML aquí"
          className="min-h-[200px]"
        />
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button onClick={handleUpload}>Subir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}