export interface ValuePair {
  id: string;
  displayedValue: string;
  storedValue: string;
}

export interface ValuePairGroup {
  id: string;
  name: string;
  pairs: ValuePair[];
}