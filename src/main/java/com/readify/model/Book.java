package com.readify.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Date;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Book name is mandatory")
    private String name;

    @NotBlank(message = "Authors are mandatory")
    private String authors;

    @NotBlank(message = "Publisher is mandatory")
    private String publisher;

    @NotNull(message = "Published date is mandatory")
    private Date publishedOn;

    @NotBlank(message = "ISBN is mandatory")
    private String isbn;

    @NotNull(message = "Price is mandatory")
    private Double price;

    @Size(max = 1000, message = "Description can't exceed 1000 characters")
    private String description;

    // Getters and setters omitted for brevity
}
