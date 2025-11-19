package com.fintech.userservice.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Bean
    public Map<String, Bucket> rateLimitBuckets() {
        return buckets;
    }

    public Bucket createBucket(String key, long capacity, long refillTokens, Duration refillPeriod) {
        return buckets.computeIfAbsent(key, k -> {
            Bandwidth limit = Bandwidth.classic(capacity, Refill.intervally(refillTokens, refillPeriod));
            return Bucket4j.builder()
                    .addLimit(limit)
                    .build();
        });
    }

    public Bucket getLoginBucket(String identifier) {
        return createBucket("login:" + identifier, 5, 5, Duration.ofMinutes(15));
    }

    public Bucket getOTPBucket(String identifier) {
        return createBucket("otp:" + identifier, 3, 3, Duration.ofMinutes(5));
    }

    public Bucket getAPIBucket(String identifier) {
        return createBucket("api:" + identifier, 100, 100, Duration.ofMinutes(1));
    }

    public Bucket getRegistrationBucket(String identifier) {
        return createBucket("registration:" + identifier, 2, 2, Duration.ofHours(1));
    }
}
