$(function() {


    $('#back-btn').hide();

    // Get data from JSON data from items.js
    var data = json.categories;
    var drinkCounter = {};
    var sumUp = 0;
    var productObjects = {};
    var cartItems = JSON.parse(localStorage.getItem('cart')) || {};

    var html;
    var url = window.location.href;
    $('.caption a').filter(function() {
        return this.href == url;
    }).addClass('active-url');

    $.each(data.drinks, function(index, value) {
        $('#drink_list').append(
            '<div class="col-md-4 col-sm-6"> <div class="thumbnail">' +
            '<div class="image">' + '<img src="./assets/imgs/' + value.image + '" alt="' + value.name + '" class="img-responsive"> </div> <div class="caption">' +
            '<p class="item-name">' + value.name + '</p>' +
            '<p>' + '<span class="price"> £' + value.price + '<small> (' + value.liter + ')</small></span>' +
            '<button data-key="' + value.name + '" class="btn btn-success btn-sm pull-right addToCart" onClick="addToCart(\'' + value.name + '\',\'' + value.price + '\', this)"> <i class="fa fa-check fa-1x"></i> </button>' +
            '</p>' +
            '</div> </div> </div>'
        );

        productObjects[value.name] = value;
    });
    $.each(data.clothes, function(index, value) {
        $('#clothes_list').append(
            '<div class="col-md-4 col-sm-6"> <div class="thumbnail">' +
            '<div class="image">' + '<img src="./assets/imgs/' + value.image + '" alt="' + value.name + '" class="img-responsive"> </div> <div class="caption">' +
            '<p class="item-name">' + value.name + '</p>' +
            '<p>' + '<span class="price"> £' + parseFloat(value.price).toFixed(2) + '</span>' +
            '<button data-key="' + value.name + '" class="btn btn-success btn-sm pull-right addToCart" onClick="addToCart(\'' + value.name + '\',\'' + value.price + '\', this)"> <i class="fa fa-check fa-1x"></i> </button>' + '</p>' +
            '</div> </div> </div>'
        );

        // cache product settings for convenient access
        productObjects[value.name] = value;
    })
    $.each(data.snacks, function(index, value) {
        $('#snack_list').append(
            '<div class="col-md-4 col-sm-6"> <div class="thumbnail">' +
            '<div class="image">' + '<img src="./assets/imgs/' + value.image + '" alt="' + value.name + '" class="img-responsive"> </div> <div class="caption">' +
            '<p class="item-name">' + value.name + '</p>' +
            '<p>' + '<span class="price"> £' + parseFloat(value.price).toFixed(2) + '</span>' +
            '<button data-key="' + value.name + '" class="btn btn-success btn-sm pull-right addToCart" onClick="addToCart(\'' + value.name + '\',\'' + value.price + '\', this)"> <i class="fa fa-check fa-1x"></i> </button>' + '</p>' +
            '</div> </div> </div>'
        );

        // cache product settings for convenient access
        productObjects[value.name] = value;
    })

    addToCart = function(item, price, elem) {
        $(elem).html('<i class="fa fa-spin fa-spinner"></i>');
        setTimeout(function() {
            $(elem).html('<i class="fa fa-check fa-1x"></i>');
        }, 500);

        var productKey = elem.getAttribute('data-key');

        if (cartItems[productKey]) {
            // add 1 to quantity
            cartItems[productKey].Quantity = parseInt(cartItems[productKey].Quantity.split('x')[0]) + 1 + 'x ';
        } else {
            // add product to cart with quantity 1
            cartItems[productKey] = {
                Product: productKey,
                Price: productObjects[productKey].price,
                Code: productObjects[productKey].code,
                Quantity: '1x '
            }
        }

        // save items to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // update receipt view
        html = '';
        var totalPrice = 0;
        for (product in cartItems) {
            html += '<div class="row" style="padding-bottom: 5px;">';
            html += '<div class="col-sm-12">';
            html += '<div class="col-sm-6">' + cartItems[product].Quantity + cartItems[product].Product + '</div>';
            html += '<div class="col-sm-6" style="text-align: right;">' + parseFloat(cartItems[product].Price).toFixed(2) + '</div>';
            html += '</div> </div>';
            var priceInt = parseFloat(cartItems[product].Price);
            var quantityInt = parseFloat(cartItems[product].Quantity);
            totalPrice += priceInt * quantityInt || 0;
            $('.total').text(totalPrice.toFixed(2));
        }
        $('#cart_data').html(html);

    }

    // Show receipt items on page reload
    var html = '';
    for (var clist in cartItems) {
        html += '<div class="row" style="padding-bottom: 5px;">';
        html += '<div class="col-sm-12">';
        html += '<div class="col-sm-6">' + cartItems[clist].Quantity + cartItems[clist].Product + '</div>';
        html += '<div class="col-sm-6" style="text-align: right;">' + parseFloat(cartItems[clist].Price).toFixed(2) + '</div>';
        html += '</div> </div>';

        var priceInt = parseFloat(cartItems[clist].Price);
        var quantityInt = parseFloat(cartItems[clist].Quantity);
        sumUp += parseFloat(priceInt * quantityInt) || 0;
        $('.total').text(sumUp.toFixed(2));
    }
    $('#cart_data').html(html);

    finishShopping = function() {
        // var xmlString = '<?xml version="1.0" encoding="UTF-8"?> <xml id="POSCMD" LateProcessing="true"><commands><injectfieldmacro type="field" name="FIELD_CLEAR"/>';

        // for (var item in cartItems) {
        //     if (cartItems.hasOwnProperty(item)) {
        //         xmlString += '<injectdata type="literal" data="' + cartItems[item].Code + '"/>'; // I don't know where you got UPC from
        //         xmlString += '<injectfieldmacro type="field" name="FIELD_UPC"/>'
        //     }
        // }

        // xmlString += '</commands></xml>';
        // $('#xml_data').append(xmlString);

        var xml = document.createElement("xml");
        xml.setAttribute("id", "POSCMD");
        xml.setAttribute("LateProcessing", "true");
        var commands = document.createElement("commands");
        xml.appendChild(commands);
        var injFM = document.createElement("injectfieldmacro");
        injFM.setAttribute("type", "field");
        injFM.setAttribute("name", "FIELD_CLEAR");
        commands.appendChild(injFM);
        var injData;
        for (var item in cartItems) {
            injData = document.createElement("injectdata");
            injData.setAttribute("type", "literal");
            injData.setAttribute("data", JSON.stringify(cartItems[item].Code));
            injFM = document.createElement("injectfieldmacro");
            injFM.setAttribute("type", "field");
            injFM.setAttribute("name", "FIELD_UPC");
            commands.appendChild(injData);
            commands.appendChild(injFM);
        }
        document.getElementsByTagName('body')[0].appendChild(xml);
    }

    goback = function() {
        $('#xml_gen').hide();
        $('#item_cat').show();
        $('#bread_nav').show();
    }
})


// remove basket items onLoad
function clearBasket() {
    localStorage.clear();
    $('#cart_data').html('');
    $('.total').text('');
}