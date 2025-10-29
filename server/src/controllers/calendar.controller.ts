// import { Response } from "express";
// import { Task } from "../models/task.model";
// import { AuthenticatedRequest } from "../middleware/authMiddleware";

// // Fetch tasks matching date for calendar view
// export const getCalendarTasks = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const { date } = req.query;

//     // Query tasks matching the requested date
//     const query: any = {};
//     if (date) query.date = date;

//     // No user filtering if createdBy is optional or null
//     // If you want to filter by user, uncomment and ensure req.user is available
//     // const userId = req.user?.id;
//     // if (!userId) return res.status(401).json({ message: "Unauthorized" });
//     // query.$or = [{ createdBy: userId }, { assignedTo: userId }];

//     const tasks = await Task.find(query).sort({ date: 1 });

//     res.json(
//       tasks.map((task) => ({
//         id: task._id,
//         title: task.title,
//         date: task.date,
//         description: task.description,
//         project: task.project,
//         time: task.time,
//       }))
//     );
//   } catch (error) {
//     console.error("Error fetching calendar tasks:", error);
//     res.status(500).json({ message: "Failed to fetch tasks for calendar" });
//   }
// };


import { Response } from "express";
import { Task } from "../models/task.model";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const getCalendarTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date } = req.query;

    const query: any = {};
    if (date) query.date = date;

    const tasks = await Task.find(query).sort({ date: 1 });

    res.json({ tasks }); // Return as object with tasks array property
  } catch (error) {
    console.error("Error fetching calendar tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks for calendar" });
  }
};
