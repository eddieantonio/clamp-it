///////////////////////////////// Public API /////////////////////////////////

/**
 * Clamp values that must be greater than or equal to the given minimum.
 */
export function atLeast(minimum: number): Clamper {
  return new AtLeast(minimum);
}

/**
 * Clamp values that must be less than or equal to the given minimum.
 */
export function atMost(maximum: number): Clamper {
  return new AtMost(maximum);
}

/**
 * Clamp values that must be bound within a given closed range.
 * The order of the arguments does not matter.
 */
export function within(a: number, b: number): Clamper {
  if (b < a) return new Within(b, a);
  return new Within(a, b);
}

////////////////////////////// Internal classes //////////////////////////////

interface Clamper {
  clamp(value: number): number;
  atMost(maximum: number): Clamper;
  atLeast(minimum: number): Clamper;
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

    if (minimum > maximum) {
      throw new RangeError(
        `contradictory bounds: ${minimum} was not less than or equal to ${maximum}`
      );
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
