'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import FormBuilder from "./components/FormBuilder"
import ValuePairsBuilder from "./components/ValuePairsBuilder"
import { FormRow } from '@/types/Form'
import { ValuePairGroup } from '@/types/ValuePairs'

export default function Home() {
  const [activeBuilder, setActiveBuilder] = useState<'form' | 'valuePairs'>('form')
  const [formBuilderState, setFormBuilderState] = useState<{
    form: FormRow[];
    formName: string;
  }>({
    form: [],
    formName: 'Form Name'
  })
  const [valuePairsBuilderState, setValuePairsBuilderState] = useState<{
    valuePairGroups: ValuePairGroup[];
  }>({
    valuePairGroups: []
  })

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Form Builder</h1>
      <div className="flex space-x-4 mb-4">
        <Button
          onClick={() => setActiveBuilder('form')}
          variant={activeBuilder === 'form' ? 'default' : 'outline'}
        >
          Form Builder
        </Button>
        <Button
          onClick={() => setActiveBuilder('valuePairs')}
          variant={activeBuilder === 'valuePairs' ? 'default' : 'outline'}
        >
          Value Pairs Builder
        </Button>
      </div>
      {activeBuilder === 'form' ? (
        <FormBuilder 
          form={formBuilderState.form}
          formName={formBuilderState.formName}
          onFormChange={(newForm) => setFormBuilderState(prev => ({ ...prev, form: newForm }))}
          onFormNameChange={(newName) => setFormBuilderState(prev => ({ ...prev, formName: newName }))}
        />
      ) : (
        <ValuePairsBuilder 
          valuePairGroups={valuePairsBuilderState.valuePairGroups}
          onValuePairsChange={(newValuePairGroups) => setValuePairsBuilderState({ valuePairGroups: newValuePairGroups })}
        />
      )}
    </div>
  )
}