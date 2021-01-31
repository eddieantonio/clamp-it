interface Clamper {
  clamp(value: number): number;
  atMost(value: number): Clamper;
}

class ClosedClamper implements Clamper {
  private _min: number;
  private _max: number;

  constructor(minimum: number, maximum: number) {
    this._min = minimum;
    this._max = maximum;
  }

  clamp(value: number): number {
    return Math.min(this._max, Math.max(this._min, value));
  }

  atMost(): Clamper {
    return notImplemeted();
  }
}

export function atLeast(minimum: number): Clamper {
  return {
    clamp(value: number) {
      return Math.max(minimum, value);
    },
    atMost(maximum): Clamper {
      return new ClosedClamper(minimum, maximum);
    },
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
