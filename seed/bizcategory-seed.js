var bc = require('../models/models/bizzCat');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/express1');
var bizzCat = [
  new bc({ catname: "Accommodation", type: "business", slug: "accommodation" }),
  new bc({ catname: "Adult", type: "business", slug: "adult" }),
  new bc({ catname: "Automotive", type: "business", slug: "automotive" }),
  new bc({ catname: "Domestic Services", type: "business", slug: "domestic-services" }),
  new bc({ catname: "Education & Learning", type: "business", slug: "education-learning" }),
  new bc({ catname: "Entertainment", type: "business", slug: "entertainment" }),
  new bc({ catname: "Event Organisation", type: "business", slug: "event-organisation" }),
  new bc({ catname: "Financial Services", type: "business", slug: "financial-services" }),
  new bc({ catname: "Food & Beverages", type: "business", slug: "food-beverages" }),
  new bc({ catname: "Government", type: "business", slug: "government" }),
  new bc({ catname: "Hair & Beauty", type: "business", slug: "hair-beauty" }),
  new bc({ catname: "Manufacturing & Agriculture", type: "business", slug: "manufacturing-agriculture" }),
  new bc({ catname: "Media & Communication", type: "business", slug: "media-communication" }),
  new bc({ catname: "Medical", type: "business", slug: "medical" }),
  new bc({ catname: "Pets", type: "business", slug: "pets" }),
  new bc({ catname: "Professional Services", type: "business", slug: "professional-services" }),
  new bc({ catname: "Religion", type: "business", slug: "religion" }),
  new bc({ catname: "Restaurants", type: "business", slug: "restaurants" }),
  new bc({ catname: "Retail Shopping", type: "business", slug: "retail" }),
  new bc({ catname: "Sports & Recreation", type: "business", slug: "sports-recreation" }),
  new bc({ catname: "Trades", type: "business", slug: "trades" }),
  new bc({ catname: "Travel", type: "business", slug: "travel" }),
  new bc({ catname: "Utilities", type: "business", slug: "utilities" }),
  new bc({ catname: "Startups", type: "business", slug: "startups" })
];

var done = 0;
for (var i = 0; i < bizzCat.length; i++) {
  bizzCat[i].save(function (err, result) {
    console.log(err);
    done++;
    if (done === bizzCat.length) {
      exit();
    }
  });
}
function exit() {
  mongoose.disconnect();
}