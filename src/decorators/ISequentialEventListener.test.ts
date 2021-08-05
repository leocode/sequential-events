import { isEvent } from '../ISequentialEventListener';

describe('ISequentialEventListener', () => {
  describe('#isEvent', () => {
    it('should detect Event interface implementation', () => {
      expect(isEvent({ type: 'someType' })).toEqual(true);
      expect(isEvent({ type: null })).toEqual(true);
      expect(isEvent({ type: '' })).toEqual(true);
      expect(isEvent({ type: 0 })).toEqual(true);
      expect(isEvent({ type: {} })).toEqual(true);
    });

    it('should recognize non-Event implementations', () => {
      expect(isEvent({})).toEqual(false);
      expect(isEvent({ type: undefined })).toEqual(false);
    });
  });
});
