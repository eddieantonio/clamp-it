///////////////////////////////// Public API /////////////////////////////////

export function atLeast(minimum: number): Clamper {
  return new AtLeast(minimum);
}

export function atMost(maximum: number): Clamper {
  return new AtMost(maximum);
}

////////////////////////////// Internal classes //////////////////////////////

interface Clamper {
  clamp(value: number): number;
  atMost(value: number): Clamper;
  atLeast(value: number): Clamper;
}

class AtLeast implements Clamper {
  private _min: number;

  constructor(minimum: number) {
    this._min = minimum;
  }

  clamp(value: number) {
    return Math.max(this._min, value);
  }

  atLeast(): Clamper {
    return notImplemeted();
  }

  atMost(maximum: number): Clamper {
    return new ClosedClamper(this._min, maximum);
  }
}

class AtMost implements Clamper {
  private _max: number;

  constructor(maximum: number) {
    this._max = maximum;
  }

  clamp(value: number) {
    return Math.min(this._max, value);
  }

  atLeast(minimum: number): Clamper {
    return new ClosedClamper(minimum, this._max);
  }

  atMost(_value: number): Clamper {
    notImplemeted();
  }
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

  atLeast(): Clamper {
    return notImplemeted();
  }

  atMost(): Clamper {
    return notImplemeted();
  }
}

function notImplemeted(): never {
  throw new Error("not implemented");
}
