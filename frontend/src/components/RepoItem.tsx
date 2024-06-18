import { GithubRepoResponse } from "../interface";

export default function RepoItem({
  repo,
  onClick,
}: {
  repo: GithubRepoResponse;
  onClick: () => void;
}) {
  return (
    <div
      className="space-y-2 p-2 border border-gray-100 rounded-md text-sm text-start cursor-pointer"
      onClick={onClick}
    >
      <p>
        <strong>Name:</strong> {repo.full_name}
      </p>
      <p>
        <strong>Description:</strong> {repo.description || ""}
      </p>
      <p>
        <strong>Language:</strong> {repo.language || ""}
      </p>
      <p>
        <strong>Forks:</strong> {repo.forks}
      </p>
    </div>
  );
}
