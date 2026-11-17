import { createContext, useContext } from "react";

/**
 * The programme LMS (/classroom/<programme>/…) shares a little state with the pages inside it. The lesson page
 * reads it to offer focus mode, which hides the LMS menu while reading. Outside the LMS it's null.
 */
export type LmsShell = { focus: boolean; setFocus: (on: boolean) => void };
export const LmsShellContext = createContext<LmsShell | null>(null);
export const useLmsShell = () => useContext(LmsShellContext);
