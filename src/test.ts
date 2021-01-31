import test from "ava";
import { testProp, fc } from "ava-fast-check";

import { atLeast, atMost } from "./";

/////////////////////////////// Example tests ////////////////////////////////

test("atLeast", (t) => {
  t.is(atLeast(3).clamp(0), 3);
  t.is(atLeast(3).clamp(10), 10);
});

test("atMost", (t) => {
  t.is(atMost(3).clamp(0), 0);
  t.is(atMost(3).clamp(10), 3);
});

test("combine the two", (t) => {
  t.is(atLeast(3).atMost(7).clamp(0), 3);
  t.is(atMost(7).atLeast(3).clamp(0), 3);
});

test("narrow atLeast", (t) => {
  t.is(atLeast(3).atLeast(7).clamp(0), 7);
  t.is(atLeast(7).atLeast(3).clamp(0), 7, "the bounds should not widen");
  t.is(atLeast(3).atLeast(7).clamp(10), 10);
});

test("narrow atMost", (t) => {
  t.is(
    atMost(7).atMost(3).clamp(10),
    3,
    "the range should have gotten smaller"
  );
  t.is(
    atMost(3).atMost(7).clamp(10),
    3,
    "the range should have stayed the same"
  );
  t.is(atMost(3).atMost(7).clamp(0), 0);
});

test("narrow an existing complete range", (t) => {
  let range;

  range = atLeast(3).atMost(10).atMost(7);
  t.is(range.clamp(0), 3);
  t.is(range.clamp(5), 5);
  t.is(range.clamp(10), 7);

  range = atLeast(0).atMost(10).atLeast(3);
  t.is(range.clamp(3), 3);
  t.is(range.clamp(5), 5);
  t.is(range.clamp(0), 3);
});

/////////////////////////////////// Errors ///////////////////////////////////

test("atLeast throws on NaN", (t) => {
  t.throws(() => atLeast(NaN), { instanceOf: RangeError });
});

test("atMost throws on NaN", (t) => {
  t.throws(() => atMost(NaN), { instanceOf: RangeError });
});

test("atMost.atLeast throws on NaN", (t) => {
  t.throws(() => atLeast(0).atMost(NaN), { instanceOf: RangeError });
  t.throws(() => atMost(0).atLeast(NaN), { instanceOf: RangeError });
});

/////////////////////////////// Property tests ///////////////////////////////

testProp(
  "clamped value is always greater than minimum",
  [validNumber(), validNumber()],
  (t, minimum, value) => {
    t.true(atLeast(minimum).clamp(value) >= minimum);
  }
);

testProp(
  "clamped value is less than maximum",
  [validNumber(), validNumber()],
  (t, maximum, value) => {
    t.true(atMost(maximum).clamp(value) <= maximum);
  }
);

testProp(
  "clamped value is always within range",
  [validNumber(), validNumber(), validNumber()],
  (t, a, b, value) => {
    const [min, max] = a < b ? [a, b] : [b, a];
    t.true(atLeast(min).atMost(max).clamp(value) >= min);
    t.true(atLeast(min).atMost(max).clamp(value) <= max);
    t.true(atMost(max).atLeast(min).clamp(value) >= min);
    t.true(atMost(max).atLeast(min).clamp(value) <= max);
  }
);

testProp("atLeast propegates NaNs", [validNumber()], (t, bound) => {
  t.is(atLeast(bound).clamp(NaN), NaN);
});

testProp("atMost propegates NaNs", [validNumber()], (t, bound) => {
  t.is(atMost(bound).clamp(NaN), NaN);
});

testProp(
  "bounded range propegates NaNs",
  [validNumber(), validNumber()],
  (t, a, b) => {
    const [min, max] = a < b ? [a, b] : [b, a];
    t.is(atLeast(min).atMost(max).clamp(NaN), NaN);
  }
);

testProp(
  "atLeast with infinite bound becomes identity function",
  [validNumber()],
  (t, value) => {
    t.is(atLeast(-Infinity).clamp(value), value);
  }
);

testProp(
  "atMost with infinite bound becomes identity function",
  [validNumber()],
  (t, value) => {
    t.is(atMost(Infinity).clamp(value), value);
  }
);

testProp(
  "bounded range with infinite bounds becomes identity function",
  [validNumber()],
  (t, value) => {
    t.is(atLeast(-Infinity).atMost(Infinity).clamp(value), value);
    t.is(atMost(Infinity).atLeast(-Infinity).clamp(value), value);
  }
);

testProp("clamping the bound gives the bound", [validNumber()], (t, bound) => {
  t.is(atLeast(bound).clamp(bound), bound);
  t.is(atMost(bound).clamp(bound), bound);
  t.is(atLeast(bound).atMost(bound).clamp(bound), bound);
  t.is(atMost(bound).atMost(bound).clamp(bound), bound);
});

testProp(
  "contradictory bounds throw errors",
  [uniquePairOfNumbers()],
  (t, [a, b]) => {
    const [smaller, bigger] = a < b ? [a, b] : [b, a];
    t.throws(() => atLeast(bigger).atMost(smaller), { instanceOf: RangeError });
    t.throws(() => atMost(smaller).atLeast(bigger), { instanceOf: RangeError });
  }
);

/**
 * A number, finite or non-finite. Cannot yield NaN.
 */
function validNumber() {
  return fc.double({ next: true, noNaN: true });
}

function uniquePairOfNumbers() {
  return fc.tuple(validNumber(), validNumber()).filter(([a, b]) => a !== b);
}
