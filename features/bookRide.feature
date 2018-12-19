Feature: Ride booking
  
Scenario: User should be able to book a ride
  Given user on the specify page
  When user fill in source with HRBB
  Then I see "Cart Requirements"