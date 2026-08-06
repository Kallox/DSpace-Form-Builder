"use client"

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import InputTypeSelect from "./InputTypeSelect"
import { PlusCircle, ChevronUp, ChevronDown, Trash2, GripVertical, Plus, FileCode } from 'lucide-react'
import { CodeZone } from "./CodeZone"
import { XmlUploadModal } from './XmlUploadModal'
import { FormElementSettingsModal } from './FormElementSettingsModal'
import FormPreviewModal from './FormPreviewModal'
import { FormElement, FormRow, Form } from '@/types/Form'

interface FormBuilderProps {
  form: FormRow[];
  formName: string;
  onFormChange: (newForm: FormRow[]) => void;
  onFormNameChange: (newName: string) => void;
  onFormUpload: (jsonForm: Form) => void;
}

export default function EnhancedFormBuilder({ form, formName, onFormChange, onFormNameChange, onFormUpload }: FormBuilderProps) {
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null)
  const [savedForm, setSavedForm] = useState<FormRow[] | null>(null)

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId.startsWith('row') && destination.droppableId.startsWith('row')) {
      const sourceRowIndex = parseInt(source.droppableId.split('-')[1])
      const destRowIndex = parseInt(destination.droppableId.split('-')[1])
      
      const newForm = [...form]
      const [movedElement] = newForm[sourceRowIndex].elements.splice(source.index, 1)
      newForm[destRowIndex].elements.splice(destination.index, 0, movedElement)
      
      // Remove empty rows
      setSavedForm(null)
      onFormChange(newForm.filter(row => row.elements.length > 0))
    }
  }

  const renderFormElement = (element: FormElement, rowIndex: number, elementIndex: number) => {
    return (
      <div className="relative w-full p-5 border border-slate-200 dark:border-slate-800/80 rounded-xl bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700/80 group/field">
        {/* Drag Handle & Delete Toolbar */}
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover/field:opacity-100 focus-within:opacity-100 transition-opacity">
          <FormElementSettingsModal onSave={handleElementSettingsSave} element={element} />
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); removeElement(rowIndex, elementIndex) }}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
            title="Remove element"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove element</span>
          </Button>
        </div>

        {/* Drag Indicator (Grab handle icon on the far left) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-650 cursor-grab active:cursor-grabbing hover:text-slate-400 dark:hover:text-slate-500">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Form Inputs Grid Layout */}
        <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-16">
          <div className="space-y-1">
            <Label htmlFor={`${element.id}-schema`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Schema
            </Label>
            <Input
              id={`${element.id}-schema`}
              value={element.schema}
              onChange={(e) => handlePropertyChange(element.id, 'schema', e.target.value)}
              className="h-9 text-sm"
              placeholder="e.g. dc"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${element.id}-element`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Element
            </Label>
            <Input
              id={`${element.id}-element`}
              value={element.element}
              onChange={(e) => handlePropertyChange(element.id, 'element', e.target.value)}
              className="h-9 text-sm"
              placeholder="e.g. contributor"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${element.id}-qualifier`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Qualifier
            </Label>
            <Input
              id={`${element.id}-qualifier`}
              value={element.qualifier}
              onChange={(e) => handlePropertyChange(element.id, 'qualifier', e.target.value)}
              className="h-9 text-sm"
              placeholder="e.g. author (optional)"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${element.id}-label`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Field Label
            </Label>
            <Input
              id={`${element.id}-label`}
              value={element.label}
              onChange={(e) => handlePropertyChange(element.id, 'label', e.target.value)}
              className="h-9 text-sm"
              placeholder="e.g. Author(s)"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${element.id}-inputType`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Input Type
            </Label>
            <InputTypeSelect 
              id={`${element.id}-inputType`} 
              value={element.inputType}
              onChange={(value) => handlePropertyChange(element.id, 'inputType', value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${element.id}-required`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Required Message
            </Label>
            <Input
              id={`${element.id}-required`}
              value={element.required}
              onChange={(e) => handlePropertyChange(element.id, 'required', e.target.value)}
              className="h-9 text-sm"
              placeholder="Required text (empty if optional)"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor={`${element.id}-hint`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Hint / Description
            </Label>
            <Input
              id={`${element.id}-hint`}
              value={element.hint}
              onChange={(e) => handlePropertyChange(element.id, 'hint', e.target.value)}
              className="h-9 text-sm"
              placeholder="Helper text displayed under the field input"
            />
          </div>
          <div className="flex items-center space-x-2 pt-5 h-9">
            <Checkbox
              id={`${element.id}-repeatable`}
              checked={element.repeatable}
              onCheckedChange={(checked) => handlePropertyChange(element.id, 'repeatable', checked)}
            />
            <Label htmlFor={`${element.id}-repeatable`} className="text-sm font-medium text-slate-600 dark:text-slate-350 cursor-pointer">
              Repeatable field
            </Label>
          </div>
        </div>
      </div>
    )
  }

  const handleElementClick = (element: FormElement) => {
    setSavedForm(null)
    setSelectedElement(element)
  }

  const handleSavedForm = () => {
    setSavedForm([...form])
  }

  const handleFormNameChange = (newName: string) => {
    setSavedForm(null)
    onFormNameChange(newName)
  }

  const handlePropertyChange = (elementId: string, property: string, value: string | boolean) => {
    const newForm = form.map(row => ({
      ...row,
      elements: row.elements.map(el => 
        el.id === elementId ? { ...el, [property]: value } : el
      )
    }))
    setSavedForm(null)
    onFormChange(newForm)
  }

  const handleXmlUpload = (jsonForm: Form) => {
    setSavedForm(null)
    onFormUpload(jsonForm)
  }

  const handleElementSettingsSave = (element: FormElement) => {
    const newForm = form.map(row => ({
      ...row,
      elements: row.elements.map(el => 
        el.id === element.id ? element : el
      )
    }))
    setSavedForm(null)
    onFormChange(newForm)
  }
  
  const addNewRow = () => {
    setSavedForm(null)
    onFormChange([...form, { id: `row-${Date.now()}`, elements: [] }])
  }

  const addNewElement = (rowIndex: number) => {
    const newElement: FormElement = {
      id: `${Date.now()}`,
      schema: '',
      element: '',
      qualifier: '',
      label: '',
      inputType: 'onebox',
      repeatable: false,
      required: '',
      hint: '',
      style: '',
      typeBind: '',
      regex: '',
      vocabulary: '',
      vocabularyClosed: false,
      visibility: true,
      readonly: false,
      valuePairsName: ''
    }
    const newForm = [...form]
    const elementsLength = newForm[rowIndex].elements.length
    newForm[rowIndex].elements.splice(elementsLength, 0, newElement)
    setSavedForm(null)
    onFormChange(newForm)
  }

  const moveRowUp = (index: number) => {
    if (index > 0) {
      const newForm = [...form]
      const temp = newForm[index]
      newForm[index] = newForm[index - 1]
      newForm[index - 1] = temp
      setSavedForm(null)
      onFormChange(newForm)
    }
  }

  const moveRowDown = (index: number) => {
    if (index < form.length - 1) {
      const newForm = [...form]
      const temp = newForm[index]
      newForm[index] = newForm[index + 1]
      newForm[index + 1] = temp
      setSavedForm(null)
      onFormChange(newForm)
    }
  }

  const removeRow = (index: number) => { 
    const newForm = [...form]
    newForm.splice(index, 1)
    setSavedForm(null)
    onFormChange(newForm)
  }

  const removeElement = (rowIndex: number, elementIndex: number) => {
    const newForm = [...form]
    newForm[rowIndex].elements.splice(elementIndex, 1)
    setSavedForm(null)
    onFormChange(newForm)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-full min-h-[calc(100vh-14rem)] bg-white dark:bg-slate-900">
        <div className="p-6 flex-1 space-y-6 overflow-y-auto">
          {/* Header toolbar within Builder */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-150 dark:border-slate-800">
            <div className="w-full sm:max-w-md">
              <Label htmlFor="FormName" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Active Form Schema Name
              </Label>
              <Input
                id="FormName"
                value={formName}
                onChange={(e) => handleFormNameChange(e.target.value)}
                className="text-lg font-bold border-dashed border-slate-300 dark:border-slate-700 bg-transparent hover:border-slate-400 dark:hover:border-slate-500 focus:border-solid focus:border-purple-500"
                placeholder="Enter Form Name"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FormPreviewModal form={form} formName={formName} />
              <Button onClick={addNewRow} className="bg-purple-600 hover:bg-purple-500 text-white font-medium gap-2 shadow-sm shrink-0">
                <Plus className="h-4 w-4" /> Add Row
              </Button>
              <XmlUploadModal onUpload={handleXmlUpload} />
            </div>
          </div>

          {/* Rows Listing */}
          <div className="space-y-6 pb-20">
            {form.map((row, rowIndex) => (
              <Droppable key={row.id} droppableId={`row-${rowIndex}`}>
                {(provided, snapshot) => (
                  <div 
                    className={`relative border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 transition-all ${
                      snapshot.isDraggingOver 
                        ? 'bg-purple-50/20 dark:bg-purple-950/10 border-purple-500/40 ring-1 ring-purple-500/20' 
                        : 'bg-slate-50/40 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-800'
                    }`}
                  >
                    {/* Row Badge Label */}
                    <span className="absolute top-3 left-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                      Row {rowIndex + 1}
                    </span>

                    {/* Row Control Toolbar */}
                    <div className="absolute top-3 right-4 flex items-center gap-0.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg p-0.5 shadow-sm">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveRowUp(rowIndex)}
                        disabled={rowIndex === 0}
                        className="h-7 w-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                        title="Move row up"
                      >
                        <ChevronUp className="h-4 w-4" />
                        <span className="sr-only">Move row up</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveRowDown(rowIndex)}
                        disabled={rowIndex === form.length - 1}
                        className="h-7 w-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                        title="Move row down"
                      >
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Move row down</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeRow(rowIndex)}
                        className="h-7 w-7 rounded-md text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Delete row"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete row</span>
                      </Button>
                    </div>

                    {/* Row Elements */}
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[40px] pt-4"
                    >
                      {row.elements.map((element, index) => (
                        <Draggable key={element.id} draggableId={element.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleElementClick(element)}
                              className={`transition-all ${snapshot.isDragging ? 'dragging-item' : ''}`}
                            >
                              <div className={`mt-4 rounded-xl transition-all ${
                                selectedElement?.id === element.id 
                                  ? 'ring-2 ring-purple-500/60 dark:ring-purple-500/50 shadow-md shadow-purple-500/5' 
                                  : ''
                              }`}>
                                {renderFormElement(element, rowIndex, index)}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Add Field Button */}
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 border-dashed border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:bg-purple-50/10 dark:hover:bg-purple-950/10 hover:text-purple-600 dark:hover:text-purple-400 gap-2 h-12 rounded-xl transition-all group"
                        onClick={() => addNewElement(rowIndex)}
                      >
                        <PlusCircle className="h-4 w-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          Add Field to Row
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>

          {/* Generate Code Area */}
          <div className="border-t border-slate-150 dark:border-slate-850 pt-6 flex flex-col gap-6">
            <div className="flex justify-end">
              {form?.length !== 0 && (
                <Button className="bg-slate-900 dark:bg-slate-800 text-white font-medium hover:bg-slate-800 dark:hover:bg-slate-700 shadow-sm gap-2 h-11 px-5" onClick={handleSavedForm}>
                  <FileCode className="h-4 w-4" /> Generate XML Code
                </Button>
              )}
            </div>
            {savedForm && <CodeZone data={savedForm} title={formName} />}
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}