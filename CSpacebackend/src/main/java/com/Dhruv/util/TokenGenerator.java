package com.Dhruv.util;

import java.security.SecureRandom;
import java.util.Base64;

public class TokenGenerator {

    private static final SecureRandom secureRandom = new SecureRandom();

    public static String generateToken(String userEmail, Long projectId, int length) {
        String tokenData = userEmail + ":" + projectId;
        byte[] randomBytes = new byte[length];
        secureRandom.nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        return token + ":" + tokenData;
    }
}

