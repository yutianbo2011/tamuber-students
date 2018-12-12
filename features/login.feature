Feature: Authentication 
  As an administrator
  I should make sure that only authenticated users should be able to book a ride
  
Scenario: login with valid credentials
  Given I am on the login page
  When I fill in Email
  And I fill in Password
  And I click on "Log in" button
    Then I should see the "Cart Requirements"