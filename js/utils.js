// reduce: collapse an array into one value (here, an object of groups)
export const groupByStatus = (tasks) =>
  tasks.reduce((groups, task) => {
    const { status } = task; // destructuring
    return { ...groups, [status]: [...(groups[status] ?? []), task] };
  }, {});

export const totalHours = (tasks) =>
  tasks.reduce((sum, { hours }) => sum + hours, 0);

// filter: keep only items that pass a test
export const progressPercent = (tasks) => {
  const done = tasks.filter((task) => task.status === "done").length;
  return Math.round((done / tasks.length) * 100);
};