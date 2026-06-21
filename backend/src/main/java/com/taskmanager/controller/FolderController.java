package com.taskmanager.controller;

import com.taskmanager.entity.Folder;
import com.taskmanager.entity.Task;
import com.taskmanager.repository.FolderRepository;
import com.taskmanager.repository.TaskRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "http://localhost")
public class FolderController {

    private final FolderRepository folderRepository;
    private final TaskRepository taskRepository;

    public FolderController(FolderRepository folderRepository, TaskRepository taskRepository) {
        this.folderRepository = folderRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Folder> getAll() {
        return folderRepository.findByDeletedAtIsNull();
    }

    @Transactional
    @PostMapping
    public ResponseEntity<Folder> create(@Valid @RequestBody Folder folder) {
        return ResponseEntity.status(HttpStatus.CREATED).body(folderRepository.save(folder));
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<Folder> update(@PathVariable Long id, @Valid @RequestBody Folder body) {
        return folderRepository.findById(id).map(folder -> {
            folder.setName(body.getName());
            return ResponseEntity.ok(folderRepository.save(folder));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return folderRepository.findById(id).<ResponseEntity<Void>>map(folder -> {
            LocalDateTime now = LocalDateTime.now();
            List<Task> tasks = taskRepository.findByFolderIdAndDeletedAtIsNull(id);
            tasks.forEach(task -> task.setDeletedAt(now));
            taskRepository.saveAll(tasks);
            folder.setDeletedAt(now);
            folderRepository.save(folder);
            return ResponseEntity.<Void>noContent().build();
        }).orElse(ResponseEntity.<Void>notFound().build());
    }
}
