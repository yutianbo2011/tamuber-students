Given("I am on the login  page") do
  visit login_path
end

When(/^I fill in Email with {string} $/) do |text|
  fill_in email_field, :with => "test@test.com"
end
