const express = require("express");
const cors = require("cors");
const dimse = require("dicom-dimse-native");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/dicom/ping", express.json(), async (req, res) => {
  const { ip, port, aet_server, aet_client = "MY_CLIENT_AE" } = req.body;

  if (!ip || !port || !aet_server) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields" });
  }

  try {
    await dimse.CEchoSCU({
      source: { aet: aet_client },
      target: { host: ip, port, aet: aet_server },
    });

    res.json({ ok: true, status: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/", (_, res) => {
  res.send("dicom-dimse-native server running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
