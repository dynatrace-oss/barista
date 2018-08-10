export class DtRouterFragmentBuilder {
  static build(ids: Set<string>): string {
    return ids.size > 0 ? Array.from(ids).join(',') : '';
  }
}
