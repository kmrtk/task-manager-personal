package com.taskmanager.controller;

import com.taskmanager.entity.Task;
import com.taskmanager.repository.TaskRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost")
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

    @Transactional
    @PostMapping
    public ResponseEntity<Task> create(@Valid @RequestBody Task task) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskRepository.save(task));
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @Valid @RequestBody Task body) {
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

    @Transactional
    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return taskRepository.findById(id).map(task -> {
            task.setStatus(body.get("status"));
            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return taskRepository.findById(id).<ResponseEntity<Void>>map(task -> {
            task.setDeletedAt(LocalDateTime.now());
            taskRepository.save(task);
            return ResponseEntity.<Void>noContent().build();
        }).orElse(ResponseEntity.<Void>notFound().build());
    }
}
