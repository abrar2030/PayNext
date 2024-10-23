package com.paynext.controller;

import com.paynext.model.Customer;
import com.paynext.model.CustomerPayments; // Updated class name
import com.paynext.model.Order;
import com.paynext.model.Payment;
import com.paynext.repository.BillingRepository;
import com.paynext.repository.OrderRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderController {

  private OrderRepository orderRepository;
  private BillingRepository billingRepository;

  public void BillingService(OrderRepository orderRepository, BillingRepository billingRepository) {
    this.orderRepository = orderRepository;
    this.billingRepository = billingRepository;
  }

  public OrderController(OrderRepository orderRepository, BillingRepository billingRepository) {
    this.orderRepository = orderRepository;
    this.billingRepository = billingRepository;
  }

  public Page<CustomerPayments> findPaginated(Pageable pageable, String term) {
    return page(pageable, term);
  }

  private Page<CustomerPayments> page(Pageable pageable, String term) {
    int pageSize = pageable.getPageSize();
    int currentPage = pageable.getPageNumber();
    int startItem = currentPage * pageSize;

    ArrayList<Order> orders;
    List<CustomerPayments> list;

    if (term == null) {
      orders = (ArrayList<Order>) orderRepository.findAll();
    } else {
      LocalDate date = LocalDate.parse(term);
      orders = (ArrayList<Order>) orderRepository.findByOrderDate(date);
    }

    Map<Customer, List<Payment>> customerPaymentsMap =
        orders.stream()
            .collect(
                Collectors.groupingBy(
                    Order::getCustomer,
                    Collectors.mapping(Order::getPayment, Collectors.toList())));

    List<CustomerPayments> customerPayments =
        customerPaymentsMap.entrySet().stream()
            .map(
                entry ->
                    new CustomerPayments(entry.getKey(), entry.getValue())) // Updated class name
            .collect(Collectors.toList());

    if (customerPayments.size() < startItem) {
      list = Collections.emptyList();
    } else {
      int toIndex = Math.min(startItem + pageSize, customerPayments.size());
      list = customerPayments.subList(startItem, toIndex);
    }

    return new PageImpl<>(list, PageRequest.of(currentPage, pageSize), customerPayments.size());
  }

  @Transactional
  public void createOrder(Customer customer, List<Payment> payments) {
    billingRepository.save(customer);

    for (Payment payment : payments) {
      Order order = new Order();
      order.setCustomer(customer);
      order.setOrderDate(LocalDate.now());
      order.setPayment(payment); // Updated to set the Payment
      orderRepository.save(order);
    }
  }

  public List<CustomerPayments> findOrdersByCustomerId(Long id) {
    List<Order> orders = (List<Order>) orderRepository.findAll();

    Map<Customer, List<Payment>> customerPaymentsMap =
        orders.stream()
            .collect(
                Collectors.groupingBy(
                    Order::getCustomer,
                    Collectors.mapping(Order::getPayment, Collectors.toList())));

    List<CustomerPayments> customerPayments =
        customerPaymentsMap.entrySet().stream()
            .map(
                entry ->
                    new CustomerPayments(entry.getKey(), entry.getValue())) // Updated class name
            .collect(Collectors.toList());

    return customerPayments.stream()
        .filter(c -> c.getCustomer().getId().equals(id))
        .collect(Collectors.toList());
  }
}
