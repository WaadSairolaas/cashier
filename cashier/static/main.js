let receipt_state = {"sum": 0};

function already_listed_handler(identifier) {

    if (receipt_state[identifier]) {
        const receipt_item = $("li[data-id='" + identifier + "']");

        receipt_state[identifier]['amount'] += 1;
        const amount = receipt_state[identifier]['amount'];
        receipt_item.find("[data-ammount]").text(amount);

        const price = receipt_state[identifier]['price'];
        const new_price = (amount * price).toFixed(2);
        receipt_item.find("[data-price]").text(new_price);

        return true;
    }
    return false;
}

function update_receipt_sum() {
    let sum = 0;
    Object.keys(receipt_state).forEach(function (key, index) {
        if (key === "sum") {
            return;
        }
        if ('price' in receipt_state[key]) {
            let price = receipt_state[key]["price"];
            let amount = receipt_state[key]["amount"];
            sum += (price * amount);
        }
    });
    receipt_state['sum'] = sum;
    console.log(receipt_state);
    $("#sum").text(sum.toFixed(2))
}

function add_new_item_to_receipt(identifier) {

    $.getJSON("/get/item/" + identifier, function (result) {

        const receipt = $("#receipt");
        receipt.append(
            "<li data-id=" + result['id'] + "><dl>"
            + "<dt>Amount: <span data-ammount>1</span></dt>"
            + "<dt>Item: " + result['title'] + "</dt>"
            + "<dd>Price: <span data-price>" + result['price'].toFixed(2) + "</span>€</dd>"
            + "<button data-remove>Remove</button></dl></li>"
        );

        receipt.on('click', "li[data-id='" + identifier + "']", function () {
            delete receipt_state[identifier];
            $("[data-id=" + identifier + "]").remove();
            update_receipt_sum();
        });

        result['amount'] = 1;
        receipt_state[identifier] = result;
        update_receipt_sum();
    });

}

function add_to_receipt(identifier) {
    if (!already_listed_handler(identifier)) {
        add_new_item_to_receipt(identifier)
    }
    update_receipt_sum();
}

document.addEventListener('DOMContentLoaded', function () {

    contrast();
    $('.itemTitle').click(function () {

        add_to_receipt(Number($(this).attr('id')))

    });

    $('#finishProcess').click(function () {

        $(".items").hide();
        $("#finishProcessTab").show();

    });

    $('#closeInteraction').click(function () {

        $("#finishProcessTab").hide();
        $(".items").show();

    })

}, false);

/*
    Contrast fix by
    https://codepen.io/znak/pen/aOvMOd
*/
function contrast() {

    let C, L, rgb;

    $(".colorBlock").each(function () {

        rgb = $(this).css('background-color');
        C = rgb.substr(4, rgb.length - 5).split(', ');

        for (let i = 0; i < C.length; ++i) {
            C[i] = Number(C[i]) / 255;
            if (C[i] <= 0.03928) {
                C[i] = C[i] / 12.92
            } else {
                C[i] = Math.pow(( C[i] + 0.055 ) / 1.055, 2.4);
            }
        }

        L = 0.2126 * C[0] + 0.7152 * C[1] + 0.0722 * C[2];
        if (L > 0.179) {
            $(this).css('color', 'black');
        } else {
            $(this).css('color', 'white');
        }

    });

}
