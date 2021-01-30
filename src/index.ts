interface Clamper {
  clamp(value: number): number;
  atMost(value: number): Clamper;
}

export function atLeast(minimum: number): Clamper {
  return {
    clamp(value: number) {
      return Math.max(minimum, value);
    },
    atMost: notImplemeted,
  };
}

export function atMost(maximum: number): Clamper {
  return {
    clamp(value: number) {
      return Math.min(maximum, value);
    },
    atMost: notImplemeted,
  };
}

function notImplemeted(): Clamper {
  throw new Error("not implemented");
}
