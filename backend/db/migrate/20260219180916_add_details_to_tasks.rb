class AddDetailsToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :title, :string

    add_column :tasks, :content, :text

    add_column :tasks, :image_urls, :string, array: true, default: []
    add_column :tasks, :document_urls, :string, array: true, default: []
  end
end
