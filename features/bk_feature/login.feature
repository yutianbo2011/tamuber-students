Scenario: login with valid credentials
  Given I am on the login page
  When I fill in Email with "test@test.com"
  And I fill in Password with "test@123"
  And I click on "Log in" button
    Then I should be on "specify" page
    Then I should see "Please select your pick up and destination"

