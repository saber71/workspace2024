import axios from "axios";

const res = await axios.post("/user/login", {
  loginNameOrEmail: "default-user",
  password: "123456",
});
console.log(res.data);

await axios.post("/user/create", { name: "dsa", password: "123456" });
