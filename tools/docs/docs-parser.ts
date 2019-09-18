import { relative } from 'path';

import * as ts from 'typescript';

import {
  ClassDocEntry,
  ConstructorDocEntry,
  DocEntry,
  FunctionDocEntry,
  InputDocEntry,
  OutputDocEntry,
  PackageDocEntry,
  PropDocEntry,
} from './types';

export class DocsParser {
  private _program: ts.Program;
  private _typeChecker: ts.TypeChecker;

  constructor(
    public basePath: string,
    public options: ts.CompilerOptions,
    public rootFileNames: string[],
  ) {
    const host = ts.createCompilerHost(this.options, true);
    this._program = ts.createProgram(this.rootFileNames, this.options, host);
    this._typeChecker = this._program.getTypeChecker();
  }

  run(): PackageDocEntry[] {
    const packages = new Map<string, PackageDocEntry>();
    for (const sourceFile of this._program.getSourceFiles()) {
      if (
        !sourceFile.isDeclarationFile &&
        !this._program.isSourceFileFromExternalLibrary(sourceFile)
      ) {
        const relativePath = this._getProjectRelativePath(sourceFile.fileName);
        const packageName = this._getPackageName(relativePath);
        if (packageName) {
          let pkg = packages.get(packageName);
          if (!pkg) {
            pkg = new PackageDocEntry(packageName, [], relativePath, '');
            packages.set(packageName, pkg);
            // console.log(`Parsing package "${packageName}"`);
          }
          const entries = this._visitChildren(sourceFile, relativePath);
          pkg.members.push(...entries);
        }
      }
    }
    return Array.from(packages.values());
  }

  private _visitChildren(node: ts.Node, fileName: string): DocEntry[] {
    const docEntries: DocEntry[] = [];
    ts.forEachChild(node, child => {
      const entry = this._visitNode(child, fileName);
      if (entry) {
        docEntries.push(entry);
      }
    });
    return docEntries;
  }

  private _visitList(
    nodes: ts.Node[] | ts.NodeArray<ts.Node> | ReadonlyArray<ts.Node>,
    fileName: string,
  ): DocEntry[] {
    return nodes.map(node => this._visitNode(node, fileName)).filter(Boolean);
  }

  private _visitNode(node: ts.Node, fileName: string): DocEntry | null {
    const symbol = (node as any).name
      ? this._typeChecker.getSymbolAtLocation((node as any).name)
      : undefined;
    if (symbol && this._isPublic(node, symbol)) {
      if (ts.isClassDeclaration(node) && node.name) {
        return this._visitClassDeclaration(node, symbol, fileName);
      } else if (
        (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) &&
        node.name
      ) {
        return this._visitFunctionDeclaration(node, symbol, fileName);
      } else if (ts.isParameter(node) || ts.isPropertyDeclaration(node)) {
        return this._visitPropertyDeclaration(node, symbol, fileName);
      } else if (ts.isConstructorDeclaration(node)) {
        return this._visitConstructorDeclaration(node, symbol, fileName);
      }
    }
    return null;
  }

  private _visitPropertyDeclaration(
    node: ts.ParameterDeclaration | ts.PropertyDeclaration,
    symbol: ts.Symbol,
    fileName: string,
  ): PropDocEntry {
    const decorators = this._getDecorators(node);
    if (decorators.has('Input')) {
      const overrideAttr = decorators.get('Input')[0];
      return new InputDocEntry(
        overrideAttr && ts.isStringLiteral(overrideAttr)
          ? overrideAttr.text
          : '',
        symbol.getName(),
        this._getTypeOfSymbol(symbol),
        fileName,
        this._getDocOfSymbol(symbol),
      );
    } else if (decorators.has('Output')) {
      const overrideAttr = decorators.get('Output')[0];
      return new OutputDocEntry(
        overrideAttr && ts.isStringLiteral(overrideAttr)
          ? overrideAttr.text
          : '',
        symbol.getName(),
        this._getTypeOfSymbol(symbol),
        fileName,
        this._getDocOfSymbol(symbol),
      );
    } else {
      return new PropDocEntry(
        symbol.getName(),
        this._getTypeOfSymbol(symbol),
        fileName,
        this._getDocOfSymbol(symbol),
      );
    }
  }

  private _visitFunctionDeclaration(
    node: ts.FunctionDeclaration | ts.MethodDeclaration,
    symbol: ts.Symbol,
    fileName: string,
  ): FunctionDocEntry {
    const returnTypeSymbol = this._typeChecker.getSymbolAtLocation(node.type);
    return new FunctionDocEntry(
      returnTypeSymbol ? this._getTypeOfSymbol(returnTypeSymbol) : 'void',
      symbol.getName(),
      this._visitList(node.parameters, fileName) as PropDocEntry[],
      fileName,
      this._getDocOfSymbol(symbol),
    );
  }

  private _visitConstructorDeclaration(
    node: ts.ConstructorDeclaration,
    symbol: ts.Symbol,
    fileName: string,
  ): ConstructorDocEntry {
    return new ConstructorDocEntry(
      symbol.getName(),
      this._visitList(node.parameters, fileName) as PropDocEntry[],
      fileName,
      this._getDocOfSymbol(symbol),
    );
  }

  private _visitClassDeclaration(
    node: ts.ClassDeclaration,
    symbol: ts.Symbol,
    fileName: string,
  ): ClassDocEntry | null {
    const methods: FunctionDocEntry[] = [];
    const properties: PropDocEntry[] = [];
    const constructors: ConstructorDocEntry[] = [];
    const members = this._visitList(node.members, fileName);
    for (const member of members) {
      if (member instanceof FunctionDocEntry) {
        methods.push(member);
      } else if (member instanceof ConstructorDocEntry) {
        constructors.push(member);
      } else if (member instanceof PropDocEntry) {
        properties.push(member);
      }
    }

    return new ClassDocEntry(
      symbol.getName(),
      constructors,
      methods,
      properties,
      fileName,
      this._getDocOfSymbol(symbol),
    );
  }

  private _isPublic(node: ts.Node, symbol?: ts.Symbol) {
    const isPrivate = Boolean(
      node.modifiers &&
        node.modifiers.find(m => m.kind === ts.SyntaxKind.PrivateKeyword),
    );
    const tags = symbol ? symbol.getJsDocTags() : [];
    const isInternal = tags.find(t => t.name === 'internal');
    return !isPrivate && !isInternal && !this._isLifeCycleHook(node);
  }

  private _isLifeCycleHook(node: ts.Node) {
    return (
      ts.isMethodDeclaration(node) &&
      Boolean(
        [
          'ngOnChanges',
          'ngOnInit',
          'ngDoCheck',
          'ngAfterContentInit',
          'ngAfterContentChecked',
          'ngAfterViewInit',
          'ngAfterViewChecked',
          'ngOnDestroy',
        ].find(hook => hook === node.name!.getText()),
      )
    );
  }

  private _getTypeOfSymbol(symbol: ts.Symbol): string {
    return symbol.valueDeclaration
      ? this._typeChecker.typeToString(
          this._typeChecker.getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration!,
          ),
        )
      : '';
  }

  private _getDocOfSymbol(symbol: ts.Symbol): string {
    return ts.displayPartsToString(
      symbol.getDocumentationComment(this._typeChecker),
    );
  }

  private _getDecorators(node: ts.Node): Map<string, ts.Node[]> {
    const dMap = new Map<string, ts.Node[]>();
    if (node.decorators) {
      for (const decorator of node.decorators) {
        if (ts.isCallExpression(decorator.expression)) {
          dMap.set(decorator.expression.expression.getText(), (decorator
            .expression.arguments as unknown) as ts.Node[]);
        }
      }
    }
    return dMap;
  }

  /** Gets the specified path relative to the project root. */
  private _getProjectRelativePath(filePath: string): string {
    return relative(this.basePath, filePath);
  }

  private _getPackageName(relativePath: string): string | null {
    const parts = relativePath.split('/');
    return parts.length > 1 ? parts[0] : null;
  }
}
