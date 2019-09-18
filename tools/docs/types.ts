export class DocEntry {
  constructor(public fileName: string, public documentation: string) {}
}

export class PackageDocEntry extends DocEntry {
  constructor(
    public name: string,
    public members: DocEntry[],
    fileName: string,
    documentation: string,
  ) {
    super(fileName, documentation);
  }
}

export class PropDocEntry extends DocEntry {
  constructor(
    public name: string,
    public type: string,
    fileName: string,
    documentation: string,
  ) {
    super(fileName, documentation);
  }
}

export class InputDocEntry extends PropDocEntry {
  constructor(
    public override: string,
    name: string,
    type: string,
    fileName: string,
    documentation: string,
  ) {
    super(name, type, fileName, documentation);
  }
}

export class OutputDocEntry extends InputDocEntry {
  constructor(
    override: string,
    name: string,
    type: string,
    fileName: string,
    documentation: string,
  ) {
    super(override, name, type, fileName, documentation);
  }
}

export class ConstructorDocEntry extends DocEntry {
  constructor(
    public name: string,
    public parameters: PropDocEntry[],
    fileName: string,
    documentation: string,
  ) {
    super(fileName, documentation);
  }
}

export class FunctionDocEntry extends ConstructorDocEntry {
  constructor(
    public returnType: string,
    name: string,
    parameters: PropDocEntry[],
    fileName: string,
    documentation: string,
  ) {
    super(name, parameters, fileName, documentation);
  }
}

export class ClassDocEntry extends DocEntry {
  constructor(
    public name: string,
    public constructors: ConstructorDocEntry[],
    public methods: FunctionDocEntry[],
    public properties: PropDocEntry[],
    fileName: string,
    documentation: string,
  ) {
    super(fileName, documentation);
  }
}
