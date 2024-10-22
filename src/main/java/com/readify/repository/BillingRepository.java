package com.readify.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.readify.model.Customer;

@Repository
public interface BillingRepository extends CrudRepository<Customer, Long> {

}
