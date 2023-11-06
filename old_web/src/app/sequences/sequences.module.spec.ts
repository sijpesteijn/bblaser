import { SequencesModule } from './sequences.module';

describe('SequencesModule', () => {
  let sequencesModule: SequencesModule;

  beforeEach(() => {
    sequencesModule = new SequencesModule();
  });

  it('should create an instance', () => {
    expect(sequencesModule).toBeTruthy();
  });
});
