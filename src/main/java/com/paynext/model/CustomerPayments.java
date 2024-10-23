package com.paynext.model;

import java.util.List;

public class CustomerPayments {

  private Customer customer;
  private List<Payment> payments;

  public CustomerPayments(Customer customer, List<Payment> payments) {
    this.customer = customer;
    this.payments = payments;
  }

  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public List<Payment> getPayments() {
    return payments;
  }

  public void setPayments(List<Payment> payments) {
    this.payments = payments;
  }
}
