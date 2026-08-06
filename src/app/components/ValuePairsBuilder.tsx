'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Layers, Plus, FileCode } from 'lucide-react'
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

  const handleRemoveGroup = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation() // Prevent selecting the group right before deleting it
    const newGroups = valuePairGroups.filter(group => group.id !== groupId)
    setSavedValuePairs(null)
    onValuePairsChange(newGroups)
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null)
    }
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
    <div className="flex h-full min-h-[calc(100vh-14rem)] divide-x divide-slate-200 dark:divide-slate-800">
      {/* Sidebar listing */}
      <div className="w-1/4 min-w-[240px] max-w-[320px] bg-slate-50/50 dark:bg-slate-900/30 p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-850">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Value Pairs
            </h2>
            <div className="flex items-center gap-1">
              <ValuePairsXmlUploadModal onUpload={handleXmlUpload} />
              <Button 
                onClick={addValuePairGroup} 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg"
                title="Add Group"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ul className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
            {valuePairGroups.map(group => {
              const isSelected = selectedGroupId === group.id
              return (
                <li 
                  key={group.id} 
                  className={`group p-2.5 rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                    isSelected 
                      ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-l-2 border-purple-500 pl-2 font-medium' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-350 border-l-2 border-transparent'
                  }`}
                  onClick={() => handleSelectedGroupId(group.id)}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Layers className={`h-4 w-4 shrink-0 ${isSelected ? 'text-purple-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                    <span className="truncate text-sm">{group.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 h-7 w-7 rounded-md text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 transition-opacity" 
                    onClick={(e) => handleRemoveGroup(e, group.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="space-y-2 mt-4">
          {valuePairGroups.length !== 0 && (
            <Button 
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white gap-2 h-10 shadow-sm"
              onClick={handleGenerateXML}
            >
              <FileCode className="h-4 w-4" /> Generate XML Code
            </Button>
          )}
          <Button 
            onClick={addValuePairGroup} 
            variant="outline"
            className="w-full border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2 h-10"
          >
            <PlusCircle className="h-4 w-4" /> Add New Group
          </Button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-white dark:bg-slate-900">
        {selectedGroupId ? (
          <div className="space-y-6">
            {(() => {
              const activeGroup = valuePairGroups.find(group => group.id === selectedGroupId)
              if (!activeGroup) return null
              
              return (
                <>
                  {/* Title & Toolbar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-150 dark:border-slate-800">
                    <div className="w-full sm:max-w-md">
                      <Label htmlFor="GroupNameInput" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                        Value Pair Group Name
                      </Label>
                      <Input
                        id="GroupNameInput"
                        placeholder="Group Name"
                        value={activeGroup.name}
                        onChange={(e) => updateGroupName(selectedGroupId, e.target.value)}
                        className="text-lg font-bold border-dashed border-slate-300 dark:border-slate-700 bg-transparent hover:border-slate-400 dark:hover:border-slate-500 focus:border-solid focus:border-purple-500"
                      />
                    </div>
                    <Button 
                      onClick={() => addValuePair(selectedGroupId)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-medium gap-2 shadow-sm shrink-0"
                    >
                      <Plus className="h-4 w-4" /> Add Pair
                    </Button>
                  </div>

                  {/* Pairs Listing */}
                  <div className="space-y-4 max-w-4xl pb-10">
                    {activeGroup.pairs.map(pair => (
                      <div key={pair.id} className="flex items-center gap-3 group/pair">
                        {/* Pair Card */}
                        <div className="flex-1 border border-slate-200 dark:border-slate-800/85 bg-slate-50/40 dark:bg-slate-900/40 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
                          <div className="space-y-1">
                            <Label htmlFor={`displayed-${pair.id}`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                              Displayed value
                            </Label>
                            <Input
                              id={`displayed-${pair.id}`}
                              placeholder="Displayed value (visible to user)"
                              value={pair.displayedValue}
                              onChange={(e) => updateValuePair(selectedGroupId, pair.id, 'displayedValue', e.target.value)}
                              className="w-full h-9 text-sm bg-white dark:bg-slate-900"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`stored-${pair.id}`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                              Stored value
                            </Label>
                            <Input
                              id={`stored-${pair.id}`}
                              placeholder="Stored value (saved in DB)"
                              value={pair.storedValue}
                              onChange={(e) => updateValuePair(selectedGroupId, pair.id, 'storedValue', e.target.value)}
                              className="w-full h-9 text-sm bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>

                        {/* Remove Pair Button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeValuePair(selectedGroupId, pair.id)}
                          className="h-9 w-9 text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg shrink-0 opacity-40 group-hover/pair:opacity-100 transition-opacity"
                          disabled={activeGroup.pairs.length === 1}
                          title="Remove pair"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Render generated code block */}
                  {savedValuePairs && (
                    <div className="border-t border-slate-150 dark:border-slate-850 pt-6">
                      <CodeZone data={savedValuePairs} title=""/>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[500px]">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Layers className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No value pair group selected</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Select an existing group from the sidebar, create a new one, or import an XML to start configuring drop-down dictionaries.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}