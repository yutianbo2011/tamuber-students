class ApplicationController < ActionController::Base
  layout 'application'
  protect_from_forgery with: :exception
  
  # Added the following for Login 
  # Edit Manish start
  include SessionsHelper
  # Edit Manish end
end
