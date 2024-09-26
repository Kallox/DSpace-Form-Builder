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
  if (!form || form.getAttribute("name") !== "bitstream-metadata") {
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
  if (field.getElementsByTagName("dc-schema")[0].textContent !== "dc") {
    return false;
  }
  if (field.getElementsByTagName("dc-element")[0].textContent !== "title") {
    return false;
  }
  if (field.getElementsByTagName("input-type")[0].textContent !== "onebox") {
    return false;
  }
  if (field.getElementsByTagName("repeatable")[0].textContent !== "false") {
    return false;
  }

  return true;
}