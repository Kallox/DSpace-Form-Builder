'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, PlusCircle, Trash2 } from 'lucide-react'
import { ValuePairGroup } from '@/types/ValuePairs'
import { CodeZone } from './CodeZone'
import { ValuePairsXmlUploadModal } from './ValuePairsXmlUploadModal'

interface ValuePairsBuilderProps {
  valuePairGroups: ValuePairGroup[];
  onValuePairsChange: (newValuePairGroups: ValuePairGroup[]) => void;
}

export default function ValuePairsBuilder({ valuePairGroups, onValuePairsChange }: ValuePairsBuilderProps) {
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(null)
  const [savedValuePairs, setSavedValuePairs] = React.useState<ValuePairGroup[] | null>(null)

  const addValuePairGroup = () => {
    const newGroup: ValuePairGroup = {
      id: `group-${Date.now()}`,
      name: 'New Value Pair Group',
      pairs: [{
        id: `pair-${Date.now()}`,
        displayedValue: '',
        storedValue: ''
      }]
    }
    setSavedValuePairs(null)
    onValuePairsChange([...valuePairGroups, newGroup])
    setSelectedGroupId(newGroup.id)
  }

  const updateGroupName = (groupId: string, newName: string) => {
    const newGroups = valuePairGroups.map(group =>
      group.id === groupId ? { ...group, name: newName } : group
    )
    setSavedValuePairs(null)
    onValuePairsChange(newGroups)
  }

  const addValuePair = (groupId: string) => {
    const newGroups = valuePairGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            pairs: [
              ...group.pairs,
              { id: `pair-${Date.now()}`, displayedValue: '', storedValue: '' }
            ]
          }
        : group
    )
    setSavedValuePairs(null)
    onValuePairsChange(newGroups)
  }

  const updateValuePair = (groupId: string, pairId: string, field: 'displayedValue' | 'storedValue', value: string) => {
    const newGroups = valuePairGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            pairs: group.pairs.map(pair =>
              pair.id === pairId ? { ...pair, [field]: value } : pair
            )
          }
        : group
    )
    setSavedValuePairs(null)
    onValuePairsChange(newGroups)
  }

  const removeValuePair = (groupId: string, pairId: string) => {
    const newGroups = valuePairGroups.map(group =>
      group.id === groupId
        ? {
            ...group,
            pairs: group.pairs.length > 1 ? group.pairs.filter(pair => pair.id !== pairId) : group.pairs
          }
        : group
    )
    setSavedValuePairs(null)
    onValuePairsChange(newGroups)
  }

  const handleRemoveGroup = (groupId: string) => {
    const newGroups = valuePairGroups.filter(group => group.id !== groupId)
    setSavedValuePairs(null)
    onValuePairsChange(newGroups)
  }

  const handleSelectedGroupId = (groupId: string) => {
    setSavedValuePairs(null)
    setSelectedGroupId(groupId)
  }

  const handleGenerateXML = () => {
    setSavedValuePairs(valuePairGroups)
  }

  const handleXmlUpload = (jsonForm: ValuePairGroup) => {
    setSavedValuePairs(null)
    onValuePairsChange([...valuePairGroups, jsonForm])
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Value Pair Groups</h2>
          <Button onClick={addValuePairGroup} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Group
          </Button>
          <ValuePairsXmlUploadModal onUpload={handleXmlUpload} />
        </div>
        <div className="space-y-2 mb-4">
          {valuePairGroups.map(group => (
            <div 
              key={group.id} 
              className={`p-2 rounded cursor-pointer flex justify-between content-center ${selectedGroupId === group.id ? 'bg-blue-100' : 'bg-white'}`}
              onClick={() => handleSelectedGroupId(group.id)}
            >
              {group.name}
              <Button variant="destructive" className="flex items-center" onClick={() => handleRemoveGroup(group.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          {
            valuePairGroups.length !== 0 && 
            <Button className="mt-4" onClick={handleGenerateXML}><Code className="mr-2 h-4 w-4"/> Generate XML</Button>
          }
        </div>
      </div>
      <div className="w-2/3 p-4 overflow-y-auto">
        {selectedGroupId && (
          <div className="space-y-4">
            {valuePairGroups.find(group => group.id === selectedGroupId) && (
              <>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Group Name"
                    value={valuePairGroups.find(group => group.id === selectedGroupId)?.name || ''}
                    onChange={(e) => updateGroupName(selectedGroupId, e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    onClick={() => addValuePair(selectedGroupId)}
                    className="flex items-center"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Pair
                  </Button>
                </div>
                {valuePairGroups.find(group => group.id === selectedGroupId)?.pairs.map(pair => (
                  <div key={pair.id} className="flex items-center space-x-2">
                    <div className="flex-grow border-2 border-dashed border-gray-300 p-2 rounded">
                      <div className="mb-2">
                        <Label htmlFor={`displayed-${pair.id}`} className="text-sm font-medium">
                          Displayed value
                        </Label>
                        <Input
                          id={`displayed-${pair.id}`}
                          placeholder="Displayed value"
                          value={pair.displayedValue}
                          onChange={(e) => updateValuePair(selectedGroupId, pair.id, 'displayedValue', e.target.value)}
                          className="w-full mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`stored-${pair.id}`} className="text-sm font-medium">
                          Stored value
                        </Label>
                        <Input
                          id={`stored-${pair.id}`}
                          placeholder="Stored value"
                          value={pair.storedValue}
                          onChange={(e) => updateValuePair(selectedGroupId, pair.id, 'storedValue', e.target.value)}
                          className="w-full mt-1"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => removeValuePair(selectedGroupId, pair.id)}
                      className="flex items-center"
                      disabled={valuePairGroups.find(group => group.id === selectedGroupId)?.pairs.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {savedValuePairs && <CodeZone data={savedValuePairs} title=""/>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}