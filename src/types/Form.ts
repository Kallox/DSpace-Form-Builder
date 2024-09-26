export interface FormElement {
    id: string;
    schema: string;
    element: string;
    qualifier: string;
    label: string
    inputType: string;
    repeatable: boolean;
    required: string;
    hint: string;
    style?: string;
    typeBind?: string;
    regex?: string;
    vocabulary?: string;
    vocabularyClosed?: boolean;
    visibility?: boolean;
    readonly?: boolean;
    valuePairsName?: string;
  }
  
export interface FormRow {
    id: string;
    elements: FormElement[];
  }

export interface Form {
    name: string;
    rows: FormRow[];
}