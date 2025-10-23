const axios = require("axios");

async function test() {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/login",
      {
        email: "admin@example.com",
        password: "password123",
      },
      { timeout: 5000 }
    );

    console.log("STATUS", res.status);
    console.log("DATA", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("ERROR MESSAGE:", err.message);
    if (err.response) {
      console.error("RESPONSE STATUS:", err.response.status);
      console.error(
        "RESPONSE DATA:",
        JSON.stringify(err.response.data, null, 2)
      );
    }
    if (err.request && !err.response) {
      console.error(
        "NO RESPONSE RECEIVED. REQUEST:",
        err.request._header || err.request
      );
    }
    process.exit(1);
  }
}

test();
