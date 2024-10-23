package com.paynext.service;

import com.paynext.model.Payment;
import com.paynext.repository.PaymentRepository; // Updated repository import
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PaymentService { // Changed class name to PaymentService

  private final PaymentRepository paymentRepository; // Updated to PaymentRepository

  public PaymentService(PaymentRepository paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  public Page<Payment> findPaginated(Pageable pageable, String term) {
    return page(pageable, term);
  }

  private Page<Payment> page(Pageable pageable, String term) {
    int pageSize = pageable.getPageSize();
    int currentPage = pageable.getPageNumber();
    int startItem = currentPage * pageSize;

    ArrayList<Payment> payments;
    List<Payment> list;

    if (term == null) {
      payments = (ArrayList<Payment>) paymentRepository.findAll(); // Updated to paymentRepository
    } else {
      payments =
          (ArrayList<Payment>)
              paymentRepository.findByNameContaining(
                  term); // Ensure the method exists in PaymentRepository
    }

    if (payments.size() < startItem) {
      list = Collections.emptyList();
    } else {
      int toIndex = Math.min(startItem + pageSize, payments.size());
      list = payments.subList(startItem, toIndex);
    }

    Page<Payment> paymentPage =
        new PageImpl<>(list, PageRequest.of(currentPage, pageSize), payments.size());

    return paymentPage;
  }

  public void save(Payment payment) {
    paymentRepository.save(payment); // Updated to paymentRepository
  }

  public Optional<Payment> findPaymentById(Long id) { // Changed method name
    return paymentRepository.findById(id); // Updated to paymentRepository
  }

  public void delete(Long id) {
    paymentRepository.deleteById(id); // Updated to paymentRepository
  }
}
