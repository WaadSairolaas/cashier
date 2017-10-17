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
        update_receipt_sum();
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
    sum = sum.toFixed(2);
    $("#sum").text(sum);
    $("#finishSum").text(sum);
    if ($("#change").text()) {
        evaluate_input()
    }

}

function add_new_item_to_receipt(identifier) {

    $.getJSON("/get/item/" + identifier, function (result) {

        const receipt = $("#receipt");
        receipt.append(
            "<li data-id=" + result['id'] + "><dl>"
            + "<dt>Amount: <span data-ammount>1</span></dt>"
            + "<dt>Item: " + result['title'] + "</dt>"
            + "<dd>Price: <span data-price>" + result['price'].toFixed(2) + "</span>€</dd>"
        );
        let remove_button = $("<button data-remove>Remove</button>");
        receipt.append(remove_button);
        receipt.append("</dl></li>");

        receipt.on('click', remove_button, function () {
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
}

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

function evaluate_input() {

    let sumDisplay = $("#receivedSum");
    let change = $("#change");
    let userInput = Number(sumDisplay.val().replace(",", "."));

    if (isNaN(userInput)) {
        change.css("color", "red");
        change.text("NaN!");
        throw "NaN";
    }

    let difference = (receipt_state['sum'] - userInput);
    if (difference >= 0) {
        change.css("color", "red")
    } else {
        change.css("color", "green")
    }
    change.text(difference.toFixed(2) + ' €');
}

document.addEventListener('DOMContentLoaded', function () {

    contrast();
    $('.itemTitle').click(function () {

        add_to_receipt(Number($(this).attr('id')))

    });

    $('#finishProcess').click(function () {

        $(".items").hide();
        $("#finishProcess").hide();
        $("#finishProcessTab").show();
        $("#returnToAddItems").show();

    });

    $('#closeInteraction').click(function () {
        const state = JSON.stringify(receipt_state);
        console.log(state);
        $.post("/add/transaction", state, function () {
             window.location.replace("/work");
        });
    });

    $('#returnToAddItems').click(function () {
        $("#finishProcessTab").hide();
        $("#returnToAddItems").hide();
        $("#finishProcess").show();
        $(".items").show();
    });

    $('#dialPad').find(':button').click(function () {

        console.log($(this));
        const attr = $(this).attr('data-number');
        const sumDisplay = $('#receivedSum');

        if (typeof attr !== typeof undefined && attr !== false) {
            sumDisplay.val(sumDisplay.val() + $(this).text());
        }
        else if ($(this).is('#decimalPoint')) {
            sumDisplay.val(sumDisplay.val() + $(this).text());
        }
        else if ($(this).is('#evaluateInput')) {
            try {
                evaluate_input();
            } catch (e) {
                console.log(e);
                sumDisplay.val("");
                return false;
            }
        }
    });

    $('#resetInput').click(function () {
        $('#receivedSum').val("");
        $('#change').text("");
    });

    $('#printCustomerReceipt').click(function () {
        $.post("/print/customer", JSON.stringify(receipt_state));
    });

    $('#printKitchenReceipt').click(function () {
        $.post("/print/kitchen", JSON.stringify(receipt_state));
    });

}, false);