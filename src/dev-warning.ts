const isProduction: boolean = process.env.NODE_ENV === 'production';

// not replacing newlines (which \s does)
const spacesAndTabs = /[ \t]{2,}/g;
const lineStartWithSpaces = /^[ \t]*/gm;

// using .trim() to clear the any newlines before the first text and after last text
const clean = (value: string): string =>
  value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();

const getDevMessage = (message: string): string =>
  clean(`
  %c@hello-pangea/dnd

  %c${clean(message)}

  %c👷‍ This is a development only message. It will be removed in production builds.
`);

export const getFormattedMessage = (message: string): string[] => [
  getDevMessage(message),
  // title (green400)
  'color: #00C584; font-size: 1.2em; font-weight: bold;',
  // message
  'line-height: 1.5',
  // footer (purple300)
  'color: #723874;',
];

const isDisabledFlag = '__@hello-pangea/dnd-disable-dev-warnings';

export function log(type: 'error' | 'warn', message: string): void {
  // no warnings in production
  if (isProduction) {
    return;
  }

  // manual opt out of warnings
  if (typeof window !== 'undefined' && window[isDisabledFlag as any]) {
    return;
  }

  // eslint-disable-next-line no-console
  console[type](...getFormattedMessage(message));
}

export const warning = log.bind(null, 'warn');
export const error = log.bind(null, 'error');
