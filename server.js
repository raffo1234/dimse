const express = require("express");
const cors = require("cors");
const dimse = require("dicom-dimse-native");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/dicom/ping", (req, res) => {
  const { ip, port, aet_server, aet_client = "MY_CLIENT_AE" } = req.body;

  if (!ip || !port || !aet_server) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields" });
  }

  const echoScu = new dimse.CEchoSCU();
  echoScu
    .start({
      callingAETitle: aet_client,
      calledAETitle: aet_server,
      host: ip,
      port: Number(port),
    })
    .then(() => {
      res.json({ ok: true, status: true });
    })
    .catch((err) => {
      res.status(500).json({ ok: false, error: err.message });
    });
});

app.get("/", (_, res) => {
  res.send("dicom-dimse-native server running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
