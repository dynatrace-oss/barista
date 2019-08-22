import { PerformanceObserver, performance } from 'perf_hooks';

import { WalkContext } from 'tslint';
import * as ts from 'typescript';

export type MemberDeclaration =
  | ts.GetAccessorDeclaration
  | ts.SetAccessorDeclaration
  | ts.PropertyDeclaration
  | ts.MethodDeclaration;

// tslint:disable-next-line:no-any
export type ContextWalker = (context: WalkContext<any>) => void;

export interface StateContainer {
  [key: string]: any; // tslint:disable-line:no-any
}

export type MemberDeclarationVerifier = (
  context: WalkContext<any>, // tslint:disable-line:no-any
  verifyDeclaration: MemberDeclaration,
  state?: StateContainer,
) => void;

export function verifyGetterSetterState(
  condition: boolean,
  declaration: MemberDeclaration,
  state: StateContainer,
): boolean {
  if (declaration.name.kind !== ts.SyntaxKind.Identifier) {
    throw new Error('MemberDeclaration must be an Identifier');
  }

  const declarationName = declaration.name.text;

  if (ts.isGetAccessorDeclaration(declaration)) {
    if (state[declarationName] === 'set') {
      return true; // setter annotated with @internal already exists
    } else if (condition) {
      state[declarationName] = 'get';
      return true;
    }
  } else if (ts.isSetAccessorDeclaration(declaration)) {
    if (state[declarationName] === 'get') {
      return true; // getter annotated with @internal already exists
    } else if (condition) {
      state[declarationName] = 'set';
      return true;
    }
  } else if (condition) {
    return true;
  }
  return false;
}

export function createMemberDeclarationWalker(
  verifyDeclaration: MemberDeclarationVerifier,
  state?: StateContainer,
): ContextWalker {
  // tslint:disable-next-line:no-any
  return (context: WalkContext<any>) => {
    const verifyNode = (node: ts.Node) => {
      switch (node.kind) {
        case ts.SyntaxKind.GetAccessor:
          verifyDeclaration(context, node as ts.GetAccessorDeclaration, state);
          break;
        case ts.SyntaxKind.SetAccessor:
          verifyDeclaration(context, node as ts.SetAccessorDeclaration, state);
          break;
        case ts.SyntaxKind.PropertyDeclaration:
          verifyDeclaration(context, node as ts.PropertyDeclaration, state);
          break;
        case ts.SyntaxKind.MethodDeclaration:
          verifyDeclaration(context, node as ts.MethodDeclaration, state);
          break;
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.InterfaceDeclaration:
          ts.forEachChild(node, verifyNode);
          break;
        default: // ignore other node types
      }
    };

    ts.forEachChild(context.sourceFile, verifyNode);
  };
}

const globalWithProfiling: NodeJS.Global & {
  _tslintRulesTotalDurations?: { [ruleName: string]: number };
} = global;

function setUpProfiling(): void {
  globalWithProfiling._tslintRulesTotalDurations = {};

  process.on('exit', () => {
    const totalDurations = globalWithProfiling._tslintRulesTotalDurations;

    for (const ruleName in totalDurations) {
      if (totalDurations.hasOwnProperty(ruleName)) {
        // tslint:disable-next-line:no-console
        console.log(
          `Total duration for "${ruleName}": ${totalDurations[ruleName]}ms`,
        );
      }
    }
  });
}

export function startProfiling(ruleName: string): void {
  if (globalWithProfiling._tslintRulesTotalDurations === undefined) {
    setUpProfiling();
  }

  const totalDurations = globalWithProfiling._tslintRulesTotalDurations!;

  totalDurations[ruleName] = 0;

  const performanceObserver = new PerformanceObserver(items => {
    const duration = items.getEntries()[0].duration;

    totalDurations[ruleName] += duration;
    performance.clearMarks();
  });

  performanceObserver.observe({ entryTypes: ['measure'] });
  performance.mark(`${ruleName}-start`);
}

export function stopProfiling(ruleName: string): void {
  performance.mark(`${ruleName}-stop`);
  performance.measure(
    `${ruleName}-start to ${ruleName}-stop`,
    `${ruleName}-start`,
    `${ruleName}-stop`,
  );
}
