"use client"

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon } from 'lucide-react'

const initialFormElements = [
  { id: 'input', type: 'input', label: 'Text Input' },
  { id: 'textarea', type: 'textarea', label: 'Text Area' },
  { id: 'select', type: 'select', label: 'Select' },
]

interface FormElement {
  id: string;
  type: string;
  label: string;
  schema: string;
  element: string;
  qualifier: string;
  description: string;
  inputType: string;
  repeatable: boolean;
  required: boolean;
  hint: string;
}

interface FormRow {
  id: string;
  elements: FormElement[];
}

export default function RowBasedFormBuilder() {
  const [form, setForm] = useState<FormRow[]>([])
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null)

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === 'elements' && destination.droppableId.startsWith('row')) {
      const baseElement = initialFormElements.find(el => el.id === result.draggableId);
      const newElement: FormElement = {
        id: `${result.draggableId}-${Date.now()}`,
        type: baseElement?.type || 'input',
        label: baseElement?.label || 'New Element',
        schema: '',
        element: '',
        qualifier: '',
        description: '',
        inputType: '',
        repeatable: false,
        required: false,
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
    switch (element.type) {
      case 'input':
        return (
          <div className="mb-4">
            <Label htmlFor={element.id}>{element.label}</Label>
            <Input id={element.id} placeholder="Enter text"  hint={element.hint}/>
          </div>
        )
      case 'textarea':
        return (
          <div className="mb-4">
            <Label htmlFor={element.id}>{element.label}</Label>
            <Textarea id={element.id} placeholder="Enter long text" />
          </div>
        )
      case 'select':
        return (
          <div className="mb-4">
            <Label htmlFor={element.id}>{element.label}</Label>
            <select id={element.id} className="w-full p-2 border rounded">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        )
      default:
        return null
    }
  }

  const handleElementClick = (element: FormElement) => {
    setSelectedElement(element)
  }

  const handlePropertyChange = (property: string, value: string | boolean) => {
    if (selectedElement) {
      const updatedElement = { ...selectedElement, [property]: value }
      setSelectedElement(updatedElement)
      setForm(form.map(row => ({
        ...row,
        elements: row.elements.map(el => el.id === updatedElement.id ? updatedElement : el)
      })))
    }
  }

  const addNewRow = () => {
    setForm([...form, { id: `row-${Date.now()}`, elements: [] }])
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-screen">
          <div className="w-1/4 bg-gray-100 p-4">
            <h2 className="text-lg font-bold mb-4">Form Elements</h2>
            <Droppable droppableId="elements">
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
          <div className="w-2/4 p-4">
            <h2 className="text-lg font-bold mb-4">Form Preview</h2>
            {form.map((row, rowIndex) => (
              <Droppable key={row.id} droppableId={`row-${rowIndex}`} direction="horizontal">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className="flex flex-wrap auto-cols-max min-h-[50px] border-2 border-dashed p-2 mb-2"
                  >
                    {row.elements.map((element, index) => (
                      <Draggable key={element.id} draggableId={element.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleElementClick(element)}
                            className={`flex-1 cursor-pointer m-1 ${selectedElement?.id === element.id ? 'border-2 border-blue-500' : ''}`}
                          >
                            {renderFormElement(element)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
            <Button className="mt-4 mr-2" onClick={addNewRow}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Row
            </Button>
            <Button className="mt-4" onClick={() => console.log(form)}>Save Form</Button>
          </div>
          <div className="w-1/4 bg-gray-100 p-4">
            <h2 className="text-lg font-bold mb-4">Element Properties</h2>
            {selectedElement && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="schema">Schema</Label>
                  <Input 
                    id="schema" 
                    value={selectedElement.schema} 
                    onChange={(e) => handlePropertyChange('schema', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="element">Element</Label>
                  <Input 
                    id="element" 
                    value={selectedElement.element} 
                    onChange={(e) => handlePropertyChange('element', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="qualifier">Qualifier</Label>
                  <Input 
                    id="qualifier" 
                    value={selectedElement.qualifier} 
                    onChange={(e) => handlePropertyChange('qualifier', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={selectedElement.description} 
                    onChange={(e) => handlePropertyChange('description', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="label">Label</Label>
                  <Input 
                    id="label" 
                    value={selectedElement.label} 
                    onChange={(e) => handlePropertyChange('label', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="inputType">Input Type</Label>
                  <Input 
                    id="inputType" 
                    value={selectedElement.inputType} 
                    onChange={(e) => handlePropertyChange('inputType', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="repeatable" 
                    checked={selectedElement.repeatable} 
                    onCheckedChange={(checked) => handlePropertyChange('repeatable', checked)}
                  />
                  <Label htmlFor="repeatable">Repeatable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="required" 
                    checked={selectedElement.required} 
                    onCheckedChange={(checked) => handlePropertyChange('required', checked)}
                  />
                  <Label htmlFor="required">Required</Label>
                </div>
                <div>
                  <Label htmlFor="hint">Hint</Label>
                  <Input 
                    id="hint" 
                    value={selectedElement.hint} 
                    onChange={(e) => handlePropertyChange('hint', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </DragDropContext>

    </div>
  )
}