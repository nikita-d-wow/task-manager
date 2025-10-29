import express, { Request, Response } from "express";
import { Task } from "../models/task.model";

const router = express.Router();

/**
 * ➕ Create Task
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, date, time, project, assignedTo, createdBy } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newTask = await Task.create({
      title,
      description,
      project: project || "",
      date: date || null,
      time: time || "",
      createdBy: createdBy || null, // allow null or client-provided
      assignedTo: assignedTo || null,
    });

    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
});

/**
 * 📦 Get All Tasks
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "username email")
      .populate("assignedTo", "username email");

    res.json({ success: true, tasks });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
});

/**
 * ✏️ Update Task
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true })
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
});

/**
 * 🗑️ Delete Task
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
});

export default router;


// import express, { Request, Response } from "express";
// import { Task } from "../models/task.model";

// const router = express.Router();

// // ➕ Create Task (no auth)
// router.post("/", async (req: Request, res: Response) => {
//   try {
//     const { title, description, date, time, project, assignedTo } = req.body;

//     if (!title) {
//       return res.status(400).json({ success: false, message: "Title is required." });
//     }

//     const newTask = await Task.create({
//       title,
//       description: description || "",
//       project: project || null,
//       date: date || null,
//       time: time || null,
//       assignedTo: assignedTo || null,
//       createdBy: createdBy || null,
//         });

//     res.status(201).json({ success: true, task: newTask });
//   } catch (error) {
//     console.error("❌ Error creating task:", error);
//     res.status(500).json({ success: false, message: "Failed to create task" });
//   }
// });

// // 📦 Get all tasks
// router.get("/", async (_req: Request, res: Response) => {
//   try {
//     const tasks = await Task.find();
//     res.json({ success: true, tasks });
//   } catch (error) {
//     console.error("❌ Error fetching tasks:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch tasks" });
//   }
// });

// // ✏️ Update Task
// router.put("/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
//     if (!updatedTask) return res.status(404).json({ success: false, message: "Task not found" });

//     res.json({ success: true, task: updatedTask });
//   } catch (error) {
//     console.error("❌ Error updating task:", error);
//     res.status(500).json({ success: false, message: "Failed to update task" });
//   }
// });

// // 🗑️ Delete Task
// router.delete("/:id", async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Task.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ success: false, message: "Task not found" });

//     res.status(204).send();
//   } catch (error) {
//     console.error("❌ Error deleting task:", error);
//     res.status(500).json({ success: false, message: "Failed to delete task" });
//   }
// });

// export default router;
