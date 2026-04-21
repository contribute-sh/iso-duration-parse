import { describe, expect, it } from "vitest";

import { parseISO8601Duration } from "./index";
import type { Duration } from "./index";

const validCases: ReadonlyArray<readonly [string, Duration]> = [
  [
    "P3Y",
    { years: 3, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
  ],
  [
    "P2M",
    { years: 0, months: 2, days: 0, hours: 0, minutes: 0, seconds: 0 },
  ],
  [
    "P4D",
    { years: 0, months: 0, days: 4, hours: 0, minutes: 0, seconds: 0 },
  ],
  [
    "PT5H",
    { years: 0, months: 0, days: 0, hours: 5, minutes: 0, seconds: 0 },
  ],
  [
    "PT6M",
    { years: 0, months: 0, days: 0, hours: 0, minutes: 6, seconds: 0 },
  ],
  [
    "PT7S",
    { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 7 },
  ],
  [
    "PT0.5S",
    { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0.5 },
  ],
  [
    "P1Y2M3DT4H5M6.75S",
    { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6.75 },
  ],
  [
    "P1YT2H",
    { years: 1, months: 0, days: 0, hours: 2, minutes: 0, seconds: 0 },
  ],
  [
    "P1MT2M",
    { years: 0, months: 1, days: 0, hours: 0, minutes: 2, seconds: 0 },
  ],
  [
    "P0DT0H0M0S",
    { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
  ],
  [
    "P123Y456M789DT10H11M12S",
    { years: 123, months: 456, days: 789, hours: 10, minutes: 11, seconds: 12 },
  ],
];

const invalidCases: ReadonlyArray<string> = [
  "",
  "P",
  "PT",
  "p1Y",
  "P1W",
  "P1S",
  "PT1D",
  "P1Y2D3M",
  "PT1M2H",
  "P1.5Y",
  "PT1.5H",
  "P1DT",
  "P1Y2M3DT4H5M6S7",
  "PT.5S",
];

describe("parseISO8601Duration", () => {
  it.each(validCases)("parses %s", (input, expected) => {
    expect(parseISO8601Duration(input)).toEqual(expected);
  });

  it.each(invalidCases)("rejects %s", (input) => {
    expect(parseISO8601Duration(input)).toBeNull();
  });
});
