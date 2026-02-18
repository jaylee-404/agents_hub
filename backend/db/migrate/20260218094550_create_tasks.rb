class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :status
      t.string :task_type
      t.jsonb :payload
      t.jsonb :result
      t.string :stream_token

      t.timestamps
    end
    add_index :tasks, :stream_token, unique: true
  end
end
