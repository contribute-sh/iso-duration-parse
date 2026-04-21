export type Duration = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type DurationKey = keyof Duration;

type NumberToken = {
  end: number;
  raw: string;
  value: number;
};

type ComponentDefinition = {
  key: DurationKey;
  rank: number;
};

const DATE_COMPONENTS: Readonly<Record<"Y" | "M" | "D", ComponentDefinition>> = {
  Y: { key: "years", rank: 0 },
  M: { key: "months", rank: 1 },
  D: { key: "days", rank: 2 },
};

const TIME_COMPONENTS: Readonly<Record<"H" | "M" | "S", ComponentDefinition>> = {
  H: { key: "hours", rank: 0 },
  M: { key: "minutes", rank: 1 },
  S: { key: "seconds", rank: 2 },
};

function createEmptyDuration(): Duration {
  return {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
}

function isDigit(code: number): boolean {
  return code >= 48 && code <= 57;
}

function parseNumberToken(input: string, start: number): NumberToken | null {
  if (!isDigit(input.charCodeAt(start))) {
    return null;
  }

  let end = start;

  while (isDigit(input.charCodeAt(end))) {
    end += 1;
  }

  if (input[end] === ".") {
    const fractionStart = end + 1;

    if (!isDigit(input.charCodeAt(fractionStart))) {
      return null;
    }

    end = fractionStart;

    while (isDigit(input.charCodeAt(end))) {
      end += 1;
    }
  }

  const raw = input.slice(start, end);
  const value = Number(raw);

  if (!Number.isFinite(value)) {
    return null;
  }

  return { end, raw, value };
}

function getDateComponent(designator: string): ComponentDefinition | null {
  switch (designator) {
    case "Y":
      return DATE_COMPONENTS.Y;
    case "M":
      return DATE_COMPONENTS.M;
    case "D":
      return DATE_COMPONENTS.D;
    default:
      return null;
  }
}

function getTimeComponent(designator: string): ComponentDefinition | null {
  switch (designator) {
    case "H":
      return TIME_COMPONENTS.H;
    case "M":
      return TIME_COMPONENTS.M;
    case "S":
      return TIME_COMPONENTS.S;
    default:
      return null;
  }
}

export function parseISO8601Duration(input: string): Duration | null {
  if (input[0] !== "P") {
    return null;
  }

  const duration = createEmptyDuration();
  let index = 1;
  let inTimeSection = false;
  let lastRank = -1;
  let sawAnyComponent = false;
  let sawTimeComponent = false;

  while (index < input.length) {
    if (!inTimeSection && input[index] === "T") {
      inTimeSection = true;
      lastRank = -1;
      index += 1;

      if (index >= input.length) {
        return null;
      }

      continue;
    }

    const numberToken = parseNumberToken(input, index);

    if (numberToken === null) {
      return null;
    }

    index = numberToken.end;

    const designator = input[index];

    if (designator === undefined) {
      return null;
    }

    const component = inTimeSection
      ? getTimeComponent(designator)
      : getDateComponent(designator);

    if (component === null) {
      return null;
    }

    if (component.rank <= lastRank) {
      return null;
    }

    if (numberToken.raw.includes(".") && component.key !== "seconds") {
      return null;
    }

    duration[component.key] = numberToken.value;
    lastRank = component.rank;
    sawAnyComponent = true;

    if (inTimeSection) {
      sawTimeComponent = true;
    }

    index += 1;
  }

  if (!sawAnyComponent) {
    return null;
  }

  if (inTimeSection && !sawTimeComponent) {
    return null;
  }

  return duration;
}
