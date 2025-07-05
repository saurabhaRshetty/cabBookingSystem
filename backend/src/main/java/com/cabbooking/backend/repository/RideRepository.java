package com.cabbooking.backend.repository;

import com.cabbooking.backend.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import com.cabbooking.backend.model.RideStatus;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByRiderUsername(String username);
    List<Ride> findByDriverUsername(String username);
    List<Ride> findByStatusAndDriverIsNull(RideStatus status);

}
