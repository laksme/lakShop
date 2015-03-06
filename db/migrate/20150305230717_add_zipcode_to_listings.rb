class AddZipcodeToListings < ActiveRecord::Migration
  def change
    add_column :listings, :zipcode, :string
  end
end
