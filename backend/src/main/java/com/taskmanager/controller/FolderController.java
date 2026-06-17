package com.taskmanager.controller;

import com.taskmanager.entity.Folder;
import com.taskmanager.repository.FolderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "*")
public class FolderController {

    private final FolderRepository folderRepository;

    public FolderController(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    @GetMapping
    public List<Folder> getAll() {
        return folderRepository.findAll();
    }

    @PostMapping
    public Folder create(@RequestBody Folder folder) {
        return folderRepository.save(folder);
    }
}
