import { IImport } from 'import-sort-parser';
import { IStyleAPI, IStyleItem } from 'import-sort-style';

// tslint:disable-next-line:no-default-export
export default function(styleApi: IStyleAPI): IStyleItem[] {
  const {
    alias,
    and,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = styleApi;

  const dtAngularComponentsLib = '@dynatrace/angular-components';
  const isDynatraceComponentsModule = (i: IImport) =>
    i.moduleName.startsWith(dtAngularComponentsLib);
  const isNotDynatraceComponentsModule = (i: IImport) =>
    !i.moduleName.startsWith(dtAngularComponentsLib);

  return [
    // import … from "fs";
    {
      match: and(isNodeModule, isNotDynatraceComponentsModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import "foo"
    {
      match: and(hasNoMember, isAbsoluteModule, isNotDynatraceComponentsModule),
    },
    { separator: true },

    // import … from "foo";
    {
      match: and(isAbsoluteModule, isNotDynatraceComponentsModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "@dynatrace/angular-components/...";
    {
      match: and(isAbsoluteModule, isDynatraceComponentsModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },
    { separator: true },

    // import … from "./foo";
    // import … from "../foo";
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
  ];
}
