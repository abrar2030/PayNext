package com.paynext.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import java.beans.PropertyVetoException;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

@Configuration
@PropertySource("classpath:application.properties")
public class WebMvcConfiguration {

  @Value("${spring.datasource.driver-class-name}")
  private String driver;

  @Value("${spring.datasource.url}")
  private String dbURL;

  @Value("${spring.datasource.username}")
  private String dbUsername;

  @Value("${spring.datasource.password}")
  private String dbPassword;

  @Value("${connection.pool.initialPoolSize}")
  private int connPoolInitSize;

  @Value("${connection.pool.minPoolSize}")
  private int connPoolMinSize;

  @Value("${connection.pool.maxPoolSize}")
  private int connPoolMaxSize;

  @Value("${connection.pool.maxIdleTime}")
  private int connPoolMaxIdleTime;

  @Bean
  public MessageSource messageSource() {
    ReloadableResourceBundleMessageSource messageSource =
        new ReloadableResourceBundleMessageSource();
    messageSource.addBasenames("classpath:messages");
    messageSource.setDefaultEncoding("UTF-8");
    return messageSource;
  }

  @Bean
  public DataSource dataSource() {
    ComboPooledDataSource dataSource = new ComboPooledDataSource();

    try {
      dataSource.setDriverClass(driver);
    } catch (PropertyVetoException exc) {
      throw new RuntimeException("Failed to set database driver class", exc);
    }

    dataSource.setJdbcUrl(dbURL);
    dataSource.setUser(dbUsername);
    dataSource.setPassword(dbPassword);

    dataSource.setInitialPoolSize(connPoolInitSize);
    dataSource.setMinPoolSize(connPoolMinSize);
    dataSource.setMaxPoolSize(connPoolMaxSize);
    dataSource.setMaxIdleTime(connPoolMaxIdleTime);

    return dataSource;
  }
}
