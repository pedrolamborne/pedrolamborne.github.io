import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { lamboGPT } from "./lamboAI.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const MEMORY_FILE = "./memory.json";

function loadMemory(){
  if(!fs.existsSync(MEMORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(MEMORY_FILE));
}

function saveMemory(memory){
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory.slice(-10), null, 2));
}

app.post("/chat", async (req,res)=>{
  const { message } = req.body;
  let memory = loadMemory();
  memory.push({ role:"user", content: message });

  const response = await lamboGPT(message, memory);

  memory.push({ role:"assistant", content: response });
  saveMemory(memory);

  res.json({ response });
});

app.listen(process.env.PORT || 3000, ()=>{
  console.log("🔥 LamboGPT Online rodando!");
});
