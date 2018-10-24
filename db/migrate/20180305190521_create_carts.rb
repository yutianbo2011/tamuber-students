class CreateCarts < ActiveRecord::Migration[5.1]
  def change
    create_table :carts do |t|
      t.string :IP
      t.boolean :inUse
      t.integer :cart_id
    end
  end
end