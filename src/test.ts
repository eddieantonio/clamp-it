import test from "ava";

import { atLeast } from "./";

test("atLeast", (t) => {
  t.is(atLeast(3).clamp(0), 3);
  t.is(atLeast(3).clamp(10), 10);
});
