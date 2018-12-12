Given("I am on the login  page") do
  visit login_path
end

When(/I click the 'Sign up now!' link/) do 
   visit signup_path
end

Then(/^I should see the Signup page$/) do
  expect(page).to have_content("Sign up")
end

When(/I fill in all the details/) do 
end

And("I press the {string} button") do |button|
  #expect(page).to have_content(button)
  lastname = "test"
  firstname = "test"
  email = 'test@test.com'
  password = 'test@123'
  password_confirmation = 'test@123'
  User.new(:firstname => firstname, :lastname => lastname, :email => email, :password => password, :password_confirmation => password).save!
  click_button(button)
end

#Then(/^I should see the {string} on specify page$/) do
#  expect(page).to have_content(text)
#end




  # visit '/users/sign_in'
  # fill_in "user_email", :with => email
  # fill_in "user_password", :with => password
  # click_button "Sign in"
# And I fill in "lastname" with "zhang"
# And I fill in "email" with "test@test.com"
# And I fill in "password" with "test123pass"
# And I fill in "password_confirmation" with "test123pass"
# And I press "Create my account"
# Then I should see the welcome message

