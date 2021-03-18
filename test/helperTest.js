const { assert } = require('chai');

const { exists } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


describe('exists function test', function() {
  it('should return a user with valid email', function() {
    const result = exists(testUsers, "email", "user@example.com")
    const expectedOutput = testUsers["userRandomID"];
    assert.equal(expectedOutput, result)
  });

  it('should return a undefined if user does not exist', function() {
    const result = exists(testUsers, "email", "user26@example.com")
    const expectedOutput = undefined;
    assert.equal(expectedOutput, result)
  });
});
