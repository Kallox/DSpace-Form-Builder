'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, FileSpreadsheet, Plus } from "lucide-react"
import { Form, FormRow } from '@/types/Form'
import FormBuilder from './FormBuilder'

interface FormListProps {
  forms: Form[];
  onAddForm: () => void;
  onUpdateForm: (updatedForm: Form) => void;
  onDeleteForm: (formId: string) => void;
}

export default function FormList({ forms, onAddForm, onUpdateForm, onDeleteForm }: FormListProps) {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(forms[0]?.id || null)

  const handleSelectForm = (formId: string) => {
    setSelectedFormId(formId)
  }

  const handleFormChange = (newRows: FormRow[]) => {
    const updatedForm = forms.find(form => form.id === selectedFormId)
    if (updatedForm) {
      onUpdateForm({ ...updatedForm, rows: newRows })
    }
  }

  const handleFormNameChange = (newName: string) => {
    const updatedForm = forms.find(form => form.id === selectedFormId)
    if (updatedForm) {
      onUpdateForm({ ...updatedForm, name: newName })
    }
  }

  const handleDeleteForm = (e: React.MouseEvent, formId: string) => {
    e.stopPropagation() // Prevent selecting the form right before deleting it
    onDeleteForm(formId)
    if (selectedFormId === formId) {
      setSelectedFormId(null)
    }
  }

  const handleUploadForm = (form: Form) => {
    const updatedForm = forms.find(form => form.id === selectedFormId)
    if (updatedForm) {
      onUpdateForm({ ...updatedForm, rows: form.rows, name: form.name })
    }
  }

  const selectedForm = forms.find(form => form.id === selectedFormId)

  return (
    <div className="flex h-full min-h-[calc(100vh-14rem)] divide-x divide-slate-200 dark:divide-slate-800">
      {/* Sidebar listing */}
      <div className="w-1/4 min-w-[240px] max-w-[320px] bg-slate-50/50 dark:bg-slate-900/30 p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-850">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Forms
            </h2>
            <Button 
              onClick={onAddForm} 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg"
              title="Add Form"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ul className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
            {forms.map((form) => {
              const isSelected = selectedFormId === form.id
              return (
                <li 
                  key={form.id} 
                  className={`group p-2.5 rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                    isSelected 
                      ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-l-2 border-purple-500 pl-2 font-medium' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-350 border-l-2 border-transparent'
                  }`} 
                  onClick={() => handleSelectForm(form.id)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileSpreadsheet className={`h-4 w-4 shrink-0 ${isSelected ? 'text-purple-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                    <span className="truncate text-sm">{form.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 h-7 w-7 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-opacity" 
                    onClick={(e) => handleDeleteForm(e, form.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>

        <Button 
          onClick={onAddForm} 
          className="w-full mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white gap-2 h-10 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" /> Add New Form
        </Button>
      </div>

      {/* Main Form Builder Area */}
      <div className="flex-1 overflow-x-auto">
        {selectedForm ? (
          <FormBuilder 
            form={selectedForm.rows}
            formName={selectedForm.name}
            onFormChange={handleFormChange}
            onFormNameChange={handleFormNameChange}
            onFormUpload={handleUploadForm}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[500px]">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No form selected</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Select an existing form from the sidebar, create a new one, or upload an XML file to start designing.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}