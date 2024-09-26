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
import { AlertCircle } from "lucide-react"

interface FormElement {
  id: string;
  schema: string;
  element: string;
  qualifier: string;
  label: string;
  inputType: string;
  repeatable: boolean;
  required: string;
  hint: string;
}

interface FormRow {
  id: string;
  elements: FormElement[];
}

interface XmlUploadModalProps {
  onUpload: (jsonForm: FormRow[]) => void
}

export function XmlUploadModal({ onUpload }: XmlUploadModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Subir formulario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subir formulario XML</DialogTitle>
          <DialogDescription>
            Pega tu código XML en el campo de texto a continuación.
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