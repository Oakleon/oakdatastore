"use strict";

import _Assert from 'assert';

describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            _Assert([1, 2, 3].indexOf(2) === 1, "Could not find 2");
            _Assert([1, 2, 3].indexOf(5) === -1, "Found 5, but didn't expect to");
            _Assert([1, 2, 3].indexOf(0) === -1, "Found 0, but didn't expect to");
        });
    });
});
