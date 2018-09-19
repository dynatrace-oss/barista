export const parseUrl = (url: string): ParsedUrl => {
  // [IE11] - to be replaced with URL class when support for ie11 is finally dropped
  // tslint:disable-next-line:ban
  const el = document.createElement('a');
  el.href = url;

  return el;
};

export interface ParsedUrl {
  hash: string;

  href: string;

  host: string;

  hostname: string;

  pathname: string;

  port: string;

  protocol: string;

  search: string;
}
