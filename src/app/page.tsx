'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import FormList from "./components/FormList"
import ValuePairsBuilder from "./components/ValuePairsBuilder"
import { Form } from '@/types/Form'
import { ValuePairGroup } from '@/types/ValuePairs'

export default function Home() {
  const [activeBuilder, setActiveBuilder] = useState<'forms' | 'valuePairs'>('forms')
  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      name: 'Sample Form',
      rows: []
    }
  ])
  const [valuePairsBuilderState, setValuePairsBuilderState] = useState<{
    valuePairGroups: ValuePairGroup[];
  }>({
    valuePairGroups: []
  })

  const handleUpdateForm = (updatedForm: Form) => {
    setForms(prevForms => prevForms.map(form => 
      form.id === updatedForm.id ? updatedForm : form
    ))
  }

  const addNewForm = () => {
    const newForm: Form = {
      id: Date.now().toString(),
      name: 'New Form',
      rows: []
    }
    setForms(prevForms => [...prevForms, newForm])
  }

  const deleteForm = (formId: string) => {
    setForms(prevForms => prevForms.filter(form => form.id !== formId))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Builder</h1>
      <div className="flex space-x-4 mb-4">
        <Button
          onClick={() => setActiveBuilder('forms')}
          variant={activeBuilder === 'forms' ? 'default' : 'outline'}
        >
          Forms
        </Button>
        <Button
          onClick={() => setActiveBuilder('valuePairs')}
          variant={activeBuilder === 'valuePairs' ? 'default' : 'outline'}
        >
          Value Pairs Builder
        </Button>
      </div>
      {activeBuilder === 'forms' && (
        <FormList 
          forms={forms}
          onAddForm={addNewForm}
          onUpdateForm={handleUpdateForm}
          onDeleteForm={deleteForm}
        />
      )}
      {activeBuilder === 'valuePairs' && (
        <ValuePairsBuilder 
          valuePairGroups={valuePairsBuilderState.valuePairGroups}
          onValuePairsChange={(newValuePairGroups) => setValuePairsBuilderState({ valuePairGroups: newValuePairGroups })}
        />
      )}
    </div>
  )
}