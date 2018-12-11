Feature: Enter the site
  As a user
  So that I can read about what TAMUber is before I book one
  I want to see information about TAMUber before I enter the site
  
  Scenario: User visits the home page
    Given I am at the home page 
    Then I should see 'TAMUber is a service' text
        And I should see 'Login to Ride' button
        
  Scenario: User enters the site 
    Given I am at the home page 
    When I click 'Login to Ride' button 
    Then I should see 'Log in' text
	And I should see 'Sign up now!' link
