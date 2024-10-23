package com.paynext.controller;

import com.paynext.model.Payment;
import com.paynext.service.PaymentService;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {

  private static final int DEFAULT_PAGE_SIZE = 6;

  private final PaymentService paymentService;

  public HomeController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @GetMapping(value = {"", "/"})
  public String listPayments(
      Model model,
      @RequestParam("page") Optional<Integer> page,
      @RequestParam("size") Optional<Integer> size) {
    return fetchPage(null, model, page, size);
  }

  @GetMapping("/search")
  public String searchPayments(
      @RequestParam("term") String term,
      Model model,
      @RequestParam("page") Optional<Integer> page,
      @RequestParam("size") Optional<Integer> size) {
    if (term == null || term.isBlank()) {
      return "redirect:/";
    }
    return fetchPage(term, model, page, size);
  }

  private String fetchPage(
      String term, Model model, Optional<Integer> page, Optional<Integer> size) {
    int currentPage = page.filter(p -> p > 0).orElse(1); // Ensure page is positive
    int pageSize = size.filter(s -> s > 0).orElse(DEFAULT_PAGE_SIZE); // Ensure size is positive

    Page<Payment> paymentPage =
        term == null
            ? paymentService.findPaginated(PageRequest.of(currentPage - 1, pageSize), null)
            : paymentService.findPaginated(PageRequest.of(currentPage - 1, pageSize), term);

    model.addAttribute("paymentPage", paymentPage); // Updated attribute name
    populatePageNumbers(model, paymentPage);

    return "index"; // This should correspond to your Thymeleaf template
  }

  private void populatePageNumbers(Model model, Page<Payment> paymentPage) {
    int totalPages = paymentPage.getTotalPages();
    if (totalPages > 0) {
      List<Integer> pageNumbers =
          IntStream.rangeClosed(1, totalPages).boxed().collect(Collectors.toList());
      model.addAttribute("pageNumbers", pageNumbers);
    }
  }
}
