const FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const TODAY = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export const formatDateTime = (iso: string) => {
  try {
    return FMT.format(new Date(iso));
  } catch {
    return iso;
  }
};

export const formatDate = (iso: string) => {
  try {
    return SHORT.format(new Date(iso));
  } catch {
    return iso;
  }
};

export const formatToday = (d = new Date()) => TODAY.format(d);
