package com.taskmanager.controller;

import com.taskmanager.entity.Folder;
import com.taskmanager.repository.FolderRepository;
import com.taskmanager.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "*")
public class FolderController {

    private final FolderRepository folderRepository;
    private final TaskRepository taskRepository;

    public FolderController(FolderRepository folderRepository, TaskRepository taskRepository) {
        this.folderRepository = folderRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Folder> getAll() {
        return folderRepository.findAll();
    }

    @PostMapping
    public Folder create(@RequestBody Folder folder) {
        return folderRepository.save(folder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Folder> update(@PathVariable Long id, @RequestBody Folder body) {
        return folderRepository.findById(id).map(folder -> {
            folder.setName(body.getName());
            return ResponseEntity.ok(folderRepository.save(folder));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!folderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteByFolderId(id);
        folderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
