import { DtRate } from './rate/rate';
import { DtBytes } from './bytes/bytes';
import { DtBits } from './bits/bits';
import { DtKilobytes } from './bytes/kilobytes';
import { DtMegabytes } from './bytes/megabytes';
import { DtCount } from './count/count';

describe('PIPES: Chaining order', () => {
  let ratePipe: DtRate;
  let bytePipe: DtBytes;
  let bitsPipe: DtBits;
  let kilobytesPipe: DtKilobytes;
  let megabytesPipe: DtMegabytes;
  let countPipe: DtCount;

  beforeEach(() => {
    ratePipe = new DtRate();
    bytePipe = new DtBytes();
    bitsPipe = new DtBits();
    kilobytesPipe = new DtKilobytes();
    megabytesPipe = new DtMegabytes();
    countPipe = new DtCount();
  });

  it('should create correct outcome for dtBytes | dtRate', () => {
    const byteResult = bytePipe.transform(3000);
    expect(ratePipe.transform(byteResult, 's').toString()).toEqual('3 kB/s');
  });

  it('should create correct outcome for dtRate | dtBytes', () => {
    const rateResult = ratePipe.transform(3000, 's');
    expect(bytePipe.transform(rateResult).toString()).toEqual('3 kB/s');
  });

  it('should create correct outcome for dtBits | dtRate', () => {
    const bitsResult = bitsPipe.transform(3000);
    expect(ratePipe.transform(bitsResult, 'm').toString()).toEqual('3 kbit/m');
  });

  it('should create correct outcome for dtRate | dtBits', () => {
    const rateResult = ratePipe.transform(3000, 'm');
    expect(bitsPipe.transform(rateResult).toString()).toEqual('3 kbit/m');
  });

  it('should create correct outcome for dtKilobytes | dtRate', () => {
    const kBResult = kilobytesPipe.transform(3000);
    expect(ratePipe.transform(kBResult, 's').toString()).toEqual('3 kB/s');
  });

  it('should create correct outcome for dtRate | dtKilobytes', () => {
    const rateResult = ratePipe.transform(3000, 's');
    expect(kilobytesPipe.transform(rateResult).toString()).toEqual('3 kB/s');
  });

  it('should create correct outcome for dtMegabytes | dtRate', () => {
    const mBResult = megabytesPipe.transform(3000000);
    expect(ratePipe.transform(mBResult, 'm').toString()).toEqual('3 MB/m');
  });

  it('should create correct outcome for dtRate | dtMegabytes', () => {
    const rateResult = ratePipe.transform(3000000, 'm');
    expect(megabytesPipe.transform(rateResult).toString()).toEqual('3 MB/m');
  });

  it('should create correct outcome for dtRate | dtCount', () => {
    const rateResult = ratePipe.transform(3000000, 'm');
    expect(countPipe.transform(rateResult).toString()).toEqual('3mil /m');
  });

  it('should create correct outcome for dtCount | dtRate', () => {
    const countResult = countPipe.transform(3000000);
    expect(ratePipe.transform(countResult, 'm').toString()).toEqual('3mil /m');
  });
});
