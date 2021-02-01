clamp-it
========

![Build](https://github.com/eddieantonio/clamp-it/workflows/Build/badge.svg)

Clamps numbers to given bounds.

Install
-------

    npm install clamp-it --save

Motivation
----------

You may find yourself needing a number to be **at least** a certain
value. So you used `Math.max()`:

```javascript
value = Math.max(0, value); // make sure value is at least 0
```

You may find yourself needing a number to be  **at most** a certain
value. So you used `Math.min()`:

```javascript
value = Math.min(100, value); // value cannot exceed 100
```

You may find yourself needing a number to be **within** a closed range.
So you used both `Math.min()` and `Math.max()`:

```javascript
value = Math.min(100, Math.min(0, value)); // value must be in [0, 100]
```


And you may ask yourself: How did we get here? Why am I using `max` to
specify a minimum. Why am I using `min` to specify a maximum. This
isn't my beautiful house! This isn't my beautiful wife!

![David Byrne doing David Byrne things](https://i.gifer.com/9pon.gif)

Usage
-----

Introducing `clamp-it` — clamps values using easy-to-understand
language!

Need a number to be **at least** a certain value?

```javascript
const { atLeast } = require("clamp-it");

// later:
value = atLeast(0).clamp(value);
```

Need a number to be **at most** a certain value?

```javascript
const { atMost } = require("clamp-it");

// later:
value = atMost(100).clamp(value);
```

Need a number to be **within** a closed range?

```javascript
const { within } = require("clamp-it");

// later:
value = within(0, 100).clamp(value);
```

Or even spicier: 🌶

```javascript
const { atLeast } = require("clamp-it");

// later:
value = atLeast(0).atMost(100).clamp(value);
```

Do I really need this library?
------------------------------

No. You can clamp values the old-fashioned way with `min()` or `max()`.
Or you could write helper functions that delegate to `min()` and `max()` like
so (go ahead and copy-paste this):

```javascript
function atLeast(bound, value) {
  return Math.max(bound, value);
}

function atMost(bound, value) {
  return Math.min(bound, value);
}

function within(lower, upper, value) {
  return Math.min(upper, Math.max(lower, value));
}
```


So why does this library exist?
-------------------------------

I created this repo mostly as an exercise in API design and because
I wanted to try property-based testing in TypeScript.

I wanted an API in which mistakes in its usage would be _obvious_. Hence
the names `atLeast()`, `atMost()`, and `within()`. I wanted to be able
to chain the `atLeast()` with `atMost()` to create a self-documenting
way to specify a closed range.

I also tested a whole bunch of properties and had to decided whether
using `NaNs` as a bound made any sense (spoilers: no).

I don't intend `clamp-it` to be used in production, but you absolutely
can.
