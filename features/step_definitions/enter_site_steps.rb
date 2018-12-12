Given("I am at the home page") do
  visit "/"
end

When("I click {string} button") do |button|
  click_link button
end


Then("I should see {string} text") do |string|
    expect(page).to have_content(string)
end

When("I should see {string} button") do |button|
  expect(page).to have_content(button)
end

When("I should see {string} link") do |link|
  expect(page).to have_content(link)
end