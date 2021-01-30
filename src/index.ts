interface Clamper {
  clamp(value: number): number;
}

export function atLeast(minimum: number): Clamper {
  return {
    clamp(value: number) {
      return Math.max(minimum, value);
    },
  };
}

export function atMost(_maximum: number): Clamper {
  throw new Error("not implemented");
}
