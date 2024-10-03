'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import FormList from "./components/FormList"
import ValuePairsBuilder from "./components/ValuePairsBuilder"
import XmlFileUploadModal from "./components/XmlFileUploadModal"
import { Form } from '@/types/Form'
import { ValuePairGroup } from '@/types/ValuePairs'
import Link from 'next/link'

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
    <div className="container mx-auto p-4 pt-0">
      <header className="flex justify-between bg-gray-100 p-4 align-middle">
        <div className="inline-flex gap-1 w-[700px]">
          <h1 className="text-2xl font-bold">Form Builder</h1>
          <XmlFileUploadModal updateForms={setForms} updateValuePairs={(newValuePairGroups) => setValuePairsBuilderState({ valuePairGroups: newValuePairGroups })}/>
        </div>
        <Button size="icon" className="rounded-full">
          <Link href="https://github.com/Kallox/DSpace-Form-Builder" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-github-filled" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z" strokeWidth="0" fill="currentColor" />
            </svg>
          </Link>
        </Button>
      </header>
      <div className="flex space-x-4 mb-4 pt-4">
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