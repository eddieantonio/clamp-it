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
    if (isNaN(minimum)) {
      throw new RangeError("bound must be a number, but got NaN");
    }

    this._min = minimum;
  }

  clamp(value: number) {
    return Math.max(this._min, value);
  }

  atLeast(minimum: number): Clamper {
    return new AtLeast(this.clamp(minimum));
  }

  atMost(maximum: number): Clamper {
    return new Within(this._min, maximum);
  }
}

class AtMost implements Clamper {
  private _max: number;

  constructor(maximum: number) {
    if (isNaN(maximum)) {
      throw new RangeError("bound must be a number, but got NaN");
    }

    this._max = maximum;
  }

  clamp(value: number) {
    return Math.min(this._max, value);
  }

  atLeast(minimum: number): Clamper {
    return new Within(minimum, this._max);
  }

  atMost(maximum: number): Clamper {
    return new AtMost(this.clamp(maximum));
  }
}

class Within implements Clamper {
  private _min: number;
  private _max: number;

  constructor(minimum: number, maximum: number) {
    if (isNaN(minimum)) {
      throw new RangeError("minimum must be a number, but got NaN");
    }

    if (isNaN(maximum)) {
      throw new RangeError("maximum must be a number, but got NaN");
    }

    this._min = minimum;
    this._max = maximum;
  }

  clamp(value: number): number {
    return Math.min(this._max, Math.max(this._min, value));
  }

  atLeast(minimum: number): Clamper {
    return new Within(this.clamp(minimum), this._max);
  }

  atMost(maximum: number): Clamper {
    return new Within(this._min, this.clamp(maximum));
  }
}
