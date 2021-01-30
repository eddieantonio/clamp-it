interface Clamper {
  atLeast(minumum: number): Clamper;
  clamp(value: number): number;
}

export function atLeast(_minimum: number): Clamper {
  throw Error("not implemented");
}
