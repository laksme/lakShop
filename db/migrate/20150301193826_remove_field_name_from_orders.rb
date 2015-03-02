class RemoveFieldNameFromOrders < ActiveRecord::Migration
  def change
    remove_column :orders, :seler_id, :integer
  end
end
