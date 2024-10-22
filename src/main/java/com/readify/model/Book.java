package com.readify.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String authors;
    private String publisher;
    private String publishedOn;
    private String isbn;
    private Double price;

    // Getters and setters omitted for brevity
}
