 Given ("user on the specify page") do
     visit specify_path
 end

When("user fill in source with HRBB") do

end
 
 Then("I see {string}") do |cartText|
  expect(page).to have_content 'Cart Requirements'
 end