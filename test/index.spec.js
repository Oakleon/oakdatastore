"use strict";

import {assert} from 'chai';

describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert([1, 2, 3].indexOf(2) === 1, "Could not find 2");
            assert([1, 2, 3].indexOf(5) === -1, "Found 5, but didn't expect to");
            assert([1, 2, 3].indexOf(0) === -1, "Found 0, but didn't expect to");
        });
    });
});
