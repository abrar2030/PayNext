package com.paynext.controller;

import com.paynext.model.Payment;
import com.paynext.service.PaymentService;
import com.paynext.service.ShoppingCartService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/cart")
public class CartController {

  private final PaymentService paymentService;
  private final ShoppingCartService shoppingCartService;

  public CartController(PaymentService paymentService, ShoppingCartService shoppingCartService) {
    this.paymentService = paymentService;
    this.shoppingCartService = shoppingCartService;
  }

  @GetMapping(value = {"", "/"})
  public String shoppingCart(Model model) {
    model.addAttribute("cart", shoppingCartService.getCart());
    return "cart"; // This should return the view for the cart
  }

  @GetMapping("/add/{id}")
  public String addToCart(@PathVariable("id") Long id, RedirectAttributes redirect) {
    List<Payment> cart = getCart();
    Optional<Payment> paymentOpt =
        paymentService.findPaymentById(id); // Updated to match service method

    if (paymentOpt.isPresent()) {
      Payment payment = paymentOpt.get();
      cart.add(payment);
      shoppingCartService.getSession().setAttribute("cart", cart);
      redirect.addFlashAttribute(
          "successMessage", "Added payment successfully!"); // Updated message for clarity
    } else {
      redirect.addFlashAttribute("errorMessage", "Payment not found!");
    }

    return "redirect:/cart";
  }

  @GetMapping("/remove/{id}")
  public String removeFromCart(@PathVariable("id") Long id, RedirectAttributes redirect) {
    Optional<Payment> paymentOpt =
        paymentService.findPaymentById(id); // Updated to match service method

    if (paymentOpt.isPresent()) {
      shoppingCartService.deletePaymentById(id); // Updated to match service method
      redirect.addFlashAttribute(
          "successMessage", "Removed payment successfully!"); // Updated message for clarity
    } else {
      redirect.addFlashAttribute("errorMessage", "Payment not found!");
    }

    return "redirect:/cart";
  }

  @GetMapping("/remove/all")
  public String removeAllFromCart(RedirectAttributes redirect) {
    List<Payment> cart = shoppingCartService.getCart();
    cart.clear(); // Clear the cart
    shoppingCartService.getSession().setAttribute("cart", cart); // Update session
    redirect.addFlashAttribute(
        "successMessage", "All payments removed from cart!"); // Updated message for clarity
    return "redirect:/cart";
  }

  private List<Payment> getCart() {
    List<Payment> cart = (List<Payment>) shoppingCartService.getSession().getAttribute("cart");
    if (cart == null) {
      cart = new ArrayList<>();
      shoppingCartService.getSession().setAttribute("cart", cart);
    }
    return cart;
  }
}
