package com.readify.controller;

import com.readify.model.Book;
import com.readify.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("books", bookService.findAll());
        return "list"; // Template for listing books
    }

    @GetMapping("/books/{id}")
    public String viewBook(@PathVariable("id") Long id, Model model) {
        Optional<Book> book = bookService.findById(id);
        if (book.isPresent()) {
            model.addAttribute("book", book.get());
            return "bookDetails"; // Template for viewing a single book
        } else {
            return "error"; // Book not found, redirect to an error page
        }
    }

    @GetMapping("/books/add")
    public String addBookForm(Model model) {
        model.addAttribute("book", new Book());
        return "addBook"; // Template for adding a new book
    }

    @PostMapping("/books/add")
    public String addBook(@ModelAttribute Book book) {
        bookService.save(book);
        return "redirect:/"; // Redirect to home after adding book
    }

    @GetMapping("/books/edit/{id}")
    public String editBookForm(@PathVariable("id") Long id, Model model) {
        Optional<Book> book = bookService.findById(id);
        if (book.isPresent()) {
            model.addAttribute("book", book.get());
            return "editBook"; // Template for editing book
        } else {
            return "error"; // Book not found
        }
    }

    @PostMapping("/books/edit")
    public String editBook(@ModelAttribute Book book) {
        bookService.save(book);
        return "redirect:/"; // Redirect after updating book
    }

    @GetMapping("/books/delete/{id}")
    public String deleteBook(@PathVariable("id") Long id) {
        bookService.deleteById(id);
        return "redirect:/"; // Redirect after deleting book
    }
}
