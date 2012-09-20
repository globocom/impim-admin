(function($){

    // essa feature detection eh para ver se o browser atual
    // tem um bug que faz o position fixed funcionar incorretamente
    // detectamos isso no webkit
    $.support.positionFixedOnParentWith3DTransformBug = (function() {

        var prefixes = ['-moz-', '-webkit-', '-o-', '-ms-', '', ''],
            parent = $('<div style="visibility:hidden;position:fixed;top:1px;'+ prefixes.join('transform:rotateY(0);') +'"></div>'),
            child = $('<div style="position:fixed;top:1px"></div>').appendTo(parent),
            body = $('body');

        parent.appendTo(body);
        var check = (child.offset().top === 2);
        parent.remove();

        check && body.addClass('positionFixedOnParentWith3DTransformBug');

        return check;

    }());

    $.widget('libby.fotoPopinCropCropper', $.libby.widgetBase, {
        options: {
            container: null,
            unsafeUrl: 'http://thumbor.globoi.com/unsafe'
        },

        _create: function() {
            this._super('_create');

            this.jCrop = null;
            this.whenInitialized = false;

            this._createElements();
            this._bindEvents();
            this._reset();
        },

        _reset: function() {
            this.clearImageData();
            this.userSelectedSize = {width: 0, height: 0};
            this.lastUserSelectedSize = null;
            this.lastCoords = null;
        },

        _createElements: function() {
            var html = [
                '<div class="', this._classFor('container'), '">',
                    '<div class="', this._classFor('container-croppable'), ' container-image">',
                    '</div>',
                '</div>'
            ];

            this.elements.container = $(html.join(''));
            this.elements.croppableContainer = this.elements.container.find('.' + this._classFor('container-croppable'));
            this.elements.loadingImage = $('<div class="' + this._classFor("loading") + '"></div>');
            this._insertImage(this.elements.croppableContainer);
            this.options.container.append(this.elements.container);
        },

        _insertImage: function(container) {
            var img = $('<img class="' + this._classFor('container-croppable-image') + '" />');
            container.append(img);
            this.elements.croppableImage = img;
            this.jCrop && this.jCrop.destroy();
        },

        _bindEvents: function() {
            this._bind('fotoPopinImageSelected', this._fotoPopinImageSelected);
            this._bind('fotoPopinSizesChanged', this._fotoPopinSizesChanged);
        },

        _fotoPopinImageSelected: function(ev, infoImage) {
            this._reset();
            this.setImageData(infoImage.url, infoImage.width, infoImage.height);
            this._initializeCrop();
        },

        _fotoPopinSizesChanged: function(ev, dimensions) {
            this.userSelectedSize = {
                width: dimensions.width,
                height: dimensions.height
            };

            if (this.jCrop) {
                this.jCrop.setOptions({
                    aspectRatio: this._calculateRatio(),
                    minSize: this._calculateMinSize()
                });
            }
        },

        _calculateRatio: function() {
            var ratio = 0;

            if (this.userSelectedSize.width && this.userSelectedSize.height) {
                ratio = this.userSelectedSize.width / this.userSelectedSize.height;
            }

            return ratio;
        },

        _calculateMinSize: function() {
            return [this.userSelectedSize.width, this.userSelectedSize.height];
        },

        setImageData: function(url, width, height) {
            this.original = {
                url: url,
                width: width,
                height: height
            };
        },

        clearImageData: function() {
            this.setImageData('', 0, 0);
        },

        triggerCropChanged: function(left, top, right, bottom) {
            var scaledCrop = this.jCrop.tellScaled();
            this._fixJcropCoords(scaledCrop);

            this.element.trigger('fotoPopinCropChanged', {
                originalUrl: this.original.url,
                croppableImageUrl: this.croppableImageUrl,
                crop: {
                    scaled: {
                        left: scaledCrop.x,
                        top: scaledCrop.y,
                        right: scaledCrop.x2,
                        bottom: scaledCrop.y2
                    },
                    left: left,
                    top: top,
                    right: right,
                    bottom: bottom
                },
                width: this.userSelectedSize.width,
                height: this.userSelectedSize.height
            });
        },

        _fixJcropCoords: function(coords) {
            var floor = Math.floor;
            if (coords.y < 0) {
                coords.y = 0;
            }
            if (coords.x < 0) {
                coords.x = 0;
            }

            coords.h = floor(coords.h);
            coords.w = floor(coords.w);
            coords.x = floor(coords.x);
            coords.x2 = floor(coords.x2);
            coords.y = floor(coords.y);
            coords.y2 = floor(coords.y2);
        },

        activateCropper: function(imageUrl) {
            this.croppableImageUrl = imageUrl;

            this.elements.croppableImage.show().load($.proxy(function() {

                if (this.lastUserSelectedSize) {
                    this.userSelectedSize = this.lastUserSelectedSize;
                }

                this.jCrop = $.Jcrop(this.elements.croppableImage, {
                    allowSelect: false,
                    minSize: this._calculateMinSize(),
                    aspectRatio: this._calculateRatio(),
                    setSelect: [0, 0, this.original.width, this.original.height],
                    trueSize: [this.original.width, this.original.height],
                    onSelect: $.proxy(function(coords) {
                        if (!this.jCrop) {
                            return;
                        }
                        this._fixJcropCoords(coords);
                        this.lastCoords = coords;
                        this.triggerCropChanged(coords.x, coords.y, coords.x2, coords.y2);
                    }, this)
                });

                this.elements.loadingImage.remove();

                if (this.lastCoords) {
                    var selection = [this.lastCoords.x,
                                     this.lastCoords.y,
                                     this.lastCoords.x2,
                                     this.lastCoords.y2];
                    this.jCrop.setSelect(selection);
                    this.triggerCropChanged.apply(this, selection);
                } else {
                    var coords = this.jCrop.tellSelect();
                    this._fixJcropCoords(coords);
                    this.triggerCropChanged(coords.x, coords.y, coords.x2, coords.y2);
                }

                this.jCrop.focus();

            }, this));

            this.elements.croppableImage.attr('src', imageUrl);
        },

        _initializeCrop: function() {
            this.elements.croppableContainer.empty();
            this.elements.croppableContainer.append(this.elements.loadingImage);
            this._insertImage(this.elements.croppableContainer);

            var data = {
                image_url: this.original.url,
                width: Math.min(this.original.width, this.elements.croppableContainer.width()),
                height: Math.min(this.original.height, this.elements.croppableContainer.height()),
                fit_in: true
            };

            this.activateCropper([this.options.unsafeUrl, 'fit-in', data.width + 'x' + data.height, data.image_url].join('/'));
        },

        close: function() {
            this._reset();
        }

    });

}(jQuery));
