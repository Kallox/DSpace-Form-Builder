'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Plus, HelpCircle, FileSpreadsheet, Lock } from 'lucide-react'
import { FormRow, FormElement } from '@/types/Form'

interface FormPreviewModalProps {
  form: FormRow[];
  formName: string;
}

export default function FormPreviewModal({ form, formName }: FormPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Filter out completely empty rows
  const activeRows = form.filter(row => row.elements && row.elements.length > 0)

  const renderPreviewField = (element: FormElement) => {
    const isRequired = element.required && element.required.trim() !== ''
    const isDisabled = element.readonly

    // Helper wrapper to style elements hidden by default in DSpace
    const isHidden = element.visibility === false

    const fieldLabel = (
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        <Label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {element.label || 'Unnamed Field'}
        </Label>
        {isRequired && <span className="text-red-500 font-bold" title="Required">*</span>}
        {isDisabled && <span title="Read Only"><Lock className="h-3 w-3 text-slate-400" /></span>}
        {isHidden && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-850 text-slate-500 font-mono font-bold flex items-center gap-1">
            <EyeOff className="h-2.5 w-2.5" /> Hidden by default
          </span>
        )}
      </div>
    )

    const hintText = element.hint ? (
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
        <HelpCircle className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
        <span>{element.hint}</span>
      </p>
    ) : null

    const vocabularyBadge = element.vocabulary ? (
      <div className="mt-1.5 flex flex-wrap gap-1">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
          Vocabulary: {element.vocabulary} {element.vocabularyClosed ? '(Closed)' : '(Open)'}
        </span>
      </div>
    ) : null

    // Determine field input component based on DSpace inputType
    let inputComponent: React.ReactNode = null

    switch (element.inputType) {
      case 'textarea':
        inputComponent = (
          <Textarea 
            placeholder={element.label || "Enter text..."} 
            disabled={isDisabled}
            className="min-h-[80px] bg-white dark:bg-slate-950" 
          />
        )
        break
      case 'dropdown':
        inputComponent = (
          <Select disabled={isDisabled}>
            <SelectTrigger className="w-full bg-white dark:bg-slate-950">
              <SelectValue placeholder={element.label ? `Select ${element.label.toLowerCase()}...` : 'Select option...'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="val1">Option 1</SelectItem>
              <SelectItem value="val2">Option 2</SelectItem>
              {element.valuePairsName && (
                <SelectItem value="val-pairs" disabled>
                  [Value Pairs: {element.valuePairsName}]
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )
        break
      case 'date':
        inputComponent = (
          <Input 
            type="date" 
            disabled={isDisabled}
            className="bg-white dark:bg-slate-950 h-10" 
          />
        )
        break
      case 'tag':
        inputComponent = (
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <Input 
                placeholder="Type tag and press Add..." 
                disabled={isDisabled}
                className="bg-white dark:bg-slate-950 h-10" 
              />
              <Button type="button" variant="secondary" size="sm" className="shrink-0 h-10" disabled={isDisabled}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-650 dark:text-slate-350">
                Sample Tag
              </span>
            </div>
          </div>
        )
        break
      case 'qualdrop_value':
        inputComponent = (
          <div className="flex gap-2">
            <Select disabled={isDisabled}>
              <SelectTrigger className="w-[130px] shrink-0 bg-white dark:bg-slate-950">
                <SelectValue placeholder="Qualifier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1">Qualifier 1</SelectItem>
                <SelectItem value="q2">Qualifier 2</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Enter value..." 
              disabled={isDisabled}
              className="flex-1 bg-white dark:bg-slate-950 h-10" 
            />
          </div>
        )
        break
      case 'series':
        inputComponent = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input 
              placeholder="Series/Report Name" 
              disabled={isDisabled}
              className="bg-white dark:bg-slate-950 h-10" 
            />
            <Input 
              placeholder="Number" 
              disabled={isDisabled}
              className="bg-white dark:bg-slate-950 h-10" 
            />
          </div>
        )
        break
      case 'onebox':
      case 'name':
      case 'link':
      default:
        inputComponent = (
          <Input 
            placeholder={element.label || "Enter value..."} 
            disabled={isDisabled}
            className="bg-white dark:bg-slate-950 h-10" 
          />
        )
        break
    }

    return (
      <div 
        key={element.id} 
        className={`flex-1 min-w-0 p-3 rounded-lg border ${
          isHidden 
            ? 'border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-955/10' 
            : 'border-transparent'
        }`}
      >
        {fieldLabel}
        {inputComponent}
        {hintText}
        {vocabularyBadge}

        {/* Repeatable field simulator */}
        {element.repeatable && (
          <button 
            type="button" 
            className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
            disabled={isDisabled}
          >
            <Plus className="h-3 w-3" /> Add more {element.label ? element.label.toLowerCase() : 'entries'}
          </button>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 gap-2 shadow-sm shrink-0 h-10 px-4"
        >
          <Eye className="h-4 w-4" /> Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[760px] max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl">
        <DialogHeader className="border-b border-slate-100 dark:border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
              <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Form Submission Preview
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Interactive mockup of how the <strong className="text-slate-700 dark:text-slate-250 font-semibold">{formName}</strong> fields appear in a deposit submission window.
          </DialogDescription>
        </DialogHeader>

        {activeRows.length > 0 ? (
          <form onSubmit={(e) => e.preventDefault()} className="py-4 space-y-6">
            {activeRows.map((row) => (
              <div 
                key={row.id} 
                className="flex flex-col md:flex-row gap-4 w-full border-b border-slate-100 dark:border-slate-850/60 pb-5 last:border-b-0 last:pb-0"
              >
                {row.elements.map(element => renderPreviewField(element))}
              </div>
            ))}
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-3">
              <FileSpreadsheet className="h-6 w-6 text-slate-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No active fields found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
              Add rows and fields in the Form Builder workspace first to see them rendered in this preview window.
            </p>
          </div>
        )}

        <DialogFooter className="border-t border-slate-100 dark:border-slate-850 pt-3">
          <Button onClick={() => setIsOpen(false)} className="bg-slate-950 dark:bg-slate-800 text-white font-medium hover:bg-slate-850 dark:hover:bg-slate-700 shadow-sm">
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
