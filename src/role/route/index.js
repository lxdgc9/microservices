export default function roleRoute(ints, _opts, done) {
  ints.get("/", (_req, rep) => {
    console.log("dhsadhakjdhkas");
    rep.send({ msg: "Hello world" });
  });

  done();
}
