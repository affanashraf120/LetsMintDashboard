$(function () {
    $('#datepicker').datepicker();
});

//  step
$('.campaign-type .form-check').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
});

//  step
$('.campaign-type-option .campaign-option').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
});


//  Campaign  step
$(document).ready(function () {
    // hidden things
    $(".hidden").hide();
    $("#successMessage").hide();
    // next button
    $(".next").on({
        click: function () {
            $("#progressBar").find(".active").next().addClass("active");
            $("#progressBar").find(".active").prev().removeClass("active").addClass("complete");
            // $("#progressBar .active").addClass("#progressBar").removeAttr('active');
            $(this).parents(".row").fadeOut("slow", function () {
                $(this).next(".row").fadeIn("slow");
            });

        }
    });

    $(".back-to-wizard").on({
        click: function () {
            location.reload(true);
        }
    });
});


// Campaign Type
$(document).ready(function () {
    $("div.desc").hide();
    $("input[name$='campaignType']").click(function () {
        var test = $(this).val();
        $("div.desc").show();
        $("#" + test).hide();
    });
});


// Whitelist Availability
$(document).ready(function () {
    $("input[name$='whitelist']").click(function () {
        var test = $(this).val();
        $("div.wehitelistDesc").hide();
        $(".wehite" + test).show();
    });
});


// date and time 
$(document).ready(function () {
    $('#datetimepicker').datetimepicker();
    $('#datetimepicker2').datetimepicker();
});


// text editor
tinymce.init({
    selector: 'textarea#editor',
    menubar: false
});

// switch-id
$(function () {
    $("#UseTheProject").change(function () {
        if ($(this).is(":checked")) {
            $(".profile-empty").hide();
            $(".profile-with-img").show();
        } else {
            $(".profile-empty").show();
            $(".profile-with-img").hide();
        }
    });
});


// Plus and minus 

var count = 0;
var countEl = document.getElementById("count");
function plus() {
    count++;
    countEl.value = count;
}
function minus() {
    if (count > 1) {
        count--;
        countEl.value = count;
    }
}

// Require user to own an NFT from specific collections
$(document).ready(function () {
    jQuery(document).delegate('button.add-record', 'click', function (e) {
        e.preventDefault();
        var content = jQuery('#sample_data .row-data'),
            size = jQuery('#data_posts .row-data').length + 1,
            element = null,
            element = content.clone();
        element.attr('id', 'rec-' + size);
        element.find('.delete-record').attr('data-id', size);
        element.appendTo('#data_body');
        element.find('.sn').html(size);
    });
    jQuery(document).delegate('a.delete-record', 'click', function (e) {
        e.preventDefault();
        var didConfirm = confirm("Are you sure You want to delete");
        if (didConfirm == true) {
            var id = jQuery(this).attr('data-id');
            var targetDiv = jQuery(this).attr('targetDiv');
            jQuery('#rec-' + id).remove();
            $('#data_body .row-data').each(function (index) {
                $(this).find('span.sn').html(index + 1);
            });
            return true;
        } else {
            return false;
        }
    });
});

// dropdown 
$(".showSingle").click(function (e) {
    $('.targetDiv' + $(this).attr('target')).show();
    $('#div' + $(this).attr('target')).addClass("active");
    e.stopPropagation();
});

$(".settingDropdown").click(function (e) {
    e.stopPropagation();
});

$(document).click(function () {
    $('.setting-dropdown').hide();
    $(".setting-dropdown-block").removeClass("active");
});

// jQuery(function () {
//     jQuery('.showSingle').click(function () {
//         jQuery('.targetDiv').hide();
//         jQuery('#div' + $(this).attr('target')).show();
//     });
// });


// Require user to own an NFT from specific collections
$(document).ready(function () {
    jQuery(document).delegate('button.add-server-record', 'click', function (e) {
        e.preventDefault();
        var content = jQuery('#server_sample_data .row-data'),
            size = jQuery('#server-data_posts .row-data').length + 1,
            element = null,
            element = content.clone();
        element.attr('id', 'rec-' + size);
        element.find('.delete-record').attr('data-id', size);
        element.appendTo('#server-data_body');
        element.find('.sn').html(size);
    });
    jQuery(document).delegate('a.delete-server-record', 'click', function (e) {
        e.preventDefault();
        var didConfirm = confirm("Are you sure You want to delete");
        if (didConfirm == true) {
            var id = jQuery(this).attr('data-id');
            var targetDiv = jQuery(this).attr('targetDiv');
            jQuery('#rec-' + id).remove();
            $('#server-data_body .row-data').each(function (index) {
                $(this).find('span.sn').html(index + 1);
            });
            return true;
        } else {
            return false;
        }
    });
});