package com.Infosys.Repository;

import com.Infosys.Entity.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerRepository extends JpaRepository<Manager, Long>{
    Manager findByUsername(String username);
}
