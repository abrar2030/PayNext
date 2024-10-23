package com.paynext.repository;

import com.paynext.model.Payment;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository
    extends CrudRepository<Payment, Long> { // Changed from BookRepository to PaymentRepository

  @Query(
      value = "SELECT * FROM payments WHERE name LIKE %:term%",
      nativeQuery = true) // Changed table name to 'payments'
  List<Payment> findByNameContaining(@Param("term") String term);
}
