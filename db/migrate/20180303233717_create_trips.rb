class CreateTrips < ActiveRecord::Migration[5.1]
  def change
    create_table :trips do |t|
      t.integer :trip_id
      t.integer :cart_id
      t.timestamp :start_time
      t.timestamp :end_time
      t.timestamp :booking_time
      t.references :user_id, index: true, foreign_key: {to_table :user }
      t.references :source_location, index: true, foreign_key: {to_table :location }
      t.references :destination_location, index: true, foreign_key: {to_table :location }
    end
  end
end
