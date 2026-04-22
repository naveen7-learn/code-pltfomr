export const createLineDiff = (before = "", after = "") => {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const max = Math.max(beforeLines.length, afterLines.length);

  return Array.from({ length: max }).map((_, index) => {
    const left = beforeLines[index] ?? "";
    const right = afterLines[index] ?? "";

    if (left === right) {
      return { type: "same", left, right, line: index + 1 };
    }

    if (left && !right) {
      return { type: "removed", left, right: "", line: index + 1 };
    }

    if (!left && right) {
      return { type: "added", left: "", right, line: index + 1 };
    }

    return { type: "modified", left, right, line: index + 1 };
  });
};
