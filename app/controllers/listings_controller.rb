class ListingsController < ApplicationController
  before_action :set_listing, only: [:show, :edit, :update, :destroy]
  before_filter :authenticate_user!, only: [:seller, :new, :create, :edit, :update, :destroy]
  before_filter :check_user, only: [:edit, :update, :destroy]

  def seller 
    @listings = Listing.where(user: current_user).order("created_at DESC")
  end
  # GET /listings
  # GET /listings.json
  def index
    if params[:query].present?
      @listings = Listing.search params[:query], fields: [{name: :word_start}], misspellings: {edit_distance: 2} #, page: params[:page])
    else
       @listings = Listing.all.order("created_at DESC")
    end
  end

  # GET /listings/1
  # GET /listings/1.json
  def show
  end

  # GET /listings/new
  def new
    @listing = Listing.new
  end

  # GET /listings/1/edit
  def edit
  end
  #def search
   # @listings_search = Listing.search params[:search], fields: [{name: :word_start}], misspellings: {edit_distance: 2}
  #end

  # POST /listings
  # POST /listings.json
  def create
    @listing = Listing.new(listing_params)
    @listing.address = current_user.address
    @listing.city = current_user.city
    @listing.state = current_user.state
    @listing.zipcode = current_user.zipcode
    @listing.country = current_user.country
    @listing.user_id = current_user.id
    if current_user.recipient.blank?
      Stripe.api_key = Rails.configuration.stripe[:secret_key]
      token = params[:stripeToken]

      recipient = Stripe::Recipient.create(
        :name => current_user.name,
        :type => "individual",
        :bank_account => token
        )

      current_user.recipient = recipient.id
      current_user.save
    end

    respond_to do |format|
      if @listing.save
        format.html { redirect_to @listing, notice: 'Listing was successfully created.' }
        format.json { render :show, status: :created, location: @listing }
      else
        format.html { render :new }
        format.json { render json: @listing.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /listings/1
  # PATCH/PUT /listings/1.json
  def update
    respond_to do |format|
      if @listing.update(listing_params)
        format.html { redirect_to @listing, notice: 'Listing was successfully updated.' }
        format.json { render :show, status: :ok, location: @listing }
      else
        format.html { render :edit }
        format.json { render json: @listing.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /listings/1
  # DELETE /listings/1.json
  def destroy
    @listing.destroy
    respond_to do |format|
      format.html { redirect_to listings_url, notice: 'Listing was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_listing
      @listing = Listing.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def listing_params
      params.require(:listing).permit(:name, :description, :price, :image)
    end

    def check_user
      if current_user != @listing.user
        redirect_to root_url, alert: "Sorry, this listing belongs to someone else"
      end
    end
end
