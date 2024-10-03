export function validateXmlStructure(xmlString: string): boolean {
  // Crear un parser XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Verificar si hay errores de parsing
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    return false;
  }

  // Verificar la estructura básica
  const form = xmlDoc.getElementsByTagName("form")[0];
  if (!form || !form.getAttribute("name")) {
    return false;
  }

  const row = form.getElementsByTagName("row")[0];
  if (!row) {
    return false;
  }

  const field = row.getElementsByTagName("field")[0];
  if (!field) {
    return false;
  }

  // Verificar los elementos requeridos dentro de field
  const requiredElements = ["dc-schema", "dc-element", "label", "input-type", "repeatable", "required", "hint"];
  for (const elementName of requiredElements) {
    if (!field.getElementsByTagName(elementName)[0]) {
      return false;
    }
  }

  // Verificar valores específicos
  if (!field.getElementsByTagName("dc-schema")[0]) {
    return false;
  }
  if (!field.getElementsByTagName("dc-element")[0]) {
    return false;
  }
  if (!field.getElementsByTagName("input-type")[0]) {
    return false;
  }
  if (!field.getElementsByTagName("repeatable")[0]) {
    return false;
  }

  return true;
}

export function validateXmlValuePairsStructure (xmlString: string): boolean {
  // Crear un parser XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Verificar si hay errores de parsing
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    return false;
  }

  // Verificar la estructura básica
  const valuePairs = xmlDoc.getElementsByTagName("value-pairs")[0];
  if (!valuePairs) {
    return false;
  }

  const pair = valuePairs.getElementsByTagName("pair")[0];
  if (!pair) {
    return false;
  }

  // Verificar los elementos requeridos dentro de pair
  const requiredElements = ["displayed-value", "stored-value"];
  for (const elementName of requiredElements) {
    if (!pair.getElementsByTagName(elementName)[0]) {
      return false;
    }
  }

  return true;
}

export function validateXmlFileStructure (xmlString: string | null): boolean {
  // Crear un parser XML
  if (!xmlString) {
    return false;
  }
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Verificar si hay errores de parsing
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    return false;
  }

  // Verificar la estructura básica
  const rootElement = xmlDoc.getElementsByTagName("input-forms")[0];
  if (!rootElement) {
    return false;
  }
  
  const formDefinitions = rootElement.getElementsByTagName("form-definitions")[0];
  if (!formDefinitions) {
    return false;
  }

  const forms = formDefinitions.getElementsByTagName("form");

  if (forms.length === 0) {
    return false;
  }
  
  for (const form of Array.from(forms)) {
    if (!form.getAttribute("name")) {
      return false;
    }

    const rows = form.getElementsByTagName("row");
    if (rows.length === 0) {
      return false;
    }

    for (const row of Array.from(rows)) {
      const fields = row.getElementsByTagName("field");
      if (fields.length === 0) {
        return false;
      }

      for (const field of Array.from(fields)) {
        const requiredElements = ["dc-schema", "dc-element", "label", "input-type", "repeatable", "required", "hint"];
        for (const elementName of requiredElements) {
          if (!field.getElementsByTagName(elementName)[0]) {
            return false;
          }
        }

        if (!field.getElementsByTagName("dc-schema")[0]) {
          return false;
        }
        if (!field.getElementsByTagName("dc-element")[0]) {
          return false;
        }
        if (!field.getElementsByTagName("input-type")[0]) {
          return false;
        }
        if (!field.getElementsByTagName("repeatable")[0]) {
          return false;
        }
      }
    }
  }

  const formValuePairs = rootElement.getElementsByTagName("form-value-pairs")[0];

  if (!formValuePairs) {
    return false;
  }

  const valuePairs = formValuePairs.getElementsByTagName("value-pairs");

  if (valuePairs.length === 0) {
    return false;
  }

  for (const valuePair of Array.from(valuePairs)) {
    const pairs = valuePair.getElementsByTagName("pair");

    if (pairs.length === 0) {
      return false;
    }

    for (const pair of Array.from(pairs)) {
      const requiredElements = ["displayed-value", "stored-value"];
      for (const elementName of requiredElements) {
        if (!pair.getElementsByTagName(elementName)[0]) {
          return false;
        }
      }
    }
  }

  return true;
}