$(function () {
    var drinkCounter = {};
    // Get data from JSON file
    $.get('./assets/products.json')
        .then(function (data) {
            var drinks = data.categories.drinks;
            $.each(drinks, function (index, value) {
                $('#drink_list').append(
                    '<div class="col-sm-4"> <div class="thumbnail">' +
                    '<img src="./assets/imgs/' + value.image + '" alt="..."> <div class="caption">' +
                    '<p>' + value.name + ' ' + value.liter + '</p>' +
                    '<p> £' + value.price + '<button class="btn btn-success btn-sm pull-right addToCart" onClick="addToCart(\'' + value.name + '\',\'' + value.price + '\')"> Add </button>' + '</p>' +
                    '</div> </div> </div>'
                );
            })
        })

    // add = function (obj) {
    //     var count = $(obj).siblings('input').val();

    //     $(obj).siblings('input').val(parseInt(++count))
    //     var at = $(obj).siblings('button.addToCard');
    //     var valcount = at.attr("onClick").split(',');
    //     at.attr("onClick", valcount[0] + "," + valcount[1] + "," + count + ")")
    // }

    // minus = function (obj) {
    //     var count = $(obj).siblings('input').val();

    //     if (count > 0) {
    //         $(obj).siblings('input').val(parseInt(count - 1))
    //         var at = $(obj).siblings('button.addToCard');
    //         var valcount = at.attr("onClick").split(',');
    //         at.attr("onClick", valcount[0] + "," + valcount[1] + "," + parseInt(count - 1) + ")")

    //     }
    // }



    addToCart = function (item, price) {
        var itemQuantity = {};
        var item_quantity;
        var quantity;

        if (drinkCounter[item])
            drinkCounter[item].count++;
        else
            drinkCounter[item] = {
                count: 1,
                price: price
            };

        // empty the cart
        $('.cart').empty();

        // refill it again with the new statistics
        var totalPrice = 0;
        for (var key in drinkCounter) {
            $('.cart').append(
                '<div class="col-sm-6">' +
                drinkCounter[key].count + 'x ' + key +
                '</div>' +
                '<div class="col-sm-6" style="text-align: right;">' +
                drinkCounter[key].price +
                '</div>'

            );
            // you can even add the total of this drink alone (drinkCounter[key].count * drinkCounter[key].price)
            // Subtotal amount
            totalPrice += parseFloat(drinkCounter[key].price * drinkCounter[key].count) || 0;
            $('.total').text(totalPrice.toFixed(2));
        }

        // cartItemArr.push(item);
        // cartPriceArr.push(price);

        // Sum up all items
        // var totalPrice = 0;
        // $.each(cartPriceArr, function () {
        //     totalPrice += parseFloat(this) || 0;
        //     $('.total').text(totalPrice.toFixed(2));
        // });

        // // Item quantity count
        // for (var i = 0, j = cartItemArr.length; i < j; i++) {
        //     if (itemQuantity[cartItemArr[i]]) {
        //         itemQuantity[cartItemArr[i]]++;
        //     }
        //     else {
        //         itemQuantity[cartItemArr[i]] = 1;
        //     }
        // }

        // for (var drink in itemQuantity) {
        //     quantity = itemQuantity[drink] + "x ";
        // }

        // // Render items in virtual receipt
        // $('.cart').append(
        //     '<div class="col-sm-6">'
        //     + quantity + item +
        //     '</div>' +
        //     '<div class="col-sm-6" style="text-align: right;">'
        //     + price +
        //     '</div>'
        // );

    }
})