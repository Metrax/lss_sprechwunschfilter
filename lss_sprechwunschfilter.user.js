// ==UserScript==
// @name         lss_sprechwunschfilter
// @namespace    https://openuserjs.org/scripts/Metrax/lss_sprechwunschfilter
// @updateURL    https://openuserjs.org/meta/Metrax/lss_sprechwunschfilter.meta.js
// @version      1.21
// @description  Adds filter to the "Sprechwunsch"-function of Leitstellenspiel.de
// @author       Robert Walter & Michael Walter
// @match        https://www.leitstellenspiel.de/*
// @match        https://www.leitstellenspiel.de/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

beds = parseInt(GM_getValue('beds',0));
fees = parseInt(GM_getValue('fees',50));
special = GM_getValue('special','Nein');
jail_cell = parseInt(GM_getValue('jail_cell',0));
jail_fees = parseInt(GM_getValue('jail_fees',50));

$(document).ready(function() {
    if (window.location.pathname.match(/vehicles\//)) {
        if($("#iframe-inside-container").html().match("<h2>Sprechwunsch</h2>")) {
            var percent0 = "";
            var percent10 = "";
            var percent20 = "";
            var percent30 = "";
            var percent40 = "";
            var percent50 = "";
            if($("#iframe-inside-container").html().match("<h2>Zelle wählen</h2>")) {
                console.log("FuStW Sprechwunsch erkannt");
                if(jail_cell === 1) {
                    cell_checked = " checked=\"checked\"";
                } else {
                    cell_checked = "";
                }

                switch (jail_fees) {
                    case 0:
                        percent0 = " selected";
                        break;
                    case 10:
                        percent10 = " selected";
                        break;
                    case 20:
                        percent20 = " selected";
                        break;
                    case 30:
                        percent30 = " selected";
                        break;
                    case 40:
                        percent40 = " selected";
                        break;
                    case 50:
                        percent50 = " selected";
                        break;
                    default:
                        percent50 = " selected";
                }
                if(special === "Ja") {
                    special_checked = " checked=\"checked\"";
                } else {
                    special_checked = "";
                }
                div = '<div class="checkbox">';
                div += '  <label>';
                div += '    <input id="swf_jail_cell" type="checkbox" value="" '+cell_checked+'>';
                div += '    Freie Zellen';
                div += '  </label>';
                div += '</div>';

                div += '<form class="form-inline">';
                div += 'Maximale Abgabe: <select name="swf_jail_fees" id="swf_jail_fees" class=\"form-control\">';
                div += '<option value="0" ' + percent0 + '>0 %</option>';
                div += '<option value="10" ' + percent10 + '>10 %</option>';
                div += '<option value="20" ' + percent20 + '>20 %</option>';
                div += '<option value="30" ' + percent30 + '>30 %</option>';
                div += '<option value="40" ' + percent40 + '>40 %</option>';
                div += '<option value="50" ' + percent50 + '>50 %</option>';
                div += '</select>';
                div += '</form>';
                $('h2:contains("Zelle wählen")').before(div);
                $('#swf_jail_cell, #swf_jail_fees').change(swf_jail_change);
                swf_jail_startFilter(jail_cell,jail_fees);
            } else {
                console.log("RTW Sprechwunsch erkannt");
                // Filterboxen hinzufügen
                // Freie Betten
                if(beds === 1) {
                    beds_checked = " checked=\"checked\"";
                } else {
                    beds_checked = "";
                }
                switch (fees) {
                    case 0:
                        percent0 = " selected";
                        break;
                    case 10:
                        percent10 = " selected";
                        break;
                    case 20:
                        percent20 = " selected";
                        break;
                    case 30:
                        percent30 = " selected";
                        break;
                    case 40:
                        percent40 = " selected";
                        break;
                    case 50:
                        percent50 = " selected";
                        break;
                    default:
                        percent50 = " selected";
                }
                if(special === "Ja") {
                    special_checked = " checked=\"checked\"";
                } else {
                    special_checked = "";
                }
                div = '<div class="checkbox">';
                div += '  <label>';
                div += '    <input id="swf_beds" type="checkbox" value="" '+beds_checked+'>';
                div += '    Freie Betten';
                div += '  </label>';
                div += '</div>';

                div += '<div class="checkbox">';
                div += '  <label>';
                div += '    <input id="swf_special" type="checkbox" value="" '+special_checked+'>';
                div += '    Fachabteilung';
                div += '  </label>';
                div += '</div>';

                div += '<form class="form-inline">';
                div += 'Maximale Abgabe: <select name="swf_fees" id="swf_fees" class=\"form-control\">';
                div += '<option value="0" ' + percent0 + '>0 %</option>';
                div += '<option value="10" ' + percent10 + '>10 %</option>';
                div += '<option value="20" ' + percent20 + '>20 %</option>';
                div += '<option value="30" ' + percent30 + '>30 %</option>';
                div += '<option value="40" ' + percent40 + '>40 %</option>';
                div += '<option value="50" ' + percent50 + '>50 %</option>';
                div += '</select>';
                div += '</form>';
                $('h5:contains("Verbandskrankenhäuser")').after(div);
                $('#swf_beds, #swf_fees, #swf_special').change(swf_change);
                swf_startFilter(beds,fees,special);
            }
        }
    }
});

function swf_change() {
    beds = $("#swf_beds").is(':checked') ? 1 : 0;
    special = $("#swf_special").is(':checked') ? 'Ja' : 'Nein';
    fees = parseInt($("#swf_fees").val());
    GM_setValue("beds",beds);
    GM_setValue("fees",fees);
    GM_setValue("special",special);
    swf_startFilter(beds,fees,special);
}

function swf_jail_change() {
    jail_cell = $("#swf_jail_cell").is(':checked') ? 1 : 0;
    jail_fees = parseInt($("#swf_jail_fees").val());
    GM_setValue("jail_cell",jail_cell);
    GM_setValue("jail_fees",jail_fees);
    swf_jail_startFilter(jail_cell,jail_fees);
}

function swf_jail_startFilter(cell,fees) {
    $("a[href*='gefangener']").show();
    $("a[href*='gefangener']").each(function() {
        a_cell = $(this).text().match(/Freie Zellen: (.*?)\,/)[1];
        if($(this).html().match('Abgabe an Besitzer')) {
            a_fees = $(this).text().match(/Abgabe an Besitzer: (.*?)\%/)[1];
        } else {
            a_fees = 0;
        }
        console.log(cell + " - " + a_cell);
        if(fees < a_fees) $(this).hide();
        if((cell === 1 && a_cell === 0) || a_cell < cell) $(this).hide();
    });

}

function swf_startFilter(beds,fees,special) {
    if($('div:contains("Du hast noch kein Krankenhaus gebaut")').length === 0) {
        index = 1;
    } else {
        index = 0;
    }
    $("table:eq(" + index + ") > tbody > tr").show();
    $("table:eq(" + index + ") > tbody > tr").each(function() {
        td_beds = parseInt($(this).find('td').eq(2).text().match(/[0-9]{1,2}/)[0]);
        td_fees = parseInt($(this).find('td').eq(3).text().match(/([0-9]{1,2}) \%/)[1]);
        td_special = $(this).find('td').eq(4).text().match(/(Ja|Nein)/)[0];
        if(fees < td_fees && td_beds >= beds) $(this).hide();
        if(beds === 1 && td_beds === 0) $(this).hide();
        if(special !== td_special && special !== "Nein") $(this).hide();
    });
}