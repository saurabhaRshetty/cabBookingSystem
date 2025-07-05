package com.cabbooking.backend.repository;

import com.cabbooking.backend.model.users;
import com.cabbooking.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<users, Long> {
    Optional<users> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<users> findByRoleAndApprovedFalse(Role role);
}