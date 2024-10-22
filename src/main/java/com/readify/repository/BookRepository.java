package com.readify.repository;

import com.readify.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b WHERE b.name LIKE %?1% OR b.authors LIKE %?1%")
    List<Book> searchBooks(String keyword);
}
