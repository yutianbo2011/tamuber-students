Feature: Signup
  As a new user 
  I should be able to sign up for a ride
  
  Scenario: Signup with Valid Credentials
    Given I am on the login page
    When I click the 'Sign up now!' link 
    Then I should see the Signup page
    When  I fill in all the details
    And I press the "Create my account" button
    #Then I should see the "Cart Requirements" on specify page
