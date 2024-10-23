package com.paynext.service;

import com.paynext.model.Payment;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ShoppingCartService {

  @Value("${shipping.costs}")
  private String shippingCosts;

  private final HttpSession session;

  public ShoppingCartService(HttpSession session) {
    this.session = session;
  }

  public List<Payment> getCart() {
    List<Payment> cart = (List<Payment>) session.getAttribute("cart");
    if (cart == null) {
      cart = new ArrayList<>();
      session.setAttribute("cart", cart); // Set the cart in the session if it was null
    }
    return cart;
  }

  public BigDecimal totalPrice() {
    BigDecimal shipping = new BigDecimal(shippingCosts);
    BigDecimal totalPriceWithShipping =
        getCart().stream()
            .map(Payment::getAmount) // Changed to getAmount to match the Payment class
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .add(shipping);
    return totalPriceWithShipping;
  }

  public void emptyCart() {
    getCart().clear(); // Use clear method to empty the cart
  }

  public void deleteProductWithId(Long paymentId) { // Renamed parameter for clarity
    List<Payment> cart = getCart();
    Iterator<Payment> iterator = cart.iterator();
    while (iterator.hasNext()) {
      Payment payment = iterator.next();
      if (payment.getId() != null
          && payment.getId().equals(paymentId)) { // Check for null before comparison
        iterator.remove(); // Remove using iterator
      }
    }
  }

  public void deletePaymentById(Long paymentId) {
    deleteProductWithId(paymentId); // Reuse the existing method
  }

  public String getShippingCosts() { // Getter method
    return shippingCosts;
  }

  public HttpSession getSession() {
    return session;
  }
}
