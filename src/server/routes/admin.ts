import { Router } from "express";
import { projectService } from "../services/ProjectService";

export const adminRouter = Router();

adminRouter.post("/cribr/admin/projects", async (req, res) => {
  try {
    const projectData = req.body;
    const newProject = await projectService.createProject(projectData);
    if (newProject) {
      return res.status(201).json(newProject);
    }
    return res.status(400).json({ error: "Failed to create project" });
  } catch (err: any) {
    console.error("[adminRouter] Create Project Error:", err?.message || err);
    res.status(500).json({ error: "Server error" });
  }
});

adminRouter.put("/cribr/admin/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const projectData = req.body;
    const success = await projectService.updateProject(id, projectData);
    if (success) {
      return res.json({ success: true });
    }
    return res.status(400).json({ error: "Failed to update project" });
  } catch (err: any) {
    console.error("[adminRouter] Update Project Error:", err?.message || err);
    res.status(500).json({ error: "Server error" });
  }
});

adminRouter.delete("/cribr/admin/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await projectService.deleteProject(id);
    if (success) {
      return res.json({ success: true });
    }
    return res.status(400).json({ error: "Failed to delete project" });
  } catch (err: any) {
    console.error("[adminRouter] Delete Project Error:", err?.message || err);
    res.status(500).json({ error: "Server error" });
  }
});
