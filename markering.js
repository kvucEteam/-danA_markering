var colors = ["#ffff99", " #f2b9e1", " #b5f8d5", " #f7e5cc", " #d2d4ec", " #f6c0c0", " #acefed", "#e5c180", "#3ee180"];


var active_object = null;
var user_select;
var fejl = 0;
var score_Array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var score = 0;
var test_length = 2;
var markering_length;

var json_streng;

$(document).ready(function() {

    enable_audio();

    $(".dropout_container").fadeOut(0);


    $(".markering").click(function(e) {
        active_object = $(this).parent().parent().find('span').index(this);
        $(".brod_txt").off("click");

        if ($(this).hasClass("korrekt")) {
            console.log("Det er allerede korrekt!");
        } else {
            clicked_word($(this), e);
        }
    });

    /*$(".brod_txt").click(function() {
        console.log("clicked brød")
        UserMsgBox("body", "Du har klikket et sted, hvor der ikke umiddelbart er nogle ord, der siger noget om billedsprog");
        fejl++;
        check_answers();
    });*/

    //$(".close_dropout").click(hide_dropout);
    // $(".checkAnswer").click(check_answers);

    //init();
microhint($(".markering").eq(0), "Klik på de grå områder i teksten, og klassificér dem efter kategori.");
});

function init() {
    $(".tekst_container").append("<div class='brod_txt textHolder'>" + JsonObj[0].tekst + "</div>");
    $(".textHolder").append("<div class='textHolder_gradient'></div>");
    // $(".instr_container").prepend("<h1>" + JsonObj[0].title + "</h1><h4 class='instruktion'><span class='glyphicon glyphicon-arrow-right'></span>" + JsonObj[0].Instruktion + "</h4>")
    $(".container-fluid").prepend("<h1>" + JsonObj[0].title + "</h1>"); // + instruction(JsonObj[0].Instruktion));
  
  $('.instr_container').html(instruction(JsonObj[0].Instruktion)); //"Brug data fra de tre punkter på bjerget til at udfylde alle spørgsmålstegnene i infokasserne ved vejrstationerne"));
    
   
  
  // fyld knapperne op med den data der findes i json filen:
    for (var i = 0; i < JsonObj[0].kategorier.length; i++) {
        var numberOfAnswers = allIndexOf(json_streng, 'svar_' + i);
        $(".klasse_container").append('<div class="box_select"><div class = "box">' + "<span class='glyphicons glyphicons-circle-info'></span>" + JsonObj[0].kategorier[i] + '<span class="span_score">0 / ' + numberOfAnswers + '</span></div></div>');

        $(".drop_left").append('<div class="dropout">' + JsonObj[0].kategorier[i] + '</div >');
    }
    markering_length = $(".markering").length;
    $(".klasse_container").append('<div class="score_container"><span class="scoreText">Korrekte svar: </span><span class="QuestionCounter QuestionTask">0 ud af ' + markering_length + '</span> <span class="scoreText"> Forsøg: </span><span class="ErrorCount QuestionTask">0</span>');

    $(".tekst_container").append("<div class='kildeContainer'><b style='color:black'>KILDE:</b> " + JsonObj[0].kilde) + "</div>";


    // load tesksten ind:
    $(".box").each(function(index) {
        $(this).css("background-color", colors[index]);
    });
    $(".dropout").each(function(index) {
        $(this).css("background-color", colors[index]);
    });

    $(".box_select").click(function() {
        clicked_forklaring($(this));
    });
    $(".btn_snyd").click(function() {
        snyd();
    });
};

function clicked_forklaring(obj) {
    var indeks = obj.index() - 1;
    UserMsgBox("body", "<h3>" + JsonObj[0].kategorier[indeks] + "</h3><h4>" + JsonObj[0].forklaring[indeks] + "</h4>");
}

function clicked_word(clicked_object, pos) {
    //clicked_object.css("text-decoration", "underline");
    var instr_height = $(".instr_container").height();

    var offset = $(".container-fluid").offset();
    var posX = pos.pageX; // - offset.left + 10;
    var posY = pos.pageY - (instr_height + 30);




    //console.log("posY: " + posY + ", offset.top: " + offset.top);

    show_dropdown(posX, posY);
}


function show_dropdown(posX, posY) {
    UserMsgBox("body", "");

    var active_sentence = $(".markering").eq(active_object).html();
    var dp = "<div class='drop_right col-xs-6 col-sm-6'><div class='h3 drop_out_header'>Vælg kategori for: </div><span class='h4 drop_spm'>&quot;" + active_sentence + "&quot;</span><div class ='drop_feedback'></div></div>" + $(".dropout_container").html() + "";
    $("#UserMsgBox").append(dp);
    //$(".dropout_container").fadeIn(100); //.css("position", "absolute").css("left", posX).css("top", posY);
    //$(".drop_out_header").html("Vælg den rigtige kategori til: <br/><h3>" + $(".markering").eq(active_object).html() + "</h3>");
    $(".dropout").show();

    $(".dropout").click(function() {
        clicked_dropout($(this));
    });
    $(".dropout").hover(function() {
        var indeks = $(this).index();
        user_select = indeks;
        console.log(indeks)
        $(".drop_spm").css("background-color", colors[indeks]);
    });

    $(".dropout").mouseleave(function() {
        $(".drop_spm").css("background-color", "transparent");
    });


    $(".MsgBox_bgr").off("click");

    $(".glyphicon-remove").click(function() {
        $(".MsgBox_bgr").fadeOut(200, function() {
            $(this).remove();
        });
    });

}







function clicked_dropout(objekt) {
    var indeks = objekt.index();
    //console.log("clicked: " + indeks)

    $(".markering").eq(active_object).attr("value", indeks).css("background-color", colors[indeks]).css("text-decoration", "none");

    //hide_dropout();
    check_answers();
}

function hide_dropout() {
    //$(".markering").css("text-decoration", "none");
    $(".dropout_container").fadeOut(100);

    $(".brod_txt").click(function() {
        UserMsgBox("body", "Der er ikke nogen vigtige ord her");
    });

    $(".dropout").off("click");

}

function check_answers() {
     fejl++;

    //score_Array = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    //score = 0;

    var fejl_i_svar = false;
    var korrekt = $(".markering").eq(active_object).attr('class').split(' ')[1];
    korrekt = parseInt(korrekt.substring(korrekt.length - 1, korrekt.length))
    var svar = $(this).attr("value");
    console.log("korrekt: " + korrekt + ",active_object: " + active_object + ", svar: " + user_select);


    if (korrekt == user_select) {

        correct_sound();

        $(".dropout").off("click");
        $(".dropout").off("mouseenter mouseleave");



        $(".markering").eq(active_object).addClass("korrekt");
        //$(".dropout, .drop_out_header, .drop_spm").hide();
        $(".drop_feedback").html("<h3>Du har svaret <span class='label label-success'>Korrekt</span> </h3>''" + $(".markering").eq(active_object).html() + "'' er i kategorien " + $(".dropout").eq(user_select).html());
        new_score = score_Array[korrekt] + 1;
        score_Array.splice(korrekt, 1, new_score);
        score++;

        $(".MsgBox_bgr").delay(1000).fadeOut(1000, function() {
            $(this).remove();
            if (score >= markering_length) {
                slutfeedback();
            }

            $(".box").eq(user_select).animate({
                opacity: "0",
            }, 0, "linear", function() {
                $(".span_score").each(function(index) {
                    var string = $(this).text();
                    string = score_Array[index] + string.substring(string.length -4, string.length);
                    //console.log(string);

                    //string.replace(0, score_Array[index]);
                    $(this).html(string)

                });
                $(".box").eq(user_select).animate({
                    opacity: "1",

                }, 500, "linear", function() {

                });
            });


        });
        $(".QuestionCounter").html(score + " ud af " + markering_length);


    } else if (korrekt != user_select) {

        $(".drop_feedback").html("<h3>Du har svaret <span class='label label-danger'>Forkert</span> </h3><p>''" + $(".markering").eq(active_object).html() + "'' er ikke i kategorien " + $(".dropout").eq(user_select).html() + "</p>");


        error_sound();

        $(".markering").eq(active_object).animate({
            backgroundColor: "#e7e6e2"
        }, 200, function() {
            $(".markering").eq(active_object).removeAttr("value").css("background-color", "e7e6e2");
        });

        fejl_i_svar = true;
           }
    //console.log("korrekt: " + korrekt + ", svar: " + svar);

    $(".ErrorCount").html(fejl);

}


function loadData(url) {
    $.ajax({
        url: url,
        // contentType: "application/json; charset=utf-8",  // Blot en test af tegnsaettet....
        //dataType: 'json', // <------ VIGTIGT: Saadan boer en angivelse til en JSON-fil vaere! 
        dataType: 'text', // <------ VIGTIGT: Pga. ???, saa bliver vi noedt til at angive JSON som text. 
        async: false, // <------ VIGTIGT: Sikring af at JSON hentes i den rigtige raekkefoelge (ikke asynkront). 
        success: function(data, textStatus, jqXHR) {
            JsonObj = jQuery.parseJSON(data);
            // Alt data JsonObj foeres over i arrays:


            //$(".correct").html("Correct answers: <b>" + score + " / " + antal_korrekte + " </b> Attempts: <b>" + attempts + "</b>");
            //next_round();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error!!!\njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
        }
    });
    json_streng = JSON.stringify(JsonObj);


    init();
}

function slutfeedback() {
    UserMsgBox("body", JsonObj[0].slutfeedback + "</p><div class='btn btn-primary btn-again'>PRØV IGEN</div>");
    $(".btn-again").click(function() {
        location.reload();
    });


}

function snyd() {

    $(".markering").each(function(index) {
        $(this).hide();
    });
}
