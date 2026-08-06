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
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => handleElementSettingsClick()}
          className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          title="Advanced settings"
        >
          <Settings className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Advanced Field Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Configure optional and validation fields for the DSpace schema element.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full p-5 border border-slate-200 dark:border-slate-800/80 rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-5">
          {/* Main settings grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor={`${element.id}-style`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Style / Theme class
              </Label>
              <Input
                id={`${element.id}-style`}
                value={formElement.style || ''}
                onChange={(e) => handlePropertyChange('style', e.target.value)}
                className="h-9 text-sm"
                placeholder="e.g. styleName"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${element.id}-typeBind`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Type Bind
              </Label>
              <Input
                id={`${element.id}-typeBind`}
                value={formElement.typeBind || ''}
                onChange={(e) => handlePropertyChange('typeBind', e.target.value)}
                className="h-9 text-sm"
                placeholder="e.g. Article, Book"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${element.id}-regex`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Regex Validation Pattern
              </Label>
              <Input
                id={`${element.id}-regex`}
                value={formElement.regex || ''}
                onChange={(e) => handlePropertyChange('regex', e.target.value)}
                className="h-9 text-sm font-mono"
                placeholder="e.g. ^[0-9]{4}$"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${element.id}-valuePairsName`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Value Pairs Name
              </Label>
              <Input
                id={`${element.id}-valuePairsName`}
                value={formElement.valuePairsName || ''}
                onChange={(e) => handlePropertyChange('valuePairsName', e.target.value)}
                className="h-9 text-sm"
                placeholder="e.g. common_iso_languages"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor={`${element.id}-vocabulary`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Controlled Vocabulary URL/Name
              </Label>
              <Input
                id={`${element.id}-vocabulary`}
                value={formElement.vocabulary || ''}
                onChange={(e) => handlePropertyChange('vocabulary', e.target.value)}
                className="h-9 text-sm"
                placeholder="e.g. srsc (Standard Subject Categories)"
              />
            </div>
          </div>

          {/* Toggle/Checkboxes section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2.5">
              <Checkbox
                id={`${element.id}-vocabularyClosed`}
                checked={formElement.vocabularyClosed || false}
                onCheckedChange={(checked) => handlePropertyChange('vocabularyClosed', !!checked)}
              />
              <Label htmlFor={`${element.id}-vocabularyClosed`} className="text-sm font-medium text-slate-650 dark:text-slate-350 cursor-pointer select-none">
                Closed Vocabulary
              </Label>
            </div>
            <div className="flex items-center space-x-2.5">
              <Checkbox
                id={`${element.id}-visibility`}
                checked={formElement.visibility !== false} // defaults to true if undefined
                onCheckedChange={(checked) => handlePropertyChange('visibility', !!checked)}
              />
              <Label htmlFor={`${element.id}-visibility`} className="text-sm font-medium text-slate-650 dark:text-slate-350 cursor-pointer select-none">
                Visible by default
              </Label>
            </div>
            <div className="flex items-center space-x-2.5">
              <Checkbox
                id={`${element.id}-readonly`}
                checked={formElement.readonly || false}
                onCheckedChange={(checked) => handlePropertyChange('readonly', !!checked)}
              />
              <Label htmlFor={`${element.id}-readonly`} className="text-sm font-medium text-slate-650 dark:text-slate-350 cursor-pointer select-none">
                Read Only
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="h-10">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-500 text-white font-medium h-10 px-5 shadow-sm">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}