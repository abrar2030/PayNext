package com.paynext.repository;

import com.paynext.model.Order;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long> {
  List<Order> findByOrderDate(LocalDate orderDate);
}
