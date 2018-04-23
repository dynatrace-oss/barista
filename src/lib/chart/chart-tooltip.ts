export function defaultTooltipFormatter(): string | boolean {
  // tslint:disable-next-line no-console
  console.warn('DefaultTooltipFormatter used - please specify a custom tooltip.formatter');

  return this.series.name;
}
