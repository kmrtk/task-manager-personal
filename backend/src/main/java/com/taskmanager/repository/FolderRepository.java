package com.taskmanager.repository;

import com.taskmanager.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    List<Folder> findByDeletedAtIsNull();

    List<Folder> findByDeletedAtIsNotNull();
}
