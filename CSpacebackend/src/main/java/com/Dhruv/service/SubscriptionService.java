package com.Dhruv.service;

import com.Dhruv.domain.PlanType;
import com.Dhruv.model.Subscription;
import com.Dhruv.model.User;

public interface SubscriptionService {
    Subscription createSubscription(User user);
    Subscription getUserSubscription(Long userId) throws Exception;
    Subscription upgradeSubscription(Long userId, PlanType planType);

    boolean isValid(Subscription subscription);
}
