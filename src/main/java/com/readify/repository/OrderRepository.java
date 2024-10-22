package com.readify.repository;

import com.readify.model.Order;
import java.time.LocalDate;
import java.util.ArrayList;
import org.springframework.data.repository.CrudRepository;

public interface OrderRepository extends CrudRepository<Order, Long> {

  ArrayList<Order> findByOrderDate(LocalDate term);

  ArrayList<Order> findOrdersById(Long id);
}
