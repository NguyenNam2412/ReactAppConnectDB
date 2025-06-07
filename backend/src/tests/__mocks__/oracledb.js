// __mocks__/oracledb.js
module.exports = {
  OUT_FORMAT_OBJECT: "mocked_format",
  getConnection: jest.fn().mockResolvedValue({
    execute: jest.fn().mockResolvedValue({
      rows: [{ SERIAL_NUMBER: "'A123456'", MODEL_NAME: "TEST_MODEL" }],
      metaData: [],
    }),
    close: jest.fn(),
  }),
};
