class UsersController < ApplicationController
  skip_before_action :check_token
  
  def show
    #@user = User.find(params[:id])
    @user = User.find(session[:user_id])
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      flash[:success] = "Welcome to TamUber!"
      #redirect_to @user
      redirect_to specify_path
    else
      render 'new'
    end
  end
  
  def update
    @user = User.find(session[:user_id])
    @user.update_attribute(:firstname, user_params[:firstname])
    @user.update_attribute(:lastname, user_params[:lastname])
    @user.update_attribute(:email, user_params[:email])
    @user.update_attribute(:phone, user_params[:phone])
    redirect_to specify_path
  end

  private

  def user_params
    params.require(:user).permit(:firstname, :lastname, :email, :phone, :password,
                                 :password_confirmation)
  end
    
   
end
