'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2 } from "lucide-react"
import { Form, FormRow } from '@/types/Form'
import FormBuilder from './FormBuilder'

interface FormListProps {
  forms: Form[];
  onAddForm: () => void;
  onUpdateForm: (updatedForm: Form) => void;
  onDeleteForm: (formId: string) => void;
}

export default function FormList({ forms, onAddForm, onUpdateForm, onDeleteForm }: FormListProps) {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

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

  const handleDeleteForm = (formId: string) => {
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
    <div className="flex h-full">
      <div className="w-1/6 bg-gray-100 p-4 overflow-y-auto space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-2">Your Forms</h2>
          <Button onClick={onAddForm} className="flex items-center">
            <PlusCircle className="h-4 w-4" /> Add Form
          </Button>
        </div>
        <ul className="space-y-2">
          {forms.map((form) => (
            <li key={form.id} className={`p-2 rounded cursor-pointer flex justify-between content-center ${selectedFormId === form.id ? 'bg-blue-100' : 'bg-white'}`} onClick={() => handleSelectForm(form.id)}>
              <span>{form.name}</span>
              <Button variant="destructive" className="flex items-center" onClick={() => handleDeleteForm(form.id)}><Trash2 className="h-4 w-4" /></Button>
            </li>
          ))}
        </ul>
        <Button onClick={onAddForm} className="w-full">
          Add New Form
        </Button>
        </div>
        {selectedForm && (
          <div className="w-5/6">
            <FormBuilder 
              form={selectedForm.rows}
              formName={selectedForm.name}
              onFormChange={handleFormChange}
              onFormNameChange={handleFormNameChange}
              onFormUpload={handleUploadForm}
            />
          </div>
        )}
      
    </div>
  )
}