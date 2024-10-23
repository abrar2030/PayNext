package com.paynext.controller;

import com.paynext.model.Payment;
import com.paynext.service.PaymentService; // Updated import to use PaymentService
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/payment") // Updated mapping to /payment
public class PaymentController {

  private final PaymentService paymentService; // Changed to PaymentService

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @GetMapping(value = {"", "/"})
  public String getAllPayments(
      Model model,
      @RequestParam("page") Optional<Integer> page,
      @RequestParam("size") Optional<Integer> size) {
    return page(null, model, page, size);
  }

  @GetMapping("/search")
  public String searchPayments(
      @RequestParam("term") String term,
      Model model,
      @RequestParam("page") Optional<Integer> page,
      @RequestParam("size") Optional<Integer> size) {
    if (term.isBlank()) {
      return "redirect:/payment";
    }
    return page(term, model, page, size);
  }

  private String page(
      @RequestParam("term") String term,
      Model model,
      @RequestParam("page") Optional<Integer> page,
      @RequestParam("size") Optional<Integer> size) {
    int currentPage = page.orElse(1);
    int pageSize = size.orElse(10);

    Page<Payment> paymentPage; // Updated variable name

    if (term == null) {
      paymentPage = paymentService.findPaginated(PageRequest.of(currentPage - 1, pageSize), null);
    } else {
      paymentPage = paymentService.findPaginated(PageRequest.of(currentPage - 1, pageSize), term);
    }
    model.addAttribute("paymentPage", paymentPage); // Updated model attribute

    int totalPages = paymentPage.getTotalPages();
    if (totalPages > 0) {
      List<Integer> pageNumbers =
          IntStream.rangeClosed(1, totalPages).boxed().collect(Collectors.toList());
      model.addAttribute("pageNumbers", pageNumbers);
    }
    return "list"; // Make sure this view reflects payments
  }

  @GetMapping("/add")
  public String addPayment(Model model) {
    model.addAttribute("payment", new Payment()); // Updated to Payment
    return "form"; // Ensure this view handles payments
  }

  @PostMapping("/save")
  public String savePayment(
      @Valid Payment payment, BindingResult result, RedirectAttributes redirect) {
    if (result.hasErrors()) {
      return "form"; // Ensure this view handles payments
    }
    paymentService.save(payment); // Updated to PaymentService
    redirect.addFlashAttribute("successMessage", "Saved payment successfully!"); // Updated message
    return "redirect:/payment"; // Updated redirect path
  }

  @GetMapping("/edit/{id}")
  public String editPayment(@PathVariable("id") Long id, Model model) {
    model.addAttribute("payment", paymentService.findPaymentById(id)); // Updated to PaymentService
    return "form"; // Ensure this view handles payments
  }

  @GetMapping("/delete/{id}")
  public String deletePayment(@PathVariable Long id, RedirectAttributes redirect) {
    paymentService.delete(id); // Updated to PaymentService
    redirect.addFlashAttribute(
        "successMessage", "Deleted payment successfully!"); // Updated message
    return "redirect:/payment"; // Updated redirect path
  }
}
