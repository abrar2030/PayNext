package com.fintech.aifraudservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@EnableKafka
@EnableAsync
@EnableScheduling
public class AIFraudDetectionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AIFraudDetectionServiceApplication.class, args);
    }
}

