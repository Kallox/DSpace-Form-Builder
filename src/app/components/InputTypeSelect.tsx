'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InputTypeSelectProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
}

export default function InputTypeSelect({ id, value, onChange }: InputTypeSelectProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger id={id} className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="onebox">One box</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="dropdown">Drop down</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="tag">Tag</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="inline-group">Inline Group</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="series">Series</SelectItem>
                <SelectItem value="qualdrop_value">Qualdrop Value</SelectItem>
            </SelectContent>
        </Select>
    )
}