const RESET_COLOR = "\x1b[0m";

const GREEN_COLOR = "\x1b[32m";
const RED_COLOR = "\x1b[31m";
const YELLOW_COLOR = "\x1b[33m";
const BLUE_COLOR = "\x1b[34m";
const MAGENTA_COLOR = "\x1b[35m";
const CYAN_COLOR = "\x1b[36m";

const flagByLanguage = {
  en: "🇬🇧 ",
  fr: "🇫🇷 "
};

const replaceLanguageWithFlag = args =>
  args.map(s =>
    s.replace("(en)", flagByLanguage.en).replace("(fr)", flagByLanguage.fr)
  );

const log = (logLevel, color, args, flag = true) =>
  console[logLevel](
    color,
    flag ? `[${logLevel.toUpperCase()}]` : "",
    ...replaceLanguageWithFlag(args),
    RESET_COLOR
  );

export const logger = {
  debug: (...args) => log("debug", CYAN_COLOR, args),
  info: (...args) => log("info", BLUE_COLOR, args),
  warn: (...args) => log("warn", YELLOW_COLOR, args),
  error: (...args) => log("error", RED_COLOR, args),
  log: (...args) => log("log", MAGENTA_COLOR, args, false),
  red: (...args) => log("info", RED_COLOR, args, false),
  green: (...args) => log("info", GREEN_COLOR, args, false),
  yellow: (...args) => log("info", YELLOW_COLOR, args, false),
  blue: (...args) => log("info", BLUE_COLOR, args, false)
};
