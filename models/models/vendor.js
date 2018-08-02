const mongoose = require('mongoose');
const moment = require('moment');
const VendorSchema = mongoose.Schema({
    adecity_user_id: mongoose.Schema.Types.ObjectId,
    business_category:
        {
            cat_id: mongoose.Schema.Types.ObjectId,
            name: String,
            slug: String,
            _id: false
        },
    business_subcategory:
        {
            cat_id: mongoose.Schema.Types.ObjectId,
            name: String,
            slug: String,
            _id: false
        },
    vendor_name: {
        type: String,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    isOnTop: {
        type: Number,
        default: 1
    },
    vendor_phones: [{
        phone: {
            type: Number,
            required: true
        },
        isOwner: { type: Boolean },
        isManager: { type: Boolean },
        isWhatsapp: { type: Boolean },
        isSMS: { type: Boolean },
        isCall: { type: Boolean }
    }],
    // vendor_other_phones: [{
    //     phone: Number,
    //     _id: false
    // }],
    vendor_desc: {
        type: String,
        required: true
    },
    vendor_timings: [{
        week_name: String,
        startTime: String,
        endTime: String,
        isClosed: Boolean,
        _id: false
    }],
    address: {
        full_address: String,
        street: String,
        city: String,
        State: String,
        landmark: String,
        lat: String,
        long: String,
        zip: Number
    },
    location: {
         type: {type: String},
         coordinates : [Number],
         
        },
    tags: [],
    vendor_images: [
        {
            image_num: String,
            image_url: String,
            isPrimary: Boolean
        }
    ],
    vendor_primary_image: Number,
    subscription_type: {
        type: String,
        enum: ['bronze', 'silver', 'gold'],
        required: true
    },
    billing_start_date: {
        type: Date,
        required: true
    },
    billing_end_date: {
        type: Date,
        required: true
    },
    additional_info: {
        website: String,
        email: String,
        social_url: {
            fb: String,
            instagram: String,
            twitter: String,
            linkedin: String
        },
        established_date: String
    }
}, {
        timestamps: true
    });
    
const Vendor = module.exports = mongoose.model('vendors', VendorSchema);