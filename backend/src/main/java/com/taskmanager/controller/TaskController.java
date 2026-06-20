package com.taskmanager.controller;

import com.taskmanager.entity.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Task> getAll() {
        return taskRepository.findByDeletedAtIsNull();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Task> search(@RequestParam(defaultValue = "") String q) {
        if (q.isBlank()) {
            return taskRepository.findByDeletedAtIsNull();
        }
        return taskRepository.findByTitleContainingIgnoreCaseAndDeletedAtIsNull(q);
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task body) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(body.getTitle());
            task.setDescription(body.getDescription());
            task.setStatus(body.getStatus());
            task.setFolderId(body.getFolderId());
            task.setPriority(body.getPriority());
            task.setDueDate(body.getDueDate());
            task.setTags(body.getTags());
            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return taskRepository.findById(id).map(task -> {
            task.setDeletedAt(LocalDateTime.now());
            taskRepository.save(task);
            return ResponseEntity.<Void>noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
