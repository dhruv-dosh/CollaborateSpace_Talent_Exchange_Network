package com.Dhruv.service;

import com.Dhruv.domain.PlanType;
import com.Dhruv.domain.SubscriptionType;
import com.Dhruv.model.Subscription;
import com.Dhruv.model.User;
import com.Dhruv.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class SubscriptionServiceImpl implements SubscriptionService{

    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;

    @Autowired
    public SubscriptionServiceImpl(SubscriptionRepository subscriptionRepository, UserService userService) {
        this.subscriptionRepository = subscriptionRepository;
        this.userService = userService;
    }

    @Override
    public Subscription createSubscription(User user) {
        Subscription subscription=new Subscription();
        subscription.setUser(user);
        subscription.setSubscriptionStartDate(LocalDate.now());
        subscription.setSubscriptionEndDate(LocalDate.now().plusMonths(12)); // Assuming one month validity for simplicity
        subscription.setValid(true);
        subscription.setPlanType(PlanType.FREE);
        subscription.setSubscriptiontype(SubscriptionType.FREE);
        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription getUserSubscription(Long userId) throws Exception {
       Subscription subscription = subscriptionRepository.findByUserId(userId);
       if(subscription==null){
           throw new Exception("subscription not found with userId "+userId);
       }
       subscription.setValid(isValid(subscription));
       if(!isValid(subscription)){
           subscription.setPlanType(PlanType.FREE);
           subscription.setSubscriptionEndDate(LocalDate.now().plusMonths(12));
           subscription.setSubscriptionStartDate(LocalDate.now());
       }
        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription upgradeSubscription(Long userId, PlanType planType) {
        Subscription subscription = subscriptionRepository.findByUserId(userId);

        subscription.setSubscriptiontype(SubscriptionType.PAID);

        subscription.setPlanType(planType);
        subscription.setSubscriptionStartDate(LocalDate.now());
        subscription.setValid(true);
        if(planType.equals(PlanType.ANNUALLY)){
            subscription.setSubscriptionEndDate(LocalDate.now().plusMonths(12));
        }
        else {
            subscription.setSubscriptionEndDate(LocalDate.now().plusMonths(1));
        }
        return subscriptionRepository.save(subscription);
    }

    @Override
    public boolean isValid(Subscription subscription) {

        if(subscription.getSubscriptiontype().equals(SubscriptionType.FREE)){
            return true;
        }
        LocalDate endDate = subscription.getSubscriptionEndDate();
        LocalDate currentDate = LocalDate.now();
//        System.out.println( "--------- "+endDate+"----"+currentDate);
//        System.out.println( endDate.isAfter(currentDate) );
//        System.out.println( endDate.isEqual(currentDate));

        return endDate.isAfter(currentDate) || endDate.isEqual(currentDate);


    }
}
