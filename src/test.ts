import test from "ava";

import { atLeast, atMost } from "./";

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

test("narrow the range", (t) => {
  t.is(atLeast(3).atLeast(7).clamp(0), 7);
  t.is(atLeast(7).atLeast(3).clamp(0), 7);
  t.is(atLeast(3).atLeast(7).clamp(10), 10);
});
