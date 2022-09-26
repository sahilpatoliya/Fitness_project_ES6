import chai from "chai";
import chaihttp from "chai-http";
import server from "../server.js";

chai.should();

chai.use(chaihttp);

describe("This is User Api", () => {
  // describe("Post /api/user/signup", () => {
  //   it("it is a Post request", (done) => {
  //     const user = {
  //       email: "hxXat9axxXac3@gmail.com",
  //       password: "9978923484",
  //       completed: false,
  //     };
  //     chai
  //       .request(server)
  //       .post("/api/user/signup")
  //       .send(user)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a("object");
  //         res.body.message.should.have.property("email").eq(user.email);
  //         res.body.message.should.have.property("enc_password");
  //         // response.body.should.have.property("completed").eq(false);
  //         done();
  //       });
  //   });

  //verification

  //verification
  describe("get /api/user/verification/:uuid", () => {
    it("it is a verification request", async (done) => {
      const uuid = "HKzI97A6ftLkVFwT";

      chai
        .request(server)
        //.set("uuid", user.uuid)
        .get("/api/user/verification/" + uuid)
        // .send("status", status)
        .end((err, res) => {
          if (res.body.userStatus == 1) {
            res.should.have.status(400);
            res.body.messages.should.be.eq("user is already verifyed");

            done();
          } else {
            res.should.have.status(200);

            res.body.messages.should.be.eq("user is successfully verified");
            done();
          }
        });
    });
  });
});
