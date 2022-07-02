import { regexRefresher } from "../utils/regex.util";

export const startQuote = regexRefresher(/^\\?[\'\"]/gi);
export const endQuote = regexRefresher(/\\?[\'\"]$/gi);
