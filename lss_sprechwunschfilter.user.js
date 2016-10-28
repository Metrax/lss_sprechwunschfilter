// ==UserScript==
// @name         lss_sprechwunschfilter
// @namespace    https://openuserjs.org/scripts/Metrax/lss_sprechwunschfilter
// @updateURL    https://openuserjs.org/meta/Metrax/lss_sprechwunschfilter.meta.js
// @version      1.13
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

$(document).ready(function() {
    if (window.location.pathname.match(/vehicles\//)) {
        if($("#iframe-inside-container").html().match("<h2>Sprechwunsch</h2>")) {
            console.log("Sprechwunsch erkannt");
            // Filterboxen hinzufügen
            // Freie Betten
            if(beds === 1) {
                beds_checked = " checked=\"checked\"";
            } else {
                beds_checked = "";
            }
            var percent0 = "";
            var percent10 = "";
            var percent20 = "";
            var percent30 = "";
            var percent40 = "";
            var percent50 = "";
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
            div = "Freie Betten: <input type=\"checkbox\" name=\"swf_beds\" id=\"swf_beds\"" + beds_checked + " />";
            div += "Maximale Abgabe: <select name=\"swf_fees\" id=\"swf_fees\">";
            div += "<option value=\"0\" " + percent0 + ">0 %</option>";
            div += "<option value=\"10\" " + percent10 + ">10 %</option>";
            div += "<option value=\"20\" " + percent20 + ">20 %</option>";
            div += "<option value=\"30\" " + percent30 + ">30 %</option>";
            div += "<option value=\"40\" " + percent40 + ">40 %</option>";
            div += "<option value=\"50\" " + percent50 + ">50 %</option>";
            div += "</select>";
            div += "Fachabteilung: <input type=\"checkbox\" name=\"swf_special\" id=\"swf_special\"" + special_checked + " />";
            $('h5:contains("Verbandskrankenhäuser")').after(div);
            $('#swf_beds, #swf_fees, #swf_special').change(swf_change);
            swf_startFilter(beds,fees,special);
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

function swf_startFilter(beds,fees,special) {
    $('table:eq(0) > tbody > tr').show();
    $('table:eq(0) > tbody > tr').each(function() {
        td_beds = parseInt($(this).find('td').eq(2).text().match(/[0-9]{1,2}/)[0]);
        td_fees = parseInt($(this).find('td').eq(3).text().match(/([0-9]{1,2}) \%/)[1]);
        td_special = $(this).find('td').eq(4).text().match(/(Ja|Nein)/)[0];
        if(fees < td_fees && td_beds >= beds) $(this).hide();
        if(beds === 1 && td_beds === 0) $(this).hide();
        if(special !== td_special && special !== "Nein") $(this).hide();
    });
}