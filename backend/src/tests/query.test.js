jest.mock("oracledb");

const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: ".env.test" });

const token = jwt.sign(
  { username: "test", role: "admin" },
  process.env.SECRET_KEY
);

describe("POST /api/:table (mocked)", () => {
  it("should return mocked data", async () => {
    const res = await request(app)
      .post("/api/MOCKED_TABLE")
      .set("Authorization", `Bearer ${token}`)
      .send({ SERIAL_NUMBER: "A123456" });

    console.log("log", process.env.SECRET_KEY, res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // expect(res.body.data).toEqual(
    //   expect.arrayContaining([
    //     expect.objectContaining({ SERIAL_NUMBER: "MOCKED123" }),
    //   ])
    // );
  });
});
