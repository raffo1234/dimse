import express from "express";
import { Client, requests, constants } from "dcmjs-dimse";
import cors from "cors";

const { CEchoRequest } = requests;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Parse JSON bodies

app.post("/cecho", async (req, res) => {
  const { ip, port, aet_server, aet_client = "MY_CLIENT_AE" } = req.body;

  if (!ip || !port || !aet_server) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields: ip, port, aet_server",
    });
  }

  const client = new Client();
  const request = new CEchoRequest();

  const TIMEOUT = 10000;

  const statusPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("C-ECHO timeout after 10s"));
    }, TIMEOUT);

    request.on("response", (res) => {
      clearTimeout(timer);
      const status = res.getStatus();
      resolve(status === constants.Status.Success);
    });

    request.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });

  client.addRequest(request);

  try {
    await client.send(ip, port, aet_client, aet_server);
    const status = await statusPromise;
    res.json({ ok: true, status });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "C-ECHO failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`DICOM DIMSE server running on port ${PORT}`);
});
