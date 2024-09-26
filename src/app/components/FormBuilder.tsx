"use client"

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle } from 'lucide-react'
import { CodeZone } from "./CodeZone"
import { XmlUploadModal } from './XmlUploadModal'

const initialFormElements = [
  { id: 'input', type: 'onebox', label: 'Text' },
  { id: 'textarea', type: 'textarea', label: 'Text Area' },
  { id: 'select', type: 'dropdown', label: 'Select' },
  { id: 'date', type: 'date', label: 'Date' },
  { id: 'tag', type: 'tag', label: 'Tag' },
  { id: 'group', type: 'group', label: 'Modal' },
  { id: 'inlinegroup', type: 'inline-group', label: 'Inline form' },
  { id: 'name', type: 'name', label: 'Person Name' },
  { id: 'link', type: 'link', label: 'Link' },
  { id: 'series', type: 'series', label: 'Publication Series' },

]

interface FormElement {
  id: string;
  schema: string;
  element: string;
  qualifier: string;
  label: string
  inputType: string;
  repeatable: boolean;
  required: string;
  hint: string;
}

interface FormRow {
  id: string;
  elements: FormElement[];
}

export default function EnhancedFormBuilder() {
  const [form, setForm] = useState<FormRow[]>([])
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null)
  const [savedForm, setSavedForm] = useState<FormRow[] | null>(null)
  const [formName, setFormName] = useState<string>('Form Name')

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === 'elements' && destination.droppableId.startsWith('row')) {
      const baseElement = initialFormElements.find(el => el.id === result.draggableId);
      const newElement: FormElement = {
        id: `${result.draggableId}-${Date.now()}`,
        schema: '',
        element: '',
        qualifier: '',
        label: '',
        inputType: baseElement ? baseElement.type : '',
        repeatable: false,
        required: '',
        hint: ''
      }
      
      const rowIndex = parseInt(destination.droppableId.split('-')[1])
      const newForm = [...form]
      newForm[rowIndex].elements.splice(destination.index, 0, newElement)
      setForm(newForm)
    } else if (source.droppableId.startsWith('row') && destination.droppableId.startsWith('row')) {
      const sourceRowIndex = parseInt(source.droppableId.split('-')[1])
      const destRowIndex = parseInt(destination.droppableId.split('-')[1])
      
      const newForm = [...form]
      const [movedElement] = newForm[sourceRowIndex].elements.splice(source.index, 1)
      newForm[destRowIndex].elements.splice(destination.index, 0, movedElement)
      
      // Remove empty rows
      setForm(newForm.filter(row => row.elements.length > 0))
    }
  }

  const renderFormElement = (element: FormElement) => {
    return (
      <div className="w-full p-4 border rounded-md mb-4 bg-white">
        <div className="flex flex-wrap items-center space-x-2">
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor={`${element.id}-schema`} className="sr-only">Schema</Label>
            <Input
              id={`${element.id}-schema`}
              value={element.schema}
              onChange={(e) => handlePropertyChange(element.id, 'schema', e.target.value)}
              className="w-full"
              placeholder="Schema"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor={`${element.id}-element`} className="sr-only">Element</Label>
            <Input
              id={`${element.id}-element`}
              value={element.element}
              onChange={(e) => handlePropertyChange(element.id, 'element', e.target.value)}
              className="w-full"
              placeholder="Element"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor={`${element.id}-qualifier`} className="sr-only">Qualifier</Label>
            <Input
              id={`${element.id}-qualifier`}
              value={element.qualifier}
              onChange={(e) => handlePropertyChange(element.id, 'qualifier', e.target.value)}
              className="w-full"
              placeholder="Qualifier"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor={`${element.id}-label`} className="sr-only">Label</Label>
            <Input
              id={`${element.id}-label`}
              value={element.label}
              onChange={(e) => handlePropertyChange(element.id, 'label', e.target.value)}
              className="w-full"
              placeholder="Label"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor={`${element.id}-inputType`} className="sr-only">Input Type</Label>
            <Input
              id={`${element.id}-inputType`}
              value={element.inputType}
              onChange={(e) => handlePropertyChange(element.id, 'inputType', e.target.value)}
              className="w-full"
              placeholder="Input Type"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${element.id}-repeatable`}
              checked={element.repeatable}
              onCheckedChange={(checked) => handlePropertyChange(element.id, 'repeatable', checked)}
            />
            <Label htmlFor={`${element.id}-repeatable`} className="text-sm">Repeatable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id={`${element.id}-required`}
              value={element.required}
              onChange={(e) => handlePropertyChange(element.id, 'required', e.target.value)}
              className="w-full"
              placeholder="Required"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor={`${element.id}-hint`} className="sr-only">Hint</Label>
            <Input
              id={`${element.id}-hint`}
              value={element.hint}
              onChange={(e) => handlePropertyChange(element.id, 'hint', e.target.value)}
              className="w-full"
              placeholder="Hint"
            />
          </div>
        </div>
      </div>
    )
  }

  const handleElementClick = (element: FormElement) => {
    setSelectedElement(element)
  }

const handleSavedForm = () => {
  setSavedForm([...form])
}

  const handlePropertyChange = (elementId: string, property: string, value: string | boolean) => {
    setForm(prevForm => prevForm.map(row => ({
      ...row,
      elements: row.elements.map(el => 
        el.id === elementId ? { ...el, [property]: value } : el
      )
    })))
  }

  const handleXmlUpload = (jsonForm: FormRow[]) => {
    setForm(jsonForm)
  }
  
  const addNewRow = () => {
    setForm(prevForm => [...prevForm, { id: `row-${Date.now()}`, elements: [] }])
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen">
        <div className="w-1/5 bg-gray-100 p-4">
          <h2 className="text-lg font-bold mb-4">Form Elements</h2>
          <Droppable droppableId="elements" isDropDisabled={true}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {initialFormElements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-2 mb-2 rounded shadow"
                      >
                        {element.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="w-4/5 p-4">
          <div className="flex justify-between items-center mb-4">
            <Input
              id="FormName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="text-lg font-bold border-none bg-transparent"
              placeholder="Enter Form Name"
            />
            <Button onClick={addNewRow} className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Row
            </Button>
            <XmlUploadModal onUpload={handleXmlUpload} />
          </div>
          {form.map((row, rowIndex) => (
            <Droppable key={row.id} droppableId={`row-${rowIndex}`}>
              {(provided) => (
                <div className="relative min-h-[100px] border-2 border-dashed p-4 mb-4">
                  <span className="absolute top-0 left-0 bg-gray-200 text-xs px-2 py-1 rounded-br">Row</span>
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[100px]"
                  >
                    {row.elements.map((element, index) => (
                      <Draggable key={element.id} draggableId={element.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleElementClick(element)}
                            className={`cursor-pointer mt-4 ${selectedElement?.id === element.id ? 'border-2 border-blue-500' : ''}`}
                          >
                            {renderFormElement(element)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
          <Button className="mt-4" onClick={handleSavedForm}>Save Form</Button>
          {savedForm && <CodeZone data={savedForm} title={formName}/>}
        </div>
      </div>
    </DragDropContext>
  )
}