import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/65 p-4 backdrop-blur-xl light-mode:bg-slate-200/50"
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
            className="card w-full max-w-xl space-y-6 rounded-[28px] p-7"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">New workspace</p>
                <h3 className="pt-2 font-display text-2xl font-semibold text-neutral-100 light-mode:text-neutral-900">Create project</h3>
                <p className="mt-1 text-sm text-neutral-500 light-mode:text-neutral-600">Start a new space for code reviews</p>
              </div>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="ghost-button h-10 w-10 rounded-full p-0 text-neutral-400"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300 light-mode:text-neutral-700">Project name</label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="My Project"
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300 light-mode:text-neutral-700">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="What is this project about?"
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300 light-mode:text-neutral-700">Visibility</label>
                <select
                  value={form.visibility}
                  onChange={(event) => setForm((current) => ({ ...current, visibility: event.target.value }))}
                  className="input-field"
                >
                  <option value="private">Private</option>
                  <option value="team">Team</option>
                  <option value="public">Public</option>
                </select>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  {error}
                </motion.div>
              )}
            </div>

            <div className="flex gap-3 border-t pt-4 divider">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="ghost-button flex-1 rounded-2xl disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitting}
                className="pill-button flex-1 rounded-2xl disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create"}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
