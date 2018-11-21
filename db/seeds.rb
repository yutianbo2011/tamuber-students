# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#routes are now held in text files on the cart, so they are no longer persistently stored in the database
# cart_routes = [{:length => 9.99, :startPoint => 'Cyclotron Institute', :endPoint => 'HRBB', :id => 1},
#                 {:length => 9.99, :startPoint => 'Engineering Innovation Center', :endPoint => 'Evans Library', :id => 2}]

# cart_routes.each do |cart_route|
#   CartRoute.create!(cart_route)
# end

# coordinates = [{:lat => 30.621284, :lng => -96.340388, :cart_route => CartRoute.find(1)},
#                 {:lat => 30.61998, :lng => -96.340193, :cart_route => CartRoute.find(1)},
#                 {:lat => 30.6186, :lng => -96.3415, :cart_route => CartRoute.find(2)},
#                 {:lat => 30.6168, :lng => -96.3388, :cart_route => CartRoute.find(2)}]

# coordinates.each do |coordinate|
#   Coordinate.create!(coordinate)
# end

#'192.168.1.1:9090', '10.265.43.62:9090', '165.193.43.23:9090'
carts = [ {:IP => "166.155.203.130:9090", :inUse => false, :seat_count => 2, :handicap_access => true, :id => 0, :last_busy_check => 0}]
          # {:IP => "10.265.43.62:9090", :inUse => false, :seat_count => 6, :handicap_access => false, :id => 1, :last_busy_check => 0},
          # {:IP => "165.193.43.23:9090", :inUse => false, :seat_count => 4, :handicap_access => false, :id => 2, :last_busy_check => 0}]
          
carts.each do |cart|
  Cart.create!(cart)
end

# carts = [{:IP => 0, :inUse => false, :seat_count => 6, :handicap_access => false, :last_busy_check => 0, :id => 3}]

# carts.each do |cart|
#   Cart.create!(cart)
# end

locations = [ {:name => "HRBB", :latitude => 30.6190388, :longitude => -96.338788},
            {:name => "ETB", :latitude => 30.622837, :longitude => -96.339397},
            {:name => "MSC", :latitude => 30.612311, :longitude => -96.341307},
            {:name => "Kyle Field", :latitude => 30.610233, :longitude => -96.3409787},
            {:name => "WEB", :latitude => 30.6102331, :longitude => -96.3409787},
            {:name => "Zackrey", :latitude => 30.6213205, :longitude => -96.3403854 },
            {:name => "Evans Library Annex", :latitude => 30.6164067, :longitude => -96.3384801},
            {:name => "Rudder Comples", :latitude => 30.6133001, :longitude => -96.339924},
            {:name => "Scoates Hall", :latitude => 30.6214851, :longitude => -96.3377064},
            {:name => "The Pavilion", :latitude => 30.6214851, :longitude => -96.3377064},
            {:name => "REC Center", :latitude => 30.6214851, :longitude => -96.3377064} ]
            
locations.each do |location|
  Location.create!(location)
end