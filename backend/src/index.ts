import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { GithubRepoResponse } from "./interface";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const repoUrl = String(process.env.GITHUB_REPO_URL);

const corsOptions = {
  origin: "https://welast.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.get("/repos", async (_req, res) => {
  const { data } = await axios.get<GithubRepoResponse[]>(repoUrl);
  const validRepos = data.filter((repo) => !repo.fork && repo.forks > 5);
  res.json(validRepos);
});

app.listen(port, () => {
  console.log(`[server]: Server is running`);
});
