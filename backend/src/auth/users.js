module.exports = [
  { username: "admin", password: "admin", role: "admin" },
  {
    username: "user2",
    password: "pass2",
    role: "user",
    permissions: {
      tables: ["*"],
    },
  },
  {
    username: "user1",
    password: "pass1",
    role: "user",
    permissions: {
      tables: ["SFISM4.R_WIP_TRACKING_T", "SFISM4.R_SN_DETAIL_T"],
    },
  },
];
