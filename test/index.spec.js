import {assert} from 'chai';

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert(-1 === [1,2,3].indexOf(5), "1 wasn't equal!");
      assert(-1 === [1,2,3].indexOf(0), "2 wasn't equal!");
    });
  });
});
