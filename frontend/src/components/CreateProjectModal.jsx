import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const CreateProjectModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({ name: "", description: "", visibility: "team" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...form,
        name: form.name.trim(),
        description: form.description.trim()
      });
      setForm({ name: "", description: "", visibility: "team" });
      onClose();
    } catch (submitError) {
      setError(submitError?.response?.data?.message || "Could not create project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.94, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
            className="glass-panel w-full max-w-xl rounded-[30px] p-6"
          >
            <h3 className="text-2xl font-semibold text-white">Create a new project space</h3>
            <div className="mt-6 space-y-4">
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Project name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
              />
              <textarea
                rows="4"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="What is this repo about?"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
              />
              <select
                value={form.visibility}
                onChange={(event) => setForm((current) => ({ ...current, visibility: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
              >
                <option value="private">Private</option>
                <option value="team">Team</option>
                <option value="public">Public</option>
              </select>

              {error && (
                <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={onClose} disabled={submitting} className="rounded-2xl px-4 py-3 text-slate-300">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
