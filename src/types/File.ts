import { Form } from "./Form";
import { ValuePairGroup } from "./ValuePairs";

export interface XmlFile {
    forms: Form[];
    valuePairs: ValuePairGroup[];
}