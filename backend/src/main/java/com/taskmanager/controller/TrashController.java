package com.taskmanager.controller;

import com.taskmanager.entity.Folder;
import com.taskmanager.entity.Task;
import com.taskmanager.repository.FolderRepository;
import com.taskmanager.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trash")
@CrossOrigin(origins = "*")
public class TrashController {

    private final TaskRepository taskRepository;
    private final FolderRepository folderRepository;

    public TrashController(TaskRepository taskRepository, FolderRepository folderRepository) {
        this.taskRepository = taskRepository;
        this.folderRepository = folderRepository;
    }

    @GetMapping("/tasks")
    public List<Task> getDeletedTasks() {
        return taskRepository.findByDeletedAtIsNotNull();
    }

    @GetMapping("/folders")
    public List<Folder> getDeletedFolders() {
        return folderRepository.findByDeletedAtIsNotNull();
    }

    @PostMapping("/tasks/{id}/restore")
    public ResponseEntity<Task> restoreTask(@PathVariable Long id) {
        return taskRepository.findById(id).map(task -> {
            task.setDeletedAt(null);
            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    @PostMapping("/folders/{id}/restore")
    public ResponseEntity<Folder> restoreFolder(@PathVariable Long id) {
        return folderRepository.findById(id).map(folder -> {
            folder.setDeletedAt(null);
            folderRepository.save(folder);
            List<Task> tasks = taskRepository.findByFolderId(id);
            tasks.forEach(task -> task.setDeletedAt(null));
            taskRepository.saveAll(tasks);
            return ResponseEntity.ok(folder);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> permanentDeleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @DeleteMapping("/folders/{id}")
    public ResponseEntity<Void> permanentDeleteFolder(@PathVariable Long id) {
        if (!folderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteByFolderId(id);
        folderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
