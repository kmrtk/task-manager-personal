package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByDeletedAtIsNull();

    List<Task> findByTitleContainingIgnoreCaseAndDeletedAtIsNull(String title);

    List<Task> findByFolderIdAndDeletedAtIsNull(Long folderId);

    List<Task> findByDeletedAtIsNotNull();

    List<Task> findByFolderId(Long folderId);

    void deleteByFolderId(Long folderId);
}
