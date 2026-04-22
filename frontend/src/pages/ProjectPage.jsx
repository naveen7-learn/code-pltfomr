import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GitPullRequestArrow, Sparkles, UploadCloud } from "lucide-react";
import { fetchProject, saveProjectFile, uploadProjectFile } from "../services/projectService";
import { fetchPullRequests, createPullRequest } from "../services/pullRequestService";
import { RepositoryTree } from "../components/RepositoryTree";
import { EditorPanel } from "../components/EditorPanel";
import { Timeline } from "../components/Timeline";
import { useSocket } from "../hooks/useSocket";
import { listItemIn, riseIn, staggerContainer } from "../animations/pageTransitions";

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
    return <div className="card rounded-[28px] p-8 text-neutral-300 light-mode:text-slate-700">Loading project workspace...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div {...riseIn} className="card p-6 md:p-7">
          <p className="eyebrow">Repository workspace</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-neutral-100 light-mode:text-slate-950">{project.name}</h1>
          <p className="mt-3 max-w-2xl text-neutral-400 light-mode:text-slate-600">{project.description || "A focused environment for live review collaboration."}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.label whileHover={{ y: -1 }} className="ghost-button cursor-none rounded-2xl px-4 py-3 text-sm">
              <UploadCloud size={16} className="mr-2 inline" />
              Upload file
              <input type="file" className="hidden" onChange={handleUpload} />
            </motion.label>
            <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleCreatePullRequest} className="pill-button rounded-2xl px-4 py-3 text-sm">
              <GitPullRequestArrow size={16} className="mr-2 inline" />
              Open Pull Request
            </motion.button>
          </div>
        </motion.div>

        <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.06 }} className="card p-6 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="surface-label">Version history</p>
              <h2 className="pt-2 text-xl font-semibold text-neutral-100 light-mode:text-slate-950">Recent snapshots</h2>
            </div>
            <div className="floating-orb flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] light-mode:bg-accent-50">
              <Sparkles size={18} className="text-accent-300 light-mode:text-accent-600" />
            </div>
          </div>
          <div className="mt-6">
            <input type="range" min="0" max={Math.max(versionMarks.length - 1, 0)} className="w-full accent-accent-400" />
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="mt-4 flex flex-wrap gap-2">
              {versionMarks.map((mark, index) => (
                <motion.span
                  key={mark.id}
                  {...listItemIn}
                  transition={{ ...listItemIn.transition, delay: 0.03 * index + 0.06 }}
                  whileHover={{ y: -2 }}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-neutral-300 light-mode:border-slate-300/70 light-mode:bg-white/76 light-mode:text-slate-600"
                >
                  {mark.label}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.32fr_0.68fr]">
        <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.08 }} className="space-y-6">
          <RepositoryTree files={project.files || []} selectedPath={selectedFile?.path} onSelect={setSelectedFile} />
          <Timeline events={project.activity || []} />
        </motion.div>
        <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.12 }} className="space-y-6">
          <EditorPanel file={selectedFile} theme={theme} onSave={saveFile} />
          <div className="card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="surface-label">Open pull requests</h3>
              <span className="text-xs text-neutral-500 light-mode:text-slate-500">{pullRequests.length} active</span>
            </div>
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
              {pullRequests.length > 0 ? (
                pullRequests.map((pullRequest, index) => (
                  <motion.button
                    key={pullRequest._id}
                    {...listItemIn}
                    transition={{ ...listItemIn.transition, delay: 0.04 * index + 0.04 }}
                    whileHover={{ y: -2, scale: 1.003 }}
                    onClick={() => navigate(`/projects/${projectId}/pull-requests/${pullRequest._id}`)}
                    className="flex w-full items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-left light-mode:border-slate-300/70 light-mode:bg-white/78"
                  >
                    <div>
                      <p className="font-medium text-neutral-100 light-mode:text-slate-950">{pullRequest.title}</p>
                      <p className="text-sm capitalize text-neutral-500 light-mode:text-slate-500">{pullRequest.status.replace("_", " ")}</p>
                    </div>
                    <span className="rounded-full border border-accent-400/20 bg-accent-500/10 px-3 py-2 text-xs text-accent-200 light-mode:text-accent-700">
                      {pullRequest.changedFiles?.length || 0} files
                    </span>
                  </motion.button>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-white/10 px-4 py-10 text-center light-mode:border-slate-300/80">
                  <p className="text-sm text-neutral-500 light-mode:text-slate-500">No pull requests yet</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
