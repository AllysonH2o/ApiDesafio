interface Distance {
  text: string;
  value: number;
}

interface Element {
  distance: Distance;
}

interface Row {
  elements: Element[];
}

export interface DistanceMatrix {
  rows: Row[];
}
