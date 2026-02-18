class User < ApplicationRecord
  has_secure_password
  has_many :tasks, dependent: :destroy

  validates :phone, presence: true, uniqueness: true, format: { with: /\A1[3-9]\d{9}\z/ }
end