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

class AtLeast implements Clamper {
  private _min: number;

  constructor(minimum: number) {
    this._min = minimum;
  }

  clamp(value: number) {
    return Math.max(this._min, value);
  }

  atMost(maximum: number): Clamper {
    return new ClosedClamper(this._min, maximum);
  }
}

export function atLeast(minimum: number): Clamper {
  return new AtLeast(minimum);
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
