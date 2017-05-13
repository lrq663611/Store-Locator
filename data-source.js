/**
 * @extends storeLocator.StaticDataFeed
 * @constructor
 */
function DataSource() {
  $.extend(this, new storeLocator.StaticDataFeed);

  var that = this;
  $.get('distributors.csv', function(data) {
    that.setStores(that.parse_(data));
  });
}

/**
 * @const
 * @type {!storeLocator.FeatureSet}
 * @private
 */
DataSource.prototype.FEATURES_ = new storeLocator.FeatureSet(
  new storeLocator.Feature('cat1-1', 'Collision Repair'),
  new storeLocator.Feature('cat2-1', 'Industrial Abrasives'),
  new storeLocator.Feature('cat3-1', 'Industrial Adhesives'),
  new storeLocator.Feature('cat4-1', 'Industrial Packaging'),
  new storeLocator.Feature('cat5-1', 'Aerospace'),
  new storeLocator.Feature('cat6-1', 'Marine'),
  new storeLocator.Feature('cat7-1', 'Building and Contrcution'),
  new storeLocator.Feature('cat8-1', 'General Industrial')
);

/**
 * @return {!storeLocator.FeatureSet}
 */
DataSource.prototype.getFeatures = function() {
  return this.FEATURES_;
};

/**
 * @private
 * @param {string} csv
 * @return {!Array.<!storeLocator.Store>}
 */
DataSource.prototype.parse_ = function(csv) {
  var stores = [];
  var rows = csv.split('\n');
  var headings = this.parseRow_(rows[0]);

  for (var i = 1, row; row = rows[i]; i++) {
    row = this.toObject_(headings, this.parseRow_(row));
    var features = new storeLocator.FeatureSet;
    features.add(this.FEATURES_.getById('cat1-' + row.cat1));
	features.add(this.FEATURES_.getById('cat2-' + row.cat2));
	features.add(this.FEATURES_.getById('cat3-' + row.cat3));
	features.add(this.FEATURES_.getById('cat4-' + row.cat4));
	features.add(this.FEATURES_.getById('cat5-' + row.cat5));
	features.add(this.FEATURES_.getById('cat6-' + row.cat6));
	features.add(this.FEATURES_.getById('cat7-' + row.cat7));
	features.add(this.FEATURES_.getById('cat8-' + row.cat8));

    var position = new google.maps.LatLng(row.Ycoord, row.Xcoord);

    var locality = this.join_([row.Locality, row.Postcode], ', ');
	if(row.Buy_Online == "YES"){
		title = row.Fcilty_nam + " <a href='" + addhttp(row.Website) + "' target='_blank'><img src='Shop-Now2.jpg' alt='Buy Online Logo' style='height:16px;'></a>"
	}else{
		title = row.Fcilty_nam
	}
	var link = "<a href='" + addhttp(row.Website) + "' target='_blank'>" + row.Website + "</a>";
    var store = new storeLocator.Store(row.uuid, position, features, {
      title: title,
      address: this.join_([row.Street_add, locality], '<br>'),
      hours: this.join_([row.Phone, link], '<br>')
    });
    stores.push(store);
  }
  return stores;
};

//format url for link with http://
function addhttp(url) {
	if (!/^(f|ht)tps?:\/\//i.test(url)) {
		url = "http://" + url;
	}
	return url;
}

/**
 * Joins elements of an array that are non-empty and non-null.
 * @private
 * @param {!Array} arr array of elements to join.
 * @param {string} sep the separator.
 * @return {string}
 */
DataSource.prototype.join_ = function(arr, sep) {
  var parts = [];
  for (var i = 0, ii = arr.length; i < ii; i++) {
    arr[i] && parts.push(arr[i]);
  }
  return parts.join(sep);
};

/**
 * Very rudimentary CSV parsing - we know how this particular CSV is formatted.
 * IMPORTANT: Don't use this for general CSV parsing!
 * @private
 * @param {string} row
 * @return {Array.<string>}
 */
DataSource.prototype.parseRow_ = function(row) {
  // Strip leading quote.
  if (row.charAt(0) == '"') {
    row = row.substring(1);
  }
  // Strip trailing quote. There seems to be a character between the last quote
  // and the line ending, hence 2 instead of 1.
  if (row.charAt(row.length - 2) == '"') {
    row = row.substring(0, row.length - 2);
  }

  row = row.split('","');

  return row;
};

/**
 * Creates an object mapping headings to row elements.
 * @private
 * @param {Array.<string>} headings
 * @param {Array.<string>} row
 * @return {Object}
 */
DataSource.prototype.toObject_ = function(headings, row) {
  var result = {};
  for (var i = 0, ii = row.length; i < ii; i++) {
    result[headings[i]] = row[i];
  }
  return result;
};
