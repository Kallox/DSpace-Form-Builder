import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react"
import { FormElement } from '@/types/Form'

interface XmlUploadModalProps {
  onSave: (jsonForm: FormElement) => void,
  element: FormElement
}

export function FormElementSettingsModal({ onSave, element }: XmlUploadModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [formElement, setFormElement] = useState<FormElement>(element)

  const handleSave = () => {
    onSave(formElement)
    setIsOpen(false)
  }

  const handleElementSettingsClick = () => {
    setFormElement(element)
  }

  const handlePropertyChange = (property: string, value: string | boolean) => {
    setFormElement({...formElement, [property]: value})
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => handleElementSettingsClick()}><Settings className="h-4 w-4"/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Advance input settings</DialogTitle>
          <DialogDescription>
            Configure optional input fields
          </DialogDescription>
        </DialogHeader>
        <div className="w-full p-4 border rounded-md mb-4 bg-white">
          <div className="flex flex-col flex-wrap items-center space-y-4">
            <div className="w-full">
              <Label htmlFor={`${element.id}-schema`} className="sr-only">Schema</Label>
              <Input
                id={`${element.id}-style`}
                value={formElement.style}
                onChange={(e) => handlePropertyChange('style', e.target.value)}
                className="w-full"
                placeholder="Style"
              />
            </div>
            <div className="w-full">
              <Label htmlFor={`${element.id}-typeBind`} className="sr-only">typeBind</Label>
              <Input
                id={`${element.id}-typeBind`}
                value={formElement.typeBind}
                onChange={(e) => handlePropertyChange('typeBind', e.target.value)}
                className="w-full"
                placeholder="Type Bind"
              />
            </div>
            <div className="w-full">
              <Label htmlFor={`${element.id}-regex`} className="sr-only">regex</Label>
              <Input
                id={`${element.id}-regex`}
                value={formElement.regex}
                onChange={(e) => handlePropertyChange('regex', e.target.value)}
                className="w-full"
                placeholder="Regex"
              />
            </div>
            <div className="w-full">
              <Label htmlFor={`${element.id}-vocabulary`} className="sr-only">Vocabulary</Label>
              <Input
                id={`${element.id}-vocabulary`}
                value={formElement.vocabulary}
                onChange={(e) => handlePropertyChange('vocabulary', e.target.value)}
                className="w-full"
                placeholder="Vocabulary"
              />
            </div>
            <div className="w-full flex items-center space-x-2">
              <Checkbox
                id={`${element.id}-vocabularyClosed`}
                checked={formElement.vocabularyClosed}
                onCheckedChange={(checked) => handlePropertyChange('vocabularyClosed', checked)}
              />
              <Label htmlFor={`${element.id}-vocabularyClosed`} className="text-sm">vocabularyClosed</Label>
            </div>
            <div className="w-full flex items-center space-x-2">
              <Checkbox
                id={`${element.id}-visibility`}
                checked={formElement.visibility}
                onCheckedChange={(checked) => handlePropertyChange('visibility', checked)}
              />
              <Label htmlFor={`${element.id}-visibility`} className="text-sm">Visibility</Label>
            </div>
            <div className="w-full flex items-center space-x-2">
              <Checkbox
                id={`${element.id}-readonly`}
                checked={formElement.readonly}
                onCheckedChange={(checked) => handlePropertyChange('readonly', checked)}
              />
              <Label htmlFor={`${element.id}-readonly`} className="text-sm">Read Only</Label>
            </div>
            <div className="w-full">
              <Label htmlFor={`${element.id}-valuePairsName`} className="sr-only">Value Pairs Name</Label>
              <Input
                id={`${element.id}-valuePairsName`}
                value={formElement.valuePairsName}
                onChange={(e) => handlePropertyChange('valuePairsName', e.target.value)}
                className="w-full"
                placeholder="Value Pairs Name"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}