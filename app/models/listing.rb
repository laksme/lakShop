class Listing < ActiveRecord::Base
	def full_address
    	"#{address}, #{zipcode}, #{city}, #{country}"
  	end
  	
	searchkick word_start: [:name]
	geocoded_by :full_address
	after_validation :geocode

	

	if Rails.env.development?
		has_attached_file :image, :styles => { :medium => "200x", :thumb => "100x100>" }, :default_url => "default.jpg"
    else
    	has_attached_file :image, :styles => { :medium => "200x", :thumb => "100x100>" }, :default_url => "default.jpg",
    	:storage => :dropbox,
    	:dropbox_credentials => Rails.root.join("config/dropbox.yml"),
    	:path => ":style/:id_:filename"
	end
	validates_attachment_content_type :image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]
	validates :name, :description, :price, presence: true
	validates :price, numericality: {greater_than_or_equal_to: 0}

	belongs_to :user
	has_many :orders
end
