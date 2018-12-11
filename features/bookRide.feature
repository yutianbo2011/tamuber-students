Scenario: User should be able to book a ride
  Given I am on the trips page
  When I click on "Book Ride" button
  Then I should see "Booked" button
  And "Booked" button should be disabled