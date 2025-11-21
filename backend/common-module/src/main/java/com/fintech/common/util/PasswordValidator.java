package com.fintech.common.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PasswordValidator {

  private static final String PASSWORD_REGEX =
      "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$";

  private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

  public static boolean isValid(final String password) {
    if (password == null) {
      return false;
    }
    Matcher matcher = PASSWORD_PATTERN.matcher(password);
    return matcher.matches();
  }

  public static void validate(final String password) throws IllegalArgumentException {
    if (!isValid(password)) {
      throw new IllegalArgumentException(
          "Password must be 8-20 characters long and contain at least one digit, one lowercase"
              + " letter, one uppercase letter, and one special character (@#$%^&+=).");
    }
  }
}
