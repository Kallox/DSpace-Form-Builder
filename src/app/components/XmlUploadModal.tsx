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
import { Form } from '@/types/Form'

interface XmlUploadModalProps {
  onUpload: (jsonForm: Form) => void
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
        setError("Error converting XML to JSON. Please check the format." + err);
      }
    } else {
      setError("The XML does not have the correct structure. Please check the format.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Upload Form</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload XML Form</DialogTitle>
          <DialogDescription>
            Paste your XML code into the text field below.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={xmlContent}
          onChange={(e) => {
            setXmlContent(e.target.value)
            setError(null)
          }}
          placeholder="Paste your XML code here"
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
          <Button onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}