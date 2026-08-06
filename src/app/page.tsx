'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import FormList from "./components/FormList"
import ValuePairsBuilder from "./components/ValuePairsBuilder"
import XmlFileUploadModal from "./components/XmlFileUploadModal"
import { Form } from '@/types/Form'
import { ValuePairGroup } from '@/types/ValuePairs'
import Link from 'next/link'
import { GenerateXmlButton } from './components/GenerateXmlButton'
import { Sun, Moon, FileText, Code } from 'lucide-react'

export default function Home() {
  const [activeBuilder, setActiveBuilder] = useState<'forms' | 'valuePairs'>('forms')
  const [isDark, setIsDark] = useState(false)
  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      name: 'Sample Form',
      rows: [
        {
          id: 'row-1',
          elements: [
            {
              id: 'title',
              schema: 'dc',
              element: 'title',
              qualifier: '',
              label: 'Title',
              inputType: 'onebox',
              repeatable: false,
              required: 'You must enter a title.',
              hint: 'Enter the main title of the item.',
              style: '',
              typeBind: '',
              regex: '',
              vocabulary: '',
              vocabularyClosed: false,
              visibility: true,
              readonly: false,
              valuePairsName: ''
            },
            {
              id: 'date',
              schema: 'dc',
              element: 'date',
              qualifier: 'issued',
              label: 'Date of Issue',
              inputType: 'date',
              repeatable: false,
              required: '',
              hint: 'Enter the date of publication or distribution.',
              style: '',
              typeBind: '',
              regex: '',
              vocabulary: '',
              vocabularyClosed: false,
              visibility: true,
              readonly: false,
              valuePairsName: ''
            }
          ]
        },
        {
          id: 'row-2',
          elements: [
            {
              id: 'author',
              schema: 'dc',
              element: 'contributor',
              qualifier: 'author',
              label: 'Author',
              inputType: 'onebox',
              repeatable: true,
              required: '',
              hint: 'Enter the name of the author(s).',
              style: '',
              typeBind: '',
              regex: '',
              vocabulary: '',
              vocabularyClosed: false,
              visibility: true,
              readonly: false,
              valuePairsName: ''
            }
          ]
        },
        {
          id: 'row-3',
          elements: [
            {
              id: 'abstract',
              schema: 'dc',
              element: 'description',
              qualifier: 'abstract',
              label: 'Abstract',
              inputType: 'textarea',
              repeatable: false,
              required: '',
              hint: 'Enter a brief abstract summarizing the item.',
              style: '',
              typeBind: '',
              regex: '',
              vocabulary: '',
              vocabularyClosed: false,
              visibility: true,
              readonly: false,
              valuePairsName: ''
            }
          ]
        }
      ]
    }
  ])
  const [valuePairsBuilderState, setValuePairsBuilderState] = useState<{
    valuePairGroups: ValuePairGroup[];
  }>({
    valuePairGroups: []
  })

  // Theme synchronization
  useEffect(() => {
    const isDarkTheme = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(isDarkTheme)
    if (isDarkTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    localStorage.setItem('theme', nextDark ? 'dark' : 'light')
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Sticky Premium Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
                DSpace Form Builder
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono -mt-1">
                Metadata Submission Schema Designer
              </p>
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-4 mr-2">
              <XmlFileUploadModal 
                updateForms={setForms} 
                updateValuePairs={(newValuePairGroups) => setValuePairsBuilderState({ valuePairGroups: newValuePairGroups })}
              />
              <GenerateXmlButton forms={forms} valuePairs={valuePairsBuilderState.valuePairGroups}/>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-lg h-9 w-9 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* GitHub Repo */}
            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white" asChild>
              <Link href="https://github.com/Kallox/DSpace-Form-Builder" target="_blank" aria-label="GitHub Repository">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                </svg>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-6 py-6 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-slate-200/60 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/30 dark:border-slate-800/30">
            <button
              onClick={() => setActiveBuilder('forms')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeBuilder === 'forms'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              Forms Builder
            </button>
            <button
              onClick={() => setActiveBuilder('valuePairs')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeBuilder === 'valuePairs'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Code className="h-4 w-4" />
              Value Pairs Builder
            </button>
          </div>
        </div>

        {/* Builder Content Area */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-100/50 dark:shadow-none overflow-hidden min-h-[calc(100vh-14rem)]">
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
      </main>
    </div>
  )
}