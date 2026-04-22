import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GitPullRequestArrow, UploadCloud } from "lucide-react";
import { fetchProject, saveProjectFile, uploadProjectFile } from "../services/projectService";
import { fetchPullRequests, createPullRequest } from "../services/pullRequestService";
import { RepositoryTree } from "../components/RepositoryTree";
import { EditorPanel } from "../components/EditorPanel";
import { Timeline } from "../components/Timeline";
import { useSocket } from "../hooks/useSocket";

export const ProjectPage = ({ theme, onNotify, onSearchIndex }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket(true);
  const [project, setProject] = useState(null);
  const [pullRequests, setPullRequests] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    socket?.emit("project:join", projectId);
  }, [projectId, socket]);

  useEffect(() => {
    fetchProject(projectId).then((result) => {
      setProject(result);
      const firstFile = result.files?.find((file) => file.type === "file");
      setSelectedFile(firstFile || null);
      onSearchIndex(
        (result.files || []).map((file) => ({
          id: file._id || file.path,
          type: "file",
          label: file.path,
          to: `/projects/${projectId}`
        }))
      );
    });
    fetchPullRequests(projectId).then(setPullRequests);
  }, [onSearchIndex, projectId]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleFileSaved = ({ path }) => {
      onNotify({
        id: crypto.randomUUID(),
        title: "File synced",
        body: `${path} updated in realtime.`
      });
    };

    socket.on("project:fileSaved", handleFileSaved);
    socket.on("pullRequest:created", (pullRequest) => setPullRequests((current) => [pullRequest, ...current]));

    return () => {
      socket.off("project:fileSaved", handleFileSaved);
      socket.off("pullRequest:created");
    };
  }, [onNotify, socket]);

  const saveFile = async (file) => {
    const files = await saveProjectFile(projectId, file);
    setProject((current) => ({ ...current, files }));
    setSelectedFile((current) => (current?.path === file.path ? { ...current, content: file.content } : current));
  };

  const handleUpload = async (event) => {
    const [file] = event.target.files;
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", `src/${file.name}`);
    const files = await uploadProjectFile(projectId, formData);
    setProject((current) => ({ ...current, files }));
    onNotify({
      id: crypto.randomUUID(),
      title: "File uploaded",
      body: `${file.name} added to the repository.`
    });
  };

  const handleCreatePullRequest = async () => {
    if (!selectedFile) {
      return;
    }

    const pullRequest = await createPullRequest(projectId, {
      title: `Review ${selectedFile.name}`,
      description: "Autosaved changes ready for feedback.",
      changedFiles: [{ path: selectedFile.path, before: "", after: selectedFile.content }]
    });
    navigate(`/projects/${projectId}/pull-requests/${pullRequest._id}`);
  };

  const versionMarks = useMemo(
    () => (project?.activity || []).slice(0, 6).map((item, index) => ({ id: item._id || index, label: item.summary })),
    [project]
  );

  if (!project) {
    return <div className="glass-panel rounded-[28px] p-8 text-slate-300">Loading project workspace...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[32px] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Repository workspace</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{project.name}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <UploadCloud size={16} className="mr-2 inline" />
              Drag or upload
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
            <button
              onClick={handleCreatePullRequest}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-4 py-3 text-sm font-medium text-slate-950"
            >
              <GitPullRequestArrow size={16} className="mr-2 inline" />
              Open Pull Request
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Version history slider</p>
          <div className="mt-6">
            <input type="range" min="0" max={Math.max(versionMarks.length - 1, 0)} className="w-full accent-cyan-400" />
            <div className="mt-4 flex flex-wrap gap-2">
              {versionMarks.map((mark) => (
                <motion.span key={mark.id} whileHover={{ y: -2 }} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                  {mark.label}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.32fr_0.68fr]">
        <div className="space-y-6">
          <RepositoryTree files={project.files || []} selectedPath={selectedFile?.path} onSelect={setSelectedFile} />
          <Timeline events={project.activity || []} />
        </div>
        <div className="space-y-6">
          <EditorPanel file={selectedFile} theme={theme} onSave={saveFile} />
          <div className="glass-panel rounded-[28px] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Open pull requests</h3>
              <span className="text-xs text-slate-500">{pullRequests.length} active</span>
            </div>
            <div className="space-y-3">
              {pullRequests.map((pullRequest) => (
                <button
                  key={pullRequest._id}
                  onClick={() => navigate(`/projects/${projectId}/pull-requests/${pullRequest._id}`)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left"
                >
                  <div>
                    <p className="font-medium text-white">{pullRequest.title}</p>
                    <p className="text-sm text-slate-400">{pullRequest.status.replace("_", " ")}</p>
                  </div>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
                    {pullRequest.changedFiles?.length || 0} files
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
