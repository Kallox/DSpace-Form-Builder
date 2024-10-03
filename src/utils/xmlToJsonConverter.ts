import { FormElement, FormRow, Form } from "@/types/Form";
import { ValuePairGroup } from "@/types/ValuePairs";
import { XmlFile } from "@/types/File";

export function convertXmlToJson(xmlString: string): Form {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const form = xmlDoc.getElementsByTagName("form")[0];
  const formName = form.getAttribute("name");
  const rows = form.getElementsByTagName("row");

  const jsonForm: FormRow[] = Array.from(rows).map((row, rowIndex) => {
    const fields = row.getElementsByTagName("field");
    
    const elements: FormElement[] = Array.from(fields).map((field, fieldIndex) => {
      const getElementContent = (tagName: string) => {
        const element = field.getElementsByTagName(tagName)[0];
        return element ? element.textContent || "" : "";
      };

      const getAttributeContent = (tagName: string, attribute: string) => {
        const element = field.getElementsByTagName(tagName)[0];
        return element ? element.getAttribute(attribute) || "" : "";
      }

      return {
        id: `field-${rowIndex}-${fieldIndex}`,
        schema: getElementContent("dc-schema"),
        element: getElementContent("dc-element"),
        qualifier: getElementContent("dc-qualifier"),
        label: getElementContent("label"),
        inputType: getElementContent("input-type"),
        repeatable: getElementContent("repeatable") === "true",
        required: getElementContent("required"),
        hint: getElementContent("hint"),
        style: getElementContent("style"),
        typeBind: getElementContent("type-bind"),
        regex: getElementContent("regex"),
        vocabulary: getElementContent("vocabulary"),
        vocabularyClosed: getAttributeContent("vocabulary", "closed") === "true",
        visibility: getElementContent("visibility") ? getElementContent("visibility") === "true" : true,
        readonly: getElementContent("readonly") === "true",
        valuePairsName: getAttributeContent("input-type", "value-pairs-name")
      };
    });

    return {
      id: `row-${rowIndex}`,
      elements: elements
    };
  });

  const jsonFormObject = {
    id: `form-${Date.now()}`,
    name: formName || "Form",
    rows: jsonForm
  }
  
  return jsonFormObject;
}

export function convertValuePairsXmlToJson(xmlString: string): ValuePairGroup {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const valuePairs = xmlDoc.getElementsByTagName("value-pairs")[0];
  const valuePairsName = valuePairs.getAttribute("value-pairs-name");
  const pairs = valuePairs.getElementsByTagName("pair");

  const jsonValuePairs: ValuePairGroup = {
    id: `group-${Date.now()}`,
    name: valuePairsName || "Value Pairs",
    pairs: Array.from(pairs).map((pair, pairIndex) => {
      return {
        id: `pair-${pairIndex}`,
        displayedValue: pair.getElementsByTagName("displayed-value")[0].textContent || "",
        storedValue: pair.getElementsByTagName("stored-value")[0].textContent || ""
      };
    })
  };

  return jsonValuePairs;
}

export const convertXmlFileToJson = (xmlString: string): XmlFile => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const formDefinitions = xmlDoc.getElementsByTagName("form-definitions")[0];
  const forms = formDefinitions.getElementsByTagName("form");

  const jsonForms: Form[] = Array.from(forms).map(form => {
    const formName = form.getAttribute("name");
    const rows = form.getElementsByTagName("row");

    const jsonForm: FormRow[] = Array.from(rows).map((row, rowIndex) => {
      const fields = row.getElementsByTagName("field");
      
      const elements: FormElement[] = Array.from(fields).map((field, fieldIndex) => {
        const getElementContent = (tagName: string) => {
          const element = field.getElementsByTagName(tagName)[0];
          return element ? element.textContent || "" : "";
        };

        const getAttributeContent = (tagName: string, attribute: string) => {
          const element = field.getElementsByTagName(tagName)[0];
          return element ? element.getAttribute(attribute) || "" : "";
        }

        return {
          id: `field-${rowIndex}-${fieldIndex}`,
          schema: getElementContent("dc-schema"),
          element: getElementContent("dc-element"),
          qualifier: getElementContent("dc-qualifier"),
          label: getElementContent("label"),
          inputType: getElementContent("input-type"),
          repeatable: getElementContent("repeatable") === "true",
          required: getElementContent("required"),
          hint: getElementContent("hint"),
          style: getElementContent("style"),
          typeBind: getElementContent("type-bind"),
          regex: getElementContent("regex"),
          vocabulary: getElementContent("vocabulary"),
          vocabularyClosed: getAttributeContent("vocabulary", "closed") === "true",
          visibility: getElementContent("visibility") ? getElementContent("visibility") === "true" : true,
          readonly: getElementContent("readonly") === "true",
          valuePairsName: getAttributeContent("input-type", "value-pairs-name")
        };
      });

      return {
        id: `row-${rowIndex}`,
        elements: elements
      };
    });

    return {
      id: `form-${Math.floor(Math.random() * Date.now())}`,
      name: formName || "Form",
      rows: jsonForm
    };
  });

  const formValuePairs = xmlDoc.getElementsByTagName("form-value-pairs")[0];

  const valuePairs = formValuePairs.getElementsByTagName("value-pairs");

  const jsonValuePairs: ValuePairGroup[] = Array.from(valuePairs).map(valuePair => {
    const valuePairsName = valuePair.getAttribute("value-pairs-name");
    const pairs = valuePair.getElementsByTagName("pair");

    return {
      id: `group-${Math.floor(Math.random() * Date.now())}`,
      name: valuePairsName || "Value Pairs",
      pairs: Array.from(pairs).map((pair, pairIndex) => {
        return {
          id: `pair-${pairIndex}`,
          displayedValue: pair.getElementsByTagName("displayed-value")[0].textContent || "",
          storedValue: pair.getElementsByTagName("stored-value")[0].textContent || ""
        };
      })
    };
  });

  const xmlJson = {
    forms: jsonForms,
    valuePairs: jsonValuePairs
  }
  
  return xmlJson;
}