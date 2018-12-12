Given("I am on the login  page") do
  visit login_path
end

When(/I fill in Email/) do 
  fill_in "session_email", :with => "test@test.com"

end

And(/I fill in Password/) do 
  fill_in "session_password", :with => "test@123"

end

And("I click on {string} button") do |button|
  #expect(page).to have_content(button)
  click_button(button)
end


Then("I should see the {string}") do |text|
  expect(page).to have_content(text)
end
#When("I click {string} button") do |button|
 # click_link button
#end