package com.readify.controller;

import com.readify.model.Book;
import com.readify.model.Customer;
import com.readify.service.BillingService;
import com.readify.service.EmailService;
import com.readify.service.ShoppingCartService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/checkout")
public class CheckoutController {

  private final BillingService billingService;
  private final EmailService emailService;
  private final ShoppingCartService shoppingCartService;

  public CheckoutController(
      BillingService billingService,
      EmailService emailService,
      ShoppingCartService shoppingCartService) {
    this.billingService = billingService;
    this.emailService = emailService;
    this.shoppingCartService = shoppingCartService;
  }

  @GetMapping(value = {"", "/"})
  public String checkout(Model model) {
    List<Book> cart = shoppingCartService.getCart();
    if (cart.isEmpty()) {
      return "redirect:/cart";
    }
    model.addAttribute("customer", new Customer());
    model.addAttribute("productsInCart", cart);
    model.addAttribute("totalPrice", shoppingCartService.totalPrice().toString());
    model.addAttribute("shippingCosts", shoppingCartService.getshippingCosts());
    return "checkout";
  }

  @PostMapping("/placeOrder")
  public String placeOrder(
      @Valid Customer customer, BindingResult result, RedirectAttributes redirect) {
    if (result.hasErrors()) {
      return "/checkout";
    }
    billingService.createOrder(customer, shoppingCartService.getCart());
    emailService.sendEmail(
        customer.getEmail(), "bookstore - Order Confirmation", "Your order has been confirmed.");
    shoppingCartService.emptyCart();
    redirect.addFlashAttribute("successMessage", "The order is confirmed, check your email.");
    return "redirect:/cart";
  }
}