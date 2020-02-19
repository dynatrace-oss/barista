export interface DtLintingRuleOptions {
  name: string;
  category?: string;
  alttext?: string;
  severity: 'warning' | 'error';
}
