interface FormElement {
  id: string;
  schema: string;
  element: string;
  qualifier: string;
  label: string;
  inputType: string;
  repeatable: boolean;
  required: string;
  hint: string;
}

interface FormRow {
  id: string;
  elements: FormElement[];
}

export function convertXmlToJson(xmlString: string): FormRow[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const form = xmlDoc.getElementsByTagName("form")[0];
  const rows = form.getElementsByTagName("row");

  const jsonForm: FormRow[] = Array.from(rows).map((row, rowIndex) => {
    const fields = row.getElementsByTagName("field");
    
    const elements: FormElement[] = Array.from(fields).map((field, fieldIndex) => {
      const getElementContent = (tagName: string) => {
        const element = field.getElementsByTagName(tagName)[0];
        return element ? element.textContent || "" : "";
      };

      return {
        id: `field-${rowIndex}-${fieldIndex}`,
        schema: getElementContent("dc-schema"),
        element: getElementContent("dc-element"),
        qualifier: getElementContent("dc-qualifier"),
        label: getElementContent("label"),
        inputType: getElementContent("input-type"),
        repeatable: getElementContent("repeatable") === "true",
        required: getElementContent("required"),
        hint: getElementContent("hint")
      };
    });

    return {
      id: `row-${rowIndex}`,
      elements: elements
    };
  });

  return jsonForm;
}