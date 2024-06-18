import { useEffect, useState } from "react";
import "./App.css";
import { GithubRepoResponse } from "./interface";
import axios from "axios";
import RepoItem from "./components/RepoItem";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function App() {
  const [repos, setRepos] = useState<GithubRepoResponse[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<GithubRepoResponse>();
  const [isOpen, setIsOpen] = useState(false);

  function openModal(repo: GithubRepoResponse) {
    setSelectedRepo(repo);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedRepo(undefined);
  }

  const fetchRepos = async () => {
    try {
      const { data } = await axios.get<GithubRepoResponse[]>(
        "https://welast-backend.vercel.app/repos",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRepos(data);
      setLanguages(
        data.reduce((prev: string[], next) => {
          if (next.language && !prev.includes(next.language)) {
            prev.push(next.language);
          }
          return prev;
        }, [])
      );
    } catch (err: any) {
      console.log("Failed to fetch repositories");
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div className="App">
      <header className="App-header px-10">
        <div className="flex gap-x-4 items-center py-6">
          <p className="font-semibold">Languages:</p>
          <button
            className={`text-sm border  px-2 py-1 rounded-lg ${
              selectedLanguage === ""
                ? "bg-white border-gray-600 text-black"
                : "border-gray-100 text-white"
            }`}
            onClick={() => setSelectedLanguage("")}
          >
            All
          </button>
          {languages.map((language) => (
            <button
              className={`text-sm border  px-2 py-1 rounded-lg ${
                language === selectedLanguage
                  ? "bg-white border-gray-600 text-black"
                  : "border-gray-100 text-white"
              }`}
              onClick={() => setSelectedLanguage(language)}
            >
              {language}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {repos
            .filter(
              (repo) => !selectedLanguage || repo.language === selectedLanguage
            )
            .map((repo) => (
              <RepoItem repo={repo} onClick={() => openModal(repo)} />
            ))}
        </div>
      </header>
      {selectedRepo ? (
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Last Commit Message"
        >
          <div className="relative">
            <p>Git commit urls: {selectedRepo.git_commits_url}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 absolute -top-5 -right-5 cursor-pointer"
              onClick={closeModal}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export default App;
