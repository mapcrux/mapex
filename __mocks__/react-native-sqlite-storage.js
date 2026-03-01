const mockExecuteSql = jest.fn().mockResolvedValue([{rows: {length: 0, item: jest.fn()}}]);

const mockDb = {
  executeSql: mockExecuteSql,
};

const SQLite = {
  openDatabase: jest.fn().mockResolvedValue(mockDb),
  enablePromise: jest.fn(),
  DEBUG: jest.fn(),
};

module.exports = SQLite;
module.exports.default = SQLite;
