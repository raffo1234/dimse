const express = require("express");
const cors = require("cors");
const { echoScu } = require("dicom-dimse-native");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/dicom/ping", (req, res) => {
  const { ip, port, aet_server, aet_client = "MY_AE" } = req.body;

  if (!ip || !port || !aet_server) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing ip, port, or aet_server" });
  }

  const options = {
    source: {
      aet: aet_client,
      ip: "0.0.0.0",
      port: 9999, // local ephemeral port for initiating request
    },
    target: {
      aet: aet_server,
      ip,
      port: parseInt(port),
    },
    verbose: true,
  };

  echoScu(options, (result) => {
    try {
      const response = JSON.parse(result);
      if (response.success) {
        res.json({ ok: true, status: "C-ECHO Success", response });
      } else {
        res.status(500).json({
          ok: false,
          error: response.error || "C-ECHO failed",
          response,
        });
      }
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: "Invalid JSON from echoScu",
        details: result,
      });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ DICOM server listening on http://localhost:${PORT}`);
});
